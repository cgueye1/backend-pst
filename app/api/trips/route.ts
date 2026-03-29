/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Récupérer tous les trajets
 *     description: Récupère la liste de tous les trajets avec filtres optionnels.
 *     tags: ["ADMIN"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["pending","completed","canceled"]
 *         description: status
 *       - in: query
 *         name: driver_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: driver_id
 *       - in: query
 *         name: school_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: school_id
 *       - in: query
 *         name: date_from
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: date_from
 *       - in: query
 *         name: date_to
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: date_to
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: page
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *         description: limit
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
 *   post:
 *     summary: Créer un trajet
 *     description: |
 *       Crée un nouveau trajet. Réservé aux administrateurs.
 *       Pour un trajet scolaire aller-retour, fournissez return_departure_time.
 *       Le trajet sera de type 'aller_retour' et permettra de gérer l'aller et le retour séparément.
 *     tags: ["ADMIN"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - driver_id
 *               - start_point
 *               - end_point
 *               - departure_time
 *               - capacity_max
 *             properties:
 *               driver_id:
 *                 type: integer
 *                 description: ID du chauffeur
 *               school_id:
 *                 type: integer
 *                 nullable: true
 *                 description: ID de l'école principale (optionnel, pour compatibilité. Utiliser 'stops' pour plusieurs arrêts)
 *               stops:
 *                 type: array
 *                 nullable: true
 *                 description: |
 *                   Liste des arrêts (écoles) du trajet. Permet de créer un trajet avec plusieurs arrêts.
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
 *                       description: Ordre de l'arrêt (1 = premier, 2 = deuxième, etc.). Si non fourni, sera déterminé automatiquement
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
 *               start_point:
 *                 type: string
 *                 description: Point de départ
 *               end_point:
 *                 type: string
 *                 description: Point d'arrivée
 *               departure_time:
 *                 type: string
 *                 format: date-time
 *                 description: Date et heure de départ de l'aller
 *                 example: "2024-12-25T08:00:00Z"
 *               return_departure_time:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: |
 *                   Date et heure de départ du retour (recommandé pour trajets scolaires).
 *                   Si fourni, crée un trajet aller-retour (trip_type = 'aller_retour').
 *                   Doit être le même jour et après departure_time.
 *                   Pour un trajet scolaire, il est recommandé de toujours fournir ce champ.
 *                 example: "2024-12-25T16:00:00Z"
 *               capacity_max:
 *                 type: integer
 *                 description: Capacité maximale du trajet
 *               is_recurring:
 *                 type: boolean
 *                 default: false
 *                 description: Indique si le trajet est récurrent
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




import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

// Configuration OSRM (OpenStreetMap Routing Machine)
const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

/**
 * Calcule la distance et le temps réel entre deux points via OSRM
 * OSRM calcule la distance réelle de l'itinéraire routier (pas à vol d'oiseau)
 */
export async function getRouteInfo(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
): Promise<{ distance_km: number; duration_minutes: number } | null> {
    try {
        // OSRM utilise l'ordre longitude,latitude (pas latitude,longitude)
        const url = `${OSRM_BASE_URL}/${startLng},${startLat};${endLng},${endLat}?overview=false&alternatives=false`;

        console.log(`🔍 Appel OSRM pour calculer distance réelle:`);
        console.log(`   Départ: [${startLat}, ${startLng}]`);
        console.log(`   Arrivée: [${endLat}, ${endLng}]`);
        console.log(`   URL: ${url}`);

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'TransportApp/1.0'
            }
        });

        if (!response.ok) {
            console.error(`❌ OSRM API error: ${response.status} ${response.statusText}`);
            const errorText = await response.text().catch(() => '');
            console.error(`   Détails: ${errorText}`);
            return null;
        }

        const data = await response.json();

        if (data.code !== 'Ok') {
            console.error(`❌ OSRM retourne un code d'erreur: ${data.code}`);
            if (data.message) {
                console.error(`   Message: ${data.message}`);
            }
            return null;
        }

        if (!data.routes || data.routes.length === 0) {
            console.error(`❌ OSRM n'a retourné aucun itinéraire`);
            return null;
        }

        const route = data.routes[0];

        // La distance est en mètres dans la réponse OSRM
        const distanceMeters = route.distance;
        const distanceKm = parseFloat((distanceMeters / 1000).toFixed(2));
        const durationMinutes = Math.round(route.duration / 60);

        console.log(`✅ Distance RÉELLE calculée via OSRM:`);
        console.log(`   Distance: ${distanceKm} km (${distanceMeters} m)`);
        console.log(`   Durée: ${durationMinutes} minutes (${route.duration} secondes)`);

        return {
            distance_km: distanceKm,
            duration_minutes: durationMinutes
        };
    } catch (error) {
        console.error('❌ Erreur lors de l\'appel OSRM:', error);
        if (error instanceof Error) {
            console.error(`   Message: ${error.message}`);
            console.error(`   Stack: ${error.stack}`);
        }
        return null;
    }
}

