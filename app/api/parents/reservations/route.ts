 import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";

/**
 * @swagger
 * /api/parents/reservations:
 *   post:
 *     summary: Réserver un trajet
 *     description: Permet à un parent de réserver un trajet pour un ou plusieurs enfants
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []

 */
export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== "parent") {
            return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
        }

        const { trip_id, child_ids, is_recurring } = await request.json();

        if (!trip_id || !Array.isArray(child_ids) || child_ids.length === 0) {
            return NextResponse.json(
                { success: false, error: "trip_id et child_ids requis" },
                { status: 400 }
            );
        }

        // Vérifier que les enfants appartiennent au parent
        const childrenCheck = await query(
            `SELECT id FROM children WHERE id = ANY($1) AND parent_id = $2`,
            [child_ids, user.user_id]
        );

        if (childrenCheck.rows.length !== child_ids.length) {
            return NextResponse.json(
                { success: false, error: "Un ou plusieurs enfants ne vous appartiennent pas" },
                { status: 403 }
            );
        }

        // Vérifier le trajet
        const tripCheck = await query(
            `
            SELECT 
                t.id,
                t.capacity_max,
                (SELECT COUNT(*) FROM trip_children WHERE trip_id = t.id) AS current_bookings,
                d.user_id AS driver_user_id
            FROM trips t
            INNER JOIN drivers d ON t.driver_id = d.id
            WHERE t.id = $1 AND t.status = 'pending'
            `,
            [trip_id]
        );

        if (tripCheck.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: "Trajet introuvable ou indisponible" },
                { status: 404 }
            );
        }

        const trip = tripCheck.rows[0];
        const availableSeats = trip.capacity_max - trip.current_bookings;

        if (availableSeats < child_ids.length) {
            return NextResponse.json(
                { success: false, error: "Pas assez de places disponibles" },
                { status: 400 }
            );
        }

        // Insertion réservations
        for (const child_id of child_ids) {
            await query(
                `INSERT INTO trip_children (trip_id, child_id) VALUES ($1, $2)`,
                [trip_id, child_id]
            );
        }

        return NextResponse.json({
            success: true,
            message: "Réservation effectuée avec succès",
            data: {
                trip_id,
                children_count: child_ids.length,
                is_recurring: !!is_recurring
            }
        });

    } catch (error) {
        console.error("Erreur réservation:", error);
        return NextResponse.json(
            { success: false, error: "Erreur serveur" },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/parents/reservations:
 *   get:
 *     summary: Liste des réservations du parent
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
   */
export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== "parent") {
            return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") ?? "all";
        const page = Number(searchParams.get("page") ?? 1);
        const limit = Number(searchParams.get("limit") ?? 20);
        const offset = (page - 1) * limit;

        const statusFilter =
            status !== "all" ? `AND t.status = '${status}'` : "";

        const result = await query(
            `
            SELECT
                tc.trip_id,
                tc.child_id,
                t.start_point,
                t.end_point,
                t.departure_time,
                t.status,
                c.name AS child_name,
                u.name AS driver_name,
                d.vehicle_plate
            FROM trip_children tc
            INNER JOIN children c ON tc.child_id = c.id
            INNER JOIN trips t ON tc.trip_id = t.id
            INNER JOIN drivers d ON t.driver_id = d.id
            INNER JOIN users u ON d.user_id = u.id
            WHERE c.parent_id = $1
            ${statusFilter}
            ORDER BY t.departure_time DESC
            LIMIT $2 OFFSET $3
            `,
            [user.id, limit, offset]
        );
console.log(result.rows)
        return NextResponse.json({
            success: true,
            data: result.rows,
            pagination: {
                page,
                limit,
                count: result.rows.length
            }
        });

    } catch (error) {
        console.error("Erreur récupération réservations:", error);
        return NextResponse.json(
            { success: false, error: "Erreur serveur" },
            { status: 500 }
        );
    }
}



