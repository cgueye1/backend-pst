/**
 * @swagger
 * /api/trips/with-driver:
 *   get:
 *     summary: Récupérer tous les trajets   affectés a un chauffeur
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Liste des trajets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   driver_id:
 *                     type: integer
 *                     example: 3
 *                   start_point:
 *                     type: string
 *                     example: "Point A"
 *                   end_point:
 *                     type: string
 *                     example: "École ABC"
 *                   departure_time:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-15T08:00:00Z"
 *                   capacity_max:
 *                     type: integer
 *                     example: 20
 *                   status:
 *                     type: string
 *                     example: "pending"
 *                   is_recurring:
 *                     type: boolean
 *                     example: false
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-10T12:00:00Z"
 *                   driver_user_id:
 *                     type: integer
 *                     example: 7
 *                   driver_name:
 *                     type: string
 *                     example: "John Doe"
 *                   driver_phone:
 *                     type: string
 *                     example: "+221770000000"
 *                   school_name:
 *                     type: string
 *                     example: "École ABC"
 *                   current_passengers:
 *                     type: integer
 *                     example: 15
 *       500:
 *         description: Erreur serveur
 */

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
    const res = await query(`
        SELECT
            t.id,
            t.driver_id,
            t.start_point,
            t.end_point,
            t.departure_time,
            t.capacity_max,
            t.status,
            t.is_recurring,
            t.created_at,

            d.user_id AS driver_user_id,
            u.name AS driver_name,
            u.phone AS driver_phone,

            s.name AS school_name,
            COUNT(tc.child_id) AS current_passengers
        FROM trips t
                 INNER JOIN drivers d ON d.id = t.driver_id
                 INNER JOIN users u ON u.id = d.user_id
                 LEFT JOIN schools s ON s.id = t.school_id
                 LEFT JOIN trip_children tc ON tc.trip_id = t.id



        GROUP BY
            t.id, d.user_id, u.name, u.phone, s.name

        ORDER BY t.created_at DESC
    `);

    return NextResponse.json(res.rows);
}