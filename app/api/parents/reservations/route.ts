import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";

import { setCorsHeaders, corsOptions } from '@/lib/cors';
/**
 * @swagger
 * /api/parents/reservations:
 *   get:
 *     summary: Récupérer les réservations
 *     description: Récupère toutes les réservations du parent avec filtres optionnels.
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["pending","confirmed","completed","canceled"]
 *         description: status
 *       - in: query
 *         name: child_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: child_id
 *       - in: query
 *         name: trip_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: trip_id
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
 *   post:
 *     summary: Réserver un trajet
 *     description: Permet à un parent de réserver un trajet pour un ou plusieurs enfants.
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trip_id
 *               - child_ids
 *             properties:
 *               trip_id:
 *                 type: integer
 *                 description: ID du trajet
 *                 example: 1
 *               child_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: IDs des enfants
 *                 example: [1,2]
 *               is_recurring:
 *                 type: boolean
 *                 description: Réservation récurrente
 *                 default: false
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

export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== "parent") {
            const response = NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        const { trip_id, child_ids, is_recurring } = await request.json();

        // Validation des paramètres
        if (!trip_id || !Array.isArray(child_ids) || child_ids.length === 0) {
            const response = NextResponse.json(
                { success: false, error: "trip_id et child_ids requis" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Validation des types
        const tripIdNum = parseInt(trip_id);
        if (isNaN(tripIdNum)) {
            const response = NextResponse.json(
                { success: false, error: "trip_id doit être un nombre" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        const childIdsNums = child_ids.map(id => parseInt(id)).filter(id => !isNaN(id));
        if (childIdsNums.length !== child_ids.length) {
            const response = NextResponse.json(
                { success: false, error: "Tous les child_ids doivent être des nombres" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier que les enfants appartiennent au parent
        const childrenCheck = await query(
            `SELECT id FROM children WHERE id = ANY($1) AND parent_id = $2`,
            [childIdsNums, user.id]
        );

        if (childrenCheck.rows.length !== childIdsNums.length) {
            const response = NextResponse.json(
                { success: false, error: "Un ou plusieurs enfants ne vous appartiennent pas" },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        // Démarrer une transaction pour éviter les race conditions
        await query('BEGIN');

        let returnTripId: number | null = null;
        let returnTripReserved = false;
        let trip: any = null;

        try {
            // Vérifier le trajet avec verrouillage (FOR UPDATE)
            // Utiliser FOR UPDATE OF t pour spécifier qu'on verrouille seulement la table trips
            // Cela évite l'erreur avec LEFT JOIN
            const tripCheck = await query(
                `
                SELECT 
                    t.id,
                    t.capacity_max,
                    t.departure_time,
                    t.return_departure_time,
                    t.status,
                    t.return_status,
                    t.start_point,
                    t.end_point,
                    t.school_id,
                    t.driver_id,
                    t.trip_type,
                    (SELECT COUNT(*) FROM trip_children WHERE trip_id = t.id) AS current_bookings,
                    d.user_id AS driver_user_id,
                    s.closing_time AS school_closing_time
                FROM trips t
                INNER JOIN drivers d ON t.driver_id = d.id
                LEFT JOIN schools s ON t.school_id = s.id
                WHERE t.id = $1
                FOR UPDATE OF t
                `,
                [tripIdNum]
            );

            if (tripCheck.rows.length === 0) {
                await query('ROLLBACK');
                const response = NextResponse.json(
                    { success: false, error: "Trajet introuvable" },
                    { status: 404 }
                );
                return setCorsHeaders(response, origin);
            }

            trip = tripCheck.rows[0];

            // Vérifier que le trajet est disponible (utiliser le statut global)
            const { getTripOverallStatus } = await import('@/lib/tripStatusUtils');
            const overallStatus = getTripOverallStatus(
                trip.status,
                trip.return_status || null,
                trip.trip_type || 'aller'
            );

            if (overallStatus !== 'pending') {
                await query('ROLLBACK');
                const response = NextResponse.json(
                    { success: false, error: "Trajet indisponible (déjà commencé ou terminé)" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            // Vérifier que le trajet n'est pas dans le passé
            if (new Date(trip.departure_time) < new Date()) {
                await query('ROLLBACK');
                const response = NextResponse.json(
                    { success: false, error: "Impossible de réserver un trajet dans le passé" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            // Vérifier les doubles réservations
            const existingReservations = await query(
                `SELECT child_id FROM trip_children WHERE trip_id = $1 AND child_id = ANY($2)`,
                [tripIdNum, childIdsNums]
            );

            if (existingReservations.rows.length > 0) {
                await query('ROLLBACK');
                const duplicateChildren = existingReservations.rows.map(r => r.child_id);
                const response = NextResponse.json(
                    {
                        success: false,
                        error: "Un ou plusieurs enfants sont déjà réservés sur ce trajet",
                        duplicate_children: duplicateChildren
                    },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            // Re-vérifier la capacité (après verrouillage)
            const availableSeats = trip.capacity_max - Number(trip.current_bookings);

            if (availableSeats < childIdsNums.length) {
                await query('ROLLBACK');
                const response = NextResponse.json(
                    { success: false, error: "Pas assez de places disponibles" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            // Si c'est un trajet aller-retour, vérifier que le retour est disponible
            if (trip.trip_type === 'aller_retour' && trip.return_departure_time) {
                // Pour un trajet aller-retour, on réserve automatiquement l'aller ET le retour
                // La capacité est partagée entre l'aller et le retour (même véhicule)
                // Donc on vérifie juste qu'il y a assez de places pour les deux
                returnTripReserved = true;
                returnTripId = trip.id; // Même trajet pour l'aller et le retour
            } else if (trip.trip_type === 'aller' || !trip.trip_type) {
                // Ancien système : chercher un trajet retour séparé (pour compatibilité)
                const tripDate = new Date(trip.departure_time);
                const tripDateStr = tripDate.toISOString().split('T')[0];

                // Calculer l'heure de départ du retour (après la fermeture de l'école)
                const schoolClosingTime = trip.school_closing_time || '16:00:00';
                const [closingHour, closingMinute] = schoolClosingTime.split(':').map(Number);
                const returnDepartureTime = new Date(tripDate);
                returnDepartureTime.setHours(closingHour, closingMinute, 0, 0);
                returnDepartureTime.setMinutes(returnDepartureTime.getMinutes() + 30);

                const returnTripCheck = await query(
                    `
                    SELECT 
                        t.id,
                        t.capacity_max,
                        t.status,
                        (SELECT COUNT(*) FROM trip_children WHERE trip_id = t.id) AS current_bookings
                    FROM trips t
                    WHERE t.driver_id = $1
                      AND t.school_id = $2
                      AND t.start_point = $3
                      AND t.end_point = $4
                      AND DATE(t.departure_time) = $5
                      AND t.departure_time >= $6
                      AND (t.trip_type = 'retour' OR t.trip_type IS NULL)
                      AND t.status = 'pending'
                    ORDER BY t.departure_time ASC
                    LIMIT 1
                    FOR UPDATE OF t
                    `,
                    [
                        trip.driver_id,
                        trip.school_id,
                        trip.end_point,
                        trip.start_point,
                        tripDateStr,
                        returnDepartureTime.toISOString()
                    ]
                );

                if (returnTripCheck.rows.length > 0) {
                    const returnTrip = returnTripCheck.rows[0];
                    const returnAvailableSeats = returnTrip.capacity_max - Number(returnTrip.current_bookings);

                    if (returnAvailableSeats >= childIdsNums.length) {
                        returnTripId = returnTrip.id;
                        returnTripReserved = true;
                    } else {
                        await query('ROLLBACK');
                        const response = NextResponse.json(
                            {
                                success: false,
                                error: "Pas assez de places disponibles pour le trajet retour",
                                return_trip_id: returnTrip.id,
                                available_seats_return: returnAvailableSeats
                            },
                            { status: 400 }
                        );
                        return setCorsHeaders(response, origin);
                    }
                } else {
                    console.warn(`Aucun trajet retour trouvé pour le trajet aller ${trip_id}`);
                }
            }

            // Insertion réservations
            // Pour un trajet aller-retour, une seule réservation suffit (même trajet)
            // Pour un trajet aller avec retour séparé, on réserve les deux
            for (const child_id of childIdsNums) {
                // Réservation pour l'aller (ou aller-retour)
                await query(
                    `INSERT INTO trip_children (trip_id, child_id) VALUES ($1, $2)`,
                    [tripIdNum, child_id]
                );

                // Si c'est un retour séparé, réserver aussi le retour
                if (returnTripReserved && returnTripId && returnTripId !== trip_id) {
                    const existingReturnReservation = await query(
                        `SELECT 1 FROM trip_children WHERE trip_id = $1 AND child_id = $2`,
                        [returnTripId, child_id]
                    );

                    if (existingReturnReservation.rows.length === 0) {
                        await query(
                            `INSERT INTO trip_children (trip_id, child_id) VALUES ($1, $2)`,
                            [returnTripId, child_id]
                        );
                    }
                }
            }

            await query('COMMIT');
        } catch (error: any) {
            await query('ROLLBACK');
            throw error;
        }

        // Déterminer le message selon le type de trajet
        let message = "Réservation effectuée avec succès";
        if (trip.trip_type === 'aller_retour' && trip.return_departure_time) {
            message = "Réservation aller-retour effectuée avec succès";
        } else if (returnTripReserved) {
            message = "Réservation aller et retour effectuée avec succès";
        }

        const successResponse = NextResponse.json({
            success: true,
            message,
            data: {
                trip_id: tripIdNum,
                return_trip_id: returnTripId || null,
                trip_type: trip.trip_type || 'aller',
                return_departure_time: trip.return_departure_time || null,
                return_reserved: returnTripReserved || (trip.trip_type === 'aller_retour' && !!trip.return_departure_time),
                children_count: childIdsNums.length,
                is_recurring: !!is_recurring
            }
        });
        return setCorsHeaders(successResponse, origin);

    } catch (error: any) {
        console.error("Erreur réservation:", error);
        console.error("Stack trace:", error.stack);
        console.error("Error details:", {
            message: error.message,
            code: error.code,
            detail: error.detail,
            constraint: error.constraint,
            table: error.table,
            column: error.column
        });

        // Retourner un message d'erreur plus détaillé en développement
        const errorMessage = process.env.NODE_ENV === 'production'
            ? "Erreur serveur"
            : error.message || "Erreur serveur";

        const errorResponse = NextResponse.json(
            {
                success: false,
                error: errorMessage,
                ...(process.env.NODE_ENV !== 'production' && {
                    details: {
                        code: error.code,
                        detail: error.detail,
                        constraint: error.constraint
                    }
                })
            },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== "parent") {
            const response = NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
            return setCorsHeaders(response, origin);
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
            // Utiliser le statut global pour les trajets aller-retour
            conditions.push(`(
                CASE 
                    WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
                        get_trip_overall_status(t.status, t.return_status, t.trip_type) = $${paramIndex}
                    ELSE
                        t.status = $${paramIndex}
                END
            )`);
            params.push(status);
            paramIndex++;
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
                t.return_departure_time,
                t.status,
                t.return_status,
                t.trip_type,
                c.name AS child_name,
                u.name AS driver_name,
                d.vehicle_plate,
                -- Calculer le statut global
                CASE 
                    WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
                        get_trip_overall_status(t.status, t.return_status, t.trip_type)
                    ELSE
                        t.status
                END as overall_status
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

        // Formater les résultats pour remplacer status par overall_status
        const formattedReservations = result.rows.map((reservation: any) => {
            const { overall_status, ...rest } = reservation;
            return {
                ...rest,
                status: overall_status, // Remplacer status par overall_status
                // Garder aussi les statuts individuels pour référence
                status_aller: reservation.status,
                status_retour: reservation.return_status || null
            };
        });

        const response = NextResponse.json({
            success: true,
            data: formattedReservations,
            pagination: {
                page,
                limit,
                count: formattedReservations.length
            }
        });
        return setCorsHeaders(response, origin);

    } catch (error) {
        console.error("Erreur récupération réservations:", error);
        const errorResponse = NextResponse.json(
            { success: false, error: "Erreur serveur" },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}



