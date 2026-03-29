
/**
 * @swagger
 * /api/drivers/trips/{id}/completed:
 *   put:
 *     summary: Terminer un trajet (aller ou retour)
 *     description: |
 *       Termine un trajet aller ou retour.
 *       Pour un trajet aller-retour, utilisez le paramètre ?direction=retour pour terminer le retour.
 *       Par défaut, termine l'aller.
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
 *         description: Direction du trajet à terminer (aller ou retour). Par défaut aller.
 *     responses:
 *       200:
 *         description: Trajet terminé avec succès
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
 *                   description: Message personnalisé selon le statut. Si partially_completed, message indique que l'aller est terminé et que le retour peut être démarré. Si completed, message indique que le trajet aller-retour est complètement terminé.
 *                   example: "Trajet aller terminé. Le trajet est maintenant partiellement terminé. Vous pouvez démarrer le retour."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     status:
 *                       type: string
 *                       description: Statut global du trajet calculé automatiquement. partially_completed signifie aller terminé et retour en attente (pour trajets aller-retour). completed signifie trajet complètement terminé. in_progress signifie trajet en cours.
 *                       enum: [pending, in_progress, completed, canceled, partially_completed]
 *                       example: "partially_completed"
 *                     status_aller:
 *                       type: string
 *                       description: Statut de l'aller (pending, in_progress, completed, canceled)
 *                       example: "completed"
 *                     status_retour:
 *                       type: string
 *                       nullable: true
 *                       description: Statut du retour (pending, in_progress, completed, canceled)
 *                       example: "pending"
 *                     trip_type:
 *                       type: string
 *                       enum: [aller, retour, aller_retour]
 *                       example: "aller_retour"
 *                     direction:
 *                       type: string
 *                       enum: [aller, retour]
 *                       example: "aller"
 *                     auto_detected:
 *                       type: boolean
 *                       description: Indique si la direction a été détectée automatiquement
 *                       example: true
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
 *                     no_return:
 *                       value: "Ce trajet n'a pas de retour"
 *       403:
 *         description: Non autorisé / chauffeur non approuvé
 *       404:
 *         description: Trajet introuvable ou pas démarré
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
 *                   example: "Trajet introuvable ou pas encore démarré. Un trajet doit être démarré avant d'être complété."
 *       500:
 *         description: Erreur serveur
 */

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { setCorsHeaders, corsOptions } from "@/lib/cors";
import {notifyParentsAboutTrip} from "@/services/tripNotificationService";

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

        // Vérifier le trajet
        const tripCheck = await query(
            `SELECT id, return_departure_time, status, return_status, trip_type 
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
            // Si l'aller est en cours → terminer l'aller
            // Si le retour est en cours → terminer le retour
            if (trip.status === 'in_progress' && trip.return_status !== 'in_progress') {
                direction = 'aller';
            } else if (trip.return_status === 'in_progress') {
                direction = 'retour';
            } else {
                // Par défaut, terminer l'aller
                direction = 'aller';
            }
        } else if (!direction) {
            // Trajet simple (pas aller-retour) ou pas de retour
            direction = 'aller';
        }
        
        let result;
        let messageDirection;

        if (direction === 'retour') {
            // Terminer le retour
            if (!trip.return_departure_time) {
                const response = NextResponse.json(
                    { success: false, message: "Ce trajet n'a pas de retour" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            // Mettre à jour le statut du retour (SEULEMENT depuis in_progress)
            result = await query(
                `UPDATE trips
                 SET return_status = 'completed'
                 WHERE id = $1
                   AND driver_id = $2
                   AND return_status = 'in_progress'
                 RETURNING *`,
                [tripId, driverId]
            );

            if (result.rows.length === 0) {
                const response = NextResponse.json(
                    {
                        success: false,
                        message: "Trajet retour introuvable ou pas encore démarré. Le retour doit être démarré avant d'être complété."
                    },
                    { status: 404 }
                );
                return setCorsHeaders(response, origin);
            }

            messageDirection = 'retour';
        } else {
            // Terminer l'aller
            // Mettre à jour le statut du trajet (SEULEMENT depuis in_progress - transition logique)
            result = await query(
                `UPDATE trips
                 SET status = 'completed'
                 WHERE id = $1
                   AND driver_id = $2
                   AND status = 'in_progress'
                 RETURNING *`,
                [tripId, driverId]
            );

            if (result.rows.length === 0) {
                const response = NextResponse.json(
                    {
                        success: false,
                        message: "Trajet introuvable ou pas encore démarré. Un trajet doit être démarré avant d'être complété."
                    },
                    { status: 404 }
                );
                return setCorsHeaders(response, origin);
            }

            messageDirection = 'aller';
        }

        // Récupérer les points de départ/arrivée pour la notification
        const tripDetails = await query(
            `SELECT start_point, end_point FROM trips WHERE id = $1`,
            [tripId]
        );
        const startPoint = direction === 'retour' 
            ? tripDetails.rows[0]?.end_point
            : tripDetails.rows[0]?.start_point;
        const endPoint = direction === 'retour'
            ? tripDetails.rows[0]?.start_point
            : tripDetails.rows[0]?.end_point;

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
        try {
             await notifyParentsAboutTrip({
                tripId: parseInt(tripId),
                driverId,
                direction: direction as 'aller' | 'retour',
                action: 'completed',
                startPoint,
                endPoint
            });
        } catch (notifError) {
            console.error('Erreur lors de la notification des parents:', notifError);
            // Ne pas faire échouer la fin du trajet si la notification échoue
        }

        // Message personnalisé selon le statut global
        let completionMessage = `Trajet ${messageDirection} terminé avec succès`;
        if (tripData.trip_type === 'aller_retour') {
            if (tripData.overall_status === 'partially_completed') {
                completionMessage = `Trajet aller terminé. Le trajet est maintenant partiellement terminé. Vous pouvez démarrer le retour.`;
            } else if (tripData.overall_status === 'completed') {
                completionMessage = `Trajet retour terminé. Le trajet aller-retour est maintenant complètement terminé.`;
            }
        }

        const response = NextResponse.json({
            success: true,
            message: completionMessage,
            data: {
                ...tripData,
                status: tripData.overall_status, // Statut global
                status_aller: tripData.status, // Statut de l'aller
                status_retour: tripData.return_status || null, // Statut du retour
                direction: messageDirection,
                auto_detected: !url.searchParams.get('direction') // Indique si la direction a été détectée automatiquement
            },
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur fin trajet:", error);
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