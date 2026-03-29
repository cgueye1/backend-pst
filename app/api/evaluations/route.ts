/**
 * @swagger
 * /api/evaluations:
 *   get:
 *     summary: Récupérer les évaluations
 *     description: Récupère les évaluations avec filtres optionnels (driver_id, parent_id, rating, etc.).
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: driver_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtrer par ID du chauffeur
 *       - in: query
 *         name: parent_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtrer par ID du parent
 *       - in: query
 *         name: min_rating
 *         required: false
 *         schema:
 *           type: integer
 *         description: Note minimale (1-5)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nombre d'évaluations à retourner
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset pour la pagination
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
 *     summary: Créer une évaluation
 *     description: Permet à un parent de créer une évaluation pour un trajet complété. Le trajet doit être en statut "completed".
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trip_id
 *               - driver_id
 *               - rating
 *             properties:
 *               trip_id:
 *                 type: integer
 *                 description: ID du trajet complété
 *                 example: 1
 *               driver_id:
 *                 type: integer
 *                 description: ID du chauffeur
 *                 example: 1
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Note de 1 à 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 description: Commentaire (optionnel)
 *                 example: "Excellent service !"
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

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        // Authentification
        const user = await getUserFromRequest(req);
        if (!user || user.role !== 'parent') {
            const response = NextResponse.json(
                { success: false, error: 'Non autorisé. Seuls les parents peuvent créer des évaluations.' },
                { status: 401 }
            );
            return setCorsHeaders(response, origin);
        }

        // Récupération et validation basique des données
        const body = await req.json();
        const { trip_id, driver_id, rating, comment } = body;

        // Validation manuelle simple
        if (!trip_id || !driver_id || !rating) {
            const response = NextResponse.json(
                { success: false, error: 'trip_id, driver_id et rating sont requis' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            const response = NextResponse.json(
                { success: false, error: 'rating doit être un nombre entre 1 et 5' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier que le trajet existe et est complété
        const tripCheck = await query(
            `SELECT id, status, return_status, trip_type, driver_id FROM trips WHERE id = $1`,
            [trip_id]
        );

        if (!tripCheck.rowCount || tripCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Trajet introuvable' },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const trip = tripCheck.rows[0];

        // Vérifier le statut global pour les trajets aller-retour
        const { getTripOverallStatus } = await import('@/lib/tripStatusUtils');
        const overallStatus = getTripOverallStatus(
            trip.status,
            trip.return_status || null,
            trip.trip_type || 'aller'
        );
        
        if (overallStatus !== 'completed') {
            const response = NextResponse.json(
                { success: false, error: 'Vous ne pouvez évaluer que les trajets complétés' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        if (trip.driver_id !== driver_id) {
            const response = NextResponse.json(
                { success: false, error: 'Le driver_id ne correspond pas au trajet' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier que le parent a réservé ce trajet (via ses enfants)
        const reservationCheck = await query(
            `
            SELECT COUNT(*) as count
            FROM trip_children tc
            INNER JOIN children c ON tc.child_id = c.id
            WHERE tc.trip_id = $1 AND c.parent_id = $2
            `,
            [trip_id, user.id]
        );

        if (parseInt(reservationCheck.rows[0]?.count || '0') === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Vous n\'avez pas réservé ce trajet' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier si une évaluation existe déjà pour ce trajet et ce parent
        const existingEvaluation = await query(
            `SELECT id FROM evaluations WHERE trip_id = $1 AND parent_id = $2`,
            [trip_id, user.id]
        );

        if (existingEvaluation.rowCount && existingEvaluation.rowCount > 0) {
            const response = NextResponse.json(
                { success: false, error: 'Vous avez déjà évalué ce trajet' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Créer l'évaluation
        const result = await query(
            `
            INSERT INTO evaluations (trip_id, parent_id, driver_id, rating, comment)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [trip_id, user.id, driver_id, rating, comment || null]
        );

        const response = NextResponse.json(
            {
                success: true,
                message: 'Évaluation créée avec succès',
                data: result.rows[0],
            },
            { status: 201 }
        );
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur création évaluation:', error);

        const errorResponse = NextResponse.json(
            {
                success: false,
                error: 'Erreur serveur lors de la création de l\'évaluation',
                details: error.message
            },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        // Authentification
        const user = await getUserFromRequest(req);
        if (!user) {
            const response = NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            );
            return setCorsHeaders(response, origin);
        }

        // Récupération des paramètres
        const { searchParams } = new URL(req.url);
        const driver_id = searchParams.get('driver_id') ? parseInt(searchParams.get('driver_id')!) : undefined;
        const trip_id = searchParams.get('trip_id') ? parseInt(searchParams.get('trip_id')!) : undefined;
        const min_rating = searchParams.get('min_rating') ? parseInt(searchParams.get('min_rating')!) : undefined;
        const parent_id = searchParams.get('parent_id') ? parseInt(searchParams.get('parent_id')!) : undefined;
        const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;

        // Construction de la requête
        const conditions: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;

        // Si parent, ne voir que ses évaluations (sauf si admin ou driver)
        if (user.role === 'parent') {
            conditions.push(`e.parent_id = $${paramIndex++}`);
            params.push(user.id);
        }

        // Filtres optionnels
        if (driver_id) {
            conditions.push(`e.driver_id = $${paramIndex++}`);
            params.push(driver_id);
        }

        if (trip_id) {
            conditions.push(`e.trip_id = $${paramIndex++}`);
            params.push(trip_id);
        }

        if (min_rating) {
            conditions.push(`e.rating >= $${paramIndex++}`);
            params.push(min_rating);
        }

        if (parent_id && (user.role === 'admin' || user.role === 'driver')) {
            conditions.push(`e.parent_id = $${paramIndex++}`);
            params.push(parent_id);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Pagination
        const offset = (page - 1) * limit;
        const limitParamIndex = paramIndex++;
        const offsetParamIndex = paramIndex++;

        // Requête principale
        const evaluationsQuery = `
            SELECT
                e.id,
                e.trip_id,
                e.parent_id,
                e.driver_id,
                e.rating,
                e.comment,
                e.created_at,

                u_parent.name AS parent_name,
                u_parent.email AS parent_email,
                u_parent.phone AS parent_phone,

                u_driver.name AS driver_name,
                u_driver.email AS driver_email,
                u_driver.phone AS driver_phone,

                t.start_point,
                t.end_point,
                t.departure_time

            FROM evaluations e

                     INNER JOIN users u_parent
                                ON e.parent_id = u_parent.id

                     INNER JOIN drivers d
                                ON e.driver_id = d.id

                     INNER JOIN users u_driver
                                ON d.user_id = u_driver.id

                     LEFT JOIN trips t
                               ON e.trip_id = t.id

            ${whereClause}
            ORDER BY e.created_at DESC
                LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
        `;

        // Ajouter limit et offset aux params
        params.push(limit, offset);

        const evaluations = await query(evaluationsQuery, params);

        // Compte total (sans pagination)
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM evaluations e
            ${whereClause}
        `;

        const countParams = params.slice(0, -2); // Retirer limit et offset
        const countResult = await query(countQuery, countParams);
        const total = parseInt(countResult.rows[0]?.total || '0');
        
        const response = NextResponse.json({
            success: true,
            data: evaluations.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur récupération évaluations:', error);

        const errorResponse = NextResponse.json(
            {
                success: false,
                error: 'Erreur serveur lors de la récupération des évaluations',
                details: error.message
            },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

















