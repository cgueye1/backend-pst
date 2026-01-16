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
            [child_ids, user.id]
        );

        if (childrenCheck.rows.length !== child_ids.length) {
            return NextResponse.json(
                { success: false, error: "Un ou plusieurs enfants ne vous appartiennent pas" },
                { status: 403 }
            );
        }

        // Démarrer une transaction pour éviter les race conditions
        await query('BEGIN');

        try {
            // Vérifier le trajet avec verrouillage (FOR UPDATE)
            const tripCheck = await query(
                `
                SELECT 
                    t.id,
                    t.capacity_max,
                    t.departure_time,
                    t.status,
                    (SELECT COUNT(*) FROM trip_children WHERE trip_id = t.id) AS current_bookings,
                    d.user_id AS driver_user_id
                FROM trips t
                INNER JOIN drivers d ON t.driver_id = d.id
                WHERE t.id = $1
                FOR UPDATE
                `,
                [trip_id]
            );

            if (tripCheck.rows.length === 0) {
                await query('ROLLBACK');
                return NextResponse.json(
                    { success: false, error: "Trajet introuvable" },
                    { status: 404 }
                );
            }

            const trip = tripCheck.rows[0];

            // Vérifier que le trajet est disponible
            if (trip.status !== 'pending') {
                await query('ROLLBACK');
                return NextResponse.json(
                    { success: false, error: "Trajet indisponible (déjà commencé ou terminé)" },
                    { status: 400 }
                );
            }

            // Vérifier que le trajet n'est pas dans le passé
            if (new Date(trip.departure_time) < new Date()) {
                await query('ROLLBACK');
                return NextResponse.json(
                    { success: false, error: "Impossible de réserver un trajet dans le passé" },
                    { status: 400 }
                );
            }

            // Vérifier les doubles réservations
            const existingReservations = await query(
                `SELECT child_id FROM trip_children WHERE trip_id = $1 AND child_id = ANY($2)`,
                [trip_id, child_ids]
            );

            if (existingReservations.rows.length > 0) {
                await query('ROLLBACK');
                const duplicateChildren = existingReservations.rows.map(r => r.child_id);
                return NextResponse.json(
                    {
                        success: false,
                        error: "Un ou plusieurs enfants sont déjà réservés sur ce trajet",
                        duplicate_children: duplicateChildren
                    },
                    { status: 400 }
                );
            }

            // Re-vérifier la capacité (après verrouillage)
            const availableSeats = trip.capacity_max - Number(trip.current_bookings);

            if (availableSeats < child_ids.length) {
                await query('ROLLBACK');
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

            await query('COMMIT');
        } catch (error: any) {
            await query('ROLLBACK');
            throw error;
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

        // Construire la requête avec paramètres sécurisés (éviter SQL injection)
        const conditions: string[] = ["c.parent_id = $1"];
        const params: any[] = [user.id];
        let paramIndex = 2;

        if (status !== "all") {
            conditions.push(`t.status = $${paramIndex++}`);
            params.push(status);
        }

        const whereClause = conditions.join(" AND ");

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
            WHERE ${whereClause}
            ORDER BY t.departure_time DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
            `,
            [...params, limit, offset]
        );
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



