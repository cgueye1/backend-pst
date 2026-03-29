import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import {emitToConversation} from "@/lib/emitters";
import {query} from "@/lib/db";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

/**
 * @swagger
 * /api/conversations/{id}/messages/{messageId}:
 *   patch:
 *     summary: Modifier un message
 *     description: Modifie le contenu d'un message. Seul l'auteur peut modifier son message.
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
 *                 example: "Message modifié"
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
 *   delete:
 *     summary: Supprimer un message
 *     description: Supprime un message. Seul l'auteur peut supprimer son message.
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

type Params = {
    params: Promise<{ messageId: string }>;
};

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function PATCH(req: NextRequest, context: Params) {
    const origin = req.headers.get('origin');
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            const response = NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        const { messageId } = await context.params;
        const user_id = user.id;
        const body = await req.json();
        const { content } = body;

        // Vérifier l'auteur
        const messageRes = await  query("SELECT sender_id, conversation_id FROM messages WHERE id=$1", [messageId]);
        if (messageRes.rows.length === 0) {
            const response = NextResponse.json({ success: false, message: "Message introuvable" }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        if (String(messageRes.rows[0].sender_id) !== String(user_id)) {
            const response = NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        const conversationId = messageRes.rows[0].conversation_id;

        await  query(
            `UPDATE messages SET content=$1, is_edited=true, updated_at=now() WHERE id=$2`,
            [content, messageId]
        );

        // Émettre en temps réel
        await emitToConversation(conversationId, "message_edited", {
            message_id: parseInt(messageId),
            content,
            is_edited: true,
            updated_at: new Date()
        });

        const response = NextResponse.json({ success: true, message: "Message modifié" });
        return setCorsHeaders(response, origin);
    } catch (error) {
        console.error("Error updating message:", error);
        const errorResponse = NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
        return setCorsHeaders(errorResponse, origin);
    }
}


export async function DELETE(req: NextRequest, context: Params) {
    const origin = req.headers.get('origin');
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            const response = NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        const { messageId } = await context.params;
        const user_id = user.id;

        // Vérifier l'auteur
        const messageRes = await  query("SELECT sender_id, conversation_id FROM messages WHERE id=$1", [messageId]);
        if (messageRes.rows.length === 0) {
            const response = NextResponse.json({ success: false, message: "Message introuvable" }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        if (String(messageRes.rows[0].sender_id) !== String(user_id)) {
            const response = NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        const conversationId = messageRes.rows[0].conversation_id;

        await  query(`UPDATE messages SET is_deleted=true, deleted_at=now() WHERE id=$1`, [messageId]);

        // Émettre la suppression en temps réel
        await emitToConversation(conversationId, "message_deleted", {
            message_id: parseInt(messageId),
            deleted_at: new Date()
        });

        const response = NextResponse.json({ success: true, message: "Message supprimé" });
        return setCorsHeaders(response, origin);
    } catch (error) {
        console.error("Error deleting message:", error);
        const errorResponse = NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
        return setCorsHeaders(errorResponse, origin);
    }
}
