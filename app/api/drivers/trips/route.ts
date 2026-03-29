import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { setCorsHeaders, corsOptions } from '@/lib/cors';
/**
 * @swagger
 * /api/drivers/trips:
 *   get:
 *     summary: Récupérer la liste des trajets du chauffeur connecté
 *     description: >
 *       Récupère tous les trajets du chauffeur authentifié avec possibilité de filtrage :
 *       - Par statut (pending, completed, canceled)
 *       - Par date (date_from, date_to)
 *       - Avec pagination (page, limit)
 *     tags: [CHAUFFEUR]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, canceled]
 *         description: Filtrer par statut du trajet
 *       - in: query
 *         name: date_from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de début pour filtrer les trajets
 *         example: "2024-01-01T00:00:00Z"
 *       - in: query
 *         name: date_to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de fin pour filtrer les trajets
 *         example: "2024-12-31T23:59:59Z"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page pour la pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nombre d'éléments par page
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
 *                         example: 1
 *                       driver_id:
 *                         type: integer
 *                         example: 1
 *                       school_id:
 *                         type: integer
 *                         nullable: true
 *                       school_name:
 *                         type: string
 *                         nullable: true
 *                         description: Nom de l'école associée au trajet
 *                         example: "École ABC"
 *                       school_address:
 *                         type: string
 *                         nullable: true
 *                         description: Adresse de l'école
 *                         example: "Almadies, Dakar"
 *                       start_point:
 *                         type: string
 *                         example: "Dakar, Plateau"
 *                       end_point:
 *                         type: string
 *                         example: "École ABC, Almadies"
 *                       departure_time:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-25T08:00:00Z"
 *                       return_departure_time:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         description: Heure de départ du retour (pour trajets aller-retour)
 *                         example: "2024-12-25T16:00:00Z"
 *                       trip_type:
 *                         type: string
 *                         enum: [aller, retour, aller_retour]
 *                         description: Type de trajet
 *                         example: "aller_retour"
 *                       capacity_max:
 *                         type: integer
 *                         example: 4
 *                       status:
 *                         type: string
 *                         enum: [pending, completed, canceled]
 *                         example: "pending"
 *                       is_recurring:
 *                         type: boolean
 *                         example: false
 *                       passengers:
 *                         type: array
 *                         description: Liste des passagers (enfants) associés au trajet
 *                         items:
 *                           type: object
 *                           properties:
 *                             child_id:
 *                               type: integer
 *                               example: 1
 *                             child_name:
 *                               type: string
 *                               example: "Amadou Diallo"
 *                             child_address:
 *                               type: string
 *                               example: "Dakar, Plateau"
 *                             parent_id:
 *                               type: integer
 *                               example: 5
 *                             parent_name:
 *                               type: string
 *                               example: "Mariama Diallo"
 *                             parent_phone:
 *                               type: string
 *                               example: "+221776665555"
 *                             parent_email:
 *                               type: string
 *                               example: "parent@example.com"
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Chauffeur introuvable
 *       500:
 *         description: Erreur serveur
 *   post:
 *     summary: Créer un nouveau trajet
 *     description: >
 *       Crée un nouveau trajet pour le chauffeur authentifié.
 *       Le chauffeur doit être approuvé pour créer un trajet.
 *       La capacité du trajet ne peut pas dépasser celle du véhicule.
 *     tags: [CHAUFFEUR]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - start_point
 *               - end_point
 *               - capacity_max
 *             optional:
 *               - departure_time (requis pour "aller" ou "aller_retour")
 *               - return_departure_time (requis pour "retour" seul ou "aller_retour")
 *             properties:
 *               start_point:
 *                 type: string
 *                 description: Point de départ du trajet
 *                 example: "Dakar, Plateau"
 *               end_point:
 *                 type: string
 *                 description: Point d'arrivée du trajet
 *                 example: "École ABC, Almadies"
 *               departure_time:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: |
 *                   Date et heure de départ.
 *                   - Pour trajet "aller" : requis
 *                   - Pour trajet "aller_retour" : requis (heure de départ aller)
 *                   - Pour trajet "retour" : optionnel (utiliser return_departure_time à la place)
 *                   Doit être dans le futur.
 *                 example: "2024-12-25T08:00:00Z"
 *               return_departure_time:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: |
 *                   Date et heure de départ du retour.
 *                   - Pour un trajet **aller-retour** : requis (avec departure_time), doit être le même jour et après departure_time
 *                   - Pour un trajet **retour** seul : requis (sans departure_time), sera utilisé comme heure de départ
 *                   - Pour un trajet **aller** : optionnel (non utilisé)
 *                 example: "2024-12-25T16:00:00Z"
 *               trip_type:
 *                 type: string
 *                 enum: [aller, retour, aller_retour]
 *                 nullable: true
 *                 description: |
 *                   Type de trajet. Si non fourni, sera **auto-détecté** automatiquement :
 *                   - Si **seulement departure_time** → 'aller'
 *                   - Si **departure_time + return_departure_time** → 'aller_retour'
 *                   - Si **seulement return_departure_time** → 'retour'
 *                   Les parents peuvent réserver séparément des trajets "aller" et "retour".
 *                 example: "aller_retour"
 *               capacity_max:
 *                 type: integer
 *                 description: Capacité maximale du trajet (ne peut pas dépasser celle du véhicule)
 *                 example: 4
 *               school_id:
 *                 type: integer
 *                 nullable: true
 *                 description: ID de l'école principale (optionnel, pour compatibilité. Utiliser 'stops' pour plusieurs arrêts)
 *                 example: 1
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
 *                       example: 1
 *                     stop_order:
 *                       type: integer
 *                       description: Ordre de l'arrêt (1 = premier, 2 = deuxième, etc.). Si non fourni, sera déterminé automatiquement
 *                       example: 1
 *                     estimated_arrival_time:
 *                       type: string
 *                       format: time
 *                       nullable: true
 *                       description: Heure d'arrivée estimée à cet arrêt (format HH:MM)
 *                       example: "07:30"
 *                 example:
 *                   - school_id: 1
 *                     stop_order: 1
 *                     estimated_arrival_time: "07:30"
 *                   - school_id: 2
 *                     stop_order: 2
 *                     estimated_arrival_time: "08:00"
 *               is_recurring:
 *                 type: boolean
 *                 description: Indique si le trajet est récurrent
 *                 default: false
 *                 example: false
 *           examples:
 *             single_stop:
 *               summary: Trajet avec un seul arrêt
 *               value:
 *                 start_point: "Dakar, Plateau"
 *                 end_point: "École ABC, Almadies"
 *                 departure_time: "2024-12-25T08:00:00Z"
 *                 capacity_max: 4
 *                 school_id: 1
 *                 trip_type: "aller"
 *                 is_recurring: false
 *             multiple_stops:
 *               summary: Trajet avec plusieurs arrêts
 *               value:
 *                 start_point: "Dakar, Plateau"
 *                 end_point: "Ouakam"
 *                 departure_time: "2024-12-25T08:00:00Z"
 *                 capacity_max: 5
 *                 trip_type: "aller"
 *                 stops:
 *                   - school_id: 1
 *                     stop_order: 1
 *                     estimated_arrival_time: "07:30"
 *                   - school_id: 2
 *                     stop_order: 2
 *                     estimated_arrival_time: "08:00"
 *                 is_recurring: false
 *             round_trip:
 *               summary: Trajet aller-retour avec arrêts
 *               value:
 *                 start_point: "Dakar, Plateau"
 *                 end_point: "Ouakam"
 *                 departure_time: "2024-12-25T08:00:00Z"
 *                 return_departure_time: "2024-12-25T16:00:00Z"
 *                 capacity_max: 5
 *                 trip_type: "aller_retour"
 *                 stops:
 *                   - school_id: 1
 *                     stop_order: 1
 *                     estimated_arrival_time: "07:30"
 *                   - school_id: 2
 *                     stop_order: 2
 *                     estimated_arrival_time: "08:00"
 *                 is_recurring: false
 *     responses:
 *       201:
 *         description: Trajet créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     driver_id:
 *                       type: integer
 *                       example: 1
 *                     start_point:
 *                       type: string
 *                       example: "Dakar, Plateau"
 *                     end_point:
 *                       type: string
 *                       example: "École ABC, Almadies"
 *                     departure_time:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-25T08:00:00Z"
 *                     return_departure_time:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: "2024-12-25T16:00:00Z"
 *                     capacity_max:
 *                       type: integer
 *                       example: 4
 *                     status:
 *                       type: string
 *                       example: "pending"
 *                     trip_type:
 *                       type: string
 *                       enum: [aller, retour, aller_retour]
 *                       example: "aller_retour"
 *                     school_id:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *                     stops:
 *                       type: array
 *                       description: Liste des arrêts (écoles) du trajet
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           school_id:
 *                             type: integer
 *                             example: 1
 *                           school_name:
 *                             type: string
 *                             example: "École ABC"
 *                           stop_order:
 *                             type: integer
 *                             example: 1
 *                           estimated_arrival_time:
 *                             type: string
 *                             format: time
 *                             nullable: true
 *                             example: "07:30"
 *                       example:
 *                         - id: 1
 *                           school_id: 1
 *                           school_name: "École ABC"
 *                           stop_order: 1
 *                           estimated_arrival_time: "07:30"
 *                         - id: 2
 *                           school_id: 2
 *                           school_name: "École XYZ"
 *                           stop_order: 2
 *                           estimated_arrival_time: "08:00"
 *                     is_recurring:
 *                       type: boolean
 *                       example: false
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-25T08:00:00Z"
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                     missing_fields:
 *                       value: "Champs obligatoires manquants"
 *                     invalid_capacity:
 *                       value: "La capacité doit être un nombre positif"
 *                     capacity_exceeded:
 *                       value: "La capacité du trajet (5) dépasse celle de votre véhicule (4)"
 *                     past_date:
 *                       value: "Impossible de créer un trajet dans le passé"
 *                     invalid_return_time:
 *                       value: "L'heure de retour doit être après l'heure de départ"
 *                     different_days:
 *                       value: "L'heure de retour doit être le même jour que l'heure de départ"
 *                     invalid_departure_time_aller:
 *                       value: "Pour un trajet aller, le départ doit être au moins 30 minutes avant l'heure d'ouverture de l'école (08:00). Heure de départ maximale recommandée : 7:30"
 *                     invalid_departure_time_retour:
 *                       value: "Pour un trajet retour, le départ doit être après l'heure de fermeture de l'école (18:00). Heure de départ minimale : 18:00"
 *                     school_closed:
 *                       value: "L'école est fermée le Lundi. Veuillez choisir un autre jour."
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Compte en attente d'approbation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Votre compte chauffeur est en attente d'approbation"
 *       404:
 *         description: Chauffeur introuvable
 *       500:
 *         description: Erreur serveur
 */
