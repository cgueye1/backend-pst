/**
 * @swagger
 * /api/evaluations/{id}:
 *   put:
 *     summary: Modifier un avis
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Authentification
        const user = await getUserFromRequest(req);
        if (!user || user.role !== 'parent') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const evaluationId = parseInt(id);
        const { rating, comment } = await req.json();

        // Validation
        if (!rating) {
            return NextResponse.json(
                { success: false, error: 'rating est requis' },
                { status: 400 }
            );
        }

        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return NextResponse.json(
                { success: false, error: 'rating doit être entre 1 et 5' },
                { status: 400 }
            );
        }

        // Vérifier que l'évaluation existe et appartient au parent
        const evaluationCheck = await query(
            `
            SELECT e.id, e.trip_id, t.status
            FROM evaluations e
            INNER JOIN trips t ON e.trip_id = t.id
            WHERE e.id = $1 AND e.parent_id = $2
            `,
            [evaluationId, user.id]
        );

        if (evaluationCheck.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Évaluation introuvable ou non autorisée' },
                { status: 404 }
            );
        }

        // Vérifier que le trajet est toujours complété
        if (evaluationCheck.rows[0].status !== 'completed') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Impossible de modifier un avis si le trajet n est pas complété'
                },
                { status: 400 }
            );
        }

        // Mise à jour
        const result = await query(
            `
            UPDATE evaluations
            SET rating = $1,
                comment = $2,
                updated_at = NOW()
            WHERE id = $3
            RETURNING *
            `,
            [rating, comment || null, evaluationId]
        );

        return NextResponse.json({
            success: true,
            message: 'Avis modifié avec succès',
            data: result.rows[0],
        });

    } catch (error: any) {
        console.error('❌ Erreur modification avis:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erreur serveur lors de la modification de l avis',
                details: error.message
            },
            { status: 500 }
        );
    }
}



