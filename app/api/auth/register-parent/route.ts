/**
 * @swagger
 * /api/auth/register-parent:
 *   post:
 *     summary: Inscription d'un parent
 *     description: Permet à un parent de s'inscrire. Crée un compte utilisateur avec le rôle "parent". Les admins sont notifiés de la nouvelle inscription.
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom complet du parent
 *                 example: "Jean Dupont"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email du parent
 *                 example: "parent@example.com"
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone (optionnel)
 *                 example: "+221771234567"
 *               address:
 *                 type: string
 *                 description: Adresse du parent (optionnel)
 *                 example: "Dakar, Sénégal"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mot de passe (min 8 caractères)
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 address:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                 error:
 *                   type: Erreur de validation
 *                   example: "Erreur de validation"
 *       500:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                 error:
 *                   type: Erreur lors de l'inscription
 *                   example: "Erreur lors de l'inscription"
 *                 message:
 *                   type: string
 *                   example: "string"
 */

import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { query } from "@/lib/db";
import { setCorsHeaders, corsOptions } from '@/lib/cors';
import { registerParentSchema, validateData, RegisterParentInput } from '@/lib/validation';

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(req: Request) {
    const origin = req.headers.get('origin');
    try {
        const body = await req.json();

        // Validation des données avec Zod
        const validation = validateData<RegisterParentInput>(registerParentSchema, body, origin);
        if (!validation.success) {
            return validation.response;
        }

        const { name, email, phone, password, address } = validation.data;

        // hash du mot de passe
        const hashedPassword = await hashPassword(password);

        const res = await query(
            `INSERT INTO users (name,email,phone,address,password,role) VALUES ($1,$2,$3,$4,$5,'parent') RETURNING id,name,email,phone,address,role`,
            [name, email, phone || null, address || null, hashedPassword]
        );

        // Notifier les admins de la nouvelle inscription
        try {
            const { notifyAdmins, AdminNotificationTypes } = await import('@/services/notificationService');
            await notifyAdmins(
                'Nouvelle inscription parent',
                AdminNotificationTypes.NEW_PARENT_REGISTRATION,
                `Un nouveau parent s'est inscrit : ${name} (${email}).`,
                res.rows[0].id
            );
        } catch (notifError) {
            console.error('Erreur notification admin:', notifError);
            // Ne pas faire échouer l'inscription si la notification échoue
        }

        const response = NextResponse.json({
            success: true,
            ...res.rows[0]
        });
        return setCorsHeaders(response, origin);
    } catch (err: unknown) {
        const error = err instanceof Error ? err.message : 'Unknown error';
        
        // Gestion d'erreurs améliorée pour le frontend
        let userMessage = "Erreur lors de l'inscription";
        if (error.includes('duplicate key') || error.includes('unique constraint')) {
            if (error.includes('email')) {
                userMessage = "Cet email est déjà utilisé";
            }
        }

        const errorResponse = NextResponse.json({
            success: false,
            error: error,
            message: userMessage,
            userMessage: userMessage
        }, { status: 500 });
        return setCorsHeaders(errorResponse, origin);
    }
}