/**
 * Calcule la distance à vol d'oiseau (fallback si OSRM échoue)
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
    return parseFloat((R * c).toFixed(2));
}

/**
 * Géocode une adresse pour obtenir ses coordonnées GPS réelles et précises
 * Utilise plusieurs stratégies pour améliorer la précision
 */
async function geocodeAddress(address: string): Promise<[number, number] | null> {
    try {
        const searchQuery = address.trim();
        const searchLower = searchQuery.toLowerCase().trim();

        // Stratégie 1: Détecter si c'est une ville connue du Sénégal (coordonnées précises)
        const senegalCities: { [key: string]: [number, number] } = {
            'thies': [14.7894, -16.9260],
            'thiès': [14.7894, -16.9260],
            'diourbel': [14.6550, -16.2314],
            'kaolack': [14.1514, -16.0733],
            'saint-louis': [16.0333, -16.5000],
            'ziguinchor': [12.5833, -16.2833],
            'touba': [14.8667, -15.8833],
            'mbour': [14.4167, -16.9667],
            'louga': [15.6167, -16.2167],
            'dakar': [14.6928, -17.4467],
            'ouakam': [14.7263, -17.4886],
            'ngor': [14.7497, -17.5138],
            'medina': [14.6844, -17.4481],
            'plateau': [14.6928, -17.4467]
        };

        // Vérifier si c'est une ville connue
        for (const [city, coords] of Object.entries(senegalCities)) {
            if (searchLower.includes(city)) {
                console.log(`✅ Ville connue détectée: ${city}, utilisation des coordonnées directes:`, coords);
                return coords;
            }
        }

        // Stratégie 2: Géocodage via API Nominatim (approche simplifiée et efficace)
        const fullQuery = searchQuery.includes('Sénégal') || searchQuery.includes('Senegal')
            ? searchQuery
            : `${searchQuery}, Senegal`;

        console.log(`🔍 Géocodage via API pour: "${fullQuery}"`);

        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullQuery)}&format=json&limit=5&countrycodes=sn`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'TransportApp/1.0',
                'Accept-Language': 'fr-FR,fr;q=0.9'
            }
        });

        if (!response.ok) {
            console.error(`❌ Erreur HTTP ${response.status} pour ${address}`);
            return null;
        }

        const data = await response.json();

        if (data.length === 0) {
            // Stratégie 3: Réessayer sans restriction de pays
            console.log(`⚠️ Aucun résultat avec restriction Sénégal, réessai sans restriction...`);
            const url2 = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullQuery)}&format=json&limit=3`;
            const response2 = await fetch(url2, {
                headers: {
                    'User-Agent': 'TransportApp/1.0',
                    'Accept-Language': 'fr-FR,fr;q=0.9'
                }
            });

            if (response2.ok) {
                const data2 = await response2.json();
                if (data2.length > 0) {
                    const lat = parseFloat(data2[0].lat);
                    const lon = parseFloat(data2[0].lon);
                    if (!isNaN(lat) && !isNaN(lon)) {
                        console.log(`✅ Coordonnées trouvées (sans restriction) pour "${address}":`, { lat, lon });
                        return [lat, lon];
                    }
                }
            }

            console.error(`❌ Adresse non trouvée: ${address}`);
            return null;
        }

        // Choisir le meilleur résultat (priorité aux résultats avec importance élevée)
        const sortedResults = data.sort((a: any, b: any) => (b.importance || 0) - (a.importance || 0));
        const bestResult = sortedResults[0];

        const lat = parseFloat(bestResult.lat);
        const lon = parseFloat(bestResult.lon);

        if (isNaN(lat) || isNaN(lon)) {
            console.error(`❌ Coordonnées invalides pour ${address}:`, bestResult);
            return null;
        }

        // Vérifier que les coordonnées sont dans une plage raisonnable pour le Sénégal
        // Sénégal: latitude ~12-17, longitude ~-17.5 à -11.5
        if (lat < 10 || lat > 18 || lon < -18 || lon > -10) {
            console.warn(`⚠️ Coordonnées suspectes pour ${address}:`, { lat, lon, display_name: bestResult.display_name });
        }

        console.log(`✅ Coordonnées trouvées pour "${address}":`, {
            lat,
            lon,
            display_name: bestResult.display_name,
            importance: bestResult.importance
        });

        return [lat, lon];
    } catch (error) {
        console.error(`❌ Erreur géocodage pour ${address}:`, error);
        return null;
    }
}

