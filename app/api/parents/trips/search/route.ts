/**
 * @swagger
 * /api/parents/trips/search:
 *   get:
 *     summary: Rechercher des trajets optimisés (domicile → école) Avec calcul de distance réelle via OpenStreetMap
 *     tags: [Parents]
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
                u.first_name as driver_first_name,
                u.last_name as driver_last_name,
                u.phone as driver_phone,
                b.registration_number as bus_number,
                b.model as bus_model,
                s.name as school_name,
                s.address as school_address,
                s.latitude as school_lat,
                s.longitude as school_lng,
                COALESCE(booked.count, 0) as booked_seats,
                (t.capacity_max - COALESCE(booked.count, 0)) as available_seats,
                COALESCE(AVG(e.rating), 0) as driver_rating,
                COUNT(DISTINCT e.id) as total_reviews,
                
                -- Premier arrêt du trajet
                (
                    SELECT json_build_object(
                        'stop_id', s2.id,
                        'stop_name', s2.name,
                        'latitude', s2.latitude,
                        'longitude', s2.longitude,
                        'address', s2.address,
                        'sequence', rs.sequence_order
                    )
                    FROM route_stops rs
                    INNER JOIN stops s2 ON rs.stop_id = s2.id
                    WHERE rs.route_id = t.route_id
                    ORDER BY rs.sequence_order ASC
                    LIMIT 1
                ) as first_stop,
                
                -- Tous les arrêts
                (
                    SELECT json_agg(
                        json_build_object(
                            'stop_id', s3.id,
                            'stop_name', s3.name,
                            'latitude', s3.latitude,
                            'longitude', s3.longitude,
                            'address', s3.address,
                            'sequence', rs2.sequence_order
                        ) ORDER BY rs2.sequence_order
                    )
                    FROM route_stops rs2
                    INNER JOIN stops s3 ON rs2.stop_id = s3.id
                    WHERE rs2.route_id = t.route_id
                ) as all_stops

            FROM trips t
            INNER JOIN drivers d ON t.driver_id = d.id
            INNER JOIN users u ON d.user_id = u.id
            LEFT JOIN buses b ON t.bus_id = b.id
            LEFT JOIN schools s ON t.school_id = s.id
            LEFT JOIN evaluations e ON d.id = e.driver_id
            LEFT JOIN (
                SELECT trip_id, COUNT(*) as count
                FROM trip_children
                GROUP BY trip_id
            ) booked ON t.id = booked.trip_id
            ${whereClause}
            GROUP BY t.id, d.id, d.status, u.id, b.id, s.id, booked.count, t.route_id
            HAVING (t.capacity_max - COALESCE(booked.count, 0)) >= ${available_seats_min}
        `;

        const tripsResult = await query(tripsQuery, params);

        console.log(`🔍 ${tripsResult.rows.length} trajets trouvés avant calcul de distance`);

        // Calculer les distances réelles avec OSRM pour chaque trajet
        const optimizedTripsPromises = tripsResult.rows.map(async (trip: any) => {
            const firstStop = trip.first_stop;
            const schoolLat = parseFloat(trip.school_lat);
            const schoolLng = parseFloat(trip.school_lng);

            if (!firstStop) {
                console.warn(`⚠️ Aucun arrêt trouvé pour le trajet ${trip.id}`);
                return null;
            }

            const firstStopLat = parseFloat(firstStop.latitude);
            const firstStopLng = parseFloat(firstStop.longitude);

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
                    first_name: trip.driver_first_name,
                    last_name: trip.driver_last_name,
                    phone: trip.driver_phone,
                    verification_status: trip.driver_verification_status,
                    rating: parseFloat(trip.driver_rating).toFixed(1),
                    total_reviews: parseInt(trip.total_reviews)
                },
                bus: {
                    registration: trip.bus_number,
                    model: trip.bus_model,
                    capacity: trip.capacity_max
                },
                school: {
                    name: trip.school_name,
                    address: trip.school_address,
                    latitude: schoolLat,
                    longitude: schoolLng
                },
                route: {
                    first_stop: firstStop,
                    all_stops: trip.all_stops || []
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
