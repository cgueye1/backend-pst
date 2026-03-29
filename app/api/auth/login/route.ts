import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/services/userServices";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/auth";
import { setCorsHeaders, corsOptions } from "@/lib/cors";


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un administrateur
 *     description: Permet à un administrateur de se connecter et de recevoir un token JWT. Réservé aux utilisateurs avec le rôle "admin".
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
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT à utiliser pour les requêtes authentifiées
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Admin User"
 *                     email:
 *                       type: string
 *                       example: "admin@example.com"
 *                     role:
 *                       type: string
 *                       enum: [admin]
 *                       example: "admin"
 *                     phone:
 *                       type: string
 *                       nullable: true
 *                       example: "+221771234567"
 *       400:
 *         description: Email et mot de passe requis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email et mot de passe requis"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid credentials"
 *       403:
 *         description: Accès réservé aux administrateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Accès réservé aux administrateurs"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Erreur serveur lors de la connexion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur lors de la connexion"
 */

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

        // Vérifier que l'utilisateur est un administrateur
        if (user.role !== "admin") {
            const response = NextResponse.json({
                error: "Accès réservé aux administrateurs",
                message: "Cette application est réservée aux administrateurs. Les autres utilisateurs doivent utiliser leur application dédiée."
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
        console.error("Erreur lors de la connexion admin:", error);
        const response = NextResponse.json({
            error: "Erreur serveur lors de la connexion"
        }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}
