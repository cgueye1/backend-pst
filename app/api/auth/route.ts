/**
 * @swagger
 * /api/auth:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     description: Récupère les informations du profil de l'utilisateur actuellement authentifié à partir d'un token JWT. Le token doit être fourni dans le header Authorization sous la forme Bearer {token}.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: integer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 role:
 *                   type: string
 *                 status:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Non autorisé ou Token invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: Non autorisé ou Token invalide
 *                   example: "Non autorisé ou Token invalide"
 *       404:
 *         description: Utilisateur introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: Utilisateur introuvable
 *                   example: "Utilisateur introuvable"
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import {getUserById, updateUser} from "@/services/userServices";
import { setCorsHeaders, corsOptions } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(req: NextRequest) {
    try {
        //   Récupération du token
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        //   Vérification JWT
        const decoded: any = verifyToken(token);

        //   Récupération utilisateur
        const user = await getUserById(decoded.id);

        if (!user) {
            return NextResponse.json(
                { message: "Utilisateur introuvable" },
                { status: 404 }
            );
        }
        const fullName = user.name || "";

        const [firstName, ...rest] = fullName.split(" ");
        const lastName = rest.join(" ");

        const origin = req.headers.get('origin');
        const response = NextResponse.json({
            id: user.id,
            firstName,
            lastName,
            role: user.role,
            status: user.status,
            phone: user.phone,
            email: user.email,
        });
        return setCorsHeaders(response, origin);

    } catch (error) {
        const origin = req.headers.get('origin');
        const errorResponse = NextResponse.json(
            { message: "Token invalide" },
            { status: 401 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

