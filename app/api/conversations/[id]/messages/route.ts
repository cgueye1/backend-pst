import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { emitToConversation, notifyConversationParticipants } from "@/lib/emitters";
import { query } from "@/lib/db";
/**
 * @swagger
 * /api/conversations/{id}/messages:
 *   get:
 *     summary: Récupérer les messages d'une conversation
 *     description: Récupère les messages d'une conversation avec pagination.
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
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Nombre de messages à récupérer
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset pour la pagination
 *       - in: query
 *         name: before_message_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Récupérer les messages avant cet ID
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
 *   post:
 *     summary: Envoyer un message dans une conversation
 *     description: Envoie un nouveau message dans une conversation.
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Bonjour !"
 *               message_type:
 *                 type: string
 *                 enum: ["text","image","file"]
 *                 default: text
 *               parent_message_id:
 *                 type: integer
 *                 description: ID du message parent (pour les réponses)
 *               attachments:
 *                 type: array
 *                 description: Pièces jointes
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
    params: Promise<{
        id: string;
    }>;
};
export async function GET(req: NextRequest, context: Params) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });

        const { id } = await context.params;
        const user_id = user.id;
        const url = new URL(req.url);
        const limit = parseInt(url.searchParams.get("limit") || "50");
        const offset = parseInt(url.searchParams.get("offset") || "0");
        const before_message_id = url.searchParams.get("before_message_id");

        // Vérifier la participation
        const isParticipant = await query(
            `SELECT 1 FROM conversation_participants WHERE conversation_id=$1 AND user_id=$2 AND left_at IS NULL`,
            [id, user_id]
        );
        if (isParticipant.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Accès non autorisé" }, { status: 403 });
        }

        let quer = `
      SELECT 
        m.id, m.content, m.message_type, m.attachments, m.metadata,
        m.is_edited, m.is_deleted, m.created_at, m.parent_message_id,
        m.sender_id, u.name AS sender_name, u.role AS sender_role,
        -- Statut de lecture
        EXISTS(
          SELECT 1 FROM message_read_status mrs WHERE mrs.message_id = m.id AND mrs.user_id = $2
        ) AS is_read,
        CASE 
          WHEN m.sender_id = $2 THEN true
          ELSE EXISTS(
            SELECT 1 FROM message_read_status mrs WHERE mrs.message_id = m.id AND mrs.user_id = $2
          )
        END AS is_read_by_me,
        (SELECT COUNT(*) FROM message_read_status mrs WHERE mrs.message_id = m.id) AS read_count,
        (SELECT COUNT(DISTINCT cp.user_id) - 1 
         FROM conversation_participants cp 
         WHERE cp.conversation_id = $1 AND cp.left_at IS NULL) AS total_participants,
        (SELECT COUNT(*) FROM messages m2 WHERE m2.parent_message_id = m.id) AS reply_count
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = $1 AND m.is_deleted = false
    `;

        const paramsArray = [id, user_id];
        let paramIndex = 3;

        if (before_message_id) {
            quer += ` AND m.id < $${paramIndex}`;
            paramsArray.push(before_message_id);
            paramIndex++;
        }

        quer += ` ORDER BY m.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        paramsArray.push(limit, offset);

        const result = await query(quer, paramsArray);

        return NextResponse.json({
            success: true,
            data: result.rows.reverse(),
            pagination: {
                limit,
                offset,
                has_more: result.rows.length === limit
            }
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/conversations/{id}/messages:
 *   post:
 *     summary: Envoyer un message dans une conversation
 *     tags: [Messagerie]
 */


export async function POST(
    req: NextRequest,
    context: Params
) {
    try {
        const { id: conversationId } = await context.params

        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });

        const user_id = user.id;

        const body = await req.json();
        const { content, message_type = "text", parent_message_id = null } = body;

        if (!content || content.trim() === "") {
            return NextResponse.json({ success: false, message: "Le contenu du message est requis" }, { status: 400 });
        }

        // Vérifier que l'utilisateur est participant
        const isParticipant = await query(
            `SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2 AND left_at IS NULL`,
            [conversationId, user_id]
        );
        if (isParticipant.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Accès non autorisé" }, { status: 403 });
        }

        // Insérer le message
        const result = await query(
            `INSERT INTO messages (conversation_id, sender_id, content, message_type, parent_message_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`,
            [conversationId, user_id, content, message_type, parent_message_id]
        );

        const message = result.rows[0];

        // Marquer comme lu par l'expéditeur
        await query(
            `INSERT INTO message_read_status (message_id, user_id, read_at) 
             VALUES ($1, $2, now())
             ON CONFLICT (message_id, user_id) DO NOTHING`,
            [message.id, user_id]
        );

        // Mettre à jour le unread_count pour tous les autres participants
        const participants = await query(
            `SELECT user_id FROM conversation_participants 
             WHERE conversation_id = $1 AND user_id != $2 AND left_at IS NULL`,
            [conversationId, user_id]
        );

        for (const participant of participants.rows) {
            await updateUnreadCount(conversationId, participant.user_id);
        }

        const messageData = {
            id: message.id,
            conversation_id: parseInt(conversationId),
            sender_id: user_id,
            content,
            message_type,
            parent_message_id,
            is_edited: false,
            is_deleted: false,
            created_at: message.created_at
        };

        // Émettre en temps réel
        await emitToConversation(conversationId, "new_message", messageData);

        return NextResponse.json({ success: true, data: messageData });
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
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
