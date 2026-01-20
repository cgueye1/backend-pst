import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/services/userServices";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/auth";
import { setCorsHeaders, corsOptions } from "@/lib/cors";


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un admin
 *     description: Permet à un utilisateur de se connecter et de recevoir un token JWT.
 *     tags: [Auth]

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
