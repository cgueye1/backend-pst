/**
 * @swagger
 * /api/auth/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     description: Met à jour les informations d'un utilisateur. Requiert un token Bearer valide. Seuls les champs fournis seront mis à jour.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
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
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 role:
 *                   type: string
 *                 status:
 *                   type: string
 *       400:
 *         description: ID utilisateur invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: ID utilisateur invalide
 *                   example: "ID utilisateur invalide"
 *       401:
 *         description: No token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: No token
 *                   example: "No token"
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
 *       500:
 *         description: Update failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: Update failed
 *                   example: "Update failed"
 */

import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser } from "@/services/userServices";
import { verifyToken } from "@/lib/auth";
import { setCorsHeaders, corsOptions } from "@/lib/cors";

type Params = {
    params: Promise<{ id: string }>;
};

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function PUT(req: NextRequest, context: Params) {
    const origin = req.headers.get('origin');
    try {
        // Simplification : déstructuration directe
        const { id } = await context.params;
        const userId = Number(id);

        // Validation de l'ID
        if (isNaN(userId)) {
            const response = NextResponse.json(
                { message: "ID utilisateur invalide" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérification du token
        const auth = req.headers.get("authorization");
        if (!auth) {
            const response = NextResponse.json({ message: "No token" }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        verifyToken(auth.split(" ")[1]);

        // Récupération des données
        const body = await req.json();
        const { name, email, phone } = body;

        // Vérification de l'existence de l'utilisateur
        const user = await getUserById(userId);
        if (!user) {
            const response = NextResponse.json(
                { message: "Utilisateur introuvable" },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        // Mise à jour
        const updatedUser = await updateUser(userId, { name, email, phone });

        // Séparation du nom
        const [firstName, ...rest] = (updatedUser.name ?? '').split(' ');

        const response = NextResponse.json({
            id: updatedUser.id,
            firstName,
            lastName: rest.join(' '),
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
            status: updatedUser.status,
        });
        return setCorsHeaders(response, origin);

    } catch (err) {
        console.error("API ERROR", err);
        const response = NextResponse.json({ error: "Update failed" }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}