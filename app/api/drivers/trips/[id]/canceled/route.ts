
/**
 * @swagger
 * /api/drivers/trips/{id}/canceled:
 *   put:
 *     summary: Annuler un trajet (aller ou retour)
 *     description: |
 *       Annule un trajet aller ou retour.
 *       Pour un trajet aller-retour, utilisez le paramètre ?direction=retour pour annuler le retour.
 *       Par défaut, annule l'aller.
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
 *         description: Direction du trajet à annuler (aller ou retour). Par défaut aller.
 *     responses:
 *       200:
 *         description: Trajet annulé avec succès
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
 *                   example: "Trajet aller annulé avec succès"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     status:
 *                       type: string
 *                       description: |
 *                         Statut global du trajet calculé automatiquement :
 *                         - "canceled" : Trajet annulé
 *                         - "partially_completed" : Aller terminé, retour annulé (pour trajets aller-retour)
 *                       enum: [pending, in_progress, completed, canceled, partially_completed]
 *                       example: "canceled"
 *                     status_aller:
 *                       type: string
 *                       description: Statut de l'aller (pending, in_progress, completed, canceled)
 *                       example: "canceled"
 *                     status_retour:
 *                       type: string
 *                       nullable: true
 *                       description: Statut du retour (pending, in_progress, completed, canceled)
 *                       example: null
 *                     trip_type:
 *                       type: string
 *                       enum: [aller, retour, aller_retour]
 *                       example: "aller"
 *                     direction:
 *                       type: string
 *                       enum: [aller, retour]
 *                       example: "aller"
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
 *         description: Trajet introuvable ou déjà annulé
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
 *                   example: "Trajet aller introuvable ou déjà annulé"
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
        console.log("User connecté:", user);

        if (!user || user.role !== 'driver') {
            const response = NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        // Récupérer le driver et vérifier le statut
        const driverResult = await query(
            `SELECT id, status FROM drivers WHERE user_id = $1`,
            [user.id]
        );

        console.log("Driver récupéré:", driverResult.rows[0]);

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

        //  Unwrap la Promise params
        const { id: tripId } = await params;
        console.log("tripId reçu:", tripId, "driverId:", driverId);

        // Récupérer le paramètre direction (aller ou retour)
        const url = new URL(request.url);
        const direction = url.searchParams.get('direction') || 'aller'; // Par défaut: aller

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
        let result;
        let messageDirection;

        if (direction === 'retour') {
            // Annuler le retour
            if (!trip.return_departure_time) {
                const response = NextResponse.json(
                    { success: false, message: "Ce trajet n'a pas de retour" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            // Mettre à jour le statut du retour
            result = await query(
                `UPDATE trips
                 SET return_status = 'canceled'
                 WHERE id = $1
                   AND driver_id = $2
                   AND return_status IN ('pending', 'in_progress')
                 RETURNING *`,
                [tripId, driverId]
            );

            messageDirection = 'retour';
        } else {
            // Annuler l'aller
            // Mettre à jour le statut du trajet
            result = await query(
                `UPDATE trips
                 SET status = 'canceled'
                 WHERE id = $1
                   AND driver_id = $2
                   AND status IN ('pending', 'in_progress')
                 RETURNING *`,
                [tripId, driverId]
            );

            messageDirection = 'aller';
        }

        console.log("Résultat UPDATE:", result.rows);

        if (result.rows.length === 0) {
            const response = NextResponse.json(
                {
                    success: false,
                    message: `Trajet ${messageDirection} introuvable ou déjà annulé`
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

        // Récupérer les points de départ/arrivée pour la notification
        const startPoint = direction === 'retour'
            ? tripData.end_point
            : tripData.start_point;
        const endPoint = direction === 'retour'
            ? tripData.start_point
            : tripData.end_point;

        // Notifier les parents via le service de notifications
        try {
            await notifyParentsAboutTrip({
                tripId: parseInt(tripId),
                driverId,
                direction: direction as 'aller' | 'retour',
                action: 'canceled',
                startPoint,
                endPoint
            });
        } catch (notifError) {
            console.error('Erreur lors de la notification des parents:', notifError);
            // Ne pas faire échouer l'annulation si la notification échoue
        }

        const response = NextResponse.json({
            success: true,
            message: `Trajet ${messageDirection} annulé avec succès`,
            data: {
                ...tripData,
                status: tripData.overall_status, // Statut global
                status_aller: tripData.status, // Statut de l'aller
                status_retour: tripData.return_status || null, // Statut du retour
                direction: messageDirection
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