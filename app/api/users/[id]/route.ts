import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword, authMiddleware } from "@/lib/auth";
import { deleteUser, getUserById, updateUser } from "@/services/userServices";
import {updateDriverStatus} from "@/services/driverServices";

// Dans app routes Next, params est un Promise : on le tape explicitement
type ParamsPromise = { params: Promise<{ id: string }> };

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID (admin uniquement)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID de l'utilisateur à récupérer
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       403:
 *         description: Accès refusé (non admin)
 *       500:
 *         description: Erreur serveur
 *
 *   put:
 *     summary: Mettre à jour un utilisateur (admin uniquement)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID de l'utilisateur à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               role:
 *                 type: string
 *                 example: parent
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       403:
 *         description: Accès refusé (non admin)
 *       500:
 *         description: Erreur serveur
 *
 *   delete:
 *     summary: Supprimer un utilisateur (admin uniquement)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       403:
 *         description: Accès refusé (non admin)
 *       500:
 *         description: Erreur serveur
 */



export async function GET(req: Request, ctx: ParamsPromise) {
    try {
        const user = authMiddleware(req);
        if (user.role !== "admin") {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const { id } = await ctx.params;
        const numId = Number(id);
        if (Number.isNaN(numId)) {
            return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
        }

        const res = await getUserById(numId);
        return NextResponse.json(res);
    } catch (err) {
        console.error("GET /api/users/[id] error:", err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function PUT(req: Request, ctx: ParamsPromise) {
    try {
        const user = authMiddleware(req);
        if (user.role !== "admin") {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const { id } = await ctx.params;
        const numId = Number(id);
        if (Number.isNaN(numId)) {
            console.error("PUT /api/users/[id] invalid id:", id);
            return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
        }

        const body = await req.json();
        console.log("PUT /api/users/[id] payload:", { id: numId, body });
        const res = await updateUser(numId, body);

        return NextResponse.json(res);
    } catch (err) {
        console.error("PUT /api/users/[id] error:", err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function DELETE(req: Request, ctx: ParamsPromise) {
    try {
        const user = authMiddleware(req);
        if (user.role !== "admin") {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const { id } = await ctx.params;
        const numId = Number(id);
        if (Number.isNaN(numId)) {
            console.error(
"DELETE /api/users/[id] invalid id:", id);
            return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
        }

        await deleteUser(numId);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("DELETE /api/users/[id] error:", err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
