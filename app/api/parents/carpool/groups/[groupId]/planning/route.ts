/**
 * @swagger
 * /api/parents/carpool/groups/{groupId}/planning:
 *   post:
 *     summary: Créer un planning avec assignations automatiques
 *     description: Crée un planning pour un groupe avec des dates début/fin et génère automatiquement des assignations pour chaque jour. Les jours sont répartis équitablement entre tous les membres acceptés du groupe (rotation).
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - start_date
 *               - end_date
 *             properties:
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-10"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-16"
 *               start_point:
 *                 type: string
 *               end_point:
 *                 type: string
 *               departure_time:
 *                 type: string
 *                 format: time
 *                 example: "08:00:00"
 *               return_time:
 *                 type: string
 *                 format: time
 *                 example: "16:30:00"
 *     responses:
 *       201:
 *         description: Planning créé avec succès
 *       400:
 *         description: Paramètres invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *   get:
 *     summary: Récupérer le planning d'un groupe
 *     description: Récupère le planning avec les assignations et leurs statuts de confirmation
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
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début (optionnel)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin (optionnel)
 *     responses:
 *       200:
 *         description: Planning récupéré avec succès
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

// POST - Créer un planning avec assignations automatiques
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

        const { groupId: groupIdParam } = await context.params;
        const userId = Number(user.id);
        const groupId = Number(groupIdParam);
        const body = await req.json();
        const {
            start_date,
            end_date,
            start_point,
            end_point,
            departure_time,
            return_time
        } = body;

        if (!start_date || !end_date) {
            const response = NextResponse.json(
                { success: false, error: 'start_date et end_date sont requis' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

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

        // Vérifier que le groupe existe
        const groupCheck = await query(
            `SELECT id, name FROM carpool_groups WHERE id = $1`,
            [groupId]
        );

        if (!groupCheck.rowCount || groupCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Groupe introuvable' },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        // Récupérer tous les membres acceptés du groupe
        const membersResult = await query(
            `
            SELECT parent_id 
            FROM carpool_group_members 
            WHERE group_id = $1 AND status = 'accepted'
            ORDER BY parent_id
            `,
            [groupId]
        );

        if (membersResult.rows.length === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Le groupe n\'a pas de membres acceptés' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        const members = membersResult.rows.map(row => row.parent_id);
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (startDate > endDate) {
            const response = NextResponse.json(
                { success: false, error: 'La date de début doit être antérieure à la date de fin' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Générer les dates entre start_date et end_date
        // Répartition équitable entre tous les membres du groupe (rotation)
        const assignments: any[] = [];
        const currentDate = new Date(startDate);
        let memberIndex = 0;

        while (currentDate <= endDate) {
            const assignedMemberId = members[memberIndex % members.length];
            assignments.push({
                date: new Date(currentDate),
                assigned_to: assignedMemberId
            });
            memberIndex++;
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Insérer les entrées dans carpool_calendar
        const createdEntries = [];
        const conflicts: any[] = [];
        
        for (const assignment of assignments) {
            const dateStr = assignment.date.toISOString().split('T')[0];
            
            // Vérifier si une entrée existe déjà pour cette date dans ce groupe
            const existingCheck = await query(
                `SELECT id FROM carpool_calendar WHERE group_id = $1 AND date = $2`,
                [groupId, dateStr]
            );

            if (!existingCheck.rowCount || existingCheck.rowCount === 0) {
                // Vérifier si le parent est déjà assigné ce jour dans un autre groupe
                const conflictCheck = await query(
                    `
                    SELECT c.id, c.group_id, g.name as group_name
                    FROM carpool_calendar c
                    INNER JOIN carpool_groups g ON c.group_id = g.id
                    WHERE c.driver_id = $1 
                    AND c.date = $2 
                    AND c.group_id != $3
                    AND c.status != 'cancelled'
                    `,
                    [assignment.assigned_to, dateStr, groupId]
                );

                if (conflictCheck.rowCount && conflictCheck.rowCount > 0) {
                    const conflict = conflictCheck.rows[0];
                    const memberName = await query(
                        `SELECT name FROM users WHERE id = $1`,
                        [assignment.assigned_to]
                    );
                    conflicts.push({
                        date: dateStr,
                        parent_id: assignment.assigned_to,
                        parent_name: memberName.rows[0]?.name || 'Inconnu',
                        conflicting_group_id: conflict.group_id,
                        conflicting_group_name: conflict.group_name
                    });
                    continue; // Skip cette assignation
                }

                const result = await query(
                    `
                    INSERT INTO carpool_calendar (
                        group_id, date, driver_id, start_point, end_point,
                        departure_time, return_time, confirmation_status,
                        status, created_at, updated_at, created_by
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', 'scheduled', NOW(), NOW(), $8)
                    RETURNING id
                    `,
                    [
                        groupId,
                        dateStr,
                        assignment.assigned_to,
                        start_point || null,
                        end_point || null,
                        departure_time || null,
                        return_time || null,
                        userId
                    ]
                );
                createdEntries.push(result.rows[0].id);
            }
        }

        // Si des conflits ont été détectés, retourner un avertissement
        if (conflicts.length > 0) {
            const response = NextResponse.json({
                success: true,
                message: `Planning créé avec ${createdEntries.length} assignations. ${conflicts.length} assignation(s) ignorée(s) car le parent est déjà assigné dans un autre groupe.`,
                data: {
                    group_id: groupId,
                    start_date,
                    end_date,
                    created_count: createdEntries.length,
                    conflicts: conflicts
                },
                warnings: conflicts
            }, { status: 201 });
            return setCorsHeaders(response, origin);
        }

        // Récupérer le planning créé
        const planningResult = await query(
            `
            SELECT 
                c.id,
                c.group_id,
                c.date,
                c.driver_id,
                c.start_point,
                c.end_point,
                c.departure_time,
                c.return_time,
                c.confirmation_status,
                c.status,
                c.created_at,
                u.name as assigned_to_name,
                u.email as assigned_to_email,
                u.phone as assigned_to_phone,
                (c.driver_id = $1) as is_my_turn
            FROM carpool_calendar c
            LEFT JOIN users u ON c.driver_id = u.id
            WHERE c.group_id = $2 AND c.date >= $3 AND c.date <= $4
            ORDER BY c.date ASC
            `,
            [userId, groupId, start_date, end_date]
        );

        const response = NextResponse.json({
            success: true,
            message: `Planning créé avec ${createdEntries.length} assignations`,
            data: {
                group_id: groupId,
                start_date,
                end_date,
                assignments: planningResult.rows,
                count: planningResult.rows.length
            }
        }, { status: 201 });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur création planning:', error);
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

// GET - Récupérer le planning d'un groupe
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
        const start_date = searchParams.get('start_date');
        const end_date = searchParams.get('end_date');

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

        if (start_date) {
            conditions.push(`c.date >= $${paramIndex++}`);
            params.push(start_date);
        }

        if (end_date) {
            conditions.push(`c.date <= $${paramIndex++}`);
            params.push(end_date);
        }

        const whereClause = conditions.join(' AND ');

        // Récupérer le planning avec les informations de remplacement
        const result = await query(
            `
            SELECT 
                c.id,
                c.group_id,
                c.date,
                c.driver_id,
                c.start_point,
                c.end_point,
                c.departure_time,
                c.return_time,
                c.confirmation_status,
                c.status,
                c.created_at,
                u.name as assigned_to_name,
                u.email as assigned_to_email,
                u.phone as assigned_to_phone,
                (c.driver_id = $${paramIndex}) as is_my_turn,
                (
                    SELECT json_build_object(
                        'id', r.id,
                        'reason', r.reason,
                        'status', r.status,
                        'created_at', r.created_at
                    )
                    FROM carpool_replacement_requests r
                    WHERE r.calendar_id = c.id AND r.status = 'pending'
                    LIMIT 1
                ) as replacement_request
            FROM carpool_calendar c
            LEFT JOIN users u ON c.driver_id = u.id
            WHERE ${whereClause}
            ORDER BY c.date ASC
            `,
            [...params, userId]
        );

        const response = NextResponse.json({
            success: true,
            data: {
                group_id: groupId,
                assignments: result.rows,
                count: result.rows.length
            }
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur récupération planning:', error);
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

