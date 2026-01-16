/**
 * @swagger
 * /api/auth/login/driver:
 *   post:
 *     summary: Connexion d'un chauffeur
 *     description: |
 *       Permet à un chauffeur de se connecter et de recevoir un token JWT.
 *       Cette route est spécifiquement réservée aux utilisateurs avec le rôle "driver".
 *       Les autres rôles (admin, parent) ne peuvent pas utiliser cette route.
 *     tags: [Auth]

 */

import { NextResponse } from "next/server";
import { getUserByEmail } from "@/services/userServices";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ 
                error: "Email et mot de passe requis" 
            }, { status: 400 });
        }

        const user = await getUserByEmail(email);
        if (!user) {
            return NextResponse.json({ 
                error: "User not found" 
            }, { status: 404 });
        }

        // Vérifier que l'utilisateur est un chauffeur
        if (user.role !== "driver") {
            return NextResponse.json({ 
                error: "Accès réservé aux chauffeurs",
                message: "Cette route est réservée aux chauffeurs. Veuillez utiliser votre application dédiée."
            }, { status: 403 });
        }

        // Vérifier le statut de l'utilisateur
        if (user.status && user.status !== "active") {
            return NextResponse.json({ 
                error: "User inactive",
                message: "Votre compte est inactif. Veuillez contacter l'administrateur."
            }, { status: 403 });
        }

        // Vérifier le mot de passe
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ 
                error: "Invalid credentials" 
            }, { status: 401 });
        }

        // Générer le token JWT
        const token = signToken({ id: user.id, role: user.role });
        
        return NextResponse.json({ 
            token, 
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (error: any) {
        console.error("Erreur lors de la connexion chauffeur:", error);
        return NextResponse.json({ 
            error: "Erreur serveur lors de la connexion" 
        }, { status: 500 });
    }
}

