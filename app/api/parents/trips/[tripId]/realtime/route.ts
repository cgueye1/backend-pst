import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";
import { setCorsHeaders, corsOptions } from "@/lib/cors";
/**
 * @swagger
 * /api/parents/trips/{tripId}/realtime:
 *   get:
 *     summary: Suivre un trajet en temps réel
 *     description: |
 *       Récupère les informations de suivi GPS en temps réel d'un trajet.
 *       Pour les trajets aller-retour, gère automatiquement le suivi de l'aller et du retour.
 *       La direction active est détectée automatiquement selon le statut du trajet.
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du trajet
 *     responses:
 *       200:
 *         description: Succès - Retourne les informations de suivi en temps réel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     trip_id:
 *                       type: integer
 *                     trip_type:
 *                       type: string
 *                       enum: [aller, retour, aller_retour]
 *                     status:
 *                       type: object
 *                       properties:
 *                         aller:
 *                           type: object
 *                           properties:
 *                             status:
 *                               type: string
 *                             departure_time:
 *                               type: string
 *                               format: date-time
 *                             completed:
 *                               type: boolean
 *                         retour:
 *                           type: object
 *                           nullable: true
 *                     active_direction:
 *                       type: string
 *                       enum: [aller, retour, null]
 *                       description: Direction actuellement active
 *                     current_leg:
 *                       type: object
 *                       nullable: true
 *                       description: Informations sur la portion de trajet en cours
 *                     tracking:
 *                       type: object
 *                       properties:
 *                         is_active:
 *                           type: boolean
 *                         active_direction:
 *                           type: string
 *                         minutes_since_start:
 *                           type: number
 *                         estimated_arrival:
 *                           type: string
 *                           format: date-time
 *                         progress_percentage:
 *                           type: number
 *                     current_location:
 *                       type: object
 *                       nullable: true
 *                     driver:
 *                       type: object
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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ tripId: string }> }
) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            const response = NextResponse.json(
                { success: false, message: "Non autorisé" },
                { status: 401 }
            );
            return setCorsHeaders(response, origin);
        }
        const { tripId } = await params;
        const user_id = user.id;

        // Vérifier que le parent a un enfant dans ce trajet
        const verification = await query(
            `
                SELECT 1
                FROM trip_children tc
                         INNER JOIN children c ON tc.child_id = c.id
                WHERE tc.trip_id = $1 AND c.parent_id = $2
            `,
            [tripId, user_id]
        );

        if (verification.rows.length === 0) {
            const response = NextResponse.json(
                { success: false, error: "Non autorisé à suivre ce trajet" },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        // Récupérer les données complètes du trajet en temps réel
        // Utiliser des sous-requêtes séparées pour éviter les problèmes avec GROUP BY et les LEFT JOIN
        const tripData = await query(
            `
            SELECT 
                t.id,
                t.start_point,
                t.end_point,
                t.departure_time,
                t.return_departure_time,
                t.status,
                t.return_status,
                t.capacity_max,
                t.is_recurring,
                t.trip_type,
                t.start_latitude,
                t.start_longitude,
                t.end_latitude,
                t.end_longitude,
                
                -- Informations du chauffeur
                d.id as driver_id,
                u_driver.name as driver_name,
                u_driver.phone as driver_phone,
                d.vehicle_brand,
                d.vehicle_color,
                d.vehicle_plate,
                d.photo_profil as driver_photo,
                
                -- École
                s.name as school_name,
                s.address as school_address,
                
                -- Calculer le temps écoulé depuis le départ (aller)
                CASE 
                    WHEN t.status = 'in_progress' THEN 
                        EXTRACT(EPOCH FROM (NOW() - t.departure_time)) / 60
                    ELSE NULL
                END as minutes_since_start_aller,
                
                -- Calculer le temps écoulé depuis le départ (retour)
                CASE 
                    WHEN t.return_status = 'in_progress' AND t.return_departure_time IS NOT NULL THEN 
                        EXTRACT(EPOCH FROM (NOW() - t.return_departure_time)) / 60
                    ELSE NULL
                END as minutes_since_start_retour,
                
                -- Temps estimé d'arrivée (aller)
                CASE 
                    WHEN t.status = 'in_progress' THEN 
                        t.departure_time + INTERVAL '30 minutes'
                    ELSE NULL
                END as estimated_arrival_aller,
                
                -- Temps estimé d'arrivée (retour)
                CASE 
                    WHEN t.return_status = 'in_progress' AND t.return_departure_time IS NOT NULL THEN 
                        t.return_departure_time + INTERVAL '30 minutes'
                    ELSE NULL
                END as estimated_arrival_retour
                
            FROM trips t
            INNER JOIN drivers d ON t.driver_id = d.id
            INNER JOIN users u_driver ON d.user_id = u_driver.id
            LEFT JOIN schools s ON t.school_id = s.id
            WHERE t.id = $1
            `,
            [tripId]
        );

        if (tripData.rows.length === 0) {
            const response = NextResponse.json(
                { success: false, error: "Trajet introuvable" },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const trip = tripData.rows[0];

        // Déterminer la direction active et les informations de suivi
        const isAllerRetour = trip.trip_type === 'aller_retour';
        const isAllerActive = trip.status === 'in_progress';
        const isRetourActive = trip.return_status === 'in_progress';
        const activeDirection = isRetourActive ? 'retour' : (isAllerActive ? 'aller' : null);
        
        // Déterminer les points de départ et d'arrivée selon la direction active
        let currentStartPoint, currentEndPoint, currentDepartureTime, currentEstimatedArrival;
        let minutesSinceStart = null;
        
        if (activeDirection === 'retour' && isAllerRetour) {
            // Retour actif : Yoff → DKR
            currentStartPoint = trip.end_point; // École (point d'arrivée de l'aller)
            currentEndPoint = trip.start_point; // Point de départ de l'aller
            currentDepartureTime = trip.return_departure_time;
            currentEstimatedArrival = trip.estimated_arrival_retour;
            minutesSinceStart = trip.minutes_since_start_retour;
        } else if (activeDirection === 'aller' || !isAllerRetour) {
            // Aller actif : DKR → Yoff
            currentStartPoint = trip.start_point;
            currentEndPoint = trip.end_point;
            currentDepartureTime = trip.departure_time;
            currentEstimatedArrival = trip.estimated_arrival_aller;
            minutesSinceStart = trip.minutes_since_start_aller;
        } else {
            // Aucune direction active
            currentStartPoint = trip.start_point;
            currentEndPoint = trip.end_point;
            currentDepartureTime = trip.departure_time;
        }

        // Récupérer les enfants dans ce trajet séparément
        const childrenData = await query(
            `
            SELECT 
                c.id as child_id,
                c.name as child_name,
                u_parent.id as parent_id,
                u_parent.name as parent_name,
                u_parent.phone as parent_phone
            FROM trip_children tc
            INNER JOIN children c ON tc.child_id = c.id
            LEFT JOIN users u_parent ON c.parent_id = u_parent.id
            WHERE tc.trip_id = $1
            `,
            [tripId]
        );

        // Récupérer la position actuelle depuis trip_locations (priorité) ou messages (fallback)
        let currentLocation = null;
        try {
            // Essayer d'abord trip_locations (nouveau système)
            const locationData = await query(
                `
                SELECT 
                    latitude,
                    longitude,
                    direction,
                    speed,
                    accuracy,
                    heading,
                    created_at as timestamp
                FROM trip_locations
                WHERE trip_id = $1
                AND direction = $2
                ORDER BY created_at DESC
                LIMIT 1
                `,
                [tripId, activeDirection || 'aller']
            );
            
            if (locationData.rows.length > 0) {
                currentLocation = {
                    latitude: locationData.rows[0].latitude,
                    longitude: locationData.rows[0].longitude,
                    direction: locationData.rows[0].direction,
                    speed: locationData.rows[0].speed,
                    accuracy: locationData.rows[0].accuracy,
                    heading: locationData.rows[0].heading,
                    timestamp: locationData.rows[0].timestamp
                };
            } else {
                // Fallback : essayer messages (ancien système)
                const locationDataMessages = await query(
                    `
                    SELECT 
                        (m.metadata->'location'->>'lat')::float as latitude,
                        (m.metadata->'location'->>'lng')::float as longitude,
                        m.created_at as timestamp
                    FROM messages m
                    INNER JOIN conversations conv ON m.conversation_id = conv.id
                    WHERE conv.trip_id = $1
                    AND m.message_type = 'location'
                    AND m.metadata->'location' IS NOT NULL
                    ORDER BY m.created_at DESC
                    LIMIT 1
                    `,
                    [tripId]
                );
                
                if (locationDataMessages.rows.length > 0) {
                    currentLocation = {
                        latitude: locationDataMessages.rows[0].latitude,
                        longitude: locationDataMessages.rows[0].longitude,
                        timestamp: locationDataMessages.rows[0].timestamp
                    };
                }
            }
        } catch (locationError) {
            console.warn("Erreur récupération position GPS:", locationError);
            // Continuer sans la position GPS
        }

        // Récupérer la dernière mise à jour de statut (si disponible)
        let lastStatusUpdate = null;
        try {
            const statusData = await query(
                `
                SELECT 
                    m.metadata->>'trip_status' as status,
                    m.created_at as timestamp
                FROM messages m
                INNER JOIN conversations conv ON m.conversation_id = conv.id
                WHERE conv.trip_id = $1
                AND m.metadata ? 'trip_status'
                ORDER BY m.created_at DESC
                LIMIT 1
                `,
                [tripId]
            );
            
            if (statusData.rows.length > 0) {
                lastStatusUpdate = {
                    status: statusData.rows[0].status,
                    timestamp: statusData.rows[0].timestamp
                };
            }
        } catch (statusError) {
            console.warn("Erreur récupération statut:", statusError);
            // Continuer sans le statut
        }

        // Formater la réponse avec toutes les données de suivi
        const response = NextResponse.json({
            success: true,
            data: {
                trip_id: trip.id,
                trip_type: trip.trip_type || 'aller',
                
                // Statuts des deux directions
                status: {
                    aller: {
                        status: trip.status,
                        departure_time: trip.departure_time,
                        completed: trip.status === 'completed'
                    },
                    retour: isAllerRetour ? {
                        status: trip.return_status || 'pending',
                        departure_time: trip.return_departure_time,
                        completed: trip.return_status === 'completed'
                    } : null
                },
                
                // Points de départ/arrivée originaux
                start_point: trip.start_point,
                end_point: trip.end_point,
                departure_time: trip.departure_time,
                return_departure_time: trip.return_departure_time || null,
                
                // Direction active et informations de suivi en cours
                active_direction: activeDirection, // 'aller', 'retour', ou null
                current_leg: activeDirection ? {
                    direction: activeDirection,
                    start_point: currentStartPoint,
                    end_point: currentEndPoint,
                    departure_time: currentDepartureTime,
                    estimated_arrival: currentEstimatedArrival,
                    // Coordonnées GPS pour le suivi
                    start_coordinates: activeDirection === 'retour' ? {
                        latitude: trip.end_latitude,
                        longitude: trip.end_longitude
                    } : {
                        latitude: trip.start_latitude,
                        longitude: trip.start_longitude
                    },
                    end_coordinates: activeDirection === 'retour' ? {
                        latitude: trip.start_latitude,
                        longitude: trip.start_longitude
                    } : {
                        latitude: trip.end_latitude,
                        longitude: trip.end_longitude
                    }
                } : null,

                // Position actuelle du bus
                current_location: currentLocation,

                // Dernière mise à jour de statut
                last_status_update: lastStatusUpdate,

                // Informations de suivi
                tracking: {
                    is_active: isAllerActive || isRetourActive,
                    active_direction: activeDirection,
                    minutes_since_start: minutesSinceStart ? Math.round(minutesSinceStart) : null,
                    estimated_arrival: currentEstimatedArrival,
                    progress_percentage: minutesSinceStart ? 
                        Math.min(100, Math.round((minutesSinceStart / 30) * 100)) :
                        (trip.status === 'completed' && (!isAllerRetour || trip.return_status === 'completed') ? 100 : 0),
                    // Progression globale pour aller-retour
                    overall_progress: isAllerRetour ? {
                        aller_completed: trip.status === 'completed',
                        retour_completed: trip.return_status === 'completed',
                        percentage: trip.status === 'completed' && trip.return_status === 'completed' ? 100 :
                                   trip.status === 'completed' ? 50 : 0
                    } : null
                },

                // Informations du chauffeur
                driver: {
                    id: trip.driver_id,
                    name: trip.driver_name,
                    phone: trip.driver_phone,
                    photo: trip.driver_photo || null,
                    vehicle: {
                        brand: trip.vehicle_brand,
                        color: trip.vehicle_color,
                        plate: trip.vehicle_plate
                    }
                },

                // École
                school: {
                    name: trip.school_name,
                    address: trip.school_address,
                    latitude: trip.end_latitude || null,
                    longitude: trip.end_longitude || null
                },

                // Enfants dans le trajet
                children: {
                    count: childrenData.rows.length,
                    details: childrenData.rows.map((child: any) => ({
                        child_id: child.child_id,
                        child_name: child.child_name,
                        parent_id: child.parent_id,
                        parent_name: child.parent_name,
                        parent_phone: child.parent_phone
                    }))
                },

                // Timestamp de la requête
                timestamp: new Date().toISOString()
            }
        });
        return setCorsHeaders(response, origin);
    } catch (error: any) {
        console.error("Erreur realtime trip:", error);
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
