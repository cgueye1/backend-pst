import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";
import { setCorsHeaders, corsOptions } from "@/lib/cors";

/**
 * @swagger
 * /api/parents/trips/{tripId}/contact-driver:
 *   post:
 *     summary: Contacter le chauffeur
 *     description: Initie une conversation avec le chauffeur d'un trajet.
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du trajet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             properties:
 *               message:
 *                 type: string
 *                 description: Message initial (optionnel)
 *                 example: "Bonjour, j'aimerais vous contacter"
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

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ tripId: string }> }
) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            const response = NextResponse.json(
                { success: false, error: "Non autorisé" },
                { status: 401 }
            );
            return setCorsHeaders(response, origin);
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
            const response = NextResponse.json(
                { success: false, error: "Chauffeur introuvable" },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
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

        const response = NextResponse.json({
            success: true,
            data: {
                conversation_id: conv.rows[0].conversation_id,
                driver_user_id: driverUserId,
            },
        });
        return setCorsHeaders(response, origin);
    } catch (error) {
        console.error("Erreur contact chauffeur:", error);
        const errorResponse = NextResponse.json(
            { success: false, error: "Erreur serveur" },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}
