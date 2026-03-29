/**
 * @swagger
 * /api/auth/bootstrap-admin:
 *   post:
 *     summary: Créer le premier administrateur (bootstrap)
 *     description: |
 *       Crée le tout premier compte avec le rôle `admin` lorsqu'aucun administrateur n'existe en base.
 *       Nécessite la variable d'environnement serveur `ADMIN_BOOTSTRAP_SECRET` ; le client envoie la même valeur dans `bootstrapSecret`.
 *       Après le premier admin, cet endpoint renvoie 403 — utiliser POST /api/users avec un token admin.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - bootstrapSecret
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Admin principal"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mot de passe (min. 8 caractères)
 *                 example: "MotDePasseSolide123"
 *               bootstrapSecret:
 *                 type: string
 *                 description: Doit correspondre à ADMIN_BOOTSTRAP_SECRET sur le serveur
 *                 example: "votre-secret-long-genere-aleatoirement"
 *     responses:
 *       200:
 *         description: Compte administrateur créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                   example: "admin"
 *                 status:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Données invalides (validation Zod)
 *       403:
 *         description: Secret invalide ou un administrateur existe déjà
 *       409:
 *         description: Email déjà utilisé
 *       500:
 *         description: Erreur serveur
 *       503:
 *         description: Bootstrap désactivé (ADMIN_BOOTSTRAP_SECRET non configuré)
 */

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

        const countRes = await query(
            `SELECT COUNT(*)::text AS count FROM users WHERE role = 'admin'`
        );
        const countRow = countRes.rows[0] as { count: string } | undefined;
        const adminCount = parseInt(countRow?.count || "0", 10);
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
