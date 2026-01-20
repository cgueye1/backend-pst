import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";
import { setCorsHeaders, corsOptions } from "@/lib/cors";
/**
 * @swagger
 * /api/parents/trips/{tripId}/realtime::
 *   get:
 *     summary: Suivre un trajet
 *     tags: [Parents]
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
        const tripData = await query(
            `
            SELECT 
                t.id,
                t.start_point,
                t.end_point,
                t.departure_time,
                t.status,
                t.capacity_max,
                t.is_recurring,
                
                -- Informations du chauffeur
                d.id as driver_id,
                u_driver.name as driver_name,
                u_driver.phone as driver_phone,
                d.vehicle_brand,
                d.vehicle_color,
                d.vehicle_plate,
                
                -- École
                s.name as school_name,
                s.address as school_address,
                s.latitude as school_latitude,
                s.longitude as school_longitude,
                
                -- Enfants dans ce trajet
                COUNT(tc.child_id) as children_count,
                json_agg(
                    json_build_object(
                        'child_id', c.id,
                        'child_name', c.name,
                        'parent_id', u_parent.id,
                        'parent_name', u_parent.name,
                        'parent_phone', u_parent.phone
                    )
                ) FILTER (WHERE c.id IS NOT NULL) as children_details,
                
                -- Position actuelle (dernière position GPS si disponible via messages)
                (
                    SELECT json_build_object(
                        'latitude', (metadata->'location'->>'lat')::float,
                        'longitude', (metadata->'location'->>'lng')::float,
                        'timestamp', created_at
                    )
                    FROM messages m
                    INNER JOIN conversations conv ON m.conversation_id = conv.id
                    WHERE conv.trip_id = t.id
                    AND m.message_type = 'location'
                    AND m.metadata->'location' IS NOT NULL
                    ORDER BY m.created_at DESC
                    LIMIT 1
                ) as current_location,
                
                -- Dernière mise à jour de statut
                (
                    SELECT json_build_object(
                        'status', m.metadata->>'trip_status',
                        'timestamp', m.created_at
                    )
                    FROM messages m
                    INNER JOIN conversations conv ON m.conversation_id = conv.id
                    WHERE conv.trip_id = t.id
                    AND m.metadata ? 'trip_status'
                    ORDER BY m.created_at DESC
                    LIMIT 1
                ) as last_status_update,
                
                -- Calculer le temps écoulé/depuis le départ
                CASE 
                    WHEN t.status = 'in_progress' THEN 
                        EXTRACT(EPOCH FROM (NOW() - t.departure_time)) / 60
                    ELSE NULL
                END as minutes_since_start,
                
                -- Temps estimé d'arrivée (si en cours)
                CASE 
                    WHEN t.status = 'in_progress' THEN 
                        t.departure_time + INTERVAL '30 minutes'
                    ELSE NULL
                END as estimated_arrival
                
            FROM trips t
            INNER JOIN drivers d ON t.driver_id = d.id
            INNER JOIN users u_driver ON d.user_id = u_driver.id
            LEFT JOIN schools s ON t.school_id = s.id
            LEFT JOIN trip_children tc ON t.id = tc.trip_id
            LEFT JOIN children c ON tc.child_id = c.id
            LEFT JOIN users u_parent ON c.parent_id = u_parent.id
            WHERE t.id = $1
            GROUP BY t.id, d.id, u_driver.id, s.id
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

        // Formater la réponse avec toutes les données de suivi
        const response = NextResponse.json({
            success: true,
            data: {
                trip_id: trip.id,
                status: trip.status,
                start_point: trip.start_point,
                end_point: trip.end_point,
                departure_time: trip.departure_time,

                // Position actuelle du bus
                current_location: trip.current_location || null,

                // Dernière mise à jour de statut
                last_status_update: trip.last_status_update || null,

                // Informations de suivi
                tracking: {
                    is_active: trip.status === 'in_progress',
                    minutes_since_start: trip.minutes_since_start ? Math.round(trip.minutes_since_start) : null,
                    estimated_arrival: trip.estimated_arrival,
                    progress_percentage: trip.status === 'in_progress' ?
                        Math.min(100, Math.round((trip.minutes_since_start || 0) / 30 * 100)) :
                        (trip.status === 'completed' ? 100 : 0)
                },

                // Informations du chauffeur
                driver: {
                    id: trip.driver_id,
                    name: trip.driver_name,
                    phone: trip.driver_phone,
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
                    latitude: trip.school_latitude,
                    longitude: trip.school_longitude
                },

                // Enfants dans le trajet
                children: {
                    count: parseInt(trip.children_count) || 0,
                    details: trip.children_details || []
                },

                // Timestamp de la requête
                timestamp: new Date().toISOString()
            }
        });
        return setCorsHeaders(response, origin);
    } catch (error) {
        console.error("Erreur realtime trip:", error);
        const errorResponse = NextResponse.json(
            { success: false, error: "Erreur serveur" },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}
