/**
 * @swagger
 * /api/auth/login/driver:
 *   post:
 *     summary: Connexion d'un chauffeur
 *     description: Permet à un chauffeur de se connecter et de recevoir un token JWT. Réservé aux utilisateurs avec le rôle "driver".
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "driver@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Email et mot de passe requis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: Email et mot de passe requis
 *                   example: "Email et mot de passe requis"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: Invalid credentials
 *                   example: "Invalid credentials"
 *       403:
 *         description: Accès réservé aux chauffeurs ou compte inactif
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: Accès réservé aux chauffeurs ou compte inactif
 *                   example: "Accès réservé aux chauffeurs ou compte inactif"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: User not found
 *                   example: "User not found"
 *       500:
 *         description: Erreur serveur lors de la connexion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: Erreur serveur lors de la connexion
 *                   example: "Erreur serveur lors de la connexion"
 */



import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/services/userServices";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/auth";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');

    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            const response = NextResponse.json({ 
                error: "Email et mot de passe requis" 
            }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        const user = await getUserByEmail(email);
        if (!user) {
            const response = NextResponse.json({ 
                error: "User not found" 
            }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        // Vérifier que l'utilisateur est un chauffeur
        if (user.role !== "driver") {
            const response = NextResponse.json({ 
                error: "Accès réservé aux chauffeurs",
                message: "Cette route est réservée aux chauffeurs. Veuillez utiliser votre application dédiée."
            }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        // Vérifier le statut de l'utilisateur
        if (user.status && user.status !== "active") {
            const response = NextResponse.json({ 
                error: "User inactive",
                message: "Votre compte est inactif. Veuillez contacter l'administrateur."
            }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        // Vérifier le mot de passe
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            const response = NextResponse.json({ 
                error: "Invalid credentials" 
            }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        // Générer le token JWT
        const token = signToken({ id: user.id, role: user.role });
        
        const response = NextResponse.json({ 
            token, 
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
        return setCorsHeaders(response, origin);
    } catch (error: any) {
        console.error("Erreur lors de la connexion chauffeur:", error);
        const response = NextResponse.json({ 
            error: "Erreur serveur lors de la connexion" 
        }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}


