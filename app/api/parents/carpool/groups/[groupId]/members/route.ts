/**
 * @swagger
 * /api/parents/carpool/groups/{groupId}/members:
 *   get:
 *     summary: Lister les membres d'un groupe
 *     description: Récupère la liste des membres d'un groupe avec leurs informations
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
 *     responses:
 *       200:
 *         description: Liste des membres
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

        // Récupérer tous les membres acceptés du groupe
        const result = await query(
            `
            SELECT 
                m.id,
                m.parent_id,
                m.status,
                m.invited_at,
                m.responded_at,
                m.created_at as joined_at,
                u.name,
                u.email,
                u.phone,
                SUBSTRING(u.name, 1, 2) as initials,
                (g.creator_id = m.parent_id) as is_creator,
                (m.parent_id = $1) as is_me
            FROM carpool_group_members m
            INNER JOIN users u ON m.parent_id = u.id
            INNER JOIN carpool_groups g ON m.group_id = g.id
            WHERE m.group_id = $2 AND m.status = 'accepted'
            ORDER BY 
                CASE WHEN m.parent_id = g.creator_id THEN 0 ELSE 1 END,
                m.responded_at ASC
            `,
            [userId, groupId]
        );

        const response = NextResponse.json({
            success: true,
            data: {
                members: result.rows,
                count: result.rows.length
            }
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur récupération membres:', error);
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

