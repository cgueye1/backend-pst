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

const SQL_EXTENDED = `
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
        `;

const SQL_LEGACY = `
            SELECT
                t.id,
                t.driver_id,
                t.start_point,
                t.end_point,
                t.departure_time,
                t.capacity_max,
                t.status,
                t.is_recurring,
                t.distance_km,
                t.price,
                t.created_at,

                d.user_id AS driver_user_id,
                u.name AS driver_name,
                u.phone AS driver_phone,

                s.name AS school_name,
                COUNT(tc.child_id) AS current_passengers,
                t.status AS overall_status
            FROM trips t
                     INNER JOIN drivers d ON d.id = t.driver_id
                     INNER JOIN users u ON u.id = d.user_id
                     LEFT JOIN schools s ON s.id = t.school_id
                     LEFT JOIN trip_children tc ON tc.trip_id = t.id

            GROUP BY
                t.id, t.driver_id, t.start_point, t.end_point, t.departure_time,
                t.capacity_max, t.status, t.is_recurring, t.distance_km, t.price, t.created_at,
                d.user_id, u.name, u.phone, s.name

            ORDER BY t.created_at DESC
        `;

let cachedTripsExtendedSchema: boolean | undefined;

async function tripsHasExtendedSchema(): Promise<boolean> {
    const r = await query(
        `SELECT COUNT(*)::text AS n
         FROM information_schema.columns
         WHERE table_schema = 'public'
           AND table_name = 'trips'
           AND column_name IN ('return_departure_time', 'return_status', 'trip_type')`
    );
    const count = parseInt(String(r.rows[0]?.n ?? '0'), 10);
    return count >= 3;
}

async function fetchTripsWithDriverRows() {
    if (cachedTripsExtendedSchema === undefined) {
        cachedTripsExtendedSchema = await tripsHasExtendedSchema();
    }
    try {
        return await query(
            cachedTripsExtendedSchema ? SQL_EXTENDED : SQL_LEGACY
        );
    } catch (e) {
        if (
            cachedTripsExtendedSchema === true &&
            String(e).includes('does not exist')
        ) {
            cachedTripsExtendedSchema = false;
            return await query(SQL_LEGACY);
        }
        throw e;
    }
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const res = await fetchTripsWithDriverRows();

        const formattedTrips = res.rows.map((trip: any) => {
            const { overall_status, ...rest } = trip;
            return {
                ...rest,
                return_departure_time: trip.return_departure_time ?? null,
                return_status: trip.return_status ?? null,
                trip_type: trip.trip_type ?? null,
                status: overall_status,
                status_aller: trip.status,
                status_retour: trip.return_status ?? null
            };
        });

        const response = NextResponse.json(formattedTrips);
        return setCorsHeaders(response, origin);
    } catch (err) {
        const response = NextResponse.json({ error: String(err) }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}
