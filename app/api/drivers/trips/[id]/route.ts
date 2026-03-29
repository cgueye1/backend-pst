/**
 * @swagger
 * /api/drivers/trips/{id}:
 *   get:
 *     summary: Récupérer les détails d'un trajet spécifique
 *     description: Récupère les détails complets d'un trajet du chauffeur authentifié, incluant les arrêts (écoles) et les passagers
 *     tags: [CHAUFFEUR]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du trajet
 *     responses:
 *       200:
 *         description: Détails du trajet récupérés avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Trajet introuvable ou n'appartient pas au chauffeur
 *       500:
 *         description: Erreur serveur
 *   put:
 *     summary: Modifier un trajet
 *     description: Modifie un trajet existant du chauffeur authentifié, incluant la gestion des arrêts (écoles)
 *     tags: [CHAUFFEUR]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du trajet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_point:
 *                 type: string
 *                 example: "Dakar, Plateau"
 *               end_point:
 *                 type: string
 *                 example: "Ouakam"
 *               departure_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-25T08:00:00Z"
 *               return_departure_time:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: "2024-12-25T16:00:00Z"
 *               capacity_max:
 *                 type: integer
 *                 example: 5
 *               trip_type:
 *                 type: string
 *                 enum: [aller, retour, aller_retour]
 *                 example: "aller"
 *               school_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               stops:
 *                 type: array
 *                 description: Liste des arrêts (écoles) du trajet. Si fourni, remplace tous les arrêts existants
 *                 items:
 *                   type: object
 *                   required:
 *                     - school_id
 *                   properties:
 *                     school_id:
 *                       type: integer
 *                       example: 1
 *                     stop_order:
 *                       type: integer
 *                       example: 1
 *                     estimated_arrival_time:
 *                       type: string
 *                       format: time
 *                       nullable: true
 *                       example: "07:30"
 *                 example:
 *                   - school_id: 1
 *                     stop_order: 1
 *                     estimated_arrival_time: "07:30"
 *                   - school_id: 2
 *                     stop_order: 2
 *                     estimated_arrival_time: "08:00"
 *               is_recurring:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Trajet modifié avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Trajet ne peut pas être modifié (déjà commencé ou terminé)
 *       404:
 *         description: Trajet introuvable ou n'appartient pas au chauffeur
 *       500:
 *         description: Erreur serveur
 */

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'driver') {
            const response = NextResponse.json({ error: "Non autorisé" }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        // Récupérer le driver_id
        const driverResult = await query(
            `SELECT id FROM drivers WHERE user_id = $1`,
            [user.id]
        );

        if (driverResult.rowCount === 0) {
            const response = NextResponse.json({ error: "Chauffeur introuvable" }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        const driverId = driverResult.rows[0].id;
        const { id } = await params;
        const tripId = parseInt(id);

        if (isNaN(tripId)) {
            const response = NextResponse.json(
                { success: false, error: "ID de trajet invalide" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Récupérer le trajet avec tous ses détails
        const tripResult = await query(
            `
            SELECT 
                t.*,
                s.name as school_name,
                s.address as school_address,
                s.opening_time as school_opening_time,
                s.closing_time as school_closing_time,
                -- Calculer le statut global
                CASE 
                    WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
                        get_trip_overall_status(t.status, t.return_status, t.trip_type)
                    ELSE
                        t.status
                END as overall_status,
                -- Récupérer tous les arrêts (écoles) du trajet
                (
                    SELECT COALESCE(
                        json_agg(
                            jsonb_build_object(
                                'id', ts.id,
                                'school_id', ts.school_id,
                                'school_name', s2.name,
                                'school_address', s2.address,
                                'stop_order', ts.stop_order,
                                'estimated_arrival_time', ts.estimated_arrival_time
                            ) ORDER BY ts.stop_order
                        ),
                        '[]'::json
                    )
                    FROM trip_stops ts
                    LEFT JOIN schools s2 ON ts.school_id = s2.id
                    WHERE ts.trip_id = t.id
                ) as stops,
                -- Récupérer tous les passagers
                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'child_id', c.id,
                            'child_name', c.name,
                            'child_address', c.address,
                            'child_school_id', c.school_id,
                            'parent_id', u_parent.id,
                            'parent_name', u_parent.name,
                            'parent_phone', u_parent.phone,
                            'parent_email', u_parent.email,
                            'parent_address', u_parent.address
                        )
                    ) FILTER (WHERE c.id IS NOT NULL),
                    '[]'::json
                ) as passengers,
                -- Informations du chauffeur
                u_driver.name as driver_name,
                u_driver.phone as driver_phone,
                u_driver.email as driver_email,
                d.vehicle_plate,
                d.vehicle_photo,
                d.photo_profil as driver_photo,
                d.capacity as vehicle_capacity,
                -- Statistiques du trajet
                (
                    SELECT COUNT(*) 
                    FROM trip_children 
                    WHERE trip_id = t.id
                ) as booked_seats,
                (
                    t.capacity_max - (
                        SELECT COUNT(*) 
                        FROM trip_children 
                        WHERE trip_id = t.id
                    )
                ) as available_seats
            FROM trips t
            LEFT JOIN schools s ON t.school_id = s.id
            LEFT JOIN drivers d ON t.driver_id = d.id
            LEFT JOIN users u_driver ON d.user_id = u_driver.id
            LEFT JOIN trip_children tc ON t.id = tc.trip_id
            LEFT JOIN children c ON tc.child_id = c.id
            LEFT JOIN users u_parent ON c.parent_id = u_parent.id
            WHERE t.id = $1 AND t.driver_id = $2
            GROUP BY t.id, s.id, s.name, s.address, s.opening_time, s.closing_time,
                     u_driver.id, u_driver.name, u_driver.phone, u_driver.email,
                     d.id, d.vehicle_plate, d.vehicle_photo, d.photo_profil, d.capacity
            `,
            [tripId, driverId]
        );

        if (tripResult.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: "Trajet introuvable ou n'appartient pas à ce chauffeur" },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const trip = tripResult.rows[0];

        // Formater la réponse
        const formattedTrip = {
            ...trip,
            status: trip.overall_status, // Utiliser le statut global
            stops: trip.stops || [], // Inclure les arrêts
            passengers: trip.passengers || [], // Inclure les passagers
            // Garder aussi les statuts individuels pour référence
            status_aller: trip.status,
            status_retour: trip.return_status || null
        };

        // Supprimer overall_status de la réponse (déjà remplacé par status)
        delete formattedTrip.overall_status;

        const response = NextResponse.json({
            success: true,
            data: formattedTrip
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('Erreur récupération détails trajet:', error);
        const errorResponse = NextResponse.json(
            { success: false, error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'driver') {
            const response = NextResponse.json({ error: "Non autorisé" }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        // Récupérer le driver_id
        const driverResult = await query(
            `SELECT id, capacity FROM drivers WHERE user_id = $1`,
            [user.id]
        );

        if (driverResult.rowCount === 0) {
            const response = NextResponse.json({ error: "Chauffeur introuvable" }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        const driverId = driverResult.rows[0].id;
        const driverCapacity = driverResult.rows[0].capacity;
        const { id } = await params;
        const tripId = parseInt(id);

        if (isNaN(tripId)) {
            const response = NextResponse.json(
                { success: false, error: "ID de trajet invalide" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier que le trajet existe et appartient au chauffeur
        const tripCheck = await query(
            `SELECT id, driver_id, status, return_status, trip_type FROM trips WHERE id = $1 AND driver_id = $2`,
            [tripId, driverId]
        );

        if (tripCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: "Trajet introuvable ou n'appartient pas à ce chauffeur" },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const existingTrip = tripCheck.rows[0];

        // Vérifier que le trajet peut être modifié (pas déjà commencé ou terminé)
        if (existingTrip.status === 'in_progress' || existingTrip.status === 'completed' || 
            existingTrip.status === 'canceled' || existingTrip.return_status === 'completed') {
            const response = NextResponse.json(
                { success: false, error: "Ce trajet ne peut pas être modifié (déjà commencé, terminé ou annulé)" },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const body = await request.json();
        const { 
            start_point, 
            end_point, 
            departure_time, 
            return_departure_time, 
            capacity_max, 
            trip_type, 
            school_id, 
            is_recurring,
            stops 
        } = body;

        // Construire la requête UPDATE dynamiquement
        const updateFields: string[] = [];
        const updateValues: any[] = [];
        let paramIndex = 1;

        if (start_point !== undefined) {
            updateFields.push(`start_point = $${paramIndex++}`);
            updateValues.push(start_point);
        }

        if (end_point !== undefined) {
            updateFields.push(`end_point = $${paramIndex++}`);
            updateValues.push(end_point);
        }

        if (departure_time !== undefined) {
            updateFields.push(`departure_time = $${paramIndex++}`);
            updateValues.push(departure_time);
        }

        if (return_departure_time !== undefined) {
            updateFields.push(`return_departure_time = $${paramIndex++}`);
            updateValues.push(return_departure_time);
        }

        if (capacity_max !== undefined) {
            const capacityMaxNum = Number(capacity_max);
            if (isNaN(capacityMaxNum) || capacityMaxNum <= 0) {
                const response = NextResponse.json(
                    { success: false, error: "La capacité doit être un nombre positif" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            if (capacityMaxNum > driverCapacity) {
                const response = NextResponse.json(
                    { success: false, error: `La capacité du trajet (${capacityMaxNum}) dépasse celle de votre véhicule (${driverCapacity})` },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            updateFields.push(`capacity_max = $${paramIndex++}`);
            updateValues.push(capacityMaxNum);
        }

        if (trip_type !== undefined) {
            if (!['aller', 'retour', 'aller_retour'].includes(trip_type)) {
                const response = NextResponse.json(
                    { success: false, error: "Type de trajet invalide" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }
            updateFields.push(`trip_type = $${paramIndex++}`);
            updateValues.push(trip_type);
        }

        if (school_id !== undefined) {
            updateFields.push(`school_id = $${paramIndex++}`);
            updateValues.push(school_id);
        }

        if (is_recurring !== undefined) {
            updateFields.push(`is_recurring = $${paramIndex++}`);
            updateValues.push(is_recurring);
        }

        // Mettre à jour le trajet si des champs ont été fournis
        if (updateFields.length > 0) {
            updateFields.push(`updated_at = now()`);
            updateValues.push(tripId);

            await query(
                `UPDATE trips SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`,
                updateValues
            );
        }

        // Gérer les arrêts si fournis
        if (stops !== undefined) {
            // Supprimer tous les arrêts existants
            await query(
                `DELETE FROM trip_stops WHERE trip_id = $1`,
                [tripId]
            );

            // Créer les nouveaux arrêts
            if (Array.isArray(stops) && stops.length > 0) {
                for (const stop of stops) {
                    if (!stop.school_id) {
                        const response = NextResponse.json(
                            { success: false, error: "Chaque arrêt doit avoir un school_id" },
                            { status: 400 }
                        );
                        return setCorsHeaders(response, origin);
                    }

                    // Vérifier que l'école existe
                    const schoolCheck = await query(
                        `SELECT id FROM schools WHERE id = $1`,
                        [stop.school_id]
                    );

                    if (schoolCheck.rowCount === 0) {
                        const response = NextResponse.json(
                            { success: false, error: `École avec ID ${stop.school_id} introuvable` },
                            { status: 400 }
                        );
                        return setCorsHeaders(response, origin);
                    }

                    // Créer l'arrêt
                    await query(
                        `INSERT INTO trip_stops (trip_id, school_id, stop_order, estimated_arrival_time)
                         VALUES ($1, $2, $3, $4)`,
                        [
                            tripId,
                            stop.school_id,
                            stop.stop_order || stops.indexOf(stop) + 1,
                            stop.estimated_arrival_time || null
                        ]
                    );
                }
            } else if (school_id) {
                // Si stops est un tableau vide mais school_id est fourni, créer un arrêt par défaut
                await query(
                    `INSERT INTO trip_stops (trip_id, school_id, stop_order, estimated_arrival_time)
                     VALUES ($1, $2, 1, NULL)`,
                    [tripId, school_id]
                );
            }
        } else if (school_id !== undefined && school_id !== null) {
            // Si stops n'est pas fourni mais school_id est fourni, créer un arrêt par défaut
            // Supprimer d'abord les arrêts existants
            await query(
                `DELETE FROM trip_stops WHERE trip_id = $1`,
                [tripId]
            );
            
            await query(
                `INSERT INTO trip_stops (trip_id, school_id, stop_order, estimated_arrival_time)
                 VALUES ($1, $2, 1, NULL)`,
                [tripId, school_id]
            );
        }

        // Récupérer le trajet mis à jour avec ses arrêts
        const updatedTripResult = await query(
            `
            SELECT 
                t.*,
                (
                    SELECT COALESCE(
                        json_agg(
                            jsonb_build_object(
                                'id', ts.id,
                                'school_id', ts.school_id,
                                'school_name', s2.name,
                                'school_address', s2.address,
                                'stop_order', ts.stop_order,
                                'estimated_arrival_time', ts.estimated_arrival_time
                            ) ORDER BY ts.stop_order
                        ),
                        '[]'::json
                    )
                    FROM trip_stops ts
                    LEFT JOIN schools s2 ON ts.school_id = s2.id
                    WHERE ts.trip_id = t.id
                ) as stops
            FROM trips t
            WHERE t.id = $1
            `,
            [tripId]
        );

        const updatedTrip = updatedTripResult.rows[0];

        const response = NextResponse.json({
            success: true,
            message: "Trajet modifié avec succès",
            data: {
                ...updatedTrip,
                stops: updatedTrip.stops || []
            }
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('Erreur modification trajet:', error);
        const errorResponse = NextResponse.json(
            { success: false, error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

