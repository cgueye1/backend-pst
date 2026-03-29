/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Récupérer un trajet par ID
 *     description: Récupère les détails d'un trajet spécifique.
 *     tags: ["ADMIN"]
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
 *   put:
 *     summary: Mettre à jour un trajet
 *     description: Met à jour les informations d'un trajet.
 *     tags: ["ADMIN"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driver_id:
 *                 type: integer
 *                 nullable: true
 *               school_id:
 *                 type: integer
 *                 nullable: true
 *                 description: ID de l'école principale (optionnel, pour compatibilité. Utiliser 'stops' pour plusieurs arrêts)
 *               start_point:
 *                 type: string
 *               end_point:
 *                 type: string
 *               departure_time:
 *                 type: string
 *                 format: date-time
 *               return_departure_time:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               capacity_max:
 *                 type: integer
 *               trip_type:
 *                 type: string
 *                 enum: [aller, retour, aller_retour]
 *               status:
 *                 type: string
 *                 enum: ["pending","completed","canceled"]
 *               is_recurring:
 *                 type: boolean
 *               stops:
 *                 type: array
 *                 nullable: true
 *                 description: |
 *                   Liste des arrêts (écoles) du trajet. Si fourni, remplace tous les arrêts existants.
 *                   Si non fourni mais school_id est fourni, un arrêt unique sera créé automatiquement.
 *                 items:
 *                   type: object
 *                   required:
 *                     - school_id
 *                   properties:
 *                     school_id:
 *                       type: integer
 *                       description: ID de l'école (arrêt)
 *                     stop_order:
 *                       type: integer
 *                       description: Ordre de l'arrêt (1 = premier, 2 = deuxième, etc.)
 *                     estimated_arrival_time:
 *                       type: string
 *                       format: time
 *                       nullable: true
 *                       description: Heure d'arrivée estimée à cet arrêt (format HH:MM)
 *                 example:
 *                   - school_id: 1
 *                     stop_order: 1
 *                     estimated_arrival_time: "07:30"
 *                   - school_id: 2
 *                     stop_order: 2
 *                     estimated_arrival_time: "08:00"
 *     responses:
 *       200:
 *         description: Trajet modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 driver_id:
 *                   type: integer
 *                   nullable: true
 *                 school_id:
 *                   type: integer
 *                   nullable: true
 *                 start_point:
 *                   type: string
 *                 end_point:
 *                   type: string
 *                 departure_time:
 *                   type: string
 *                   format: date-time
 *                 return_departure_time:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 capacity_max:
 *                   type: integer
 *                 trip_type:
 *                   type: string
 *                   enum: [aller, retour, aller_retour]
 *                 status:
 *                   type: string
 *                 is_recurring:
 *                   type: boolean
 *                 stops:
 *                   type: array
 *                   description: Liste des arrêts (écoles) du trajet
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       school_id:
 *                         type: integer
 *                       school_name:
 *                         type: string
 *                       school_address:
 *                         type: string
 *                       stop_order:
 *                         type: integer
 *                       estimated_arrival_time:
 *                         type: string
 *                         format: time
 *                         nullable: true
 *                 driver:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
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
 *   delete:
 *     summary: Supprimer un trajet
 *     description: Supprime un trajet.
 *     tags: ["ADMIN"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID id
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

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { setCorsHeaders, corsOptions } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

type Params = {
    params: Promise<{ id: string }>;
};

// GET: Récupérer un trajet par ID
// GET: Récupérer un trajet par ID avec info chauffeur
export async function GET(req: NextRequest, context: Params) {
    const origin = req.headers.get('origin');
    try {
        const { id } = await context.params;
        const numericId = Number(id);

        if (isNaN(numericId)) {
            const response = NextResponse.json({ error: 'ID invalide' }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        // Requête SQL avec jointure sur driver et user, incluant les coordonnées GPS et les arrêts
        const res = await query(
            `
      SELECT 
        t.*,
        t.start_latitude,
        t.start_longitude,
        t.end_latitude,
        t.end_longitude,
        d.id AS driver_id,
        d.user_id AS driver_user_id,
        u.name AS driver_name, 
        u.email AS driver_email,
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
        ) as stops
      FROM trips t
      LEFT JOIN drivers d ON t.driver_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE t.id = $1
      `,
            [numericId]
        );

        if (res.rowCount === 0) {
            const response = NextResponse.json({ error: 'Trajet non trouvé' }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        // Transformer le résultat pour inclure un objet chauffeur plus clair
        const trip = res.rows[0];
        const result = {
            ...trip,
            stops: trip.stops || [], // Tous les arrêts (écoles) du trajet
            driver: trip.driver_id
                ? {
                    id: trip.driver_id,
                    userId: trip.driver_user_id,
                    name: trip.driver_name,
                    email: trip.driver_email,
                }
                : null, // null si pas de chauffeur
        };

        const response = NextResponse.json(result);
        return setCorsHeaders(response, origin);
    } catch (error) {
        console.error('GET trip error:', error);
        const response = NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}
// PUT: Mettre à jour un trajet complet
export async function PUT(req: NextRequest, context: Params) {
    const origin = req.headers.get('origin');
    try {
        const { id } = await context.params;
        const numericId = Number(id);

        if (isNaN(numericId)) {
            const response = NextResponse.json({ error: 'ID invalide' }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        const body = await req.json();
        const {
            driver_id,
            school_id,
            start_point,
            end_point,
            departure_time,
            return_departure_time,
            capacity_max,
            trip_type,
            status,
            is_recurring,
            stops
        } = body;

        // Validation des champs requis
        if (!start_point || !end_point || !departure_time) {
            const response = NextResponse.json(
                { error: 'Champs requis manquants (start_point, end_point, departure_time)' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Construire la requête UPDATE dynamiquement
        const updateFields: string[] = [];
        const updateValues: any[] = [];
        let paramIndex = 1;

        if (driver_id !== undefined) {
            updateFields.push(`driver_id = $${paramIndex++}`);
            updateValues.push(driver_id || null);
        }

        if (school_id !== undefined) {
            updateFields.push(`school_id = $${paramIndex++}`);
            updateValues.push(school_id || null);
        }

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
            updateValues.push(return_departure_time || null);
        }

        if (capacity_max !== undefined) {
            updateFields.push(`capacity_max = $${paramIndex++}`);
            updateValues.push(capacity_max || 4);
        }

        if (trip_type !== undefined) {
            updateFields.push(`trip_type = $${paramIndex++}`);
            updateValues.push(trip_type);
        }

        if (status !== undefined) {
            updateFields.push(`status = $${paramIndex++}`);
            updateValues.push(status);
        }

        if (is_recurring !== undefined) {
            updateFields.push(`is_recurring = $${paramIndex++}`);
            updateValues.push(is_recurring || false);
        }

        // Mettre à jour le trajet si des champs ont été fournis
        if (updateFields.length > 0) {
            updateFields.push(`updated_at = now()`);
            updateValues.push(numericId);

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
                [numericId]
            );

            // Créer les nouveaux arrêts
            if (Array.isArray(stops) && stops.length > 0) {
                for (const stop of stops) {
                    if (!stop.school_id) {
                        const response = NextResponse.json(
                            { error: "Chaque arrêt doit avoir un school_id" },
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
                            { error: `École avec ID ${stop.school_id} introuvable` },
                            { status: 400 }
                        );
                        return setCorsHeaders(response, origin);
                    }

                    // Créer l'arrêt
                    await query(
                        `INSERT INTO trip_stops (trip_id, school_id, stop_order, estimated_arrival_time)
                         VALUES ($1, $2, $3, $4)`,
                        [
                            numericId,
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
                    [numericId, school_id]
                );
            }
        } else if (school_id !== undefined && school_id !== null) {
            // Si stops n'est pas fourni mais school_id est fourni, créer un arrêt par défaut
            // Supprimer d'abord les arrêts existants
            await query(
                `DELETE FROM trip_stops WHERE trip_id = $1`,
                [numericId]
            );
            
            await query(
                `INSERT INTO trip_stops (trip_id, school_id, stop_order, estimated_arrival_time)
                 VALUES ($1, $2, 1, NULL)`,
                [numericId, school_id]
            );
        }

        // Récupérer le trajet mis à jour avec ses arrêts
        const updatedTripResult = await query(
            `
            SELECT 
                t.*,
                d.id AS driver_id,
                d.user_id AS driver_user_id,
                u.name AS driver_name, 
                u.email AS driver_email,
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
            LEFT JOIN drivers d ON t.driver_id = d.id
            LEFT JOIN users u ON d.user_id = u.id
            WHERE t.id = $1
            `,
            [numericId]
        );

        if (updatedTripResult.rowCount === 0) {
            const response = NextResponse.json({ error: 'Trajet non trouvé' }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        const updatedTrip = updatedTripResult.rows[0];
        const result = {
            ...updatedTrip,
            stops: updatedTrip.stops || [],
            driver: updatedTrip.driver_id
                ? {
                    id: updatedTrip.driver_id,
                    userId: updatedTrip.driver_user_id,
                    name: updatedTrip.driver_name,
                    email: updatedTrip.driver_email,
                }
                : null,
        };

        const response = NextResponse.json(result);
        return setCorsHeaders(response, origin);
    } catch (error: any) {
        console.error('PUT trip error:', error);
        const response = NextResponse.json(
            { error: error.message || 'Erreur lors de la mise à jour' },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}

// PATCH: Affecter un chauffeur à un trajet
export async function PATCH(req: NextRequest, context: Params) {
    const origin = req.headers.get('origin');
    try {
        const { id } = await context.params;
        const tripId = Number(id);

        if (isNaN(tripId)) {
            const response = NextResponse.json({ error: 'ID invalide' }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        const body = await req.json();
        const { driver_id } = body;

        if (!driver_id) {
            const response = NextResponse.json(
                { error: 'driver_id requis' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Récupération du trajet
        const tripResult = await query(
            `SELECT start_point, end_point, departure_time, driver_id 
             FROM trips 
             WHERE id = $1`,
            [tripId]
        );

        if (tripResult.rowCount === 0) {
            const response = NextResponse.json(
                { error: 'Trajet introuvable' },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const trip = tripResult.rows[0];

        // Optionnel: Vérifier si un chauffeur est déjà affecté
        if (trip.driver_id && trip.driver_id !== driver_id) {
            const response = NextResponse.json(
                {
                    error: 'Un chauffeur est déjà affecté à ce trajet',
                    current_driver_id: trip.driver_id
                },
                { status: 409 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérification des conflits d'horaire pour le chauffeur
        const conflictResult = await query(
            `SELECT id FROM trips
             WHERE driver_id = $1
               AND id != $2
               AND start_point = $3
               AND end_point = $4
               AND departure_time = $5`,
            [driver_id, tripId, trip.start_point, trip.end_point, trip.departure_time]
        );

        if (conflictResult.rowCount && conflictResult.rowCount > 0) {
            const response = NextResponse.json(
                { error: 'Ce chauffeur a déjà un trajet similaire à cette heure' },
                { status: 409 }
            );
            return setCorsHeaders(response, origin);
        }

        // Affectation du chauffeur
        const updateResult = await query(
            `UPDATE trips
             SET driver_id = $1, 
                 status = CASE WHEN status = 'En attente' THEN 'Confirmé' ELSE status END 
               WHERE id = $2
             RETURNING *`,
            [driver_id, tripId]
        );

        const response = NextResponse.json({
            message: 'Chauffeur affecté avec succès',
            trip: updateResult.rows[0]
        });
        return setCorsHeaders(response, origin);
    } catch (error: any) {
        console.error('PATCH trip (assign driver) error:', error);
        const response = NextResponse.json(
            { error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}

// DELETE: Supprimer un trajet
export async function DELETE(req: NextRequest, context: Params) {
    const origin = req.headers.get('origin');
    try {
        const { id } = await context.params;
        const numericId = Number(id);

        if (isNaN(numericId)) {
            const response = NextResponse.json({ error: 'ID invalide' }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        // Vérifier si le trajet existe avant suppression
        const checkResult = await query(
            'SELECT id, status FROM trips WHERE id=$1',
            [numericId]
        );

        if (checkResult.rowCount === 0) {
            const response = NextResponse.json({ error: 'Trajet non trouvé' }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        const trip = checkResult.rows[0];

        // Optionnel: Empêcher la suppression de trajets en cours
        if (trip.status === 'En cours') {
            const response = NextResponse.json(
                { error: 'Impossible de supprimer un trajet en cours' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Suppression
        await query('DELETE FROM trips WHERE id=$1', [numericId]);

        const response = NextResponse.json({
            success: true,
            message: 'Trajet supprimé avec succès'
        });
        return setCorsHeaders(response, origin);
    } catch (error: any) {
        console.error('DELETE trip error:', error);
        const response = NextResponse.json(
            { error: error.message || 'Erreur lors de la suppression' },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}