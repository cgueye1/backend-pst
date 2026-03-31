/**
 * @swagger
 * /api/trips/with-driver:
 *   get:
 *     summary: Récupérer tous les trajets   affectés a un chauffeur
 *     tags: [ADMIN]

 */


import { query } from "@/lib/db";

import { NextRequest, NextResponse } from 'next/server';
import { setCorsHeaders, corsOptions } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const res = await query(`
            SELECT
                t.id,
                t.driver_id,
                t.start_point,
                t.end_point,
                t.departure_time,
                t.return_departure_time,
                t.capacity_max,
                t.status,
                t.return_status,
                t.trip_type,
                t.is_recurring,
                t.distance_km,
                t.price,
                t.created_at,

                d.user_id AS driver_user_id,
                u.name AS driver_name,
                u.phone AS driver_phone,

                s.name AS school_name,
                COUNT(tc.child_id) AS current_passengers,
                CASE
                    WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
                        CASE
                            WHEN t.status = 'canceled' OR t.return_status = 'canceled' THEN 'canceled'
                            WHEN t.status = 'completed' AND t.return_status = 'completed' THEN 'completed'
                            WHEN t.status = 'in_progress' OR t.return_status = 'in_progress' THEN 'in_progress'
                            WHEN t.status = 'completed' AND t.return_status = 'pending' THEN 'partially_completed'
                            ELSE 'pending'
                        END
                    ELSE t.status
                END AS overall_status
            FROM trips t
                     INNER JOIN drivers d ON d.id = t.driver_id
                     INNER JOIN users u ON u.id = d.user_id
                     LEFT JOIN schools s ON s.id = t.school_id
                     LEFT JOIN trip_children tc ON tc.trip_id = t.id

            GROUP BY
                t.id, t.driver_id, t.start_point, t.end_point, t.departure_time, 
                t.return_departure_time, t.capacity_max, t.status, t.return_status, 
                t.trip_type, t.is_recurring, t.distance_km, t.price, t.created_at,
                d.user_id, u.name, u.phone, s.name

            ORDER BY t.created_at DESC
        `);

        // Formater les résultats pour remplacer status par overall_status
        const formattedTrips = res.rows.map((trip: any) => {
            const { overall_status, ...rest } = trip;
            return {
                ...rest,
                status: overall_status, // Remplacer status par overall_status
                // Garder aussi les statuts individuels pour référence si nécessaire
                status_aller: trip.status,
                status_retour: trip.return_status || null
            };
        });

        const response = NextResponse.json(formattedTrips);
        return setCorsHeaders(response, origin);
    } catch (err) {
        const response = NextResponse.json({ error: String(err) }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}