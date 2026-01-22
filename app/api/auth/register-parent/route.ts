/**
 * @swagger
 * /api/auth/register-parent:
 *   post:
 *     summary: Inscription d'un parent
 *     tags: [Auth]

 */

import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { query } from "@/lib/db";
import { setCorsHeaders, corsOptions } from '@/lib/cors';
import { registerParentSchema, validateData } from '@/lib/validation';

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(req: Request) {
    const origin = req.headers.get('origin');
    try {
        const body = await req.json();

        // Validation des données avec Zod
        const validation = validateData(registerParentSchema, body, origin);
        if (!validation.success) {
            return validation.response;
        }

        const { name, email, phone, password } = validation.data;

        // hash du mot de passe
        const hashedPassword = await hashPassword(password);

        const res = await query(
            `INSERT INTO users (name,email,phone,password,role) VALUES ($1,$2,$3,$4,'parent') RETURNING id,name,email,phone,role`,
            [name, email, phone, hashedPassword]
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
