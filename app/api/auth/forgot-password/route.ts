import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import {createPasswordResetCode, sendCodeByEmail, sendCodeBySMS} from "@/services/userServices";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Demande de réinitialisation de mot de passe
 *     description: |
 *       Envoie un code OTP à l'utilisateur pour réinitialiser son mot de passe.
 *       Le code peut être envoyé par email, par SMS, ou par les deux canaux.
 *       - Si `contact` correspond à l'email, le code est envoyé par email
 *       - Si `contact` correspond au téléphone, le code est envoyé par SMS
 *       - Si `sendBoth` est true, le code est envoyé par email ET SMS (si disponibles)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contact
 *             properties:
 *               contact:
 *                 type: string
 *                 description: Email ou numéro de téléphone de l'utilisateur
 *                 example: "user@example.com"
 *               sendBoth:
 *                 type: boolean
 *                 description: Si true, envoie le code par email ET SMS (si disponibles)
 *                 default: false
 *                 example: false
 *     responses:
 *       200:
 *         description: Code de réinitialisation envoyé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: Code de réinitialisation envoyé
 *                 user:
 *                   type: object
 *       404:
 *         description: Utilisateur introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: Utilisateur introuvable
 *                   example: "Utilisateur introuvable"
 *       500:
 *         description: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "string"
 */



export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const { contact, sendBoth } = await req.json(); // phone ou email, sendBoth pour envoyer par les deux canaux

        if (!contact) {
            const response = NextResponse.json(
                { error: "Contact (email ou téléphone) requis" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        const userRes = await query(
            `SELECT * FROM users WHERE email=$1 OR phone=$2`,
            [contact, contact]
        );
        const user = userRes.rows[0];

        if (!user) {
            const response = NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        const code = await createPasswordResetCode(user.id);

        const sentChannels: string[] = [];
        const errors: string[] = [];

        // Déterminer les canaux d'envoi
        const shouldSendEmail = sendBoth || user.email === contact;
        const shouldSendSMS = sendBoth || user.phone === contact;

        // Envoi par email
        if (shouldSendEmail && user.email) {
            try {
                await sendCodeByEmail(user.email, code);
                sentChannels.push("email");
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : "Erreur inconnue";
                errors.push(`Email: ${errorMsg}`);
                console.error("❌ Erreur envoi email:", errorMsg);
            }
        }

        // Envoi par SMS
        if (shouldSendSMS && user.phone) {
            try {
                await sendCodeBySMS(user.phone, code);
                sentChannels.push("SMS");
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : "Erreur inconnue";
                errors.push(`SMS: ${errorMsg}`);
                console.error("❌ Erreur envoi SMS:", errorMsg);
            }
        }

        // Si aucun canal n'a réussi, retourner une erreur
        if (sentChannels.length === 0) {
            const response = NextResponse.json(
                {
                    error: "Impossible d'envoyer le code",
                    details: errors.length > 0 ? errors : ["Aucun canal de communication disponible"]
                },
                { status: 500 }
            );
            return setCorsHeaders(response, origin);
        }

        const response = NextResponse.json({
            message: `Code de réinitialisation envoyé par ${sentChannels.join(" et ")}`,
            channels: sentChannels,
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone
            },
            ...(errors.length > 0 && { warnings: errors })
        });
        return setCorsHeaders(response, origin);

    } catch (err: unknown) {
        const error = err instanceof Error ? err.message : "Unknown error";
        const stack = err instanceof Error ? err.stack : undefined;
        console.error("❌ Erreur forgot-password:", error);
        if (stack) {
            console.error("Stack trace:", stack);
        }
        const response = NextResponse.json(
            { 
                error: "Erreur serveur lors de la réinitialisation du mot de passe",
                details: process.env.NODE_ENV === 'development' ? error : undefined
            },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}
