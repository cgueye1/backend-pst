import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";

/**
 * @swagger
 * /api/parents/trips/{tripId}/contact-driver:
 *   post:
 *     summary: Contacter le chauffeur
 *     description: Crée ou récupère une conversation entre un parent et un chauffeur
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ tripId: string }> }
) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { success: false, error: "Non autorisé" },
                { status: 401 }
            );
        }

        const { tripId } = await params;
        const { message } = await request.json();
        const user_id = user.id;

        const driverResult = await query(
            `
      SELECT u.id AS driver_user_id
      FROM trips t
      INNER JOIN drivers d ON t.driver_id = d.id
      INNER JOIN users u ON d.user_id = u.id
      WHERE t.id = $1
      `,
            [tripId]
        );

        if (driverResult.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: "Chauffeur introuvable" },
                { status: 404 }
            );
        }

        const driverUserId = driverResult.rows[0].driver_user_id;

        const conv = await query(
            `SELECT get_or_create_direct_conversation($1, $2) AS conversation_id`,
            [user_id, driverUserId]
        );

        if (message) {
            await query(
                `
        INSERT INTO messages (conversation_id, sender_id, content, message_type)
        VALUES ($1, $2, $3, 'text')
        `,
                [conv.rows[0].conversation_id, user_id, message]
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                conversation_id: conv.rows[0].conversation_id,
                driver_user_id: driverUserId,
            },
        });
    } catch (error) {
        console.error("Erreur contact chauffeur:", error);
        return NextResponse.json(
            { success: false, error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
