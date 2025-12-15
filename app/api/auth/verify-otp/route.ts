import { NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Vérifie le code OTP
 *     description: Vérifie si le code OTP saisi par l'utilisateur correspond à celui généré pour réinitialiser le mot de passe.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               code:
 *                 type: string
 *                 example: "7425"
 *     responses:
 *       200:
 *         description: OTP correct
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Code OTP vérifié"
 *       400:
 *         description: OTP invalide ou expiré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Code OTP invalide ou expiré"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unknown error"
 */

export async function POST(req: Request) {
    try {
        const { userId, code } = await req.json();

        const res = await query(
            `SELECT * FROM password_resets WHERE user_id=$1 AND code=$2 AND expires_at > now()`,
            [userId, code]
        );

        if (res.rowCount === 0) {
            return NextResponse.json({ error: "Code OTP invalide ou expiré" }, { status: 400 });
        }


        // Récupérer l'utilisateur pour renvoyer son id et éventuellement email
        const userRes = await query(`SELECT id, email FROM users WHERE id=$1`, [userId]);
        const user = userRes.rows[0];

        return NextResponse.json({ message: "Code OTP vérifié", user, code });
    } catch (err: unknown) {
        const error = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error }, { status: 500 });
    }
}
