/**
 * @swagger
 * /api/parents/carpool/replacement-requests/{requestId}:
 *   post:
 *     summary: Accepter ou refuser une demande de remplacement
 *     description: Permet à un membre du groupe d'accepter ou de refuser une demande de remplacement
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la demande de remplacement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [accept, decline]
 *                 description: Action à effectuer (accept ou decline)
 *     responses:
 *       200:
 *         description: Action effectuée avec succès
 *       400:
 *         description: Paramètres invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Demande de remplacement introuvable
 */
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { setCorsHeaders, corsOptions } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = {
    params: Promise<{ requestId: string }>;
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

        const { requestId: requestIdParam } = await context.params;
        const userId = Number(user.id);
        const requestId = Number(requestIdParam);
        const body = await req.json();
        const { action } = body;

        if (!action || !['accept', 'decline'].includes(action)) {
            const response = NextResponse.json(
                { success: false, error: 'action doit être "accept" ou "decline"' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Récupérer la demande de remplacement
        const requestCheck = await query(
            `
            SELECT 
                r.*,
                c.group_id,
                c.driver_id as original_driver_id,
                c.date
            FROM carpool_replacement_requests r
            INNER JOIN carpool_calendar c ON r.calendar_id = c.id
            WHERE r.id = $1 AND r.status = 'pending'
            `,
            [requestId]
        );

        if (!requestCheck.rowCount || requestCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Demande de remplacement introuvable ou déjà traitée' },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const replacementRequest = requestCheck.rows[0];

        // Vérifier que l'utilisateur est membre du groupe
        const memberCheck = await query(
            `
            SELECT id FROM carpool_group_members 
            WHERE group_id = $1 AND parent_id = $2 AND status = 'accepted'
            `,
            [replacementRequest.group_id, userId]
        );

        if (!memberCheck.rowCount || memberCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Vous devez être membre du groupe' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier que l'utilisateur n'est pas celui qui a fait la demande
        if (replacementRequest.requested_by === userId) {
            const response = NextResponse.json(
                { success: false, error: 'Vous ne pouvez pas répondre à votre propre demande' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        const newStatus = action === 'accept' ? 'accepted' : 'declined';

        // Mettre à jour la demande
        await query(
            `
            UPDATE carpool_replacement_requests 
            SET status = $1, responded_at = NOW(), responded_by = $2
            WHERE id = $3
            `,
            [newStatus, userId, requestId]
        );

        if (action === 'accept') {
            // Vérifier si le parent est déjà assigné ce jour dans un autre groupe
            const conflictCheck = await query(
                `
                SELECT c.id, c.group_id, g.name as group_name
                FROM carpool_calendar c
                INNER JOIN carpool_groups g ON c.group_id = g.id
                WHERE c.driver_id = $1 
                AND c.date = $2 
                AND c.id != $3
                AND c.status != 'cancelled'
                `,
                [userId, replacementRequest.date, replacementRequest.calendar_id]
            );

            if (conflictCheck.rowCount && conflictCheck.rowCount > 0) {
                const conflict = conflictCheck.rows[0];
                const response = NextResponse.json(
                    { 
                        success: false, 
                        error: `Vous êtes déjà assigné à conduire le ${replacementRequest.date} dans le groupe "${conflict.group_name}". Vous ne pouvez pas accepter ce remplacement.` 
                    },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            // Mettre à jour le calendrier avec le nouveau conducteur
            await query(
                `
                UPDATE carpool_calendar 
                SET driver_id = $1, confirmation_status = 'confirmed', updated_at = NOW()
                WHERE id = $2
                `,
                [userId, replacementRequest.calendar_id]
            );
        } else {
            // Si refusé, remettre le statut à pending
            await query(
                `
                UPDATE carpool_calendar 
                SET confirmation_status = 'replacement_requested', updated_at = NOW()
                WHERE id = $1
                `,
                [replacementRequest.calendar_id]
            );
        }

        // Récupérer la demande mise à jour
        const updated = await query(
            `
            SELECT 
                r.*,
                c.date,
                c.group_id,
                c.driver_id,
                u_req.name as requested_by_name,
                u_resp.name as responded_by_name
            FROM carpool_replacement_requests r
            INNER JOIN carpool_calendar c ON r.calendar_id = c.id
            LEFT JOIN users u_req ON r.requested_by = u_req.id
            LEFT JOIN users u_resp ON r.responded_by = u_resp.id
            WHERE r.id = $1
            `,
            [requestId]
        );

        const response = NextResponse.json({
            success: true,
            message: action === 'accept' 
                ? 'Remplacement accepté, vous êtes maintenant assigné à ce jour'
                : 'Remplacement refusé',
            data: updated.rows[0]
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur réponse remplacement:', error);
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

