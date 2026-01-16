import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";

/**
 * @swagger
 * /api/conversations/{id}/archive:
 *   patch:
 *     summary: Archiver ou désarchiver une conversation
 *     tags: [Messagerie]
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
