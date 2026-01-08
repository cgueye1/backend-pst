import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import {emitToUser} from "@/lib/emitters";

/**
 * @swagger
 * /api/conversations:
 *   get:
 *     summary: Récupérer toutes les conversations de l'utilisateur connecté
 *     tags: [Messagerie]
 */
export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
        }

        const user_id = user.user_id || user.id;

        const url = new URL(req.url);
        const archived = url.searchParams.get("archived") === "true";

        const result = await query (`
      SELECT 
        c.id,
        c.type,
        c.title,
        c.trip_id,
        c.last_message_at,
        c.is_archived,
        cp.unread_count,
        cp.is_muted,
        cp.last_read_at,
        -- Dernier message
        m.content as last_message,
        m.message_type as last_message_type,
        m.created_at as last_message_date,
        u_sender.name as last_sender_name,
        -- Autre participant (pour conversation directe)
        CASE 
          WHEN c.type = 'direct' THEN (
            SELECT u.name FROM conversation_participants cp2
            JOIN users u ON cp2.user_id = u.id
            WHERE cp2.conversation_id = c.id 
              AND cp2.user_id != $1
              AND cp2.left_at IS NULL
            LIMIT 1
          )
        END as other_participant_name,
        CASE 
          WHEN c.type = 'direct' THEN (
            SELECT u.role FROM conversation_participants cp2
            JOIN users u ON cp2.user_id = u.id
            WHERE cp2.conversation_id = c.id 
              AND cp2.user_id != $1
              AND cp2.left_at IS NULL
            LIMIT 1
          )
        END as other_participant_role,
        CASE 
          WHEN c.type = 'direct' THEN (
            SELECT cp2.user_id FROM conversation_participants cp2
            WHERE cp2.conversation_id = c.id 
              AND cp2.user_id != $1
              AND cp2.left_at IS NULL
            LIMIT 1
          )
        END as other_participant_id,
        -- Nombre de participants
        (SELECT COUNT(*) FROM conversation_participants cp3 
         WHERE cp3.conversation_id = c.id AND cp3.left_at IS NULL) as participant_count
      FROM conversation_participants cp
      JOIN conversations c ON cp.conversation_id = c.id
      LEFT JOIN LATERAL (
        SELECT * FROM messages 
        WHERE conversation_id = c.id AND is_deleted = false
        ORDER BY created_at DESC 
        LIMIT 1
      ) m ON true
      LEFT JOIN users u_sender ON m.sender_id = u_sender.id
      WHERE cp.user_id = $1 
        AND cp.left_at IS NULL
        AND c.is_archived = $2
      ORDER BY c.last_message_at DESC NULLS LAST
    `,[user_id, archived]
        );


        return NextResponse.json({
            success: true,
            data: result.rows,
            total_unread: result.rows.reduce((sum, conv) => sum + conv.unread_count, 0)
        });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/conversations:
 *   post:
 *     summary: Créer ou récupérer une conversation directe avec un utilisateur
 *     tags: [Messagerie]
 */
export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
        }
        const currentUserId = user.user_id || user.id;

        const body = await req.json();
        const { other_user_id } = body;

        if (!other_user_id) {
            return NextResponse.json({ success: false, message: "other_user_id requis" }, { status: 400 });
        }

        // Créer ou récupérer la conversation directe
        const result = await query(
            "SELECT get_or_create_direct_conversation($1, $2) AS conversation_id",
            [currentUserId, other_user_id]
        );

        const conversationId = result.rows[0].conversation_id;

        // Récupérer les détails
        const convDetails = await  query(
            `
      SELECT 
        c.*,
        u.name AS other_participant_name,
        u.role AS other_participant_role
      FROM conversations c
      JOIN conversation_participants cp ON c.id = cp.conversation_id
      JOIN users u ON cp.user_id = u.id
      WHERE c.id = $1 AND cp.user_id = $2
      `,
            [conversationId, other_user_id]
        );

        const conversationData = { id: conversationId, ...convDetails.rows[0] };

        // Émettre l'événement en temps réel
        emitToUser(other_user_id, "new_conversation", conversationData);

        return NextResponse.json({ success: true, data: conversationData });
    } catch (error) {
        console.error("Error creating conversation:", error);
        return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
    }
}




