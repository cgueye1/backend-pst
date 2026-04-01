/**
 * Stockage des fichiers : MinIO (S3) ou disque local (uploads/).
 *
 * MinIO (recommandé en prod) :
 *   MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET
 *   MINIO_REGION (optionnel, défaut us-east-1)
 *   URL publique (navigateur), au choix (sans slash final) :
 *     MINIO_PUBLIC_BASE_URL ou MINIO_BROWSER_BASE_URL ou MINIO_PUBLIC_URL
 *     Ex. https://minio.votredomaine.com/nom-bucket  (path-style)
 *   Si l’API parle à MinIO en interne (ex. http://minio:9000) mais le navigateur doit utiliser une autre URL :
 *     MINIO_PUBLIC_ENDPOINT=https://fichiers.example.com  → base = {MINIO_PUBLIC_ENDPOINT}/{MINIO_BUCKET}
 *   Si aucune URL publique : l’URL stockée reste /uploads/... (proxy Next via readUploadsFile).
 *   Bucket privé (lecture anonyme refusée) : garder des chemins /uploads/... en base (défaut).
 *   Pour enregistrer l’URL MinIO absolue en base (bucket avec policy lecture publique) :
 *     MINIO_STORE_PUBLIC_URL_IN_DB=true
 *
 * Forcer le backend :
 *   UPLOAD_STORAGE=minio  → uniquement MinIO (erreur si variables incomplètes)
 *   UPLOAD_STORAGE=local  → uniquement le disque (ignore MinIO même si configuré)
 *   (non défini)          → MinIO si toutes les variables MinIO sont présentes, sinon disque.
 *
 * Objectif prod typique (images dans MinIO, visibles en permanence) :
 *   UPLOAD_STORAGE=minio + MINIO_ENDPOINT, ACCESS_KEY, SECRET_KEY, BUCKET
 *   Ne pas activer MINIO_STORE_PUBLIC_URL_IN_DB (bucket privé) : en base reste /uploads/...
 *   Le navigateur appelle https://votre-api/uploads/... → l’API lit l’objet dans MinIO (URL stable).
 *   Définir API_PUBLIC_URL (ou NEXT_PUBLIC_BASE_URL) si le front est sur un autre domaine que l’API.
 *
 * Logos école (JSON) : par défaut URL absolue vers l’API (/uploads/...) — pas d’expiration.
 * MINIO_DIRECT_PUBLIC_LOGO_URL=true : renvoyer une URL MinIO/CDN (bucket doit être lisible publiquement).
 *
 * Désactiver toute présignature (même si d’anciennes vars sont présentes) :
 *   MINIO_FORCE_PERMANENT_MEDIA_URL=true  ou  MINIO_DISABLE_PRESIGNED_URLS=true
 *
 * URLs présignées (optionnel — expirent toujours, déconseillé si vous voulez des liens permanents) :
 *   Uniquement si MINIO_PRESIGNED_URL_EXPIRES_SECONDS est un entier > 0 (max 604800).
 *   MINIO_USE_PRESIGNED_GET_URL seul ne suffit plus (évite les URLs qui expirent par erreur).
 * MINIO_PRESIGN_ENDPOINT=https://minio...  (optionnel)
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
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

/** Base URL publique (accessible depuis le navigateur), distincte de MINIO_ENDPOINT si Docker. */
function resolvedMinioPublicBase(): string | null {
    const pick = (...vals: (string | undefined)[]) => {
        for (const v of vals) {
            const t = v?.trim().replace(/\/+$/, "");
            if (t) return t;
        }
        return null;
    };
    const explicit = pick(
        process.env.MINIO_PUBLIC_BASE_URL,
        process.env.MINIO_BROWSER_BASE_URL,
        process.env.MINIO_PUBLIC_URL
    );
    if (explicit) return explicit;

    const pubEndpoint = process.env.MINIO_PUBLIC_ENDPOINT?.trim().replace(/\/+$/, "");
    if (pubEndpoint && isMinioStorageConfigured()) {
        return `${pubEndpoint}/${bucket()}`;
    }
    return null;
}

/** URL publique directe vers l’objet dans MinIO (bucket policy / CDN). */
function minioPublicUrlForKey(key: string): string | null {
    const base = resolvedMinioPublicBase();
    if (!base) return null;
    const k = key.replace(/^\/+/, "");
    return `${base}/${k}`;
}

let loggedStorageBackendOnce = false;

function logStorageBackendOnce(mode: UploadStorageMode): void {
    if (loggedStorageBackendOnce) return;
    loggedStorageBackendOnce = true;
    if (mode === "local") {
        console.warn(
            "[storage] Écriture sur disque (uploads/). Pour MinIO : MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET — puis MINIO_PUBLIC_BASE_URL (ou MINIO_PUBLIC_ENDPOINT) pour les URLs directes. Forcer MinIO : UPLOAD_STORAGE=minio."
        );
    } else {
        console.info(
            "[storage] MinIO actif, bucket=",
            process.env.MINIO_BUCKET?.trim(),
            resolvedMinioPublicBase() ? ", URL publique configurée" : ", URL publique non configurée (URLs /uploads/ en base)"
        );
    }
}

function getUploadsBaseDir(): string {
    if (fs.existsSync("/app/uploads")) {
        return "/app/uploads";
    }
    return path.join(process.cwd(), "uploads");
}

let s3Client: S3Client | null = null;
let s3PresignClient: S3Client | null = null;

