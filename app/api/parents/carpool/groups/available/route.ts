/**
 * @swagger
 * /api/parents/carpool/groups/available:
 *   get:
 *     summary: Récupérer les groupes disponibles à rejoindre
 *     description: Récupère les groupes de covoiturage actifs où le parent n'est pas encore membre. Par défaut, filtre par les écoles des enfants du parent. Utilisez show_all=true pour voir tous les groupes.
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: show_all
 *         schema:
 *           type: boolean
 *         description: Si true, affiche tous les groupes disponibles (sans filtre par école). Par défaut, filtre par les écoles des enfants.
 *     responses:
 *       200:
 *         description: Liste des groupes disponibles
 *       401:
 *         description: Non autorisé
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

export async function GET(req: NextRequest) {
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

        const userId = Number(user.id);
        const { searchParams } = new URL(req.url);
        const show_all = searchParams.get('show_all') === 'true'; // Paramètre optionnel pour voir tous les groupes

        // Récupérer les écoles des enfants du parent
        const childrenSchoolsResult = await query(
            `
            SELECT DISTINCT school_id 
            FROM children 
            WHERE parent_id = $1 AND school_id IS NOT NULL
            `,
            [userId]
        );

        const childrenSchoolIds = childrenSchoolsResult.rows.map(row => row.school_id);

        // Construire la condition WHERE
        let whereConditions = [
            "g.status = 'active'",
            "g.creator_id != $1",
            `NOT EXISTS (
                SELECT 1 FROM carpool_group_members m 
                WHERE m.group_id = g.id 
                AND m.parent_id = $1
                AND m.status IN ('accepted', 'declined', 'rejected')
            )`
        ];

        const queryParams: any[] = [userId];
        let paramIndex = 2;

        // Filtrer par école si le parent a des enfants avec des écoles, sauf si show_all=true
        if (!show_all && childrenSchoolIds.length > 0) {
            whereConditions.push(`g.school_id = ANY($${paramIndex})`);
            queryParams.push(childrenSchoolIds);
            paramIndex++;
        } else if (!show_all && childrenSchoolIds.length === 0) {
            // Si le parent n'a pas d'enfants avec école, ne rien retourner
            const response = NextResponse.json({
                success: true,
                data: [],
                count: 0,
                message: 'Aucun groupe disponible. Ajoutez d\'abord des enfants avec une école pour voir les groupes correspondants.'
            });
            return setCorsHeaders(response, origin);
        }

        const whereClause = whereConditions.join(' AND ');

        // Construire la condition pour is_my_school (seulement si on a des écoles)
        let isMySchoolCondition = 'false';
        if (childrenSchoolIds.length > 0 && !show_all) {
            isMySchoolCondition = `(g.school_id = ANY($${paramIndex - 1}))`;
        }

        // Récupérer les groupes disponibles
        const result = await query(
            `
            SELECT 
                g.id,
                g.name,
                g.description,
                g.school_id,
                g.creator_id,
                g.status,
                g.created_at,
                
                s.name as school_name,
                s.address as school_address,
                u.name as creator_name,
                u.email as creator_email,
                
                (SELECT COUNT(*) FROM carpool_group_members WHERE group_id = g.id AND status = 'accepted') as members_count,
                
                -- Vérifier si une invitation existe déjà
                EXISTS (
                    SELECT 1 FROM carpool_group_members m_inv 
                    WHERE m_inv.group_id = g.id 
                    AND m_inv.parent_id = $1 
                    AND m_inv.status = 'pending'
                ) as has_pending_invitation,
                
                -- Indiquer si c'est une école de l'enfant du parent
                ${isMySchoolCondition} as is_my_school
                
            FROM carpool_groups g
            LEFT JOIN schools s ON g.school_id = s.id
            LEFT JOIN users u ON g.creator_id = u.id
            WHERE ${whereClause}
            ORDER BY 
                -- Prioriser les groupes de la même école (si applicable)
                CASE WHEN ${isMySchoolCondition} THEN 0 ELSE 1 END,
                g.created_at DESC
            `,
            queryParams
        );

        const response = NextResponse.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur récupération groupes disponibles:', error);
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

