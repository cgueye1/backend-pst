import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { emitToConversation } from "@/lib/emitters";
import { query } from "@/lib/db";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

/**
 * @swagger
 * /api/conversations/{id}/read:
 *   patch:
 *     summary: Marquer tous les messages d'une conversation comme lus
 *     description: Marque tous les messages non lus d'une conversation comme lus par l'utilisateur connecté.
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

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(req: NextRequest, context: Params) {
    const origin = req.headers.get('origin');
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            const response = NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        const { id: conversationId } = await context.params;
        const user_id = user.id;

        // Vérifier que l'utilisateur est participant
        const isParticipant = await query(
            `SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2 AND left_at IS NULL`,
            [conversationId, user_id]
        );
        if (isParticipant.rows.length === 0) {
            const response = NextResponse.json({ success: false, message: "Accès non autorisé" }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        // Récupérer tous les messages non lus de la conversation (sauf ceux de l'utilisateur)
        const unreadMessages = await query(
            `SELECT m.id
             FROM messages m
             WHERE m.conversation_id = $1
               AND m.is_deleted = false
               AND m.sender_id != $2
               AND NOT EXISTS (
                   SELECT 1 FROM message_read_status mrs
                   WHERE mrs.message_id = m.id AND mrs.user_id = $2
               )`,
            [conversationId, user_id]
        );

        // Marquer tous les messages comme lus
        if (unreadMessages.rows.length > 0) {
            const messageIds = unreadMessages.rows.map((row: any) => row.id);
            
            // Insérer les statuts de lecture en batch
            for (const messageId of messageIds) {
                await query(
                    `INSERT INTO message_read_status (message_id, user_id, read_at)
                     VALUES ($1, $2, now())
                     ON CONFLICT (message_id, user_id) 
                     DO UPDATE SET read_at = now()`,
                    [messageId, user_id]
                );
            }
        }

        // Mettre à jour last_read_at et unread_count
        await query(
            `UPDATE conversation_participants
             SET last_read_at = now(), unread_count = 0
             WHERE conversation_id = $1 AND user_id = $2`,
            [conversationId, user_id]
        );

        // Émettre en temps réel
        await emitToConversation(conversationId, "conversation_read", {
            conversation_id: parseInt(conversationId),
            user_id: user_id,
            read_at: new Date(),
            unread_count: 0
        });

        const response = NextResponse.json({ 
            success: true, 
            message: "Tous les messages marqués comme lus",
            unread_count: 0
        });
        return setCorsHeaders(response, origin);
    } catch (error) {
        console.error("Error marking conversation as read:", error);
        const errorResponse = NextResponse.json(
            { success: false, message: "Erreur serveur" },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}








