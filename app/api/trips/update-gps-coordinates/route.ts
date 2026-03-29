/**
 * @swagger
 * /api/trips/update-gps-coordinates:
 *   post:
 *     summary: Mettre à jour les coordonnées GPS des trajets (admin)
 *     description: Geocode les adresses des trajets qui n'ont pas encore de coordonnées GPS et met à jour la base.
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mise à jour effectuée
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
/**
 * Endpoint pour mettre a jour les coordonnees GPS des trajets existants
 * POST /api/trips/update-gps-coordinates
 * 
 * Ce endpoint geocode les adresses des trajets qui n'ont pas encore de coordonnees GPS
 * et met a jour la base de donnees.
 */

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { setCorsHeaders, corsOptions } from '@/lib/cors';
import { authMiddleware } from "@/lib/auth";

// Configuration OSRM (OpenStreetMap Routing Machine)
const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

/**
 * Calcule la distance et le temps reel entre deux points via OSRM
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
            distance_km: parseFloat((route.distance / 1000).toFixed(2)), // metres -> km
            duration_minutes: Math.round(route.duration / 60) // secondes -> minutes
        };
    } catch (error) {
        console.error('Erreur appel OSRM:', error);
        return null;
    }
}

// Fonction de geocodage simplifiee et efficace (meme logique que route.ts)
async function geocodeAddress(address: string): Promise<[number, number] | null> {
    try {
        const searchQuery = address.trim();
        const searchLower = searchQuery.toLowerCase().trim();

        // Strategie 1: Detectar si c'est une ville connue du Senegal (coordonnees precises)
        const senegalCities: { [key: string]: [number, number] } = {
            // === DAKAR - QUARTIERS CENTRAUX ===
            'plateau': [14.6928, -17.4467],
            'médina': [14.6844, -17.4481],
            'medina': [14.6844, -17.4481],
            'gueule tapée': [14.6950, -17.4550],
            'fass': [14.7000, -17.4500],
            'colobane': [14.6950, -17.4550],
            'fann': [14.6900, -17.4650],
            'point e': [14.6900, -17.4600],
            'mermoz': [14.7100, -17.4700],
            'sacré-cœur': [14.7167, -17.4650],
            'sacre-coeur': [14.7167, -17.4650],
            'liberté': [14.7050, -17.4600],
            'liberte': [14.7050, -17.4600],

            // === DAKAR - OUEST ===
            'ouakam': [14.7263, -17.4886],
            'ngor': [14.7497, -17.5138],
            'yoff': [14.7450, -17.4900],
            'almadies': [14.7400, -17.5167],
            'les almadies': [14.7400, -17.5167],

            // === DAKAR - NORD ===
            'parcelles assainies': [14.7600, -17.4400],
            'parcelles': [14.7600, -17.4400],
            'grand-yoff': [14.7550, -17.4650],
            'grand yoff': [14.7550, -17.4650],
            'cambérène': [14.7800, -17.4200],
            'camberene': [14.7800, -17.4200],

            // === DAKAR - EST ===
            'grand-dakar': [14.7100, -17.4450],
            'grand dakar': [14.7100, -17.4450],
            'biscuiterie': [14.7150, -17.4350],
            'hann bel-air': [14.7300, -17.4200],
            'hann': [14.7400, -17.4100],
            'bel-air': [14.7350, -17.4200],
            'bel air': [14.7350, -17.4200],
            'thiaroye': [14.7833, -17.3667],
            'thiaroye sur mer': [14.7900, -17.3500],

            // === DAKAR - SUD ===
            'port': [14.6950, -17.4350],
            'hann maristes': [14.7250, -17.4150],

            // === PIKINE (Département) ===
            'pikine': [14.7500, -17.4000],
            'pikine ancien': [14.7550, -17.4050],
            'pikine dagoudane': [14.7450, -17.3900],
            'pikine icotaf': [14.7500, -17.3950],
            'guinaw rails': [14.7700, -17.3950],
            'guinaw-rails': [14.7700, -17.3950],
            'diamaguene': [14.7650, -17.3850],
            'diamaguène': [14.7650, -17.3850],
            'tally boubess': [14.7800, -17.3900],
            'tally bmb': [14.7850, -17.3850],

            // === GUÉDIAWAYE (Département) ===
            'guediawaye': [14.7833, -17.3833],
            'guédiawaye': [14.7833, -17.3833],
            'sam notaire': [14.7900, -17.3800],
            'golf sud': [14.7950, -17.3750],
            'médina gounass': [14.7800, -17.3700],
            'medina gounass': [14.7800, -17.3700],
            'wakhinane nimzat': [14.8000, -17.3650],

            // === RUFISQUE (Département) ===
            'rufisque': [14.7167, -17.2667],
            'bargny': [14.7000, -17.2167],
            'diamniadio': [14.7300, -17.1900],
            'sendou': [14.6833, -17.1833],
            'bambilor': [14.7500, -17.2500],
            'sébikhotane': [14.7667, -17.1333],
            'sebikhotane': [14.7667, -17.1333],

            // === RÉGION DE THIÈS ===
            'thiès': [14.7894, -16.9260],
            'thies': [14.7894, -16.9260],
            'mbour': [14.4167, -16.9667],
            'tivaouane': [14.9500, -16.8167],
            'mboro': [15.3500, -16.6667],
            'khombole': [14.7667, -16.7167],
            'pout': [14.7667, -17.0667],
            'joal-fadiouth': [14.1667, -16.8333],
            'joal': [14.1667, -16.8333],
            'fadiouth': [14.1500, -16.8300],
            'kayar': [15.0833, -17.1167],
            'mékhé': [15.1167, -16.6167],
            'mekhe': [15.1167, -16.6167],
            'mont-rolland': [14.8667, -16.9667],
            'mont rolland': [14.8667, -16.9667],
            'popenguine': [14.5500, -17.1167],
            'saly': [14.4500, -16.9167],
            'saly portudal': [14.4500, -16.9167],
            'somone': [14.4667, -17.0833],

            // === RÉGION DE DIOURBEL ===
            'diourbel': [14.6550, -16.2314],
            'touba': [14.8500, -15.8833],
            'mbacké': [14.7833, -15.9167],
            'mbacke': [14.7833, -15.9167],
            'bambey': [14.7000, -16.4500],

            // === RÉGION DE KAOLACK ===
            'kaolack': [14.1514, -16.0733],
            'nioro du rip': [13.7500, -15.7833],
            'gossas': [14.5000, -16.2833],
            'guinguinéo': [14.2667, -15.9500],
            'guinguineo': [14.2667, -15.9500],
            'kahone': [14.1833, -15.9333],
            'ndoffane': [13.9000, -16.1500],
            'foundiougne': [14.1333, -16.4667],

            // === RÉGION DE FATICK ===
            'fatick': [14.3333, -16.4167],
            'sokone': [13.8833, -16.3667],
            'toubacouta': [13.8833, -16.4833],
            'ndangane': [14.1500, -16.6833],
            'passi': [14.1000, -16.6000],
            'palmarin': [14.0333, -16.7667],

            // === RÉGION DE LOUGA ===
            'louga': [15.6167, -16.2167],
            'linguère': [15.3833, -15.1167],
            'linguere': [15.3833, -15.1167],
            'kébémer': [15.3667, -16.4500],
            'kebemer': [15.3667, -16.4500],
            'dahra': [15.3333, -15.4833],

            // === RÉGION DE SAINT-LOUIS ===
            'saint-louis': [16.0333, -16.5000],
            'saint louis': [16.0333, -16.5000],
            'dagana': [16.5167, -15.5000],
            'richard-toll': [16.4667, -15.7000],
            'richard toll': [16.4667, -15.7000],
            'ross-béthio': [16.3000, -15.8000],
            'ross bethio': [16.3000, -15.8000],
            'podor': [16.6500, -14.9667],

            // === RÉGION DE MATAM ===
            'matam': [15.6500, -13.2500],
            'kanel': [15.5333, -13.1833],
            'ranérou': [15.3000, -13.9667],
            'ranerou': [15.3000, -13.9667],
            'ourossogui': [15.6167, -13.3500],

            // === RÉGION DE TAMBACOUNDA ===
            'tambacounda': [13.7667, -13.6667],
            'bakel': [14.9000, -10.9833],
            'goudiry': [14.1833, -12.7167],
            'koumpentoum': [13.9833, -14.5667],
            'kidira': [14.4500, -12.2167],

            // === RÉGION DE KÉDOUGOU ===
            'kédougou': [12.5556, -12.1750],
            'kedougou': [12.5556, -12.1750],
            'saraya': [12.8167, -11.7333],
            'salémata': [12.6500, -12.6667],
            'salemata': [12.6500, -12.6667],
            'bandafassi': [12.5333, -12.2333],

            // === RÉGION DE KOLDA ===
            'kolda': [12.8833, -14.9500],
            'vélingara': [13.1500, -14.1167],
            'velingara': [13.1500, -14.1167],
            'médina yoro foulah': [12.8167, -13.8167],
            'medina yoro foulah': [12.8167, -13.8167],

            // === RÉGION DE SÉDHIOU ===
            'sédhiou': [12.7000, -15.5500],
            'sedhiou': [12.7000, -15.5500],
            'goudomp': [12.5667, -15.8667],
            'bounkiling': [12.9000, -15.3667],

            // === RÉGION DE ZIGUINCHOR ===
            'ziguinchor': [12.5833, -16.2833],
            'oussouye': [12.4833, -16.5500],
            'bignona': [12.8167, -16.2333],
            'diouloulou': [12.7833, -16.6167],
            'cap skirring': [12.3833, -16.7500],
            'cap-skirring': [12.3833, -16.7500],

            // === RÉGION DE KAFFRINE ===
            'kaffrine': [14.1167, -15.5500],
            'kafrine': [14.1167, -15.5500],
            'koungheul': [13.9833, -14.8000],
            'malem-hodar': [13.7833, -15.3833],
            'malem hodar': [13.7833, -15.3833],
            'birkelane': [14.2500, -15.5500],

            // === AUTRES LOCALITÉS IMPORTANTES ===
            'sindia': [14.6333, -16.9167],
            'nguékhokh': [14.5167, -17.0000],
            'nguekhokh': [14.5167, -17.0000],
            'sessène': [14.9167, -16.9500],
            'sessene': [14.9167, -16.9500],
            'sangalkam': [14.7833, -17.2333],
            'bayakh': [14.9333, -16.9333],
            'pire': [15.9167, -16.4333],

            // === ÎLES ===
            'île de gorée': [14.6667, -17.3983],
            'ile de goree': [14.6667, -17.3983],
            'gorée': [14.6667, -17.3983],
            'goree': [14.6667, -17.3983],
            'île de ngor': [14.7500, -17.5167],
            'ile de ngor': [14.7500, -17.5167],
            'îles de la madeleine': [14.7333, -17.5000],
            'iles de la madeleine': [14.7333, -17.5000],
        };

        // Verifier si c'est une ville connue
        for (const [city, coords] of Object.entries(senegalCities)) {
            if (searchLower.includes(city)) {
                console.log(`Ville connue detectee: ${city}, utilisation des coordonnees directes:`, coords);
                return coords;
            }
        }

        // Strategie 2: Geocodage via API Nominatim (approche simplifiee)
        const fullQuery = searchQuery.includes('Senegal') || searchQuery.includes('Senegal')
            ? searchQuery
            : `${searchQuery}, Senegal`;

        console.log(`Geocodage via API pour: "${fullQuery}"`);

        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullQuery)}&format=json&limit=5&countrycodes=sn`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'TransportApp/1.0',
                'Accept-Language': 'fr-FR,fr;q=0.9'
            }
        });

        if (!response.ok) {
            console.error(`Erreur HTTP ${response.status} pour ${address}`);
            return null;
        }

        const data = await response.json();

        if (data.length === 0) {
            // Strategie 3: Reessayer sans restriction de pays
            console.log(`Aucun resultat avec restriction Senegal, reessai sans restriction...`);
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
                        console.log(`Coordonnees trouvees (sans restriction) pour "${address}":`, { lat, lon });
                        return [lat, lon];
                    }
                }
            }

            console.error(`Adresse non trouvee: ${address}`);
            return null;
        }

        // Choisir le meilleur resultat (priorite aux resultats avec importance elevee)
        const sortedResults = data.sort((a: any, b: any) => (b.importance || 0) - (a.importance || 0));
        const bestResult = sortedResults[0];

        const lat = parseFloat(bestResult.lat);
        const lon = parseFloat(bestResult.lon);

        if (isNaN(lat) || isNaN(lon)) {
            console.error(`Coordonnees invalides pour ${address}`);
            return null;
        }

        console.log(`Coordonnees trouvees pour "${address}":`, { lat, lon, display_name: bestResult.display_name });
        return [lat, lon];
    } catch (error) {
        console.error(`Erreur geocodage pour ${address}:`, error);
        return null;
    }
}

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        // Verifier que l'utilisateur est admin
        const user = authMiddleware(req);
        if (user.role !== "admin") {
            const response = NextResponse.json({ error: "Acces refuse" }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        // Recuperer tous les trajets sans coordonnees GPS
        const tripsResult = await query(
            `SELECT id, start_point, end_point 
             FROM trips 
             WHERE start_latitude IS NULL 
                OR start_longitude IS NULL 
                OR end_latitude IS NULL 
                OR end_longitude IS NULL
             ORDER BY id`
        );

        const trips = tripsResult.rows;
        console.log(`${trips.length} trajets a mettre a jour`);

        const results = {
            total: trips.length,
            updated: 0,
            failed: 0,
            errors: [] as string[]
        };

        // Mettre a jour chaque trajet
        for (const trip of trips) {
            try {
                console.log(`Geocodage du trajet ${trip.id}: ${trip.start_point} -> ${trip.end_point}`);

                const startCoords = await geocodeAddress(trip.start_point);
                const endCoords = await geocodeAddress(trip.end_point);

                if (startCoords && endCoords) {
                    // Recalculer la distance avec les bonnes coordonnees
                    const routeInfo = await getRouteInfo(
                        startCoords[0],
                        startCoords[1],
                        endCoords[0],
                        endCoords[1]
                    );

                    let distance_km = null;
                    let price = null;

                    if (routeInfo) {
                        distance_km = routeInfo.distance_km;
                        // Calculer le prix (500 FCFA/km, 20% reduction si recurrent)
                        const tripData = await query('SELECT is_recurring FROM trips WHERE id = $1', [trip.id]);
                        const isRecurring = tripData.rows[0]?.is_recurring || false;
                        const basePrice = distance_km * 500;
                        price = isRecurring ? Math.round(basePrice * 0.8) : Math.round(basePrice);
                        console.log(`Distance recalculée pour trajet ${trip.id}: ${distance_km} km, prix: ${price} FCFA`);
                    } else {
                        console.warn(`Impossible de calculer la distance pour le trajet ${trip.id}`);
                    }

                    if (distance_km !== null) {
                        await query(
                            `UPDATE trips 
                             SET start_latitude = $1, start_longitude = $2, 
                                 end_latitude = $3, end_longitude = $4,
                                 distance_km = $5, price = $6
                             WHERE id = $7`,
                            [startCoords[0], startCoords[1], endCoords[0], endCoords[1],
                                distance_km, price, trip.id]
                        );
                    } else {
                        await query(
                            `UPDATE trips 
                             SET start_latitude = $1, start_longitude = $2, 
                                 end_latitude = $3, end_longitude = $4
                             WHERE id = $5`,
                            [startCoords[0], startCoords[1], endCoords[0], endCoords[1], trip.id]
                        );
                    }
                    results.updated++;
                    console.log(`Trajet ${trip.id} mis a jour avec coordonnees GPS${distance_km ? ' et distance recalculee' : ''}`);
                } else {
                    results.failed++;
                    const errorMsg = `Trajet ${trip.id}: geocodage echoue`;
                    results.errors.push(errorMsg);
                    console.warn(`${errorMsg}`);
                }

                // Attendre un peu entre les requetes pour eviter de surcharger l'API Nominatim
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error: any) {
                results.failed++;
                const errorMsg = `Trajet ${trip.id}: ${error.message}`;
                results.errors.push(errorMsg);
                console.error(`${errorMsg}`);
            }
        }

        const response = NextResponse.json({
            success: true,
            message: `Mise a jour terminee: ${results.updated} trajets mis a jour, ${results.failed} echecs`,
            ...results
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur mise a jour GPS:", error);
        const response = NextResponse.json(
            { error: error.message || "Erreur lors de la mise a jour" },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}
