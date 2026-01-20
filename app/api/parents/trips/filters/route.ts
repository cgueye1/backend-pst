
/**
 * @swagger
 * /api/parents/trips/filters:
 *   get:
 *     summary:  Filtres avancés pour   la recherche Retourne les options de filtrage disponibles et les statistiques
 *     tags: [Parents]
 */
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

import { setCorsHeaders, corsOptions } from '@/lib/cors';
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const user = await getUserFromRequest(req);
        if (!user || user.role !== "parent") {
            const response = NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        // Récupérer plages horaires, prix et notes
        const filtersQuery = `
            SELECT 
                MIN(sub.price) as min_price, 
                MAX(sub.price) as max_price, 
                AVG(sub.price) as avg_price,
                MIN(sub.driver_rating) as min_rating, 
                MAX(sub.driver_rating) as max_rating
            FROM (
                SELECT 
                    t.id,
                    COALESCE(AVG(e.rating), 0) as driver_rating,
                    COALESCE(booked.count, 0) as booked_seats,
                    (t.capacity_max - COALESCE(booked.count, 0)) as available_seats,
                    CASE 
                        WHEN t.is_recurring THEN (COALESCE(t.distance_km, 0) * 300 * 1.2) 
                        ELSE (COALESCE(t.distance_km, 0) * 300) 
                    END as price
                FROM trips t
                LEFT JOIN evaluations e ON t.driver_id = e.driver_id
                LEFT JOIN (
                    SELECT trip_id, COUNT(*) as count 
                    FROM trip_children 
                    GROUP BY trip_id
                ) booked ON t.id = booked.trip_id
                WHERE t.status = 'pending' AND t.departure_time > NOW()
                GROUP BY t.id, t.capacity_max, t.is_recurring, t.distance_km, booked.count
            ) sub
        `;
        const filters = await query(filtersQuery);

        const response = NextResponse.json({ success: true, filters: filters.rows[0] });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur récupération filtres :", error);
        const errorResponse = NextResponse.json({ success: false, error: error.message }, { status: 500 });
        return setCorsHeaders(errorResponse, origin);
    }
}