export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'driver') {
            const response = NextResponse.json({ error: "Non autorisé" }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        // Récupérer le driver_id depuis la table drivers
        const driverResult = await query(
            `SELECT id FROM drivers WHERE user_id = $1`,
            [user.id]
        );

        if (driverResult.rowCount === 0) {
            const response = NextResponse.json({ error: "Chauffeur introuvable" }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        const driverId = driverResult.rows[0].id;

        //  Récupérer les query params
        const { searchParams } = new URL(request.url);

        const status = searchParams.get("status");
        const date_from = searchParams.get("date_from");
        const date_to = searchParams.get("date_to");
        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 20);
        const offset = (page - 1) * limit;

        let whereClause = "WHERE t.driver_id = $1";
        const params: any[] = [driverId];
        let paramIndex = 2;

        if (status) {
            // Utiliser le statut global pour les trajets aller-retour
            whereClause += ` AND (
                CASE 
                    WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
                        get_trip_overall_status(t.status, t.return_status, t.trip_type) = $${paramIndex}
                    ELSE
                        t.status = $${paramIndex}
                END
            )`;
            params.push(status);
            paramIndex++;
        }

        if (date_from) {
            whereClause += ` AND t.departure_time >= $${paramIndex++}`;
            params.push(date_from);
        }

        if (date_to) {
            whereClause += ` AND t.departure_time <= $${paramIndex++}`;
            params.push(date_to);
        }

        const trips = await query(
            `
      SELECT 
        t.*,
        s.name as school_name,
        s.address as school_address,
        -- Calculer le statut global
        CASE 
            WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
                get_trip_overall_status(t.status, t.return_status, t.trip_type)
            ELSE
                t.status
        END as overall_status,
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
                        'estimated_arrival_time', ts.estimated_arrival_time
                    ) ORDER BY ts.stop_order
                ),
                '[]'::json
            )
            FROM trip_stops ts
            LEFT JOIN schools s2 ON ts.school_id = s2.id
            WHERE ts.trip_id = t.id
        ) as stops,
        COALESCE(
          json_agg(
            json_build_object(
              'child_id', c.id,
              'child_name', c.name,
              'child_address', c.address,
              'parent_id', u_parent.id,
              'parent_name', u_parent.name,
              'parent_phone', u_parent.phone,
              'parent_email', u_parent.email
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'::json
        ) as passengers
      FROM trips t
      LEFT JOIN schools s ON t.school_id = s.id
      LEFT JOIN trip_children tc ON t.id = tc.trip_id
      LEFT JOIN children c ON tc.child_id = c.id
      LEFT JOIN users u_parent ON c.parent_id = u_parent.id
      ${whereClause}
      GROUP BY t.id, s.id, s.name, s.address
      ORDER BY t.departure_time DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `,
            [...params, limit, offset]
        );

        // Formater les résultats pour remplacer status par overall_status
        const formattedTrips = trips.rows.map((trip: any) => {
            const { overall_status, ...rest } = trip;
            return {
                ...rest,
                status: overall_status, // Remplacer status par overall_status
                stops: trip.stops || [], // Inclure les arrêts
                // Garder aussi les statuts individuels pour référence
                status_aller: trip.status,
                status_retour: trip.return_status || null
            };
        });

        const response = NextResponse.json({
            success: true,
            data: formattedTrips,
        });
        return setCorsHeaders(response, origin);
    } catch (error: any) {
        const errorResponse = NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'driver') {
            const response = NextResponse.json({ error: "Non autorisé" }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        // Récupérer le driver_id depuis la table drivers
        const driverResult = await query(
            `SELECT id, status, capacity FROM drivers WHERE user_id = $1`,
            [user.id]
        );

        if (driverResult.rowCount === 0) {
            const response = NextResponse.json({ error: "Chauffeur introuvable" }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        const driver = driverResult.rows[0];
        if (driver.status !== 'Approuvé') {
            const response = NextResponse.json(
                { error: "Votre compte chauffeur est en attente d'approbation" },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const driverId = driver.id;

        const body = await request.json();
        const { start_point, end_point, departure_time, arrival_time, return_departure_time, return_arrival_time, capacity_max, school_id, is_recurring, trip_type, stops } = body;
        
        // stops est un tableau d'arrêts (écoles) : [{ school_id: 1, stop_order: 1, estimated_arrival_time: "07:30" }, ...]
        // Si stops n'est pas fourni mais school_id l'est, on crée un arrêt par défaut

        // Validation des champs obligatoires selon le type de trajet
        // Pour un trajet "retour", on peut utiliser return_departure_time comme departure_time
        let actualDepartureTime = departure_time;
        let actualReturnTime = return_departure_time;
        let isReturnOnly = false;

        // Si trip_type est fourni explicitement, l'utiliser
        let finalTripType: string;
        if (trip_type && ['aller', 'retour', 'aller_retour'].includes(trip_type)) {
            finalTripType = trip_type;
            
            // Pour un trajet "retour", on peut utiliser return_departure_time comme departure_time
            if (finalTripType === 'retour' && return_departure_time && !departure_time) {
                actualDepartureTime = return_departure_time;
                actualReturnTime = null;
                isReturnOnly = true;
            }
        } else {
            // Auto-détection intelligente selon les paramètres fournis
            if (departure_time && return_departure_time) {
                // Les deux horaires fournis → aller-retour
                finalTripType = 'aller_retour';
            } else if (return_departure_time && !departure_time) {
                // Seulement return_departure_time fourni → retour
                finalTripType = 'retour';
                actualDepartureTime = return_departure_time;
                actualReturnTime = null;
                isReturnOnly = true;
            } else if (departure_time && !return_departure_time) {
                // Seulement departure_time fourni → aller
                finalTripType = 'aller';
            } else {
                // Aucun horaire fourni → erreur
                const response = NextResponse.json(
                    { success: false, message: "Au moins un horaire de départ (departure_time ou return_departure_time) est requis" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }
        }

        // Validation des champs obligatoires
        if (!start_point || !end_point || !actualDepartureTime || !capacity_max) {
            const response = NextResponse.json(
                { success: false, message: "Champs obligatoires manquants" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Pour un trajet "retour", on utilise departure_time comme heure de départ du retour
        // return_departure_time n'est pas utilisé pour ce type de trajet

        // Vérifier que return_departure_time est après departure_time et le même jour
        // (uniquement pour les trajets aller-retour)
        if (actualReturnTime && finalTripType === 'aller_retour') {
            const departureDate = new Date(actualDepartureTime);
            const returnDate = new Date(actualReturnTime);

            // Vérifier que return_departure_time est après departure_time
            if (returnDate <= departureDate) {
                const response = NextResponse.json(
                    { success: false, message: "L'heure de retour doit être après l'heure de départ" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            // Vérifier que c'est le même jour (pour un trajet scolaire)
            const departureDay = departureDate.toISOString().split('T')[0];
            const returnDay = returnDate.toISOString().split('T')[0];
            if (departureDay !== returnDay) {
                const response = NextResponse.json(
                    { success: false, message: "L'heure de retour doit être le même jour que l'heure de départ" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }
        }

        // Vérifier que la capacité du trajet ne dépasse pas celle du véhicule
        const capacityMaxNum = Number(capacity_max);
        if (isNaN(capacityMaxNum) || capacityMaxNum <= 0) {
            const response = NextResponse.json(
                { success: false, message: "La capacité doit être un nombre positif" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        if (capacityMaxNum > driver.capacity) {
            const response = NextResponse.json(
                {
                    success: false,
                    message: `La capacité du trajet (${capacityMaxNum}) dépasse celle de votre véhicule (${driver.capacity})`
                },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier que le trajet n'est pas dans le passé
        const departureDate = new Date(actualDepartureTime);
        if (departureDate < new Date()) {
            const response = NextResponse.json(
                { success: false, message: "Impossible de créer un trajet dans le passé" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Validation selon l'emploi du temps de l'école (si school_id est fourni)
        if (school_id) {
            // Récupérer le schedule de l'école
            const schoolResult = await query(
                `SELECT schedule FROM schools WHERE id = $1`,
                [school_id]
            );

            if (schoolResult.rowCount && schoolResult.rowCount > 0) {
                const schoolSchedule = schoolResult.rows[0].schedule;
                
                if (schoolSchedule && Array.isArray(schoolSchedule)) {
                    // Déterminer le jour de la semaine du trajet
                    const dayOfWeek = departureDate.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
                    const dayMapping: { [key: number]: string } = {
                        0: 'Dimanche',
                        1: 'Lundi',
                        2: 'Mardi',
                        3: 'Mercredi',
                        4: 'Jeudi',
                        5: 'Vendredi',
                        6: 'Samedi'
                    };
                    const dayName = dayMapping[dayOfWeek];

                    // Trouver l'emploi du temps pour ce jour
                    const daySchedule = schoolSchedule.find((s: any) => s.day === dayName);

                    if (daySchedule && daySchedule.open) {
                        const openTime = daySchedule.openTime || '08:00';
                        const closeTime = daySchedule.closeTime || '18:00';

                        // Convertir les heures en minutes depuis minuit
                        const parseTime = (timeStr: string): number => {
                            const [hours, minutes] = timeStr.split(':').map(Number);
                            return hours * 60 + minutes;
                        };

                        const openTimeMinutes = parseTime(openTime);
                        const closeTimeMinutes = parseTime(closeTime);
                        const tripHour = departureDate.getHours();
                        const tripMinutes = departureDate.getMinutes();
                        const tripTimeMinutes = tripHour * 60 + tripMinutes;

                        // Validation pour trajet "aller" ou partie aller d'un "aller-retour"
                        // Pour un trajet "retour", on ne valide pas l'openTime
                        if ((finalTripType === 'aller' || finalTripType === 'aller_retour') && !isReturnOnly) {
                            // L'heure d'arrivée estimée (départ + 30 min) doit être avant openTime
                            const arrivalTimeMinutes = tripTimeMinutes + 30;
                            if (arrivalTimeMinutes > openTimeMinutes) {
                                const response = NextResponse.json(
                                    { 
                                        success: false, 
                                        message: `Pour un trajet aller, le départ doit être au moins 30 minutes avant l'heure d'ouverture de l'école (${openTime}). Heure de départ maximale recommandée : ${Math.floor((openTimeMinutes - 30) / 60)}:${String((openTimeMinutes - 30) % 60).padStart(2, '0')}` 
                                    },
                                    { status: 400 }
                                );
                                return setCorsHeaders(response, origin);
                            }
                        }

                        // Validation pour trajet "retour"
                        if (finalTripType === 'retour') {
                            // L'heure de départ doit être après closeTime
                            if (tripTimeMinutes < closeTimeMinutes) {
                                const response = NextResponse.json(
                                    { 
                                        success: false, 
                                        message: `Pour un trajet retour, le départ doit être après l'heure de fermeture de l'école (${closeTime}). Heure de départ minimale : ${closeTime}` 
                                    },
                                    { status: 400 }
                                );
                                return setCorsHeaders(response, origin);
                            }
                        }

                        // Validation pour la partie retour d'un trajet "aller-retour"
                        if (finalTripType === 'aller_retour' && actualReturnTime) {
                            const returnDate = new Date(actualReturnTime);
                            const returnHour = returnDate.getHours();
                            const returnMinutes = returnDate.getMinutes();
                            const returnTimeMinutes = returnHour * 60 + returnMinutes;

                            if (returnTimeMinutes < closeTimeMinutes) {
                                const response = NextResponse.json(
                                    { 
                                        success: false, 
                                        message: `Pour un trajet aller-retour, l'heure de retour doit être après l'heure de fermeture de l'école (${closeTime}). Heure de retour minimale : ${closeTime}` 
                                    },
                                    { status: 400 }
                                );
                                return setCorsHeaders(response, origin);
                            }
                        }
                    } else if (daySchedule && !daySchedule.open) {
                        // L'école est fermée ce jour
                        const response = NextResponse.json(
                            { 
                                success: false, 
                                message: `L'école est fermée le ${dayName}. Veuillez choisir un autre jour.` 
                            },
                            { status: 400 }
                        );
                        return setCorsHeaders(response, origin);
                    }
                }
            }
        }

        // Initialiser return_status selon le type de trajet
        let returnStatus: string | null = null;
        if (finalTripType === 'aller_retour') {
            returnStatus = 'pending';
        }
        // Pour un trajet "retour", on utilise departure_time comme heure de départ du retour
        // return_departure_time reste null

        // Créer le trajet
        const result = await query(
            `
                    INSERT INTO trips (driver_id, school_id, start_point, end_point, departure_time, return_departure_time, capacity_max, trip_type, is_recurring, status, return_status)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', $10)
                        RETURNING *
                `,
            [driverId, school_id, start_point, end_point, actualDepartureTime, actualReturnTime, capacityMaxNum, finalTripType, is_recurring || false, returnStatus]
        );

        const tripId = result.rows[0].id;

        // Créer les arrêts (écoles) si fournis
        let createdStops: any[] = [];
        
        if (stops && Array.isArray(stops) && stops.length > 0) {
            // Valider et créer chaque arrêt
            for (const stop of stops) {
                if (!stop.school_id) {
                    const response = NextResponse.json(
                        { success: false, message: "Chaque arrêt doit avoir un school_id" },
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
                        { success: false, message: `École avec ID ${stop.school_id} introuvable` },
                        { status: 400 }
                    );
                    return setCorsHeaders(response, origin);
                }

                // Créer l'arrêt
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
            }
        } else if (school_id) {
            // Si pas d'arrêts mais un school_id, créer un arrêt par défaut (compatibilité)
            try {
                const stopResult = await query(
                    `INSERT INTO trip_stops (trip_id, school_id, stop_order, estimated_arrival_time)
                     VALUES ($1, $2, 1, NULL)
                     RETURNING *`,
                    [tripId, school_id]
                );
                createdStops.push(stopResult.rows[0]);
            } catch (error: any) {
                // Si la table trip_stops n'existe pas encore, on ignore l'erreur (migration pas encore exécutée)
                console.warn('⚠️ Table trip_stops non disponible, arrêts non créés:', error.message);
            }
        }

        // Récupérer le trajet avec ses arrêts
        const tripWithStops = await query(
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

        const response = NextResponse.json(
            { 
                success: true, 
                data: {
                    ...tripWithStops.rows[0],
                    stops: tripWithStops.rows[0].stops || createdStops
                }
            },
            { status: 201 }
        );
        return setCorsHeaders(response, origin);
    } catch (error: any) {
        const errorResponse = NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}
