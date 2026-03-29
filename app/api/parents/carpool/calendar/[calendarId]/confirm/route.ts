/**
 * @swagger
 * /api/parents/carpool/calendar/{calendarId}/confirm:
 *   post:
 *     summary: Confirmer sa disponibilité pour un jour assigné
 *     description: Confirme la disponibilité d'un parent pour un jour qui lui a été assigné dans le planning
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: calendarId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'entrée du calendrier
 *     responses:
 *       200:
 *         description: Disponibilité confirmée avec succès
 *       400:
 *         description: Paramètres invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé (ce n'est pas votre jour assigné)
 *       404:
 *         description: Entrée du calendrier introuvable
 */
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { setCorsHeaders, corsOptions } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = {
    params: Promise<{ calendarId: string }>;
};

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(
    req: NextRequest,
    context: Params
) {
    const origin = req.headers.get('origin');
    try {
        const user = await getUserFromRequest(req);

        if (!user || user.role !== 'parent') {
            const response = NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            );
            return setCorsHeaders(response, origin);
        }

        const { calendarId: calendarIdParam } = await context.params;
        const userId = Number(user.id);
        const calendarId = Number(calendarIdParam);

        // Vérifier que l'entrée existe et que c'est bien assigné à l'utilisateur
        const calendarCheck = await query(
            `
            SELECT c.*, g.id as group_id
            FROM carpool_calendar c
            INNER JOIN carpool_groups g ON c.group_id = g.id
            WHERE c.id = $1 AND c.driver_id = $2
            `,
            [calendarId, userId]
        );

        if (!calendarCheck.rowCount || calendarCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Entrée introuvable ou ce n\'est pas votre jour assigné' },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const calendarEntry = calendarCheck.rows[0];

        // Vérifier que l'utilisateur est membre du groupe
        const memberCheck = await query(
            `
            SELECT id FROM carpool_group_members 
            WHERE group_id = $1 AND parent_id = $2 AND status = 'accepted'
            `,
            [calendarEntry.group_id, userId]
        );

        if (!memberCheck.rowCount || memberCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Vous devez être membre du groupe' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        // Mettre à jour le statut de confirmation
        await query(
            `
            UPDATE carpool_calendar 
            SET confirmation_status = 'confirmed', updated_at = NOW()
            WHERE id = $1
            `,
            [calendarId]
        );

        // Récupérer l'entrée mise à jour
        const updated = await query(
            `
            SELECT 
                c.*,
                u.name as assigned_to_name,
                u.email as assigned_to_email
            FROM carpool_calendar c
            LEFT JOIN users u ON c.driver_id = u.id
            WHERE c.id = $1
            `,
            [calendarId]
        );

        const response = NextResponse.json({
            success: true,
            message: 'Disponibilité confirmée avec succès',
            data: updated.rows[0]
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur confirmation:', error);
        const errorResponse = NextResponse.json(
            {
                success: false,
                error: 'Erreur serveur',
                details: error.message
            },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

