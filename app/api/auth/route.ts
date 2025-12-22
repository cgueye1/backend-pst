/**
 * @swagger
 * /api/auth :
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     description: |
 *       Cette route permet de récupérer les informations du profil de
 *       l'utilisateur actuellement authentifié à partir d'un token JWT.
 *       Le token doit être fourni dans le header Authorization sous la forme :
 *       **Bearer {token}**
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 7
 *                 firstName:
 *                   type: string
 *                   example: "Mame"
 *                 lastName:
 *                   type: string
 *                   example: "Dramé"
 *                 role:
 *                   type: string
 *                   example: "admin"
 *                 status:
 *                   type: string
 *                   example: "active"
 *                 phone:
 *                   type: string
 *                   example: "+221770000000"
 *                 email:
 *                   type: string
 *                   example: "user@email.com"
 *       401:
 *         description: Non autorisé ou token invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Non autorisé"
 *       404:
 *         description: Utilisateur introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur introuvable"
 */



import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import {getUserById, updateUser} from "@/services/userServices";

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

        return NextResponse.json({
            id: user.id,
            firstName,
            lastName,
            role: user.role,
            status: user.status,
            phone: user.phone,
            email: user.email,
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Token invalide" },
            { status: 401 }
        );
    }
}