/**
 * Calcule le prix en fonction de la distance
 * 1km = 500 FCFA, réduction de 20% pour trajets récurrents
 */
function calculatePrice(distance_km: number, isRecurring: boolean): number {
    const basePrice = distance_km * 500; // 1km = 500 FCFA
    return isRecurring ? Math.round(basePrice * 0.8) : Math.round(basePrice); // 20% réduction si récurrent
}

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        // Récupérer les paramètres de requête
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const driver_id = searchParams.get("driver_id");
        const school_id = searchParams.get("school_id");
        const date_from = searchParams.get("date_from");
        const date_to = searchParams.get("date_to");
        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 20);
        const offset = (page - 1) * limit;

        // Construire la clause WHERE
        const conditions: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;

        // Condition de base (optionnel selon les besoins)
        // Si vous voulez tous les trajets, commentez cette ligne
        // conditions.push(`t.driver_id IS NOT NULL`);

        if (status) {
            // Utiliser le statut global pour les trajets aller-retour
            conditions.push(`(
                CASE 
                    WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
                        get_trip_overall_status(t.status, t.return_status, t.trip_type) = $${paramIndex}
                    ELSE
                        t.status = $${paramIndex}
                END
            )`);
            params.push(status);
            paramIndex++;
        }

        if (driver_id) {
            conditions.push(`t.driver_id = $${paramIndex++}`);
            params.push(parseInt(driver_id));
        }

        if (school_id) {
            conditions.push(`t.school_id = $${paramIndex++}`);
            params.push(parseInt(school_id));
        }

        if (date_from) {
            conditions.push(`t.departure_time >= $${paramIndex++}`);
            params.push(date_from);
        }

        if (date_to) {
            conditions.push(`t.departure_time <= $${paramIndex++}`);
            params.push(date_to);
        }

        const whereClause = conditions.length > 0
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

        const res = await query(`
            SELECT
                t.id,
                t.start_point,
                t.end_point,
                t.departure_time,
                t.return_departure_time,
                t.driver_id,
                t.status,
                t.return_status,
                t.trip_type,
                t.capacity_max,
                t.is_recurring,
                t.created_at,
                s.name AS school_name,
                s.address AS school_address,
                u.name AS driver_name,
                u.phone AS driver_phone,
                -- Calculer le statut global
                CASE 
                    WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
                        get_trip_overall_status(t.status, t.return_status, t.trip_type)
                    ELSE
                        t.status
                END as overall_status,
                -- Compter les réservations
                (SELECT COUNT(*) FROM trip_children WHERE trip_id = t.id) as booked_seats,
                (t.capacity_max - (SELECT COUNT(*) FROM trip_children WHERE trip_id = t.id)) as available_seats
            FROM trips t 
            LEFT JOIN schools s ON s.id = t.school_id
            LEFT JOIN drivers d ON t.driver_id = d.id
            LEFT JOIN users u ON d.user_id = u.id
            ${whereClause}
            ORDER BY t.created_at DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `, [...params, limit, offset]);

        // Compter le total pour la pagination
        const countRes = await query(`
            SELECT COUNT(*) as total
            FROM trips t
            ${whereClause}
        `, params);

        // Formater les résultats pour remplacer status par overall_status
        const formattedTrips = res.rows.map((trip: any) => {
            const { overall_status, ...rest } = trip;
            return {
                ...rest,
                status: overall_status, // Remplacer status par overall_status
                // Garder aussi les statuts individuels pour référence
                status_aller: trip.status,
                status_retour: trip.return_status || null
            };
        });

        const response = NextResponse.json({
            success: true,
            data: formattedTrips,
            pagination: {
                page,
                limit,
                total: parseInt(countRes.rows[0].total),
                totalPages: Math.ceil(parseInt(countRes.rows[0].total) / limit)
            }
        });
        return setCorsHeaders(response, origin);
    } catch (err) {
        console.error("Erreur GET /api/trips:", err);
        const response = NextResponse.json({
            success: false,
            error: String(err)
        }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const {
            driver_id,
            school_id,
            start_point,
            end_point,
            departure_time,
            return_departure_time,
            capacity_max,
            distance_km,
            price,
            is_recurring,
            stops
        } = await req.json();
        
        // stops est un tableau d'arrêts (écoles) : [{ school_id: 1, stop_order: 1, estimated_arrival_time: "07:30" }, ...]
        // Si stops n'est pas fourni mais school_id l'est, on crée un arrêt par défaut

        // Validation des champs obligatoires
        if (!start_point || !end_point || !departure_time || !capacity_max) {
            const response = NextResponse.json(
                { error: "Champs obligatoires manquants: start_point, end_point, departure_time, capacity_max" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Validation des types
        if (capacity_max && (typeof capacity_max !== 'number' || capacity_max < 1)) {
            const response = NextResponse.json(
                { error: "capacity_max doit être un nombre supérieur à 0" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Convertir driver_id et school_id en nombres si fournis
        const finalDriverId = driver_id ? Number(driver_id) : null;
        const finalSchoolId = school_id ? Number(school_id) : null;
        const finalCapacityMax = Number(capacity_max);

        // Si return_departure_time est fourni, c'est un trajet aller-retour
        const tripType = return_departure_time ? 'aller_retour' : 'aller';

        // Vérifier que return_departure_time est après departure_time et le même jour
        if (return_departure_time) {
            const departureDate = new Date(departure_time);
            const returnDate = new Date(return_departure_time);

            // Vérifier que return_departure_time est après departure_time
            if (returnDate <= departureDate) {
                const response = NextResponse.json(
                    { error: "L'heure de retour doit être après l'heure de départ" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            // Vérifier que c'est le même jour (pour un trajet scolaire)
            const departureDay = departureDate.toISOString().split('T')[0];
            const returnDay = returnDate.toISOString().split('T')[0];
            if (departureDay !== returnDay) {
                const response = NextResponse.json(
                    { error: "L'heure de retour doit être le même jour que l'heure de départ" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }
        }

        // 📅 Extraire uniquement la date (YYYY-MM-DD)
        const tripDate = new Date(departure_time).toISOString().split("T")[0];

        // 1️⃣ Vérifier vacances scolaires (seulement si school_id est fourni)
        let hasVacation = false;
        if (finalSchoolId) {
            const vacation = await query(
                `
      SELECT 1
      FROM school_vacations
      WHERE school_id = $1
        AND $2::date BETWEEN start_date AND end_date
      LIMIT 1
      `,
                [finalSchoolId, tripDate]
            );
            hasVacation = (vacation.rowCount ?? 0) > 0;
        }

        if (hasVacation) {
            const response = NextResponse.json(
                {
                    error: "Impossible de créer un trajet pendant les vacances scolaires",
                    type: "HOLIDAY"
                },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // 2️⃣ Vérifier jour férié
        const holiday = await query(
            `
                SELECT 1
                FROM public_holidays
                WHERE date = DATE($1)
                    LIMIT 1
            `,
            [tripDate]
        );

        const hasHoliday = (holiday.rowCount ?? 0) > 0;

        if (hasHoliday) {
            const response = NextResponse.json(
                {
                    error: "Impossible de créer un trajet un jour férié",
                    type: "FERIE"
                },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // 3️⃣ TOUJOURS calculer la distance RÉELLE via OSRM (ignorer la distance fournie)
        // Cela garantit que la distance est toujours réelle et précise
        let finalDistance: number | null = null;
        let finalPrice = price;

        console.log('📊 Calcul distance/prix - TOUJOURS utiliser OSRM pour distance réelle');
        console.log('📊 Valeurs reçues (distance sera recalculée):', { distance_km, price, is_recurring });

        // Variables pour stocker les coordonnées GPS
        let startLat: number | null = null;
        let startLng: number | null = null;
        let endLat: number | null = null;
        let endLng: number | null = null;

        // TOUJOURS géocoder les deux points pour obtenir les coordonnées GPS réelles
        console.log('🔍 Géocodage du point de départ:', start_point);
        const startCoords = await geocodeAddress(start_point);

        if (!startCoords) {
            const response = NextResponse.json(
                {
                    error: `Impossible de trouver les coordonnées GPS du point de départ: "${start_point}". Veuillez vérifier l'adresse.`,
                    details: 'Le géocodage a échoué. Assurez-vous que l\'adresse est correcte et se trouve au Sénégal.'
                },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        startLat = startCoords[0];
        startLng = startCoords[1];
        console.log('✅ Coordonnées de départ trouvées:', { lat: startLat, lng: startLng });

        // Géocoder le point d'arrivée - OBLIGATOIRE pour avoir une distance réelle
        console.log('🔍 Géocodage du point d\'arrivée:', end_point);
        const endCoords = await geocodeAddress(end_point);

        if (!endCoords) {
            const response = NextResponse.json(
                {
                    error: `Impossible de trouver les coordonnées GPS du point d'arrivée: "${end_point}". Veuillez vérifier l'adresse.`,
                    details: 'Le géocodage a échoué. Assurez-vous que l\'adresse est correcte et se trouve au Sénégal.'
                },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        endLat = endCoords[0];
        endLng = endCoords[1];
        console.log('✅ Coordonnées d\'arrivée trouvées:', { lat: endLat, lng: endLng });

        // TOUJOURS calculer la distance RÉELLE via OSRM (itinéraire routier réel)
        console.log('🔍 Calcul de la distance RÉELLE via OSRM (itinéraire routier)...');
        const routeInfo = await getRouteInfo(
            startLat,
            startLng,
            endLat,
            endLng
        );

        if (routeInfo) {
            finalDistance = routeInfo.distance_km;
            console.log('✅ Distance RÉELLE calculée via OSRM:', finalDistance, 'km (itinéraire routier réel)');
        } else {
            // Fallback: distance à vol d'oiseau (moins précise mais mieux que rien)
            console.warn('⚠️ OSRM échoué, utilisation de Haversine (distance à vol d\'oiseau - moins précise)');
            finalDistance = calculateHaversineDistance(
                startLat,
                startLng,
                endLat,
                endLng
            );
            console.log('✅ Distance calculée via Haversine (fallback):', finalDistance, 'km');
        }

        // Calculer le prix si distance disponible mais prix non fourni
        if (finalDistance && finalDistance > 0 && !finalPrice) {
            finalPrice = calculatePrice(finalDistance, is_recurring || false);
            console.log('✅ Prix calculé:', finalPrice, 'FCFA (distance:', finalDistance, 'km, récurrent:', is_recurring, ')');
        } else if (finalPrice) {
            console.log('✅ Prix déjà fourni:', finalPrice, 'FCFA');
        } else if (!finalDistance || finalDistance === 0) {
            console.warn('⚠️ Distance non calculée ou nulle, prix ne sera pas calculé');
        } else {
            console.warn('⚠️ Aucun prix calculé - distance:', finalDistance);
        }

        // Vérifier que les valeurs sont valides avant insertion
        if (finalDistance && finalDistance > 0) {
            console.log('✅ Distance valide pour insertion:', finalDistance, 'km');
        } else {
            console.warn('⚠️ Distance invalide ou nulle:', finalDistance);
        }

        if (finalPrice && finalPrice > 0) {
            console.log('✅ Prix valide pour insertion:', finalPrice, 'FCFA');
        } else {
            console.warn('⚠️ Prix invalide ou nul:', finalPrice);
        }

        console.log('📦 Valeurs finales avant insertion:', {
            finalDistance,
            finalPrice,
            distanceType: typeof finalDistance,
            priceType: typeof finalPrice
        });

        // 4️⃣ Création du trip avec coordonnées GPS réelles
        const insertValues = [
            finalDriverId,
            finalSchoolId,
            start_point,
            end_point,
            departure_time,
            finalCapacityMax,
            finalDistance || null,
            finalPrice || null,
            is_recurring || false,
            startLat,
            startLng,
            endLat,
            endLng
        ];

        // Ajouter return_departure_time et trip_type
        const finalInsertValues = [
            ...insertValues.slice(0, 5), // driver_id, school_id, start_point, end_point, departure_time
            return_departure_time || null, // return_departure_time
            ...insertValues.slice(5, 6), // capacity_max
            tripType, // trip_type
            ...insertValues.slice(6) // distance_km, price, is_recurring, start_latitude, start_longitude, end_latitude, end_longitude
        ];

        console.log('💾 Insertion dans la base de données avec valeurs:', {
            distance_km: insertValues[6],
            price: insertValues[7],
            is_recurring: insertValues[8],
            start_latitude: insertValues[9],
            start_longitude: insertValues[10],
            end_latitude: insertValues[11],
            end_longitude: insertValues[12]
        });

        // Initialiser return_status à 'pending' si c'est un trajet aller-retour
        const returnStatus = return_departure_time ? 'pending' : null;
        finalInsertValues.push(returnStatus);

        // Log des valeurs avant insertion pour debug
        console.log('🔍 Valeurs finales pour insertion:', {
            driver_id: finalInsertValues[0],
            school_id: finalInsertValues[1],
            start_point: finalInsertValues[2],
            end_point: finalInsertValues[3],
            departure_time: finalInsertValues[4],
            return_departure_time: finalInsertValues[5],
            capacity_max: finalInsertValues[6],
            trip_type: finalInsertValues[7],
            distance_km: finalInsertValues[8],
            price: finalInsertValues[9],
            is_recurring: finalInsertValues[10],
            start_latitude: finalInsertValues[11],
            start_longitude: finalInsertValues[12],
            end_latitude: finalInsertValues[13],
            end_longitude: finalInsertValues[14],
            return_status: finalInsertValues[15],
            totalValues: finalInsertValues.length
        });

        const res = await query(
            `
      INSERT INTO trips 
        (driver_id, school_id, start_point, end_point, departure_time, return_departure_time, capacity_max, trip_type,
         distance_km, price, is_recurring, 
         start_latitude, start_longitude, end_latitude, end_longitude, return_status)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
      `,
            finalInsertValues
        );

        console.log('✅ Trajet créé avec succès:', {
            id: res.rows[0].id,
            distance_km: res.rows[0].distance_km,
            price: res.rows[0].price,
            start_latitude: res.rows[0].start_latitude,
            start_longitude: res.rows[0].start_longitude,
            end_latitude: res.rows[0].end_latitude,
            end_longitude: res.rows[0].end_longitude
        });

        const tripId = res.rows[0].id;

        // Créer les arrêts (écoles) si fournis
        let createdStops: any[] = [];
        
        if (stops && Array.isArray(stops) && stops.length > 0) {
            // Valider et créer chaque arrêt
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
                try {
                    const stopResult = await query(
                        `INSERT INTO trip_stops (trip_id, school_id, stop_order, estimated_arrival_time)
                         VALUES ($1, $2, $3, $4)
                         RETURNING *`,
                        [
                            tripId,
                            stop.school_id,
                            stop.stop_order || stops.indexOf(stop) + 1, // Ordre par défaut si non fourni
                            stop.estimated_arrival_time || null
                        ]
                    );

                    createdStops.push(stopResult.rows[0]);
                } catch (error: any) {
                    // Si la table trip_stops n'existe pas encore, on ignore l'erreur (migration pas encore exécutée)
                    console.warn('⚠️ Table trip_stops non disponible, arrêts non créés:', error.message);
                }
            }
        } else if (finalSchoolId) {
            // Si pas d'arrêts mais un school_id, créer un arrêt par défaut (compatibilité)
            try {
                const stopResult = await query(
                    `INSERT INTO trip_stops (trip_id, school_id, stop_order, estimated_arrival_time)
                     VALUES ($1, $2, 1, NULL)
                     RETURNING *`,
                    [tripId, finalSchoolId]
                );
                createdStops.push(stopResult.rows[0]);
            } catch (error: any) {
                // Si la table trip_stops n'existe pas encore, on ignore l'erreur (migration pas encore exécutée)
                console.warn('⚠️ Table trip_stops non disponible, arrêts non créés:', error.message);
            }
        }

        // Récupérer le trajet avec ses arrêts
        let tripWithStops = res.rows[0];
        try {
            const tripResult = await query(
                `
                SELECT 
                    t.*,
                    (
                        SELECT COALESCE(
                            json_agg(
                                jsonb_build_object(
                                    'id', ts.id,
                                    'school_id', ts.school_id,
                                    'school_name', s.name,
                                    'stop_order', ts.stop_order,
                                    'estimated_arrival_time', ts.estimated_arrival_time
                                ) ORDER BY ts.stop_order
                            ),
                            '[]'::json
                        )
                        FROM trip_stops ts
                        LEFT JOIN schools s ON ts.school_id = s.id
                        WHERE ts.trip_id = t.id
                    ) as stops
                FROM trips t
                WHERE t.id = $1
                `,
                [tripId]
            );
            
            if (tripResult.rows.length > 0) {
                tripWithStops = {
                    ...tripResult.rows[0],
                    stops: tripResult.rows[0].stops || createdStops
                };
            }
        } catch (error: any) {
            console.warn('⚠️ Impossible de récupérer les arrêts:', error.message);
        }

        const response = NextResponse.json(tripWithStops, { status: 201 });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur création trip :", error);
        const errorMessage = error?.message || "Erreur lors de la création du trajet";
        const errorDetails = error?.detail || error?.code || "";
        console.error("Détails de l'erreur:", {
            message: errorMessage,
            detail: errorDetails,
            code: error?.code,
            stack: error?.stack
        });
        const response = NextResponse.json(
            {
                message: "Erreur lors de la création du trajet",
                error: errorMessage,
                details: errorDetails
            },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}

