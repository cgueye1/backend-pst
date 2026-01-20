import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Vérifie le code OTP
 *     description: Vérifie si le code OTP saisi par l'utilisateur correspond à celui généré pour réinitialiser le mot de passe.
 *     tags: [Auth]

 */

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const { userId, code } = await req.json();

        const res = await query(
            `SELECT * FROM password_resets WHERE user_id=$1 AND code=$2 AND expires_at > now()`,
            [userId, code]
        );

        if (res.rowCount === 0) {
            const response = NextResponse.json({ error: "Code OTP invalide ou expiré" }, { status: 400 });
            return setCorsHeaders(response, origin);
        }


        // Récupérer l'utilisateur pour renvoyer son id et éventuellement email
        const userRes = await query(`SELECT id, email FROM users WHERE id=$1`, [userId]);
        const user = userRes.rows[0];

        const response = NextResponse.json({ message: "Code OTP vérifié", user, code });
        return setCorsHeaders(response, origin);
    } catch (err: unknown) {
        const error = err instanceof Error ? err.message : "Unknown error";
        const response = NextResponse.json({ error }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}
