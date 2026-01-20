import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";
import { setCorsHeaders, corsOptions } from "@/lib/cors";

/**
 * @swagger
 * /api/parents/trips/{tripId}/details:
 *   get:
 *     summary: Détails complets d'un trajet
 *     description: Permet à un parent de consulter les informations complètes d'un trajet
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 */

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(
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

        const result = await query(
            `
      SELECT
        t.id,
        t.start_point,
        t.end_point,
        t.departure_time,
        t.status,
        t.capacity_max,
        t.is_recurring,

        s.id AS school_id,
        s.name AS school_name,
        s.address AS school_address,
        s.opening_time,
        s.closing_time,

        d.id AS driver_id,
        u_driver.id AS driver_user_id,
        u_driver.name AS driver_name,
        u_driver.phone AS driver_phone,
        u_driver.email AS driver_email,
        d.vehicle_brand,
        d.vehicle_color,
        d.vehicle_plate,
        d.photo_profil AS driver_photo,
        d.license_document,
        d.vehicle_photo,
        d.capacity AS vehicle_capacity,

        COALESCE(AVG(e.rating), 0) AS driver_rating,
        COUNT(DISTINCT e.id) AS total_reviews,
        COUNT(DISTINCT t2.id) FILTER (WHERE t2.status = 'completed') AS completed_trips,

        t.capacity_max - (
          SELECT COUNT(*) FROM trip_children tc WHERE tc.trip_id = t.id
        ) AS available_seats,

        (SELECT COUNT(*) FROM trip_children tc WHERE tc.trip_id = t.id)
        AS enrolled_children_count

      FROM trips t
      INNER JOIN drivers d ON t.driver_id = d.id
      INNER JOIN users u_driver ON d.user_id = u_driver.id
      LEFT JOIN schools s ON t.school_id = s.id
      LEFT JOIN evaluations e ON d.id = e.driver_id
      LEFT JOIN trips t2 ON t2.driver_id = d.id

      WHERE t.id = $1
      GROUP BY t.id, s.id, d.id, u_driver.id
      `,
            [tripId]
        );

        if (result.rows.length === 0) {
            const response = NextResponse.json(
                { success: false, error: "Trajet introuvable" },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const reviews = await query(
            `
      SELECT
        e.rating,
        e.comment,
        e.created_at,
        u.name AS parent_name
      FROM evaluations e
      INNER JOIN users u ON e.parent_id = u.id
      WHERE e.driver_id = $1
      ORDER BY e.created_at DESC
      LIMIT 5
      `,
            [result.rows[0].driver_id]
        );

        const response = NextResponse.json({
            success: true,
            data: {
                ...result.rows[0],
                driver_rating: Number(result.rows[0].driver_rating).toFixed(1),
                recent_reviews: reviews.rows,
            },
        });
        return setCorsHeaders(response, origin);
    } catch (error) {
        console.error("Erreur récupération détails trajet:", error);
        const errorResponse = NextResponse.json(
            { success: false, error: "Erreur serveur" },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}
