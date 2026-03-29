

/**
 * @swagger
 * /api/drivers/trips/{id}/start:
 *   put:
 *     summary: Démarrer un trajet (aller ou retour)
 *     description: |
 *       Démarre un trajet aller ou retour.
 *       Pour un trajet aller-retour, utilisez le paramètre ?direction=retour pour démarrer le retour.
 *       Par défaut, démarre l'aller.
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
 *       - in: query
 *         name: direction
 *         required: false
 *         schema:
 *           type: string
 *           enum: [aller, retour]
 *           default: aller
 *         description: Direction du trajet à démarrer (aller ou retour). Par défaut aller.
 *     responses:
 *       200:
 *         description: Trajet démarré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Trajet aller démarré avec succès"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     status:
 *                       type: string
 *                       description: Statut global du trajet (in_progress, partially_completed, completed, etc.)
 *                       example: "in_progress"
 *                     status_aller:
 *                       type: string
 *                       description: Statut de l'aller (pending, in_progress, completed, canceled)
 *                       example: "in_progress"
 *                     status_retour:
 *                       type: string
 *                       nullable: true
 *                       description: Statut du retour (pending, in_progress, completed, canceled)
 *                       example: null
 *                     trip_type:
 *                       type: string
 *                       enum: [aller, retour, aller_retour]
 *                       example: "aller_retour"
 *                     direction:
 *                       type: string
 *                       enum: [aller, retour]
 *                       example: "aller"
 *                     departure_time:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-25T08:00:00Z"
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                     no_children:
 *                       value: "Aucun enfant réservé pour ce trajet"
 *                     past_date:
 *                       value: "Impossible de démarrer un trajet dans le passé"
 *                     already_started:
 *                       value: "Le trajet retour est déjà en cours"
 *       403:
 *         description: Non autorisé / chauffeur non approuvé
 *       404:
 *         description: Trajet introuvable
 *       500:
 *         description: Erreur serveur
 */

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { setCorsHeaders, corsOptions } from "@/lib/cors";
import { notifyParentsAboutTrip } from "@/services/tripNotificationService";

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const origin = request.headers.get('origin');
    try {
        // Récupérer l'utilisateur connecté
        const user = await getUserFromRequest(request);

        if (!user || user.role !== 'driver') {
            const response = NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        // Récupérer le driver et vérifier le statut
        const driverResult = await query(
            `SELECT id, status FROM drivers WHERE user_id = $1`,
            [user.id]
        );

        if (driverResult.rowCount === 0) {
            const response = NextResponse.json({ error: 'Chauffeur introuvable' }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        const driver = driverResult.rows[0];
        if (driver.status !== 'Approuvé') {
            const response = NextResponse.json(
                {
                    error: 'Votre compte chauffeur est en attente d\'approbation',
                    status: driver.status
                },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const driverId = driver.id;
        const { id: tripId } = await params;

        // Récupérer le paramètre direction (aller ou retour) - optionnel, sera détecté automatiquement si non fourni
        const url = new URL(request.url);
        let direction = url.searchParams.get('direction'); // Peut être null

        // Vérifier le trajet avant de le démarrer
        const tripCheck = await query(
            `SELECT id, departure_time, return_departure_time, status, return_status, trip_type 
             FROM trips WHERE id = $1 AND driver_id = $2`,
            [tripId, driverId]
        );

        if (tripCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, message: "Trajet introuvable" },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const trip = tripCheck.rows[0];

        // Détection automatique de la direction si non spécifiée
        if (!direction && trip.trip_type === 'aller_retour' && trip.return_departure_time) {
            // Logique de détection automatique simple et claire :
            // - Si l'aller est terminé ET le retour n'est pas encore démarré → démarrer le retour
            // - Sinon → démarrer l'aller
            if (trip.status === 'completed' && trip.return_status === 'pending') {
                // L'aller est terminé, on démarre automatiquement le retour
                direction = 'retour';
            } else if (trip.status === 'pending' || trip.status === 'in_progress') {
                // L'aller n'est pas encore terminé, on démarre/continue l'aller
                direction = 'aller';
            } else {
                // Par défaut, démarrer l'aller
                direction = 'aller';
            }
        } else if (!direction) {
            // Trajet simple (pas aller-retour) ou pas de retour
            direction = 'aller';
        }

        // Vérifier qu'il y a des enfants réservés
        const childrenCount = await query(
            `SELECT COUNT(*) as count FROM trip_children WHERE trip_id = $1`,
            [tripId]
        );

        if (Number(childrenCount.rows[0].count) === 0) {
            const response = NextResponse.json(
                { success: false, message: "Aucun enfant réservé pour ce trajet" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        let result;
        let departureTime;
        let messageDirection;

        if (direction === 'retour') {
            // Démarrer le retour
            if (!trip.return_departure_time) {
                const response = NextResponse.json(
                    { success: false, message: "Ce trajet n'a pas de retour" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            // Vérifier que l'aller est terminé
            if (trip.status !== 'completed') {
                const response = NextResponse.json(
                    { success: false, message: "Vous devez d'abord terminer le trajet aller avant de démarrer le retour" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            // Note: On ne vérifie plus si l'heure de retour est passée
            // Le chauffeur peut démarrer le retour même s'il est un peu en retard
            // (par exemple si l'aller a pris plus de temps que prévu)

            // Vérifier que le retour n'est pas déjà démarré/terminé
            if (trip.return_status && trip.return_status !== 'pending') {
                const response = NextResponse.json(
                    { success: false, message: `Le trajet retour est déjà ${trip.return_status === 'in_progress' ? 'en cours' : 'terminé'}` },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            // Mettre à jour le statut du retour
            result = await query(
                `UPDATE trips
                 SET return_status = 'in_progress'
                 WHERE id = $1 AND driver_id = $2 AND return_status = 'pending'
                 RETURNING *`,
                [tripId, driverId]
            );

            departureTime = trip.return_departure_time;
            messageDirection = 'retour';
        } else {
            // Démarrer l'aller
            // Vérifier que le trajet n'est pas dans le passé
            if (new Date(trip.departure_time) < new Date()) {
                const response = NextResponse.json(
                    { success: false, message: "Impossible de démarrer un trajet dans le passé" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            // Mettre à jour le statut du trajet (seulement depuis pending)
            result = await query(
                `UPDATE trips
                 SET status = 'in_progress'
                 WHERE id = $1 AND driver_id = $2 AND status = 'pending'
                 RETURNING *`,
                [tripId, driverId]
            );

            departureTime = trip.departure_time;
            messageDirection = 'aller';
        }

        if (result.rows.length === 0) {
            const response = NextResponse.json(
                {
                    success: false,
                    message: "Trajet introuvable ou déjà démarré/terminé"
                },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        // Récupérer le trajet mis à jour avec le statut global calculé
        const updatedTrip = await query(
            `SELECT 
                t.*,
                -- Calculer le statut global
                CASE 
                    WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
                        get_trip_overall_status(t.status, t.return_status, t.trip_type)
                    ELSE
                        t.status
                END as overall_status
             FROM trips t
             WHERE t.id = $1`,
            [tripId]
        );

        const tripData = updatedTrip.rows[0];

        // Notifier les parents via le service de notifications
        const startPoint = direction === 'retour'
            ? tripData.end_point  // Pour le retour, le point de départ est l'end_point de l'aller
            : tripData.start_point;
        const endPoint = direction === 'retour'
            ? tripData.start_point
            : tripData.end_point;

        try {
            await notifyParentsAboutTrip({
                tripId: parseInt(tripId),
                driverId,
                direction: direction as 'aller' | 'retour',
                action: 'started',
                startPoint,
                endPoint
            });
        } catch (notifError) {
            console.error('Erreur lors de la notification des parents:', notifError);
            // Ne pas faire échouer le démarrage du trajet si la notification échoue
        }

        const response = NextResponse.json({
            success: true,
            message: `Trajet ${messageDirection} démarré avec succès`,
            data: {
                ...tripData,
                status: tripData.overall_status, // Statut global
                status_aller: tripData.status, // Statut de l'aller
                status_retour: tripData.return_status || null, // Statut du retour
                direction: messageDirection,
                departure_time: departureTime
            },
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur démarrage trajet:", error);
        const errorResponse = NextResponse.json(
            {
                success: false,
                message: error.message,
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}
