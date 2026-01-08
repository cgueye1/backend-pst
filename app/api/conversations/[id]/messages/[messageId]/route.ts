import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import {emitToConversation} from "@/lib/emitters";
import {query} from "@/lib/db";

/**
 * @swagger
 * /api/conversations/{id}/messages/{id}:
 *   patch:
 *     summary: Modifier un message EN TEMPS RÉEL
 *     tags: [Messagerie]
 */
export async function PATCH(req: NextRequest, { params }: { params: { messageId: string } }) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });

        const { messageId } = params;
        const { user_id } = user;
        const body = await req.json();
        const { content } = body;

        // Vérifier l'auteur
        const messageRes = await  query("SELECT sender_id, conversation_id FROM messages WHERE id=$1", [messageId]);
        if (messageRes.rows.length === 0)
            return NextResponse.json({ success: false, message: "Message introuvable" }, { status: 404 });

        if (messageRes.rows[0].sender_id !== user_id)
            return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 });

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

        return NextResponse.json({ success: true, message: "Message modifié" });
    } catch (error) {
        console.error("Error updating message:", error);
        return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     summary: Supprimer un message EN TEMPS RÉEL
 *     tags: [Messagerie]
 */
export async function DELETE(req: NextRequest, { params }: { params: { messageId: string } }) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });

        const { messageId } = params;
        const { user_id } = user;

        // Vérifier l'auteur
        const messageRes = await  query("SELECT sender_id, conversation_id FROM messages WHERE id=$1", [messageId]);
        if (messageRes.rows.length === 0)
            return NextResponse.json({ success: false, message: "Message introuvable" }, { status: 404 });

        if (messageRes.rows[0].sender_id !== user_id)
            return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 });

        const conversationId = messageRes.rows[0].conversation_id;

        await  query(`UPDATE messages SET is_deleted=true, deleted_at=now() WHERE id=$1`, [messageId]);

        // Émettre la suppression en temps réel
        await emitToConversation(conversationId, "message_deleted", {
            message_id: parseInt(messageId),
            deleted_at: new Date()
        });

        return NextResponse.json({ success: true, message: "Message supprimé" });
    } catch (error) {
        console.error("Error deleting message:", error);
        return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
    }
}
