/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     description: Récupère la liste de tous les utilisateurs. Réservé aux administrateurs.
 *     tags: ["ADMIN"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Ressource non trouvée
 *       500:
 *         description: Erreur serveur
 *   post:
 *     summary: Créer un utilisateur
 *     description: Crée un nouvel utilisateur (admin, parent ou chauffeur). Réservé aux administrateurs.
 *     tags: ["ADMIN"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jean Dupont"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               phone:
 *                 type: string
 *                 example: "+221771234567"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mot de passe (optionnel, généré automatiquement si absent)
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: ["admin","parent","driver"]
 *                 example: "parent"
 *               address:
 *                 type: string
 *                 example: "Dakar, Almadies"
 *               status:
 *                 type: string
 *                 enum: ["active","inactive"]
 *                 default: active
 *     responses:
 *       200:
 *         description: Succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Ressource non trouvée
 *       500:
 *         description: Erreur serveur
 */

import { createUser, getAllUsers } from "@/services/userServices";
import { authMiddleware } from "@/lib/auth";

import { NextRequest, NextResponse } from 'next/server';
import { setCorsHeaders, corsOptions } from '@/lib/cors';
import { createUserSchema, validateData } from '@/lib/validation';


export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
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
    } catch (err: any) {
        // Gestion des erreurs d'authentification
        const errorMessage = err?.message || String(err);
        let status = 500;

        if (errorMessage.includes('No token provided') ||
            errorMessage.includes('Invalid token') ||
            errorMessage.includes('Unauthorized')) {
            status = 401;
        }

        const response = NextResponse.json({
            error: errorMessage,
            message: status === 401 ? 'Non autorisé. Veuillez vous connecter.' : errorMessage
        }, { status });
        return setCorsHeaders(response, origin);
    }
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const caller = authMiddleware(req);
        if (caller.role !== "admin") {
            const response = NextResponse.json(
                { error: "Accès refusé", message: "Seuls les administrateurs peuvent créer des utilisateurs." },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

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
