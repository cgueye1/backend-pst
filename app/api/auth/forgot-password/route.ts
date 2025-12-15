import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import {createPasswordResetCode, sendCodeByEmail, sendCodeBySMS} from "@/services/userServices";

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Demande de réinitialisation de mot de passe
 *     description: Envoie un code OTP à l'utilisateur pour réinitialiser son mot de passe. Le code peut être envoyé par email ou par SMS selon le contact fourni.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contact:
 *                 type: string
 *                 description: Email ou numéro de téléphone de l'utilisateur
 *                 example: "john@example.com"
 *     responses:
 *       200:
 *         description: Code de réinitialisation envoyé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Code de réinitialisation envoyé"
 *       404:
 *         description: Utilisateur introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Utilisateur introuvable"
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
        const { contact } = await req.json(); // phone ou email

        const userRes = await query(
            `SELECT * FROM users WHERE email=$1 OR phone=$2`,
            [contact, contact]
        );
        const user = userRes.rows[0];

        if (!user) {
            return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
        }

        const code = await createPasswordResetCode(user.id);

        // Choisir l'envoi selon le contact
        if (user.email === contact) {
            await sendCodeByEmail(user.email, code);
        } else if (user.phone === contact) {
            await sendCodeBySMS(user.phone, code);
        }


        return NextResponse.json({
            message: "Code de réinitialisation envoyé",
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (err: unknown) {
        const error = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error }, { status: 500 });
    }
}
