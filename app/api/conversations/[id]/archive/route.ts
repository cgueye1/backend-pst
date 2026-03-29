import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";

/**
 * @swagger
 * /api/conversations/{id}/archive:
 *   patch:
 *     summary: Archiver ou désarchiver une conversation
 *     description: Change le statut d'archivage d'une conversation.
 *     tags: ["Messagerie"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la conversation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               archived:
 *                 type: boolean
 *                 description: true pour archiver, false pour désarchiver
 *                 default: true
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
type Params = {
    params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, context: Params) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });

        const { id } = await context.params;
        const { archived = true } = await req.json();

        await query("UPDATE conversations SET is_archived = $1 WHERE id = $2", [archived, id]);

        return NextResponse.json({ success: true, message: "Conversation mise à jour" });
    } catch (error) {
        console.error("Error archiving conversation:", error);
        return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
    }
}
