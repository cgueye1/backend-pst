/**
 * Stockage des fichiers : MinIO (S3) si MINIO_* est défini, sinon disque local (uploads/).
 *
 * Variables : MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET
 * Optionnel : MINIO_REGION (défaut us-east-1)
 * Ne jamais committer les clés — uniquement via variables d'environnement (Dockploy, .env).
 */

import fs from "fs";
import path from "path";
import { Readable } from "stream";
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export function isMinioStorageConfigured(): boolean {
    return Boolean(
        process.env.MINIO_ENDPOINT?.trim() &&
            process.env.MINIO_ACCESS_KEY?.trim() &&
            process.env.MINIO_SECRET_KEY?.trim() &&
            process.env.MINIO_BUCKET?.trim()
    );
}

function getUploadsBaseDir(): string {
    if (fs.existsSync("/app/uploads")) {
        return "/app/uploads";
    }
    return path.join(process.cwd(), "uploads");
}

let s3Client: S3Client | null = null;

function getS3(): S3Client {
    if (!s3Client) {
        const endpoint = process.env.MINIO_ENDPOINT!.replace(/\/+$/, "");
        s3Client = new S3Client({
            region: process.env.MINIO_REGION || "us-east-1",
            endpoint,
            credentials: {
                accessKeyId: process.env.MINIO_ACCESS_KEY!,
                secretAccessKey: process.env.MINIO_SECRET_KEY!,
            },
            forcePathStyle: true,
        });
    }
    return s3Client;
}

function bucket(): string {
    return process.env.MINIO_BUCKET!.trim();
}

/** Clé objet S3 : uploads/drivers/foo.jpg */
export function toObjectKey(relativeUnderUploads: string): string {
    const clean = relativeUnderUploads.replace(/^\/+/, "").replace(/\\/g, "/");
    if (clean.startsWith("uploads/")) return clean;
    return `uploads/${clean}`;
}

/**
 * @param relativeUnderUploads chemin sous uploads/, ex. drivers/foo.jpg ou incidents/x.pdf
 * @returns URL stockée en base, ex. /uploads/drivers/foo.jpg
 */
export async function saveUploadsFile(
    relativeUnderUploads: string,
    body: Buffer,
    contentType?: string
): Promise<string> {
    const key = toObjectKey(relativeUnderUploads);
    const relForUrl = key.replace(/^uploads\/?/, "");
    const publicPath = `/uploads/${relForUrl}`;

    if (isMinioStorageConfigured()) {
        await getS3().send(
            new PutObjectCommand({
                Bucket: bucket(),
                Key: key,
                Body: body,
                ContentType: contentType || "application/octet-stream",
            })
        );
        return publicPath;
    }

    const fullPath = path.join(getUploadsBaseDir(), relForUrl);
    await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.promises.writeFile(fullPath, body);
    return publicPath;
}

export function parseRelativePathFromStoredUrl(storedUrl: string): string | null {
    if (!storedUrl || typeof storedUrl !== "string") return null;
    const u = storedUrl.trim();
    const marker = "/uploads/";
    const idx = u.indexOf(marker);
    if (idx !== -1) {
        return u.slice(idx + marker.length).split("?")[0];
    }
    const b = process.env.MINIO_BUCKET;
    if (b) {
        const m2 = `/${b}/uploads/`;
        const j = u.indexOf(m2);
        if (j !== -1) {
            return u.slice(j + m2.length).split("?")[0];
        }
    }
    return null;
}

export async function deleteUploadsByStoredUrl(storedUrl: string): Promise<void> {
    const rel = parseRelativePathFromStoredUrl(storedUrl);
    if (!rel) return;
    const key = toObjectKey(rel);

    if (isMinioStorageConfigured()) {
        try {
            await getS3().send(
                new DeleteObjectCommand({
                    Bucket: bucket(),
                    Key: key,
                })
            );
        } catch (e) {
            console.warn("MinIO delete:", e);
        }
        return;
    }

    const fullPath = path.join(getUploadsBaseDir(), rel);
    try {
        if (fs.existsSync(fullPath)) {
            await fs.promises.unlink(fullPath);
        }
    } catch (e) {
        console.warn("Local delete:", e);
    }
    try {
        const alt = path.join(process.cwd(), "public", storedUrl.replace(/^\//, ""));
        if (fs.existsSync(alt)) await fs.promises.unlink(alt);
    } catch {
        /* ignore */
    }
}

async function streamToBuffer(body: unknown): Promise<Buffer> {
    if (!body) return Buffer.alloc(0);
    if (Buffer.isBuffer(body)) return body;
    if (body instanceof Uint8Array) return Buffer.from(body);
    const stream = body as Readable;
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}

/**
 * @param filePathSegments ex. drivers/foo.jpg (comme params.path.join('/'))
 */
export async function readUploadsFile(filePathSegments: string): Promise<Buffer | null> {
    if (filePathSegments.includes("..")) return null;

    const key = toObjectKey(filePathSegments);

    if (isMinioStorageConfigured()) {
        try {
            const out = await getS3().send(
                new GetObjectCommand({
                    Bucket: bucket(),
                    Key: key,
                })
            );
            return streamToBuffer(out.Body);
        } catch (e: unknown) {
            const err = e as { name?: string; Code?: string; $metadata?: { httpStatusCode?: number } };
            if (
                err.name === "NoSuchKey" ||
                err.Code === "NoSuchKey" ||
                err.$metadata?.httpStatusCode === 404
            ) {
                return null;
            }
            console.error("MinIO read:", e);
            return null;
        }
    }

    const rel = key.replace(/^uploads\/?/, "");
    const fullPath = path.join(getUploadsBaseDir(), rel);
    if (!fs.existsSync(fullPath)) return null;
    return fs.promises.readFile(fullPath);
}

export function mimeFromExtension(ext: string): string {
    const e = ext.toLowerCase();
    const mimeTypes: Record<string, string> = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".pdf": "application/pdf",
        ".mp4": "video/mp4",
    };
    return mimeTypes[e] || "application/octet-stream";
}
