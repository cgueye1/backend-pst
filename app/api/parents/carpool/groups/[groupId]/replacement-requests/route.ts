/**
 * @swagger
 * /api/parents/carpool/groups/{groupId}/replacement-requests:
 *   get:
 *     summary: Lister les demandes de remplacement d'un groupe
 *     description: Récupère toutes les demandes de remplacement en attente pour un groupe
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du groupe
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, declined]
 *         description: Filtrer par statut (optionnel)
 *     responses:
 *       200:
 *         description: Liste des demandes de remplacement
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 */
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { setCorsHeaders, corsOptions } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = {
    params: Promise<{ groupId: string }>;
};

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(
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

        const { groupId: groupIdParam } = await context.params;
        const userId = Number(user.id);
        const groupId = Number(groupIdParam);
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        // Vérifier que l'utilisateur est membre du groupe
        const memberCheck = await query(
            `
            SELECT id FROM carpool_group_members 
            WHERE group_id = $1 AND parent_id = $2 AND status = 'accepted'
            `,
            [groupId, userId]
        );

        if (!memberCheck.rowCount || memberCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Vous devez être membre du groupe' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const conditions = ['c.group_id = $1'];
        const params: any[] = [groupId];
        let paramIndex = 2;

        if (status) {
            conditions.push(`r.status = $${paramIndex++}`);
            params.push(status);
        }

        const whereClause = conditions.join(' AND ');

        // Récupérer les demandes de remplacement
        const result = await query(
            `
            SELECT 
                r.id,
                r.calendar_id,
                r.requested_by,
                r.reason,
                r.status,
                r.created_at,
                r.responded_at,
                r.responded_by,
                c.date,
                c.driver_id as original_driver_id,
                u_req.name as requested_by_name,
                u_req.email as requested_by_email,
                u_orig.name as original_driver_name,
                u_resp.name as responded_by_name,
                (r.requested_by = $${paramIndex}) as is_my_request,
                (r.status = 'pending' AND r.requested_by != $${paramIndex}) as can_respond
            FROM carpool_replacement_requests r
            INNER JOIN carpool_calendar c ON r.calendar_id = c.id
            LEFT JOIN users u_req ON r.requested_by = u_req.id
            LEFT JOIN users u_orig ON c.driver_id = u_orig.id
            LEFT JOIN users u_resp ON r.responded_by = u_resp.id
            WHERE ${whereClause}
            ORDER BY 
                CASE r.status
                    WHEN 'pending' THEN 1
                    WHEN 'accepted' THEN 2
                    WHEN 'declined' THEN 3
                END,
                r.created_at DESC
            `,
            [...params, userId]
        );

        const response = NextResponse.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur récupération demandes remplacement:', error);
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

