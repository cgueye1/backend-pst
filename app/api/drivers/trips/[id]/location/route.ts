/**
 * @swagger
 * /api/drivers/trips/{id}/location:
 *   post:
 *     summary: Envoyer la position GPS actuelle du véhicule
 *     description: |
 *       Permet au chauffeur d'envoyer sa position GPS en temps réel pendant un trajet actif.
 *       Cette position sera utilisée pour le suivi en temps réel par les parents.
 *       Pour un trajet aller-retour, la direction (aller/retour) est détectée automatiquement.
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
 *             required:
 *               - latitude
 *               - longitude
 *             properties:
 *               latitude:
 *                 type: number
 *                 format: float
 *                 description: Latitude GPS
 *                 example: 14.7167
 *               longitude:
 *                 type: number
 *                 format: float
 *                 description: Longitude GPS
 *                 example: -17.4677
 *               direction:
 *                 type: string
 *                 enum: [aller, retour]
 *                 description: Direction du trajet (optionnel, détecté automatiquement si non fourni)
 *               speed:
 *                 type: number
 *                 format: float
 *                 description: Vitesse en km/h (optionnel)
 *               accuracy:
 *                 type: number
 *                 format: float
 *                 description: Précision du GPS en mètres (optionnel)
 *               heading:
 *                 type: number
 *                 format: float
 *                 description: Direction du véhicule en degrés 0-360 (optionnel)
 *     responses:
 *       200:
 *         description: Position enregistrée avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Chauffeur non autorisé ou trajet non actif
 *       404:
 *         description: Trajet introuvable
 *       500:
 *         description: Erreur serveur
 */

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { setCorsHeaders, corsOptions } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const origin = request.headers.get('origin');
    try {
        // Authentification
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'driver') {
            const response = NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier le chauffeur
        const driverResult = await query(
            `SELECT id, status FROM drivers WHERE user_id = $1`,
            [user.id]
        );

        if (driverResult.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Chauffeur introuvable' },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const driver = driverResult.rows[0];
        if (driver.status !== 'Approuvé') {
            const response = NextResponse.json(
                {
                    success: false,
                    error: 'Votre compte chauffeur est en attente d\'approbation',
                    status: driver.status
                },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const driverId = driver.id;
        const { id: tripId } = await params;

        // Récupérer les données du body
        const body = await request.json();
        const { latitude, longitude, direction: providedDirection, speed, accuracy, heading } = body;

        // Validation des coordonnées GPS
        if (!latitude || !longitude) {
            const response = NextResponse.json(
                { success: false, error: 'Latitude et longitude sont requises' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        if (latitude < -90 || latitude > 90) {
            const response = NextResponse.json(
                { success: false, error: 'Latitude invalide (doit être entre -90 et 90)' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        if (longitude < -180 || longitude > 180) {
            const response = NextResponse.json(
                { success: false, error: 'Longitude invalide (doit être entre -180 et 180)' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier le trajet
        const tripCheck = await query(
            `SELECT id, driver_id, status, return_status, trip_type, return_departure_time
             FROM trips WHERE id = $1 AND driver_id = $2`,
            [tripId, driverId]
        );

        if (tripCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Trajet introuvable ou vous n\'êtes pas autorisé' },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const trip = tripCheck.rows[0];

        // Vérifier que le trajet est actif (en cours)
        const isAllerActive = trip.status === 'in_progress';
        const isRetourActive = trip.return_status === 'in_progress';

        if (!isAllerActive && !isRetourActive) {
            const response = NextResponse.json(
                { 
                    success: false, 
                    error: 'Le trajet doit être en cours (démarré) pour envoyer la position GPS',
                    trip_status: trip.status,
                    return_status: trip.return_status
                },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Détecter automatiquement la direction si non fournie
        let direction = providedDirection;
        if (!direction) {
            if (isRetourActive) {
                direction = 'retour';
            } else if (isAllerActive) {
                direction = 'aller';
            } else {
                direction = 'aller'; // Par défaut
            }
        }

        // Valider la direction
        if (direction !== 'aller' && direction !== 'retour') {
            const response = NextResponse.json(
                { success: false, error: 'Direction invalide (doit être "aller" ou "retour")' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier que la direction correspond au statut du trajet
        if (direction === 'retour' && !isRetourActive) {
            const response = NextResponse.json(
                { success: false, error: 'Le trajet retour n\'est pas encore démarré' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        if (direction === 'aller' && !isAllerActive) {
            const response = NextResponse.json(
                { success: false, error: 'Le trajet aller n\'est pas en cours' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Insérer la position GPS
        const result = await query(
            `INSERT INTO trip_locations 
             (trip_id, driver_id, latitude, longitude, direction, speed, accuracy, heading)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING id, created_at`,
            [
                tripId,
                driverId,
                latitude,
                longitude,
                direction,
                speed || null,
                accuracy || null,
                heading || null
            ]
        );

        // Optionnel : Mettre à jour aussi dans la table messages pour compatibilité
        // (si vous utilisez déjà messages pour les positions)
        try {
            // Récupérer la conversation du trajet
            const conversationResult = await query(
                `SELECT id FROM conversations WHERE trip_id = $1 LIMIT 1`,
                [tripId]
            );

            if (conversationResult.rows.length > 0) {
                const conversationId = conversationResult.rows[0].id;
                await query(
                    `INSERT INTO messages (conversation_id, message_type, metadata, created_at)
                     VALUES ($1, 'location', $2, NOW())`,
                    [
                        conversationId,
                        JSON.stringify({
                            location: {
                                lat: latitude,
                                lng: longitude
                            },
                            direction: direction,
                            speed: speed || null,
                            accuracy: accuracy || null
                        })
                    ]
                );
            }
        } catch (msgError) {
            // Ne pas faire échouer l'insertion si l'insertion dans messages échoue
            console.warn('Erreur insertion position dans messages:', msgError);
        }

        const response = NextResponse.json({
            success: true,
            message: 'Position GPS enregistrée avec succès',
            data: {
                location_id: result.rows[0].id,
                trip_id: parseInt(tripId),
                latitude,
                longitude,
                direction,
                timestamp: result.rows[0].created_at
            }
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur enregistrement position GPS:", error);
        const errorResponse = NextResponse.json(
            {
                success: false,
                error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur serveur',
                details: process.env.NODE_ENV === 'development' ? {
                    stack: error.stack,
                    code: error.code
                } : undefined
            },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

