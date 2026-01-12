 /**
 * @swagger
 * /api/parents/trips/search:
 *   get:
 *     summary: Rechercher des trajets optimisés (domicile → école) Avec filtres par distance, temps, coût, etc.
 *     tags: [Parents]
 */
 import { NextRequest, NextResponse } from 'next/server';
 import { query } from '@/lib/db';
 import { getUserFromRequest } from '@/lib/auth';

 export const runtime = 'nodejs';
 export const dynamic = 'force-dynamic';

 // GET - Recherche trajets optimisés pour parent
 export async function GET(req: NextRequest) {
     try {
         const url = new URL(req.url);
         const user = await getUserFromRequest(req);

         if (!user || user.role !== "parent") {
             return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
         }

         // Params
         const child_id = url.searchParams.get("child_id");
         const school_id = url.searchParams.get("school_id");
         const date = url.searchParams.get("date");
         const departure_time_min = url.searchParams.get("departure_time_min");
         const departure_time_max = url.searchParams.get("departure_time_max");
         const min_rating = url.searchParams.get("min_rating");
         const verified_only = url.searchParams.get("verified_only") === "true";
         const available_seats_min = parseInt(url.searchParams.get("available_seats_min") || "1");
         const sort_by = url.searchParams.get("sort_by") || "departure_time";
         const sort_order = url.searchParams.get("sort_order") || "asc";
         const page = parseInt(url.searchParams.get("page") || "1");
         const limit = parseInt(url.searchParams.get("limit") || "20");
         const offset = (page - 1) * limit;

         // ----------------------------
         // Conditions dynamiques
         const conditions: string[] = [`t.status = 'pending'`, `t.departure_time > NOW()`];
         const params: any[] = [];
         let idx = 1;

         if (school_id) {
             conditions.push(`t.school_id = $${idx++}`);
             params.push(school_id);
         } else if (child_id) {
             conditions.push(`t.school_id = (SELECT school_id FROM children WHERE id=$${idx++} AND parent_id=$${idx++})`);
             params.push(child_id, user.id);
         }

         if (date) {
             conditions.push(`DATE(t.departure_time) = $${idx++}`);
             params.push(date);
         }
         if (departure_time_min) {
             conditions.push(`t.departure_time::time >= $${idx++}::time`);
             params.push(departure_time_min);
         }
         if (departure_time_max) {
             conditions.push(`t.departure_time::time <= $${idx++}::time`);
             params.push(departure_time_max);
         }
         if (min_rating) {
             conditions.push(`(SELECT COALESCE(AVG(rating),0) FROM evaluations WHERE driver_id=d.id) >= $${idx++}`);
             params.push(parseFloat(min_rating));
         }
         if (verified_only) {
             conditions.push(`d.status = 'Approuvé'`);
         }

         const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

         // ----------------------------
         // Requête principale
         const tripsQuery = `
             SELECT
                 t.*,
                 d.status as driver_verification_status,
                 COALESCE(booked.count,0) as booked_seats,
                 (t.capacity_max - COALESCE(booked.count,0)) as available_seats,
                 COALESCE(AVG(e.rating),0) as driver_rating,
                 COUNT(DISTINCT e.id) as total_reviews
             FROM trips t
                      INNER JOIN drivers d ON t.driver_id=d.id
                      LEFT JOIN evaluations e ON d.id=e.driver_id
                      LEFT JOIN (
                 SELECT trip_id, COUNT(*) as count
                 FROM trip_children
                 GROUP BY trip_id
             ) booked ON t.id=booked.trip_id
                 ${whereClause}
             GROUP BY t.id, d.id, booked.count
             HAVING (t.capacity_max - COALESCE(booked.count,0)) >= ${available_seats_min}
             ORDER BY
                 ${sort_by === "driver_rating" ? "driver_rating" : sort_by} ${sort_order.toUpperCase()}
                 LIMIT $${idx} OFFSET $${idx + 1}
         `;

         params.push(limit, offset);
         const trips = await query(tripsQuery, params);

         // ----------------------------
         // Retour JSON
         return NextResponse.json({
             success: true,
             data: trips.rows.map(trip => ({
                 ...trip,
                 driver_rating: parseFloat(trip.driver_rating).toFixed(1),
                 total_reviews: parseInt(trip.total_reviews),
                 available_seats: parseInt(trip.available_seats),
                 booked_seats: parseInt(trip.booked_seats),
                 price: parseInt(trip.estimated_price)
             })),
             pagination: { page, limit, total: trips.rows.length },
             filters_applied: { child_id, school_id, date, departure_time_min, departure_time_max, min_rating, verified_only, available_seats_min }
         });

     } catch (error: any) {
         console.error("Erreur recherche trajets :", error);
         return NextResponse.json({ success: false, error: error.message }, { status: 500 });
     }
 }
