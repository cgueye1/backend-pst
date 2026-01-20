import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import {emitToUser, pool} from "@/lib/emitters";
import { query } from "@/lib/db";

import { setCorsHeaders, corsOptions } from '@/lib/cors';
/**
 * @swagger
 * /api/conversations/group:
 *   post:
 *     summary: Créer une conversation de groupe
 *     tags: [Messagerie]
 */
export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(req: NextRequest) {
    const client = await pool.connect();

    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
        }

        const { user_id } = user;
        const body = await req.json();
        const { title, participant_ids, trip_id } = body;

        if (!participant_ids || participant_ids.length < 2) {
            return NextResponse.json({
                success: false,
                message: "Au moins 2 participants requis",
            }, { status: 400 });
        }

        await  query("BEGIN");

        // Créer la conversation
        const convResult = await  query(
            `INSERT INTO conversations (type, title, trip_id, created_by)
       VALUES ('group', $1, $2, $3)
       RETURNING id`,
            [title, trip_id, user_id]
        );

        const conversationId = convResult.rows[0].id;

        // Ajouter le créateur comme admin
        await  query(
            `INSERT INTO conversation_participants (conversation_id, user_id, role)
       VALUES ($1, $2, 'admin')`,
            [conversationId, user_id]
        );

        // Ajouter les autres participants
        for (const participantId of participant_ids) {
            if (participantId !== user_id) {
                await client.query(
                    `INSERT INTO conversation_participants (conversation_id, user_id)
           VALUES ($1, $2)`,
                    [conversationId, participantId]
                );
            }
        }

        await  query("COMMIT");

        const conversationData = {
            id: conversationId,
            title,
            type: "group",
            trip_id,
            created_by: user_id,
        };

        // Notifier les participants en temps réel
        participant_ids.forEach((participantId: number) => {
            if (participantId !== user_id) {
                emitToUser(participantId, "new_conversation", conversationData);
            }
        });

        return NextResponse.json({ success: true, data: conversationData });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error creating group conversation:", error);
        return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
    } finally {
        client.release();
    }
}
