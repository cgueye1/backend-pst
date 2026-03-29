import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { query } from './db';
import { NextRequest } from "next/server";

const isNextProductionBuild = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

// Validation du JWT_SECRET avec fallback en développement uniquement
// Pendant `next build`, NODE_ENV vaut production sans secrets : on utilise une valeur factice.
let JWT_SECRET =
    process.env.JWT_SECRET?.trim() ||
    (process.env.NODE_ENV === 'development' ? 'dev-secret-key-change-in-production' : '');
if (!JWT_SECRET && isNextProductionBuild) {
    console.warn(
        '⚠️ JWT_SECRET manquant pendant le build Next — valeur factice (définir JWT_SECRET au runtime).'
    );
    JWT_SECRET = 'buildtime-jwt-secret-placeholder-min-32-chars-change-at-runtime';
}
if (!JWT_SECRET) {
    console.error('❌ ERREUR CRITIQUE: JWT_SECRET non défini dans les variables d\'environnement');
    console.error('   Veuillez définir JWT_SECRET dans votre fichier .env');
    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET is required in production environment');
    }
    console.warn('⚠️  Utilisation d\'une clé de développement - NE PAS UTILISER EN PRODUCTION');
}

const JWT_EXPIRES_IN = '1d';
const SALT_ROUNDS = 10;

interface TokenPayload {
    id: number;
    role: string;
    [key: string]: unknown;
}

export function signToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token?: string) {
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET) as any;

    } catch {
        return null;
    }
}

export async function hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
}

export async function requireAuth(req: Request, roles?: string[]) {
    const authHeader = req.headers.get('authorization') || '';
    if (!authHeader.startsWith('Bearer ')) throw new Error('Unauthorized');

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) throw new Error('Unauthorized');
    if (roles && roles.length > 0 && !roles.includes(payload.role)) {
        throw new Error('Forbidden');
    }

    const res = await query('SELECT id,name,email,role FROM users WHERE id=$1', [payload.id]);
    if (res.rowCount === 0) throw new Error('Unauthorized');

    return res.rows[0];
}

export async function getUserFromRequest(req: NextRequest) {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
    const payload = verifyToken(token || undefined);
    if (!payload?.id) return null;
    const res = await query(`SELECT id,name,email,role,phone, created_at FROM users WHERE id=$1`, [payload.id]);
    return res.rows[0] ?? null;
}

export function requireRole(user: any, role: string) {
    if (!user) return false;
    if (Array.isArray(role)) {
        return (role as string[]).includes(user.role);
    }
    return user.role === role;
}

// Middleware pour protéger les routes
export const authMiddleware = (req: Request) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("No token provided");
    const token = authHeader.split(" ")[1];
    try {
        return verifyToken(token);
    } catch (err) {
        throw new Error("Invalid token");
    }
};

