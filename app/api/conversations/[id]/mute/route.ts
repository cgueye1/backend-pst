import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";

/**
 * @swagger
 * /api/conversations/{id}/mute:
 *   patch:
 *     summary: Activer ou désactiver les notifications d'une conversation
 *     description: Met à jour le statut de notification (muet/non muet) d'une conversation pour l'utilisateur connecté.
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
 *             required:
 *             properties:
 *               muted:
 *                 type: boolean
 *                 description: true pour couper les notifications, false pour les activer
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
        const { muted = true } = await req.json();
        const { user_id } = user;

        await query(
            `UPDATE conversation_participants 
       SET is_muted = $1 
       WHERE conversation_id = $2 AND user_id = $3`,
            [muted, id, user_id]
        );

        return NextResponse.json({ success: true, message: "Notifications mises à jour" });
    } catch (error) {
        console.error("Error muting conversation:", error);
        return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
    }
}
