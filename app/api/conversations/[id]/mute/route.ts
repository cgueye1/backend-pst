import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";

/**
 * @swagger
 * /api/conversations/{id}/mute:
 *   patch:
 *     summary: Activer ou désactiver les notifications d'une conversation
 *     tags: [Messagerie]
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });

        const { id } = params;
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
