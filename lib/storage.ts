/**
 * Stockage des fichiers : MinIO (S3) ou disque local (uploads/).
 *
 * MinIO (recommandé en prod) :
 *   MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET
 *   MINIO_REGION (optionnel, défaut us-east-1)
 *   MINIO_PUBLIC_BASE_URL (optionnel) : URL publique pour les objets, sans slash final.
 *     Ex. path-style : https://minio.votredomaine.com/nom-bucket
 *     Les fichiers seront accessibles en https://.../nom-bucket/uploads/...
 *     Si absent : l’URL stockée reste /uploads/... et Next sert le fichier via readUploadsFile (proxy).
 *
 * Forcer le backend :
 *   UPLOAD_STORAGE=minio  → uniquement MinIO (erreur si variables incomplètes)
 *   UPLOAD_STORAGE=local  → uniquement le disque (ignore MinIO même si configuré)
 *   (non défini)          → MinIO si toutes les variables MinIO sont présentes, sinon disque.
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

export type UploadStorageMode = "minio" | "local";

/** Mode effectif : minio, local, ou auto (MinIO si configuré sinon disque). */
export function getUploadStorageMode(): UploadStorageMode {
    const v = process.env.UPLOAD_STORAGE?.trim().toLowerCase();
    if (v === "minio") return "minio";
    if (v === "local") return "local";
    return isMinioStorageConfigured() ? "minio" : "local";
}

function requireMinioConfigured(): void {
    if (!isMinioStorageConfigured()) {
        throw new Error(
            "UPLOAD_STORAGE=minio (ou MinIO auto) : définissez MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY et MINIO_BUCKET"
        );
    }
}

/** URL publique directe vers l’objet dans MinIO (bucket policy / CDN). */
function minioPublicUrlForKey(key: string): string | null {
    const base = process.env.MINIO_PUBLIC_BASE_URL?.trim().replace(/\/+$/, "");
    if (!base) return null;
    const k = key.replace(/^\/+/, "");
    return `${base}/${k}`;
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
 * @returns URL stockée en base : URL absolue MinIO si MINIO_PUBLIC_BASE_URL est défini, sinon /uploads/...
 */
export async function saveUploadsFile(
    relativeUnderUploads: string,
    body: Buffer,
    contentType?: string
): Promise<string> {
    const key = toObjectKey(relativeUnderUploads);
    const relForUrl = key.replace(/^uploads\/?/, "");
    const publicPath = `/uploads/${relForUrl}`;
    const mode = getUploadStorageMode();

    if (mode === "minio") {
        requireMinioConfigured();
        await getS3().send(
            new PutObjectCommand({
                Bucket: bucket(),
                Key: key,
                Body: body,
                ContentType: contentType || "application/octet-stream",
            })
        );
        const direct = minioPublicUrlForKey(key);
        return direct ?? publicPath;
    }

    const fullPath = path.join(getUploadsBaseDir(), relForUrl);
    await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.promises.writeFile(fullPath, body);
    return publicPath;
}

export function parseRelativePathFromStoredUrl(storedUrl: string): string | null {
    if (!storedUrl || typeof storedUrl !== "string") return null;
    const u = storedUrl.trim().split("?")[0];
    const marker = "/uploads/";
    const idx = u.indexOf(marker);
    if (idx !== -1) {
        return u.slice(idx + marker.length);
    }
    const b = process.env.MINIO_BUCKET;
    if (b) {
        const m2 = `/${b}/uploads/`;
        const j = u.indexOf(m2);
        if (j !== -1) {
            return u.slice(j + m2.length);
        }
    }
    return null;
}

export async function deleteUploadsByStoredUrl(storedUrl: string): Promise<void> {
    const rel = parseRelativePathFromStoredUrl(storedUrl);
    if (!rel) return;
    const key = toObjectKey(rel);

    if (getUploadStorageMode() === "minio") {
        requireMinioConfigured();
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

    if (getUploadStorageMode() === "minio") {
        requireMinioConfigured();
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

function publicBaseUrlFromRequestHeaders(h: Headers | undefined): string {
    if (!h) return "";
    const host = h.get("x-forwarded-host") || h.get("host");
    if (!host) return "";
    const forwardedProto = h.get("x-forwarded-proto");
    const proto =
        forwardedProto?.split(",")[0]?.trim() ||
        (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
    return `${proto}://${host}`.replace(/\/+$/, "");
}

/**
 * Préfixe une URL stockée (/uploads/...) avec l’origine publique de l’API.
 * Indispensable quand le front (Angular) est sur un autre domaine que l’API : sinon
 * le navigateur demande https://front/uploads/... au lieu de https://api.../uploads/...
 *
 * Variables : API_PUBLIC_URL ou NEXT_PUBLIC_BASE_URL (sans slash final), ex. https://api.example.com
 * Sinon : Host / X-Forwarded-* de la requête vers l’API (pas le header Origin, qui est le domaine du front).
 */
export function publicUrlForStoredUpload(
    storedUrl: string | null | undefined,
    requestHeaders?: Headers
): string | null {
    if (storedUrl == null || storedUrl === "") return null;
    const u = String(storedUrl).trim();
    if (/^https?:\/\//i.test(u)) return u;
    const pathPart = u.startsWith("/") ? u : `/${u}`;
    const baseRaw =
        process.env.API_PUBLIC_URL?.trim() ||
        process.env.NEXT_PUBLIC_BASE_URL?.trim() ||
        publicBaseUrlFromRequestHeaders(requestHeaders);
    const base = baseRaw.replace(/\/+$/, "");
    if (!base) return pathPart;
    return `${base}${pathPart}`;
}

/** Réponse JSON école : logo_url utilisable depuis le navigateur (URL absolue si possible). */
export function schoolRowWithPublicLogoUrl<T extends Record<string, unknown>>(
    row: T,
    requestHeaders?: Headers
): T {
    if (!row || !Object.prototype.hasOwnProperty.call(row, "logo_url")) return row;
    const resolved = publicUrlForStoredUpload(row.logo_url as string | null, requestHeaders);
    return { ...row, logo_url: resolved } as T;
}
