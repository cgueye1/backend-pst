/**
 * @swagger
 * /api/parents/trips/available:
 *   get:
 *     summary: Récupérer tous les trajets disponibles
 *     description: >
 *       Récupère tous les trajets disponibles pour les parents :
 *       - Trajets avec chauffeur assigné
 *       - Date/heure de départ dans le futur
 *       - Statut "pending" (disponible)
 *       - **Filtre automatique : uniquement les trajets dont l'école correspond aux écoles des enfants du parent**
 *       - **Filtre de proximité : uniquement les trajets dont le point de départ est proche de l'adresse du parent (rayon de 10 km)**
 *       - Inclut le nombre de places disponibles
 *       - Inclut les informations du chauffeur, de l'école et des passagers actuels
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: school_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtrer par ID de l'école
 *       - in: query
 *         name: start_point
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtrer par point de départ
 *       - in: query
 *         name: end_point
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtrer par point d'arrivée
 *       - in: query
 *         name: min_available_seats
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nombre minimum de places disponibles
 *     responses:
 *       200:
 *         description: Liste des trajets disponibles récupérée avec succès
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
 *                       available_seats:
 *                         type: integer
 *                         example: 5
 *                       booked_seats:
 *                         type: integer
 *                         example: 4
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
 *                       driver_name:
 *                         type: string
 *                         example: "Amadou Diallo"
 *                       driver_phone:
 *                         type: string
 *                         example: "+221771234567"
 *                       driver_rating:
 *                         type: number
 *                         example: 4.5
 *                       trip_type:
 *                         type: string
 *                         enum: [aller, retour, aller_retour]
 *                         example: "aller"
 *                       return_departure_time:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         description: Heure de départ du trajet retour
 *                         example: "2026-02-19T16:00:00.000Z"
 *                       has_return:
 *                         type: boolean
 *                         description: Indique si un trajet retour est disponible
 *                         example: true
 *                       driver_photo:
 *                         type: string
 *                         nullable: true
 *                         example: "/uploads/drivers/photo_profil_1234567890.jpg"
 *                       vehicle_plate:
 *                         type: string
 *                         nullable: true
 *                         example: "ABC-123"
 *                       vehicle_photo:
 *                         type: string
 *                         nullable: true
 *                         example: "/uploads/drivers/vehicle_photo_1234567890.jpg"
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

/**
 * Calcule la distance à vol d'oiseau entre deux points GPS (formule de Haversine)
 */
function calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Géocode une adresse pour obtenir ses coordonnées GPS
 */
