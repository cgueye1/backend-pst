/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs (admin uniquement)
 *     tags: [ADMIN]

 *   post:
 *     summary: Créer un utilisateur
 *     tags: [ADMIN]

 */

import { createUser, getAllUsers } from "@/services/userServices";
import { authMiddleware } from "@/lib/auth";

import { NextRequest, NextResponse } from 'next/server';
import { setCorsHeaders, corsOptions } from '@/lib/cors';
import { createUserSchema, validateData } from '@/lib/validation';

}

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const user = authMiddleware(req);
        if (user.role !== "admin") {
            const response = NextResponse.json({ error: "Accès refusé" }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        const res = await getAllUsers();
        const response = NextResponse.json(res);
        return setCorsHeaders(response, origin);
    } catch (err) {
        const response = NextResponse.json({ error: String(err) }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        authMiddleware(req);

        const body = await req.json();

        // Validation des données avec Zod
        const validation = validateData(createUserSchema, body, origin);
        if (!validation.success) {
            return validation.response;
        }

        const user = await createUser(validation.data);

        const response = NextResponse.json({
            success: true,
            ...user
        });
        return setCorsHeaders(response, origin);
    } catch (err: any) {
        // Gestion d'erreurs améliorée pour le frontend
        let errorMessage = "Erreur lors de la création de l'utilisateur";
        let userMessage = errorMessage;

        if (err.message) {
            errorMessage = err.message;
            userMessage = err.message;

            // Messages spécifiques pour les erreurs courantes
            if (err.message.includes('duplicate key') || err.message.includes('unique constraint')) {
                if (err.message.includes('email')) {
                    userMessage = "Cet email est déjà utilisé";
                } else {
                    userMessage = "Un utilisateur avec ces informations existe déjà";
                }
            } else if (err.message.includes('not-null constraint')) {
                userMessage = "Des champs requis sont manquants";
            }
        }

        const response = NextResponse.json({
            success: false,
            error: errorMessage,
            message: userMessage,
            userMessage: userMessage // Pour compatibilité avec le frontend
        }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}
