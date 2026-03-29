import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { emitToConversation } from "@/lib/emitters";
import { query } from "@/lib/db";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

/**
 * @swagger
 * /api/conversations/{id}/messages/{messageId}/read:
 *   patch:
 *     summary: Marquer un message comme lu
 *     description: Marque un message spécifique comme lu par l'utilisateur connecté.
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
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du message
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
        messageId: string;
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

        const { id: conversationId, messageId } = await context.params;
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

        // Vérifier que le message existe et appartient à la conversation
        const messageCheck = await query(
            `SELECT id, sender_id FROM messages WHERE id = $1 AND conversation_id = $2 AND is_deleted = false`,
            [messageId, conversationId]
        );
        if (messageCheck.rows.length === 0) {
            const response = NextResponse.json({ success: false, message: "Message introuvable" }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        // Ne pas marquer comme lu si c'est l'expéditeur
        if (messageCheck.rows[0].sender_id === user_id) {
            const response = NextResponse.json({ success: true, message: "Message déjà lu (expéditeur)" });
            return setCorsHeaders(response, origin);
        }

        // Insérer ou mettre à jour le statut de lecture
        await query(
            `INSERT INTO message_read_status (message_id, user_id, read_at)
             VALUES ($1, $2, now())
             ON CONFLICT (message_id, user_id) 
             DO UPDATE SET read_at = now()`,
            [messageId, user_id]
        );

        // Mettre à jour le unread_count du participant
        await updateUnreadCount(conversationId, user_id);

        // Émettre en temps réel
        await emitToConversation(conversationId, "message_read", {
            message_id: parseInt(messageId),
            user_id: user_id,
            read_at: new Date()
        });

        const response = NextResponse.json({ 
            success: true, 
            message: "Message marqué comme lu" 
        });
        return setCorsHeaders(response, origin);
    } catch (error) {
        console.error("Error marking message as read:", error);
        const errorResponse = NextResponse.json(
            { success: false, message: "Erreur serveur" },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

/**
 * Met à jour le unread_count pour un participant
 */
async function updateUnreadCount(conversationId: string, userId: number) {
    // Compter les messages non lus après le last_read_at
    const result = await query(
        `SELECT COUNT(*) as unread_count
         FROM messages m
         WHERE m.conversation_id = $1
           AND m.is_deleted = false
           AND m.sender_id != $2
           AND m.created_at > (
               SELECT COALESCE(last_read_at, '1970-01-01'::timestamp)
               FROM conversation_participants
               WHERE conversation_id = $1 AND user_id = $2
           )
           AND NOT EXISTS (
               SELECT 1 FROM message_read_status mrs
               WHERE mrs.message_id = m.id AND mrs.user_id = $2
           )`,
        [conversationId, userId]
    );

    const unreadCount = parseInt(result.rows[0].unread_count || '0');

    // Mettre à jour le unread_count
    await query(
        `UPDATE conversation_participants
         SET unread_count = $1
         WHERE conversation_id = $2 AND user_id = $3`,
        [unreadCount, conversationId, userId]
    );

    return unreadCount;
}








