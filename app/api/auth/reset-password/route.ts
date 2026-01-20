import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Réinitialisation du mot de passe avec code OTP
 *     description: Vérifie le code OTP fourni et met à jour le mot de passe de l'utilisateur si le code est valide et non expiré.
 *     tags: [Auth]

 */

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const { userId, code, newPassword } = await req.json();

        if (!userId || !code || !newPassword) {
            const response = NextResponse.json(
                { error: "Paramètres manquants" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérification OTP en enlevant les espaces (CHAR(4) padding)
        const res = await query(
            `SELECT * FROM password_resets WHERE user_id=$1 AND TRIM(code)=$2 AND expires_at > now()`,
            [userId, code.trim()]
        );

        if (!res.rows[0]) {
            const response = NextResponse.json(
                { error: "Code invalide ou expiré" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Hash du nouveau mot de passe
        const hashedPassword = await hashPassword(newPassword);

        // Mise à jour du mot de passe
        await query(`UPDATE users SET password=$1 WHERE id=$2`, [hashedPassword, userId]);

        // Suppression du code utilisé
        await query(`DELETE FROM password_resets WHERE user_id=$1`, [userId]);

        const response = NextResponse.json({ message: "Mot de passe réinitialisé avec succès" });
        return setCorsHeaders(response, origin);

    } catch (err: unknown) {
        const error = err instanceof Error ? err.message : "Unknown error";
        const response = NextResponse.json({ error }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}