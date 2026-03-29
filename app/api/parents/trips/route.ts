/**
 * @swagger
 * /api/parents/trips:
 *   get:
 *     summary: Récupérer les trajets des parents
 *     description: Récupère tous les trajets où les enfants du parent sont passagers, avec les informations du trajet, de l'école et des passagers.
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des trajets récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 57
 *                       driver_id:
 *                         type: integer
 *                         example: 12
 *                       start_point:
 *                         type: string
 *                         example: "Thies"
 *                       end_point:
 *                         type: string
 *                         example: "Diourbel"
 *                       departure_time:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-02-19T13:33:00.000Z"
 *                       capacity_max:
 *                         type: integer
 *                         example: 9
 *                       status:
 *                         type: string
 *                         enum: [pending, in_progress, completed, canceled]
 *                         example: "pending"
 *                       school_id:
 *                         type: integer
 *                         example: 26
 *                       school_name:
 *                         type: string
 *                         example: "saint gabriel"
 *                       passengers:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 24
 *                             name:
 *                               type: string
 *                               example: "lama fall"
 *                             school_id:
 *                               type: integer
 *                               example: 26
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { setCorsHeaders, corsOptions } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const user = await getUserFromRequest(req);

        if (!user || user.role !== 'parent') {
            const response = NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        // Récupérer tous les trajets où les enfants du parent sont passagers
        // Inclure tous les passagers de chaque trajet, pas seulement les enfants du parent
        const result = await query(
            `
            SELECT 
                t.id,
                t.driver_id,
                t.start_point,
                t.end_point,
                t.departure_time,
                t.capacity_max,
                t.status,
                t.return_status,
                t.school_id,
                t.trip_type,
                t.return_departure_time,
                s.name as school_name,
                -- Informations du chauffeur
                u_driver.id as driver_user_id,
                u_driver.name as driver_name,
                u_driver.email as driver_email,
                u_driver.phone as driver_phone,
                u_driver.address as driver_address,
                u_driver.photo_profil as user_photo_profil,
                d.status as driver_status,
                d.vehicle_brand,
                d.vehicle_color,
                d.vehicle_plate,
                d.license_document,
                d.id_document,
                d.vehicle_photo,
                d.photo_profil as driver_photo_profil,
                d.capacity as driver_capacity,
                d.created_at as driver_created_at,
                -- Calculer le statut global
                CASE 
                    WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
                        get_trip_overall_status(t.status, t.return_status, t.trip_type)
                    ELSE
                        t.status
                END as overall_status,
                -- Arrêts du trajet (écoles)
                (
                    SELECT COALESCE(
                        json_agg(
                            jsonb_build_object(
                                'id', ts.id,
                                'school_id', ts.school_id,
                                'school_name', s_stop.name,
                                'school_address', s_stop.address,
                                'stop_order', ts.stop_order,
                                'estimated_arrival_time', ts.estimated_arrival_time::text
                            ) ORDER BY ts.stop_order
                        ),
                        '[]'::json
                    )
                    FROM trip_stops ts
                    LEFT JOIN schools s_stop ON ts.school_id = s_stop.id
                    WHERE ts.trip_id = t.id
                ) as stops,
                (
                    SELECT COALESCE(
                        json_agg(
                            jsonb_build_object(
                                'id', c2.id,
                                'name', c2.name,
                                'school_id', c2.school_id
                            )
                        ),
                        '[]'::json
                    )
                    FROM trip_children tc2
                    INNER JOIN children c2 ON tc2.child_id = c2.id
                    WHERE tc2.trip_id = t.id
                ) as passengers
            FROM trips t
            INNER JOIN trip_children tc ON t.id = tc.trip_id
            INNER JOIN children c ON tc.child_id = c.id
            LEFT JOIN schools s ON t.school_id = s.id
            LEFT JOIN drivers d ON t.driver_id = d.id
            LEFT JOIN users u_driver ON d.user_id = u_driver.id
            WHERE c.parent_id = $1
            GROUP BY t.id, t.driver_id, t.start_point, t.end_point, t.departure_time, 
                     t.capacity_max, t.status, t.return_status, t.school_id, s.name, t.trip_type, t.return_departure_time,
                     u_driver.id, u_driver.name, u_driver.email, u_driver.phone, u_driver.address, u_driver.photo_profil,
                     d.status, d.vehicle_brand, d.vehicle_color, d.vehicle_plate, d.license_document, 
                     d.id_document, d.vehicle_photo, d.photo_profil, d.capacity, d.created_at
            ORDER BY t.departure_time DESC
            `,
            [user.id]
        );

        // Formater les résultats pour remplacer status par overall_status et structurer les infos du chauffeur
        const formattedTrips = result.rows.map((trip: any) => {
            const { overall_status, driver_user_id, driver_name, driver_email, driver_phone, driver_address,
                    user_photo_profil, driver_status, vehicle_brand, vehicle_color, vehicle_plate, 
                    license_document, id_document, vehicle_photo, driver_photo_profil, 
                    driver_capacity, driver_created_at, ...rest } = trip;
            
            // Utiliser la photo de users en priorité, sinon celle de drivers
            const photo_profil = user_photo_profil || driver_photo_profil || null;
            
            return {
                ...rest,
                status: overall_status, // Remplacer status par overall_status
                // Garder aussi les statuts individuels pour référence
                status_aller: trip.status,
                status_retour: trip.return_status || null,
                // Arrêts du trajet (écoles)
                stops: trip.stops || [],
                // Informations complètes du chauffeur
                driver: trip.driver_id ? {
                    id: trip.driver_id,
                    user_id: driver_user_id,
                    name: driver_name,
                    email: driver_email,
                    phone: driver_phone,
                    address: driver_address,
                    photo_profil: photo_profil,
                    status: driver_status,
                    created_at: driver_created_at,
                    vehicle: {
                        brand: vehicle_brand,
                        color: vehicle_color,
                        plate: vehicle_plate,
                        capacity: driver_capacity
                    },
                    documents: {
                        license_document: license_document,
                        id_document: id_document,
                        vehicle_photo: vehicle_photo
                    }
                } : null
            };
        });

        const response = NextResponse.json({
            success: true,
            data: formattedTrips
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('Erreur récupération trajets parents:', error);
        const errorResponse = NextResponse.json(
            { success: false, error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