async function geocodeAddress(address: string): Promise<[number, number] | null> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Senegal')}&limit=1`,
            {
                headers: {
                    'User-Agent': 'TransportApp/1.0'
                }
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        if (data.length === 0) {
            return null;
        }
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } catch (error) {
        console.error('Erreur géocodage:', error);
        return null;
    }
}

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

        // Récupérer les paramètres de filtrage
        const url = new URL(req.url);
        const school_id = url.searchParams.get('school_id');
        const start_point = url.searchParams.get('start_point');
        const end_point = url.searchParams.get('end_point');
        const min_available_seats = parseInt(url.searchParams.get('min_available_seats') || '1');
        const disableProximityFilter = url.searchParams.get('disable_proximity') === 'true';

        // Récupérer les enfants avec leurs écoles, adresses et emplois du temps
        const childrenInfoResult = await query(
            `SELECT 
                c.id as child_id,
                c.school_id, 
                c.schedule,
                COALESCE(c.address, u.address) as address
             FROM children c
             INNER JOIN users u ON c.parent_id = u.id
             WHERE c.parent_id = $1 AND c.school_id IS NOT NULL`,
            [user.id]
        );

        console.log(`🔍 [DEBUG] Enfants trouvés pour parent ${user.id}:`, {
            count: childrenInfoResult.rows.length,
            children: childrenInfoResult.rows.map((row: any) => ({
                child_id: row.child_id,
                school_id: row.school_id,
                has_schedule: !!row.schedule,
                schedule: row.schedule,
                address: row.address
            }))
        });

        const childrenSchoolIds = childrenInfoResult.rows
            .map((row: any) => row.school_id)
            .filter((id: any) => id !== null);

        // Extraire les emplois du temps des enfants
        const childrenSchedules = childrenInfoResult.rows.map((row: any) => ({
            child_id: row.child_id,
            school_id: row.school_id,
            schedule: row.schedule || []
        }));

        // Si le parent n'a pas d'enfants avec des écoles, retourner une liste vide
        if (childrenSchoolIds.length === 0) {
            const response = NextResponse.json({
                success: true,
                data: [],
                message: "Aucun enfant avec école assignée"
            });
            return setCorsHeaders(response, origin);
        }

        // Récupérer l'adresse du parent (priorité: adresse de l'enfant, sinon adresse du parent)
        let parentAddress: string | null = null;
        let parentCoords: [number, number] | null = null;
        const maxDistanceKm = 10; // Rayon maximum de 10 km

        // Essayer d'abord l'adresse des enfants, puis celle du parent
        const childWithAddress = childrenInfoResult.rows.find((row: any) => row.address);
        if (childWithAddress && childWithAddress.address) {
            parentAddress = childWithAddress.address;
        } else {
            // Récupérer l'adresse du parent depuis la table users
            const userResult = await query(
                `SELECT address FROM users WHERE id = $1`,
                [user.id]
            );
            if (userResult.rows.length > 0 && userResult.rows[0].address) {
                parentAddress = userResult.rows[0].address;
            }
        }

        // Géocoder l'adresse du parent pour obtenir les coordonnées GPS
        if (parentAddress) {
            parentCoords = await geocodeAddress(parentAddress);
            if (parentCoords) {
                console.log(`📍 Adresse parent géocodée: ${parentAddress} -> (${parentCoords[0]}, ${parentCoords[1]})`);
            } else {
                console.warn(`⚠️ Impossible de géocoder l'adresse du parent: ${parentAddress}`);
            }
        }

        // Si un school_id spécifique est fourni, vérifier qu'il fait partie des écoles des enfants
        let filteredSchoolIds = childrenSchoolIds;
        if (school_id) {
            const schoolIdNum = parseInt(school_id);
            if (!isNaN(schoolIdNum) && childrenSchoolIds.includes(schoolIdNum)) {
                filteredSchoolIds = [schoolIdNum]; // Filtrer par cette école spécifique
            } else {
                // Si l'école demandée n'est pas dans les écoles des enfants, retourner vide
                const response = NextResponse.json({
                    success: true,
                    data: [],
                    message: "L'école spécifiée ne correspond pas aux écoles de vos enfants"
                });
                return setCorsHeaders(response, origin);
            }
        }

        // Construire les conditions WHERE
        // Support des arrêts multiples : un trajet peut avoir plusieurs écoles (arrêts)
        // On filtre les trajets qui ont au moins un arrêt correspondant à une école des enfants
        const conditions: string[] = [
            't.driver_id IS NOT NULL',
            "t.status = 'pending'",
            't.departure_time > NOW()',
            // Vérifier si le trajet a un school_id direct OU au moins un arrêt (trip_stops) correspondant
            `(
                t.school_id = ANY($1) 
                OR EXISTS (
                    SELECT 1 FROM trip_stops ts 
                    WHERE ts.trip_id = t.id 
                    AND ts.school_id = ANY($1)
                )
            )`
        ];
        const params: any[] = [filteredSchoolIds];
        let paramIndex = 2;

        // Ajouter le filtre de proximité si on a les coordonnées du parent
        // NOTE: Ce filtre est optionnel - si les coordonnées ne sont pas disponibles, on ne filtre pas par proximité
        // Peut être désactivé avec le paramètre disable_proximity=true
        if (parentCoords && parentAddress && !disableProximityFilter) {
            // Filtrer les trajets dont le point de départ est proche de l'adresse du parent
            // Stratégie hybride :
            // 1. Si le trajet a des coordonnées GPS → filtrer par distance (précis, rayon de 10 km)
            // 2. Si le trajet n'a pas de coordonnées GPS → filtrer par similarité de texte (fallback)
            // 3. Si aucun match → accepter quand même (pas de filtre trop strict)
            const parentAddressLower = parentAddress.toLowerCase().trim();

            console.log(`🔍 [DEBUG] Application filtre de proximité:`, {
                parentAddress,
                parentCoords,
                maxDistanceKm
            });

            conditions.push(`
                (
                    -- Cas 1: Trajet avec coordonnées GPS → filtrer par distance (rayon de 10 km)
                    (
                        t.start_latitude IS NOT NULL 
                        AND t.start_longitude IS NOT NULL
                        AND (
                            6371 * acos(
                                cos(radians($${paramIndex})) * 
                                cos(radians(t.start_latitude)) * 
                                cos(radians(t.start_longitude) - radians($${paramIndex + 1})) + 
                                sin(radians($${paramIndex})) * 
                                sin(radians(t.start_latitude))
                            )
                        ) <= $${paramIndex + 2}
                    )
                    OR
                    -- Cas 2: Trajet sans coordonnées GPS → filtrer par similarité de texte
                    (
                        (t.start_latitude IS NULL OR t.start_longitude IS NULL)
                        AND (
                            LOWER(t.start_point) LIKE LOWER($${paramIndex + 3})
                            OR LOWER($${paramIndex + 4}) LIKE LOWER('%' || t.start_point || '%')
                        )
                    )
                    OR
                    -- Cas 3: Si le trajet n'a pas de coordonnées ET que le texte ne correspond pas,
                    -- on accepte quand même (pour éviter de bloquer tous les trajets)
                    (
                        (t.start_latitude IS NULL OR t.start_longitude IS NULL)
                        AND t.start_point IS NOT NULL
                    )
                )
            `);
            // Pour le filtre texte, on cherche si le point de départ ou l'adresse du parent se ressemblent
            const addressPattern = `%${parentAddressLower}%`;
            params.push(parentCoords[0], parentCoords[1], maxDistanceKm, addressPattern, parentAddressLower);
            paramIndex += 5;
        } else {
            console.log(`⚠️ [DEBUG] Pas de filtre de proximité appliqué:`, {
                hasParentCoords: !!parentCoords,
                hasParentAddress: !!parentAddress
            });
        }

        if (start_point) {
            conditions.push(`LOWER(t.start_point) LIKE LOWER($${paramIndex++})`);
            params.push(`%${start_point}%`);
        }

        if (end_point) {
            conditions.push(`LOWER(t.end_point) LIKE LOWER($${paramIndex++})`);
            params.push(`%${end_point}%`);
        }

        const whereClause = conditions.join(' AND ');

        // Requête principale pour récupérer les trajets disponibles
        // Filtrer uniquement les trajets dont l'école correspond aux écoles des enfants du parent
        console.log(`🔍 [DEBUG] Requête SQL avec conditions:`, {
            whereClause,
            params: params.map((p, i) => `$${i + 1} = ${JSON.stringify(p)}`),
            min_available_seats
        });

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
                -- Calculer le statut global
                CASE 
                    WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
                        get_trip_overall_status(t.status, t.return_status, t.trip_type)
                    ELSE
                        t.status
                END as overall_status,
                s.name as school_name,
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
                                'estimated_arrival_time', ts.estimated_arrival_time::text
                            ) ORDER BY ts.stop_order
                        ),
                        '[]'::json
                    )
                    FROM trip_stops ts
                    LEFT JOIN schools s2 ON ts.school_id = s2.id
                    WHERE ts.trip_id = t.id
                ) as stops,
                u.name as driver_name,
                u.phone as driver_phone,
                d.photo_profil as driver_photo,
                d.vehicle_plate,
                d.vehicle_photo,
                COALESCE(
                    (SELECT AVG(rating)::numeric(3,2) 
                     FROM evaluations 
                     WHERE driver_id = d.id),
                    0
                ) as driver_rating,
                COALESCE(
                    (SELECT COUNT(*) FROM trip_children WHERE trip_id = t.id),
                    0
                ) as booked_seats,
                (
                    t.capacity_max - COALESCE(
                        (SELECT COUNT(*) FROM trip_children WHERE trip_id = t.id),
                        0
                    )
                ) as available_seats,
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
            INNER JOIN drivers d ON t.driver_id = d.id
            INNER JOIN users u ON d.user_id = u.id
            LEFT JOIN schools s ON t.school_id = s.id
            WHERE ${whereClause}
            AND (
                t.capacity_max - COALESCE(
                    (SELECT COUNT(*) FROM trip_children WHERE trip_id = t.id),
                    0
                )
            ) >= $${paramIndex}
            ORDER BY t.departure_time ASC
            `,
            [...params, min_available_seats]
        );

        console.log(`🔍 [DEBUG] Trajets trouvés avant filtrage emploi du temps:`, {
            count: result.rows.length,
            trips: result.rows.map((trip: any) => ({
                id: trip.id,
                school_id: trip.school_id,
                departure_time: trip.departure_time,
                trip_type: trip.trip_type,
                start_point: trip.start_point,
                status: trip.status
            }))
        });

        // Mapping des jours de la semaine (PostgreSQL TO_CHAR retourne 1-7 pour lundi-dimanche)
        const dayMapping: { [key: number]: string } = {
            1: 'Lundi',
            2: 'Mardi',
            3: 'Mercredi',
            4: 'Jeudi',
            5: 'Vendredi',
            6: 'Samedi',
            7: 'Dimanche'
        };

        // Fonction utilitaire pour parser une heure HH:MM en minutes
        const parseTime = (timeStr: string): number => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        };

        // Fonction pour vérifier si un trajet correspond à l'emploi du temps d'un enfant
        const matchesChildSchedule = (trip: any, childSchedule: any[]): boolean => {
            if (!childSchedule || childSchedule.length === 0) {
                // Si pas d'emploi du temps défini, accepter le trajet
                console.log(`✅ [DEBUG] matchesChildSchedule: pas d'emploi du temps, accepté`);
                return true;
            }

            // Déterminer le jour de la semaine du trajet
            const tripDate = new Date(trip.departure_time);
            const dayOfWeek = tripDate.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
            // Convertir en format PostgreSQL (1 = Lundi, 7 = Dimanche)
            const pgDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
            const dayName = dayMapping[pgDayOfWeek];

            console.log(`🔍 [DEBUG] matchesChildSchedule:`, {
                trip_id: trip.id,
                trip_date: trip.departure_time,
                dayOfWeek,
                pgDayOfWeek,
                dayName,
                childSchedule
            });

            // Trouver l'emploi du temps de l'enfant pour ce jour
            const childDaySchedule = childSchedule.find((s: any) => s.day === dayName);

            console.log(`🔍 [DEBUG] Recherche emploi du temps pour ${dayName}:`, {
                childDaySchedule,
                allChildSchedules: childSchedule
            });

            // Vérifier que l'enfant va à l'école ce jour
            if (!childDaySchedule || !childDaySchedule.open) {
                console.log(`❌ [DEBUG] matchesChildSchedule: enfant ne va pas à l'école le ${dayName}`);
                return false;
            }

            // Extraire les heures de l'enfant
            const childOpenTime = childDaySchedule.openTime || '08:00';
            const childCloseTime = childDaySchedule.closeTime || '18:00';

            // Convertir en minutes pour les comparaisons
            const childOpenTimeMinutes = parseTime(childOpenTime);
            const childCloseTimeMinutes = parseTime(childCloseTime);

            console.log(`🔍 [DEBUG] Horaires enfant:`, {
                childOpenTime,
                childOpenTimeMinutes,
                childCloseTime,
                childCloseTimeMinutes
            });

            // Utiliser getUTCHours() et getUTCMinutes() pour éviter les problèmes de fuseau horaire
            // car PostgreSQL retourne les timestamps en UTC
            const tripHour = tripDate.getUTCHours();
            const tripMinutes = tripDate.getUTCMinutes();
            const tripTimeMinutes = tripHour * 60 + tripMinutes;

            console.log(`🔍 [DEBUG] Calcul heures trajet:`, {
                tripDateISO: trip.departure_time,
                tripDateParsed: tripDate.toISOString(),
                tripHour,
                tripMinutes,
                tripTimeMinutes,
                childOpenTime,
                childOpenTimeMinutes,
                childCloseTime,
                childCloseTimeMinutes
            });

            // Vérifier selon le type de trajet
            if (trip.trip_type === 'aller' || trip.trip_type === 'aller_retour') {
                // Pour un trajet aller (ou la partie aller d'un aller-retour), 
                // on doit arriver avant l'heure d'ouverture de l'enfant
                // On ajoute 30 minutes de marge pour le temps de trajet
                const arrivalTimeMinutes = tripTimeMinutes + 30; // Marge de 30 minutes

                console.log(`🔍 [DEBUG] Vérification trajet aller:`, {
                    tripTimeMinutes,
                    arrivalTimeMinutes,
                    childOpenTime,
                    childOpenTimeMinutes,
                    matches: arrivalTimeMinutes <= childOpenTimeMinutes
                });

                // Vérifier l'openTime de l'enfant
                if (arrivalTimeMinutes > childOpenTimeMinutes) {
                    console.log(`❌ [DEBUG] matchesChildSchedule: arriverait trop tard pour l'enfant (${arrivalTimeMinutes} > ${childOpenTimeMinutes}, openTime=${childOpenTime})`);
                    return false; // Arriverait après l'heure d'arrivée de l'enfant
                }

                console.log(`✅ [DEBUG] matchesChildSchedule: trajet aller accepté (arrivée à ${arrivalTimeMinutes} min, avant ${childOpenTime})`);
            }

            if (trip.trip_type === 'retour') {
                // Pour un trajet retour uniquement, on utilise departure_time comme heure de départ
                // (car pour un trajet "retour", departure_time contient l'heure de départ du retour)
                // L'enfant doit partir APRÈS son heure de fermeture

                console.log(`🔍 [DEBUG] Vérification trajet retour:`, {
                    tripTimeMinutes,
                    childCloseTime,
                    childCloseTimeMinutes,
                    matches: tripTimeMinutes >= childCloseTimeMinutes
                });

                // Vérifier le closeTime de l'enfant
                if (tripTimeMinutes < childCloseTimeMinutes) {
                    console.log(`❌ [DEBUG] matchesChildSchedule: partirait trop tôt pour l'enfant (${tripTimeMinutes} < ${childCloseTimeMinutes}, closeTime=${childCloseTime})`);
                    return false; // Partirait avant l'heure de départ de l'enfant
                }

                console.log(`✅ [DEBUG] matchesChildSchedule: trajet retour accepté (départ à ${tripTimeMinutes} min, après ${childCloseTime})`);
            } else if (trip.trip_type === 'aller_retour' && trip.return_departure_time) {
                // Pour la partie retour d'un trajet aller-retour, on doit partir après l'heure de fermeture de l'enfant
                const returnTime = new Date(trip.return_departure_time);
                const returnHour = returnTime.getUTCHours();
                const returnMinutes = returnTime.getUTCMinutes();
                const returnTimeMinutes = returnHour * 60 + returnMinutes;

                console.log(`🔍 [DEBUG] Vérification trajet retour (aller-retour):`, {
                    returnTimeMinutes,
                    childCloseTime,
                    childCloseTimeMinutes,
                    matches: returnTimeMinutes >= childCloseTimeMinutes
                });

                // Vérifier le closeTime de l'enfant
                if (returnTimeMinutes < childCloseTimeMinutes) {
                    console.log(`❌ [DEBUG] matchesChildSchedule: retour partirait trop tôt pour l'enfant (${returnTimeMinutes} < ${childCloseTimeMinutes})`);
                    return false; // Partirait avant l'heure de départ de l'enfant
                }

                console.log(`✅ [DEBUG] matchesChildSchedule: trajet retour (aller-retour) accepté`);
            }

            console.log(`✅ [DEBUG] matchesChildSchedule: trajet accepté pour ${dayName}`);
            return true;
        };

        // Filtrer les trajets selon l'emploi du temps des enfants
        // RÈGLE : Un parent voit un trajet si :
        // 1. Au moins un de ses enfants est dans une des écoles du trajet (arrêts)
        // 2. L'emploi du temps de cet enfant correspond au trajet (horaires compatibles)
        const filteredTrips = result.rows.filter((trip: any) => {
            // Étape 1 : Récupérer toutes les écoles du trajet (arrêts)
            // Le trajet peut avoir un school_id direct OU plusieurs arrêts dans trip_stops
            const tripSchoolIds: number[] = [];

            // Ajouter l'école principale si elle existe
            if (trip.school_id) {
                tripSchoolIds.push(trip.school_id);
            }

            // Ajouter les écoles des arrêts
            if (trip.stops && Array.isArray(trip.stops)) {
                trip.stops.forEach((stop: any) => {
                    if (stop.school_id && !tripSchoolIds.includes(stop.school_id)) {
                        tripSchoolIds.push(stop.school_id);
                    }
                });
            }

            console.log(`🔍 [DEBUG] Trajet ${trip.id} - Écoles/arrêts:`, {
                school_id_direct: trip.school_id,
                stops: trip.stops,
                all_school_ids: tripSchoolIds
            });

            // Étape 2 : Trouver les enfants qui vont à une des écoles du trajet
            const relevantChildren = childrenSchedules.filter(
                (child: any) => tripSchoolIds.includes(child.school_id)
            );

            console.log(`🔍 [DEBUG] Trajet ${trip.id} - Enfants correspondants:`, {
                relevant_children_count: relevantChildren.length,
                relevant_children: relevantChildren.map((c: any) => ({
                    child_id: c.child_id,
                    school_id: c.school_id,
                    schedule: c.schedule
                }))
            });

            if (relevantChildren.length === 0) {
                console.log(`❌ [DEBUG] Trajet ${trip.id} rejeté: aucun enfant ne va aux écoles ${tripSchoolIds.join(', ')}`);
                return false; // Aucun enfant ne va à une de ces écoles → trajet non visible
            }

            // Étape 3 : Vérifier si au moins un enfant a un emploi du temps compatible
            // Si au moins un enfant a un emploi du temps compatible, le trajet est visible
            const matches = relevantChildren.some((child: any) => {
                const schedule = Array.isArray(child.schedule) ? child.schedule : [];
                const match = matchesChildSchedule(trip, schedule);
                console.log(`🔍 [DEBUG] Trajet ${trip.id} vs enfant ${child.child_id} (école ${child.school_id}):`, {
                    childSchedule: schedule,
                    matches: match,
                    trip_departure: trip.departure_time,
                    trip_type: trip.trip_type
                });
                return match;
            });

            if (!matches) {
                console.log(`❌ [DEBUG] Trajet ${trip.id} rejeté: aucun emploi du temps compatible`);
            } else {
                console.log(`✅ [DEBUG] Trajet ${trip.id} accepté: emploi du temps compatible`);
            }

            return matches;
        });

        console.log(`🔍 [DEBUG] Trajets après filtrage emploi du temps:`, {
            count: filteredTrips.length,
            trips: filteredTrips.map((trip: any) => ({
                id: trip.id,
                school_id: trip.school_id,
                departure_time: trip.departure_time
            }))
        });

        // Formater les résultats
        const formattedTrips = filteredTrips.map((trip: any) => {
            // Extraire tous les noms d'écoles des arrêts
            const schoolNames: string[] = [];
            if (trip.stops && Array.isArray(trip.stops)) {
                trip.stops.forEach((stop: any) => {
                    if (stop.school_name && !schoolNames.includes(stop.school_name)) {
                        schoolNames.push(stop.school_name);
                    }
                });
            }
            // Ajouter aussi l'école principale si elle existe et n'est pas déjà dans la liste
            if (trip.school_name && !schoolNames.includes(trip.school_name)) {
                schoolNames.push(trip.school_name);
            }

            return {
            id: trip.id,
            driver_id: trip.driver_id,
            start_point: trip.start_point,
            end_point: trip.end_point,
            departure_time: trip.departure_time,
            capacity_max: trip.capacity_max,
            available_seats: parseInt(trip.available_seats),
            booked_seats: parseInt(trip.booked_seats),
            status: trip.overall_status || trip.status, // Utiliser le statut global
                school_id: trip.school_id, // École principale (pour compatibilité)
                //school_name: trip.school_name, // Nom de l'école principale
                school_name: schoolNames, // Liste de tous les noms d'écoles (arrêts)
                stops: trip.stops || [], // Tous les arrêts (écoles) du trajet
            trip_type: trip.trip_type || 'aller_retour',
            return_departure_time: trip.return_departure_time || null,
            driver_name: trip.driver_name,
            driver_phone: trip.driver_phone,
            driver_rating: parseFloat(trip.driver_rating || 0),
            driver_photo: trip.driver_photo || null,
            vehicle_plate: trip.vehicle_plate || null,
            vehicle_photo: trip.vehicle_photo || null,
            passengers: trip.passengers || [],
            has_return: !!trip.return_departure_time,
            // Garder aussi les statuts individuels pour référence
            status_aller: trip.status,
            status_retour: trip.return_status || null
            };
        });

        const response = NextResponse.json({
            success: true,
            data: formattedTrips
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('Erreur récupération trajets disponibles:', error);
        const errorResponse = NextResponse.json(
            { success: false, error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

