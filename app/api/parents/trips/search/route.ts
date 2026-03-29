/**
 * @swagger
 * /api/parents/trips/search:
 *   get:
 *     summary: Rechercher des trajets
 *     description: Recherche des trajets disponibles selon des critères (point de départ, destination, date, etc.).
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_point
 *         required: false
 *         schema:
 *           type: string
 *         description: Point de départ
 *       - in: query
 *         name: end_point
 *         required: false
 *         schema:
 *           type: string
 *         description: Point d'arrivée
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Date du trajet
 *       - in: query
 *         name: school_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: school_id
 *       - in: query
 *         name: available_seats
 *         required: false
 *         schema:
 *           type: integer
 *         description: Nombre de places disponibles minimum
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


import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { setCorsHeaders, corsOptions } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Configuration OSRM (OpenStreetMap Routing Machine)
const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

/**
 * Calcule la distance et le temps réel entre deux points via OSRM
 */
async function getRouteInfo(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
): Promise<{ distance_km: number; duration_minutes: number } | null> {
    try {
        const url = `${OSRM_BASE_URL}/${startLng},${startLat};${endLng},${endLat}?overview=false&alternatives=false`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'TransportApp/1.0'
            }
        });

        if (!response.ok) {
            console.error(`OSRM API error: ${response.status}`);
            return null;
        }

        const data = await response.json();

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            return null;
        }

        const route = data.routes[0];

        return {
            distance_km: parseFloat((route.distance / 1000).toFixed(2)), // mètres → km
            duration_minutes: Math.round(route.duration / 60) // secondes → minutes
        };
    } catch (error) {
        console.error('Erreur appel OSRM:', error);
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
 * Calcule le prix en fonction de la distance
 */
function calculatePrice(distance_km: number, isRecurring: boolean): number {
    const BASE_RATE = 300; // FCFA par km
    const price = distance_km * BASE_RATE;
    return isRecurring ? Math.round(price * 0.8) : Math.round(price); // 20% réduction si récurrent
}

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const url = new URL(req.url);
        const user = await getUserFromRequest(req);

        if (!user || user.role !== "parent") {
            const response = NextResponse.json({
                success: false,
                error: "Non autorisé"
            }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        // Paramètres
        const child_id = url.searchParams.get("child_id");
        const school_id = url.searchParams.get("school_id");
        const home_lat = parseFloat(url.searchParams.get("home_lat") || "0");
        const home_lng = parseFloat(url.searchParams.get("home_lng") || "0");
        const date = url.searchParams.get("date");
        const departure_time_min = url.searchParams.get("departure_time_min");
        const departure_time_max = url.searchParams.get("departure_time_max");
        const min_rating = url.searchParams.get("min_rating");
        const verified_only = url.searchParams.get("verified_only") === "true";
        const available_seats_min = parseInt(url.searchParams.get("available_seats_min") || "1");
        const max_distance = parseFloat(url.searchParams.get("max_distance") || "30"); // km
        const max_price = parseFloat(url.searchParams.get("max_price") || "999999");
        const max_duration = parseInt(url.searchParams.get("max_duration") || "120"); // minutes
        const sort_by = url.searchParams.get("sort_by") || "optimized";
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "20");
        const offset = (page - 1) * limit;

        // Validation des coordonnées
        if (!home_lat || !home_lng || home_lat === 0 || home_lng === 0) {
            const response = NextResponse.json({
                success: false,
                error: "Position du domicile requise (home_lat et home_lng)"
            }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        // Conditions SQL
        const conditions: string[] = [`t.status = 'pending'`, `t.departure_time > NOW()`];
        const params: any[] = [];
        let idx = 1;

        if (school_id) {
            conditions.push(`t.school_id = $${idx++}`);
            params.push(school_id);
        } else if (child_id) {
            conditions.push(`t.school_id = (SELECT school_id FROM children WHERE id=$${idx++} AND parent_id=$${idx++})`);
            params.push(child_id, user.id);
        }

        if (date) {
            conditions.push(`DATE(t.departure_time) = $${idx++}`);
            params.push(date);
        }
        if (departure_time_min) {
            conditions.push(`t.departure_time::time >= $${idx++}::time`);
            params.push(departure_time_min);
        }
        if (departure_time_max) {
            conditions.push(`t.departure_time::time <= $${idx++}::time`);
            params.push(departure_time_max);
        }
        if (min_rating) {
            conditions.push(`(SELECT COALESCE(AVG(rating),0) FROM evaluations WHERE driver_id=d.id) >= $${idx++}`);
            params.push(parseFloat(min_rating));
        }
        if (verified_only) {
            conditions.push(`d.status = 'Approuvé'`);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        // Requête principale
        const tripsQuery = `
            SELECT
                t.*,
                d.status as driver_verification_status,
                d.vehicle_brand,
                d.vehicle_color,
                d.vehicle_plate,
                u.name as driver_name,
                u.phone as driver_phone,
                s.name as school_name,
                s.address as school_address,
                COALESCE(booked.count, 0) as booked_seats,
                (t.capacity_max - COALESCE(booked.count, 0)) as available_seats,
                COALESCE(AVG(e.rating), 0) as driver_rating,
                COUNT(DISTINCT e.id) as total_reviews,
                
                -- Utiliser les coordonnées du trajet comme premier arrêt (si disponibles)
                CASE 
                    WHEN t.start_latitude IS NOT NULL AND t.start_longitude IS NOT NULL THEN
                        json_build_object(
                            'latitude', t.start_latitude,
                            'longitude', t.start_longitude,
                            'address', t.start_point,
                            'name', t.start_point
                        )
                    ELSE NULL
                END as first_stop

            FROM trips t
            INNER JOIN drivers d ON t.driver_id = d.id
            INNER JOIN users u ON d.user_id = u.id
            LEFT JOIN schools s ON t.school_id = s.id
            LEFT JOIN evaluations e ON d.id = e.driver_id
            LEFT JOIN (
                SELECT trip_id, COUNT(*) as count
                FROM trip_children
                GROUP BY trip_id
            ) booked ON t.id = booked.trip_id
            ${whereClause}
            GROUP BY t.id, d.id, d.status, d.vehicle_brand, d.vehicle_color, d.vehicle_plate, u.id, s.id, booked.count
            HAVING (t.capacity_max - COALESCE(booked.count, 0)) >= ${available_seats_min}
        `;

        const tripsResult = await query(tripsQuery, params);

        console.log(`🔍 ${tripsResult.rows.length} trajets trouvés avant calcul de distance`);

        // Calculer les distances réelles avec OSRM pour chaque trajet
        const optimizedTripsPromises = tripsResult.rows.map(async (trip: any) => {
            const firstStop = trip.first_stop;
            // Utiliser les coordonnées de fin du trajet comme coordonnées de l'école
            const schoolLat = parseFloat(trip.end_latitude || 0);
            const schoolLng = parseFloat(trip.end_longitude || 0);

            // Si pas de premier arrêt, utiliser les coordonnées du trajet ou le point de départ
            let firstStopLat: number;
            let firstStopLng: number;
            
            if (firstStop && firstStop.latitude && firstStop.longitude) {
                firstStopLat = parseFloat(firstStop.latitude);
                firstStopLng = parseFloat(firstStop.longitude);
            } else if (trip.start_latitude && trip.start_longitude) {
                firstStopLat = parseFloat(trip.start_latitude);
                firstStopLng = parseFloat(trip.start_longitude);
            } else {
                // Si pas de coordonnées, on ne peut pas calculer la distance
                console.warn(`⚠️ Aucune coordonnée disponible pour le trajet ${trip.id}`);
                return null;
            }

            if (!schoolLat || !schoolLng || schoolLat === 0 || schoolLng === 0) {
                console.warn(`⚠️ Coordonnées de l'école invalides pour le trajet ${trip.id}`);
                return null;
            }

            // 1. Distance domicile → premier arrêt (via OSRM)
            const homeToStopRoute = await getRouteInfo(
                home_lat,
                home_lng,
                firstStopLat,
                firstStopLng
            );

            // 2. Distance premier arrêt → école (via OSRM)
            const stopToSchoolRoute = await getRouteInfo(
                firstStopLat,
                firstStopLng,
                schoolLat,
                schoolLng
            );

            // Fallback si OSRM échoue
            const distanceToFirstStop = homeToStopRoute
                ? homeToStopRoute.distance_km
                : calculateHaversineDistance(home_lat, home_lng, firstStopLat, firstStopLng);

            const durationToFirstStop = homeToStopRoute
                ? homeToStopRoute.duration_minutes
                : Math.round((distanceToFirstStop / 40) * 60); // 40 km/h par défaut

            const stopToSchoolDistance = stopToSchoolRoute
                ? stopToSchoolRoute.distance_km
                : parseFloat(trip.distance_km || 0);

            const stopToSchoolDuration = stopToSchoolRoute
                ? stopToSchoolRoute.duration_minutes
                : Math.round((stopToSchoolDistance / 40) * 60);

            // Totaux
            const totalDistance = distanceToFirstStop + stopToSchoolDistance;
            const totalDuration = durationToFirstStop + stopToSchoolDuration;
            const calculatedPrice = calculatePrice(totalDistance, trip.is_recurring);

            // Score d'optimisation
            const distanceScore = Math.max(0, 100 - (totalDistance / max_distance) * 100);
            const priceScore = Math.max(0, 100 - (calculatedPrice / max_price) * 100);
            const timeScore = Math.max(0, 100 - (totalDuration / max_duration) * 100);
            const ratingScore = (parseFloat(trip.driver_rating) / 5) * 100;

            const optimizationScore = (
                distanceScore * 0.35 +
                priceScore * 0.30 +
                timeScore * 0.25 +
                ratingScore * 0.10
            );

            return {
                ...trip,
                // Données de route calculées
                distance_from_home_km: distanceToFirstStop,
                duration_from_home_minutes: durationToFirstStop,
                stop_to_school_distance_km: stopToSchoolDistance,
                stop_to_school_duration_minutes: stopToSchoolDuration,
                total_distance_km: parseFloat(totalDistance.toFixed(2)),
                total_duration_minutes: totalDuration,
                calculated_price: calculatedPrice,
                optimization_score: parseFloat(optimizationScore.toFixed(2)),
                route_calculation_method: homeToStopRoute ? 'osrm' : 'haversine',

                // Données formatées
                driver_rating: parseFloat(trip.driver_rating).toFixed(1),
                total_reviews: parseInt(trip.total_reviews),
                available_seats: parseInt(trip.available_seats),
                booked_seats: parseInt(trip.booked_seats),

                // Détails
                driver: {
                    name: trip.driver_name,
                    phone: trip.driver_phone,
                    verification_status: trip.driver_verification_status,
                    rating: parseFloat(trip.driver_rating).toFixed(1),
                    total_reviews: parseInt(trip.total_reviews)
                },
                vehicle: {
                    brand: trip.vehicle_brand || null,
                    color: trip.vehicle_color || null,
                    plate: trip.vehicle_plate || null,
                    capacity: trip.capacity_max
                },
                school: {
                    name: trip.school_name,
                    address: trip.school_address,
                    latitude: schoolLat || null,
                    longitude: schoolLng || null
                },
                route: {
                    first_stop: firstStop,
                    start_point: trip.start_point,
                    end_point: trip.end_point
                }
            };
        });

        const optimizedTripsResults = await Promise.all(optimizedTripsPromises);

        // Filtrer les trajets null et appliquer les filtres
        const optimizedTrips = optimizedTripsResults
            .filter((trip: any) => trip !== null)
            .filter((trip: any) => {
                return trip.total_distance_km <= max_distance &&
                    trip.calculated_price <= max_price &&
                    trip.total_duration_minutes <= max_duration;
            })
            .sort((a: any, b: any) => {
                switch (sort_by) {
                    case "optimized":
                        return b.optimization_score - a.optimization_score;
                    case "price":
                        return a.calculated_price - b.calculated_price;
                    case "distance":
                        return a.total_distance_km - b.total_distance_km;
                    case "time":
                        return a.total_duration_minutes - b.total_duration_minutes;
                    case "rating":
                        return parseFloat(b.driver_rating) - parseFloat(a.driver_rating);
                    case "departure_time":
                        return new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime();
                    default:
                        return b.optimization_score - a.optimization_score;
                }
            });

        console.log(`✅ ${optimizedTrips.length} trajets après filtres et calcul distance`);

        // Pagination
        const total = optimizedTrips.length;
        const paginatedTrips = optimizedTrips.slice(offset, offset + limit);

        const response = NextResponse.json({
            success: true,
            data: paginatedTrips,
            pagination: {
                page,
                limit,
                total,
                total_pages: Math.ceil(total / limit)
            },
            filters_applied: {
                child_id,
                school_id,
                home_position: {
                    latitude: home_lat,
                    longitude: home_lng
                },
                date,
                departure_time_min,
                departure_time_max,
                min_rating,
                verified_only,
                available_seats_min,
                max_distance,
                max_price,
                max_duration,
                sort_by
            },
            summary: {
                trips_found: total,
                average_distance_km: total > 0
                    ? parseFloat((optimizedTrips.reduce((sum: number, t: any) => sum + t.total_distance_km, 0) / total).toFixed(2))
                    : 0,
                average_price_fcfa: total > 0
                    ? Math.round(optimizedTrips.reduce((sum: number, t: any) => sum + t.calculated_price, 0) / total)
                    : 0,
                average_duration_minutes: total > 0
                    ? Math.round(optimizedTrips.reduce((sum: number, t: any) => sum + t.total_duration_minutes, 0) / total)
                    : 0,
                routing_service: "OpenStreetMap OSRM"
            }
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur recherche trajets optimisés:", error);
        const errorResponse = NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
        return setCorsHeaders(errorResponse, origin);
    }
}
