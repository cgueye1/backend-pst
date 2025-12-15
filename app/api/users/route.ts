/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs (admin uniquement)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       403:
 *         description: Accès refusé (non admin)
 *       500:
 *         description: Erreur serveur
 *
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *               role:
 *                 type: string
 *                 example: parent
 *     responses:
 *       200:
 *         description: Utilisateur créé avec succès
 *       500:
 *         description: Erreur serveur
 */
import { NextResponse } from "next/server";
import { createUser, getAllUsers } from "@/services/userServices";
import { authMiddleware } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const user = authMiddleware(req);
        if (user.role !== "admin") {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const res = await getAllUsers();
        return NextResponse.json(res);
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        authMiddleware(req);

        const body = await req.json();
        const user = await createUser(body);

        return NextResponse.json(user);
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
