/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Récupérer tous les trajets
 *     tags: [ADMIN]

 *   post:
 *     summary: Créer un nouveau trajet
 *     tags: [ADMIN]

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
        const res = await query(`
            SELECT
                t.id,
                t.start_point,
                t.end_point,
                t.departure_time,
                t.driver_id,
                s.name AS school_name
                FROM trips t 
                LEFT JOIN schools s ON s.id = t.school_id
            WHERE t.driver_id IS NULL
              AND t.departure_time >= CURRENT_TIMESTAMP
            ORDER BY t.created_at DESC
        `);

        const response = NextResponse.json(res.rows);
        return setCorsHeaders(response, origin);
    } catch (err) {
        const response = NextResponse.json({ error: String(err) }, { status: 500 });
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
            capacity_max,
            distance_km,
            price,
            is_recurring
        } = await req.json();

        // 📅 Extraire uniquement la date (YYYY-MM-DD)
        const tripDate = new Date(departure_time).toISOString().split("T")[0];

        // 1️⃣ Vérifier vacances scolaires
        const vacation = await query(
            `
      SELECT 1
      FROM school_vacations
      WHERE school_id = $1
        AND $2::date BETWEEN start_date AND end_date
      LIMIT 1
      `,
            [school_id, tripDate]
        );

        const hasVacation = (vacation.rowCount ?? 0) > 0;

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
            driver_id,
            school_id,
            start_point,
            end_point,
            departure_time,
            capacity_max,
            finalDistance || null,
            finalPrice || null,
            is_recurring || false,
            startLat,
            startLng,
            endLat,
            endLng
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

        const res = await query(
            `
      INSERT INTO trips 
        (driver_id, school_id, start_point, end_point, departure_time, capacity_max, 
         distance_km, price, is_recurring, 
         start_latitude, start_longitude, end_latitude, end_longitude)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
      `,
            insertValues
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

        const response = NextResponse.json(res.rows[0], { status: 201 });
        return setCorsHeaders(response, origin);

    } catch (error) {
        console.error("Erreur création trip :", error);
        const response = NextResponse.json(
            { message: "Erreur lors de la création du trajet" },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}

