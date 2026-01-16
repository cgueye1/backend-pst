/**
 * @swagger
 * /api/evaluations:
 *   post:
 *     summary: Créer une évaluation(Noter le chauffeur)
 *     description: Permet à un parent de créer une évaluation pour un trajet complété
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *   get:
 *     summary: Récupérer les évaluations(- Consulter un avis )
 *     description: Récupère les évaluations avec filtres optionnels
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        // Authentification
        const user = await getUserFromRequest(req);
        if (!user || user.role !== 'parent') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé. Seuls les parents peuvent créer des évaluations.' },
                { status: 401 }
            );
        }

        // Récupération et validation basique des données
        const body = await req.json();
        const { trip_id, driver_id, rating, comment } = body;

        // Validation manuelle simple
        if (!trip_id || !driver_id || !rating) {
            return NextResponse.json(
                { success: false, error: 'trip_id, driver_id et rating sont requis' },
                { status: 400 }
            );
        }

        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return NextResponse.json(
                { success: false, error: 'rating doit être un nombre entre 1 et 5' },
                { status: 400 }
            );
        }

        // Vérifier que le trajet existe et est complété
        const tripCheck = await query(
            `SELECT id, status, driver_id FROM trips WHERE id = $1`,
            [trip_id]
        );

        if (tripCheck.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Trajet introuvable' },
                { status: 404 }
            );
        }

        const trip = tripCheck.rows[0];

        if (trip.status !== 'completed') {
            return NextResponse.json(
                { success: false, error: 'Vous ne pouvez évaluer que les trajets complétés' },
                { status: 400 }
            );
        }

        if (trip.driver_id !== driver_id) {
            return NextResponse.json(
                { success: false, error: 'Le driver_id ne correspond pas au trajet' },
                { status: 400 }
            );
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

        if (parseInt(reservationCheck.rows[0].count) === 0) {
            return NextResponse.json(
                { success: false, error: 'Vous n\'avez pas réservé ce trajet' },
                { status: 403 }
            );
        }

        // Vérifier si une évaluation existe déjà pour ce trajet et ce parent
        const existingEvaluation = await query(
            `SELECT id FROM evaluations WHERE trip_id = $1 AND parent_id = $2`,
            [trip_id, user.id]
        );

        if (existingEvaluation.rowCount && existingEvaluation.rowCount > 0) {
            return NextResponse.json(
                { success: false, error: 'Vous avez déjà évalué ce trajet' },
                { status: 400 }
            );
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

        return NextResponse.json(
            {
                success: true,
                message: 'Évaluation créée avec succès',
                data: result.rows[0],
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('❌ Erreur création évaluation:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Erreur serveur lors de la création de l\'évaluation',
                details: error.message
            },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        // Authentification
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            );
        }

        // Récupération des paramètres
        const { searchParams } = new URL(req.url);
        const driver_id = searchParams.get('driver_id') ? parseInt(searchParams.get('driver_id')!) : undefined;
        const trip_id = searchParams.get('trip_id') ? parseInt(searchParams.get('trip_id')!) : undefined;
        const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;

        // Construction de la requête
        const conditions: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;

        // Si parent, ne voir que ses évaluations
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

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Pagination
        const offset = (page - 1) * limit;
        params.push(limit, offset);

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
                u_driver.name AS driver_name,

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

            WHERE e.parent_id = $1
            ORDER BY e.created_at DESC
                LIMIT $2 OFFSET $3
        `;

        console.log('📊 Query:', evaluationsQuery);
        console.log('📊 Params:', params);

        const evaluations = await query(evaluationsQuery, params);

        // Compte total
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM evaluations e
            ${whereClause}
        `;

        const countResult = await query(countQuery, params.slice(0, -2));
        const total = parseInt(countResult.rows[0].total);
        console.log(evaluations.rows)
        return NextResponse.json({
            success: true,
            data: evaluations.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });

    } catch (error: any) {
        console.error('❌ Erreur récupération évaluations:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Erreur serveur lors de la récupération des évaluations',
                details: error.message
            },
            { status: 500 }
        );
    }
}

