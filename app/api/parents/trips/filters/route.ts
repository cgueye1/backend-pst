
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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);
        if (!user || user.role !== "parent")
            return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });

        // Récupérer plages horaires, prix et notes
        const filtersQuery = `
            SELECT MIN(t.price) as min_price, MAX(t.price) as max_price, AVG(t.price) as avg_price,
                   MIN(driver_rating) as min_rating, MAX(driver_rating) as max_rating
            FROM (
                SELECT t.*, COALESCE(AVG(e.rating),0) as driver_rating,
                       COALESCE(booked.count,0) as booked_seats,
                       (t.capacity_max - COALESCE(booked.count,0)) as available_seats,
                       CASE WHEN t.is_recurring THEN (t.distance_km*300*1.2) ELSE (t.distance_km*300) END as price
                FROM trips t
                LEFT JOIN evaluations e ON t.driver_id=e.driver_id
                LEFT JOIN (SELECT trip_id, COUNT(*) as count FROM trip_children GROUP BY trip_id) booked ON t.id=booked.trip_id
                WHERE t.status='pending' AND t.departure_time > NOW()
            ) sub
        `;
        const filters = await query(filtersQuery);

        return NextResponse.json({ success: true, filters: filters.rows[0] });

    } catch (error: any) {
        console.error("Erreur récupération filtres :", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
