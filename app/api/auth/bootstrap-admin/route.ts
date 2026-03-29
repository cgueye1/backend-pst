import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { query } from "@/lib/db";
import { setCorsHeaders, corsOptions } from "@/lib/cors";
import { bootstrapAdminSchema, validateData, BootstrapAdminInput } from "@/lib/validation";

function secretsMatch(provided: string, expected: string): boolean {
    try {
        const a = Buffer.from(provided, "utf8");
        const b = Buffer.from(expected, "utf8");
        if (a.length !== b.length) return false;
        return timingSafeEqual(a, b);
    } catch {
        return false;
    }
}

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

/**
 * Crée le tout premier compte administrateur (aucun user avec role=admin en base).
 * Protégé par la variable d'environnement ADMIN_BOOTSTRAP_SECRET (à retirer ou changer après usage).
 */
export async function POST(req: NextRequest) {
    const origin = req.headers.get("origin");
    try {
        const expectedSecret = process.env.ADMIN_BOOTSTRAP_SECRET?.trim();
        if (!expectedSecret) {
            const response = NextResponse.json(
                {
                    success: false,
                    error: "Bootstrap désactivé",
                    message:
                        "ADMIN_BOOTSTRAP_SECRET n'est pas configuré sur le serveur. Créez un admin via SQL ou un admin existant (POST /api/users).",
                },
                { status: 503 }
            );
            return setCorsHeaders(response, origin);
        }

        const body = await req.json();
        const validation = validateData<BootstrapAdminInput>(bootstrapAdminSchema, body, origin);
        if (!validation.success) {
            return validation.response;
        }

        const { name, email, password, bootstrapSecret } = validation.data;
        if (!secretsMatch(bootstrapSecret, expectedSecret)) {
            const response = NextResponse.json(
                { success: false, error: "Non autorisé", message: "Secret de bootstrap invalide." },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const countRes = await query<{ count: string }>(
            `SELECT COUNT(*)::text AS count FROM users WHERE role = 'admin'`
        );
        const adminCount = parseInt(countRes.rows[0]?.count || "0", 10);
        if (adminCount > 0) {
            const response = NextResponse.json(
                {
                    success: false,
                    error: "Déjà initialisé",
                    message: "Un administrateur existe déjà. Utilisez POST /api/users avec un token admin.",
                },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const hashedPassword = await hashPassword(password);
        const res = await query(
            `INSERT INTO users (name, email, phone, address, password, role, status)
             VALUES ($1, $2, NULL, NULL, $3, 'admin', 'active')
             RETURNING id, name, email, role, status, created_at`,
            [name, email, hashedPassword]
        );

        const response = NextResponse.json({
            success: true,
            message: "Compte administrateur créé. Vous pouvez vous connecter via POST /api/auth/login.",
            ...res.rows[0],
        });
        return setCorsHeaders(response, origin);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erreur inconnue";
        if (msg.includes("duplicate key") || msg.includes("unique constraint")) {
            const response = NextResponse.json(
                { success: false, error: "Email déjà utilisé", message: "Cet email est déjà enregistré." },
                { status: 409 }
            );
            return setCorsHeaders(response, origin);
        }
        console.error("bootstrap-admin:", err);
        const response = NextResponse.json(
            { success: false, error: msg, message: "Erreur lors de la création du compte administrateur." },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}