/** Hôte utilisé pour signer les URLs que le navigateur appellera (souvent public, pas le service Docker interne). */
function presignEndpointUrl(): string {
    const explicit = process.env.MINIO_PRESIGN_ENDPOINT?.trim().replace(/\/+$/, "");
    if (explicit) return explicit;
    const base = resolvedMinioPublicBase();
    if (base) {
        try {
            return new URL(base).origin;
        } catch {
            /* ignore */
        }
    }
    const pub = process.env.MINIO_PUBLIC_ENDPOINT?.trim().replace(/\/+$/, "");
    if (pub) return pub;
    return process.env.MINIO_ENDPOINT!.replace(/\/+$/, "");
}

function getS3ForPresign(): S3Client {
    if (s3PresignClient) return s3PresignClient;
    requireMinioConfigured();
    s3PresignClient = new S3Client({
        region: process.env.MINIO_REGION || "us-east-1",
        endpoint: presignEndpointUrl(),
        credentials: {
            accessKeyId: process.env.MINIO_ACCESS_KEY!,
            secretAccessKey: process.env.MINIO_SECRET_KEY!,
        },
        forcePathStyle: true,
    });
    return s3PresignClient;
}

function forcePermanentMediaUrls(): boolean {
    const t = (v: string | undefined) => v?.trim().toLowerCase() === "true";
    return (
        t(process.env.MINIO_FORCE_PERMANENT_MEDIA_URL) ||
        t(process.env.MINIO_DISABLE_PRESIGNED_URLS)
    );
}

/** Durée de validité des URLs présignées pour les logos école (0 = désactivé, URLs via /uploads/ ou MinIO public). */
export function presignedUrlExpiresSeconds(): number {
    if (forcePermanentMediaUrls()) {
        return 0;
    }
    const raw = process.env.MINIO_PRESIGNED_URL_EXPIRES_SECONDS?.trim();
    if (raw !== undefined && raw !== "") {
        const n = parseInt(raw, 10);
        if (Number.isFinite(n) && n > 0) {
            return Math.min(n, 604800);
        }
        return 0;
    }
    return 0;
}

/**
 * URL présignée GetObject pour une URL déjà stockée (MinIO), sans la persister.
 */
export async function presignedGetUrlForStoredObject(
    storedUrl: string | null | undefined,
    expiresInSeconds: number
): Promise<string | null> {
    if (!storedUrl || getUploadStorageMode() !== "minio") return null;
    const rel = parseRelativePathFromStoredUrl(String(storedUrl).trim());
    if (!rel) return null;
    const key = toObjectKey(rel);
    const cmd = new GetObjectCommand({
        Bucket: bucket(),
        Key: key,
    });
    return getSignedUrl(getS3ForPresign(), cmd, { expiresIn: expiresInSeconds });
}

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

function storeAbsoluteMinioUrlInDb(): boolean {
    return process.env.MINIO_STORE_PUBLIC_URL_IN_DB?.trim().toLowerCase() === "true";
}

/**
 * @param relativeUnderUploads chemin sous uploads/, ex. drivers/foo.jpg ou incidents/x.pdf
 * @returns Chemin /uploads/... (défaut, bucket privé OK) ou URL MinIO absolue si MINIO_STORE_PUBLIC_URL_IN_DB=true et base publique configurée.
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
    logStorageBackendOnce(mode);

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
        if (storeAbsoluteMinioUrlInDb()) {
            const direct = minioPublicUrlForKey(key);
            if (direct) return direct;
        }
        return publicPath;
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

function useDirectMinioLogoInSchoolJson(): boolean {
    return process.env.MINIO_DIRECT_PUBLIC_LOGO_URL?.trim().toLowerCase() === "true";
}

/**
 * Réponse JSON école : logo_url que le navigateur peut charger.
 * Si MINIO_PRESIGNED_URL_EXPIRES_SECONDS > 0 : URL présignée MinIO (expire).
 * Sinon : proxy API (/uploads/...) stable, ou URL directe si MINIO_DIRECT_PUBLIC_LOGO_URL.
 */
export async function schoolRowWithPublicLogoUrl<T extends Record<string, unknown>>(
    row: T,
    requestHeaders?: Headers
): Promise<T> {
    if (!row || !Object.prototype.hasOwnProperty.call(row, "logo_url")) return row;
    const raw = row.logo_url as string | null;
    if (raw == null || raw === "") {
        return { ...row, logo_url: null } as T;
    }

    const exp = presignedUrlExpiresSeconds();
    if (getUploadStorageMode() === "minio" && exp > 0) {
        try {
            const signed = await presignedGetUrlForStoredObject(raw, exp);
            if (signed) {
                return { ...row, logo_url: signed } as T;
            }
        } catch (e) {
            console.warn("[storage] Presign logo_url échoué, repli proxy/API :", e);
        }
    }

    if (useDirectMinioLogoInSchoolJson()) {
        const resolved = publicUrlForStoredUpload(raw, requestHeaders);
        return { ...row, logo_url: resolved } as T;
    }

    const rel = parseRelativePathFromStoredUrl(raw);
    if (rel) {
        const proxyPath = `/uploads/${rel.replace(/^\/+/, "")}`;
        const resolved = publicUrlForStoredUpload(proxyPath, requestHeaders);
        return { ...row, logo_url: resolved } as T;
    }

    const resolved = publicUrlForStoredUpload(raw, requestHeaders);
    return { ...row, logo_url: resolved } as T;
}
