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


import { NextResponse } from "next/server";
import { query } from "@/lib/db";


export async function GET() {
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
        console.log(`[GET /api/trips] ${res.rows.length} trajets trouvés`);
        if (res.rows.length > 0) {
            console.log('Premier trajet:', JSON.stringify(res.rows[0], null, 2));
        }

        return NextResponse.json(res.rows);
    } catch (error) {
        console.error('Erreur dans GET /api/trips:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des trajets' },
            { status: 500 }
        );
    }
}



//   Clé Google Maps (mettre dans .env)
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// ----------------------------
// Fonction utilitaire : calcul distance Google Maps
async function calculateDistance(start: string, end: string): Promise<number> {
    const origin = encodeURIComponent(start);
    const destination = encodeURIComponent(end);
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${GOOGLE_MAPS_API_KEY}&units=metric`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK") throw new Error("Google Maps API Error");

    const element = data.rows[0].elements[0];
    if (element.status !== "OK") throw new Error("Adresse invalide");

    return element.distance.value / 1000; // en km
}


/**
 * Fonction pour géocoder une adresse avec Nominatim (OpenStreetMap)
 */
async function geocode(address: string) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data[0]) throw new Error("Adresse introuvable: " + address);
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

/**
 * Fonction pour calculer distance et durée via OSRM
 */
async function getDistanceOSRM(start: { lat: number; lon: number }, end: { lat: number; lon: number }) {
    const url = `http://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=false`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code !== "Ok") throw new Error("OSRM Error: " + data.message);
    const distanceMeters = data.routes[0].distance;
    const durationSeconds = data.routes[0].duration;
    return { distanceMeters, durationSeconds };
}

/**
 * Fonction pour calculer le prix d'un trajet
 * @param distance en mètres
 * @param isRecurring boolean
 */
function calculatePrice(distanceMeters: number, isRecurring: boolean) {
    const distanceKm = distanceMeters / 1000;
    const baseRate = 500; // 500 FCFA par km par exemple
    let price = distanceKm * baseRate;
    if (isRecurring) price *= 0.9; // réduction pour trajets récurrents
    return Math.round(price); // arrondi FCFA
}

export async function POST(req: Request) {
    try {
        const {
            driver_id,
            school_id,
            start_point,
            end_point,
            departure_time,
            capacity_max,
            is_recurring
        } = await req.json();

        // Validation des champs obligatoires
        if (!start_point || !end_point || !departure_time || !capacity_max) {
            return NextResponse.json({
                error: "Champs obligatoires manquants",
                message: "start_point, end_point, departure_time et capacity_max sont requis"
            }, { status: 400 });
        }

        // 1️⃣ Géocodage des adresses
        let startCoords, endCoords;
        try {
            startCoords = await geocode(start_point);
            endCoords = await geocode(end_point);
        } catch (geoError: any) {
            console.error("Erreur géocodage:", geoError);
            return NextResponse.json({
                error: "Erreur lors du géocodage des adresses",
                message: geoError?.message || "Impossible de localiser les adresses"
            }, { status: 400 });
        }

        // 2️⃣ Calcul distance et durée
        let distanceMeters, durationSeconds;
        try {
            const result = await getDistanceOSRM(startCoords, endCoords);
            distanceMeters = result.distanceMeters;
            durationSeconds = result.durationSeconds;
        } catch (osrmError: any) {
            console.error("Erreur calcul distance OSRM:", osrmError);
            // En cas d'erreur OSRM, utiliser une distance par défaut (0) ou estimée
            distanceMeters = 0;
            durationSeconds = 0;
            console.warn("Utilisation de distance par défaut (0 km)");
        }

        // 3️⃣ Calcul du prix
        const price = calculatePrice(distanceMeters, is_recurring || false);

        // 4️⃣ Extraire uniquement la date pour vérification vacances/jours fériés
        const tripDate = new Date(departure_time).toISOString().split("T")[0];

        // 5️⃣ Vérifier vacances scolaires (seulement si school_id est fourni)
        if (school_id) {
            try {
                const vacation = await query(
                    `SELECT 1 FROM school_vacations WHERE school_id = $1 AND $2::date BETWEEN start_date AND end_date LIMIT 1`,
                    [school_id, tripDate]
                );
                if (Number(vacation.rowCount) > 0) {
                    return NextResponse.json({ error: "Impossible de créer un trajet pendant les vacances scolaires", type: "HOLIDAY" }, { status: 400 });
                }
            } catch (vacError: any) {
                console.warn("Erreur vérification vacances:", vacError);
                // Continue même en cas d'erreur
            }
        }

        // 6️⃣ Vérifier jour férié
        try {
            const holiday = await query(`SELECT 1 FROM public_holidays WHERE date = $1::date LIMIT 1`, [tripDate]);
            if (Number(holiday.rowCount) > 0) {
                return NextResponse.json({ error: "Impossible de créer un trajet un jour férié", type: "FERIE" }, { status: 400 });
            }
        } catch (holError: any) {
            console.warn("Erreur vérification jour férié:", holError);
            // Continue même en cas d'erreur
        }

        // 7️⃣ Création du trajet
        // Convertir distanceMeters (mètres) en distance_km (kilomètres)
        const distanceKm = distanceMeters > 0 ? distanceMeters / 1000 : null;

        // Validation capacity_max
        const capacityMax = Number(capacity_max);
        if (isNaN(capacityMax) || capacityMax <= 0) {
            return NextResponse.json({
                error: "capacity_max doit être un nombre positif"
            }, { status: 400 });
        }

        const resTrip = await query(
            `INSERT INTO trips
             (driver_id, school_id, start_point, end_point, departure_time, capacity_max, is_recurring, distance_km, price)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 RETURNING *`,
            [
                driver_id || null,
                school_id || null,
                start_point,
                end_point,
                departure_time,
                capacityMax,
                Boolean(is_recurring),
                distanceKm,
                price || null
            ]
        );

        return NextResponse.json(resTrip.rows[0], { status: 201 });

    } catch (error: any) {
        console.error("Erreur création trip :", error);
        console.error("Stack:", error?.stack);
        console.error("Détails:", {
            message: error?.message,
            code: error?.code,
            detail: error?.detail
        });
        return NextResponse.json({
            message: "Erreur lors de la création du trajet",
            error: error?.message || "Erreur inconnue",
            details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
        }, { status: 500 });
    }
}




