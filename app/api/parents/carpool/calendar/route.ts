
/**
 * @swagger
 * /api/parents/carpool/calendar:
 *   post:
 *     summary: Ajouter un trajet au calendrier du covoiturage
 *     description: Ajoute un nouveau trajet au calendrier d'un groupe de covoiturage
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - group_id
 *               - date
 *               - departure_time
 *             properties:
 *               group_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               driver_id:
 *                 type: integer
 *               start_point:
 *                 type: string
 *               end_point:
 *                 type: string
 *               departure_time:
 *                 type: string
 *                 format: time
 *               return_time:
 *                 type: string
 *                 format: time
 *               capacity_max:
 *                 type: integer
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Trajet ajouté avec succès
 *       400:
 *         description: Paramètres invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *   get:
 *     summary: Récupérer le calendrier du groupe
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []

 *     parameters:
 *       - in: query
 *         name: group_id
 *         schema:
 *           type: string
 *         description: Paramètre de requête
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *         description: Paramètre de requête
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *         description: Paramètre de requête
 *       - in: query
 *         name: calendar_id
 *         schema:
 *           type: string
 *         description: Paramètre de requête
 *   put:
 *     summary: Modifier une entrée du calendrier
 *     description: Modifie une entrée existante du calendrier
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - calendar_id
 *             properties:
 *               calendar_id:
 *                 type: integer
 *               driver_id:
 *                 type: integer
 *               start_point:
 *                 type: string
 *               end_point:
 *                 type: string
 *               departure_time:
 *                 type: string
 *                 format: time
 *               return_time:
 *                 type: string
 *                 format: time
 *               notes:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Calendrier mis à jour
 *       400:
 *         description: Paramètres invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *   delete:
 *     summary: Supprimer une entrée du calendrier
 *     description: Supprime une entrée du calendrier
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: calendar_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'entrée du calendrier
 *     responses:
 *       200:
 *         description: Entrée supprimée avec succès
 *       400:
 *         description: Paramètres invalides
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

// POST - Ajouter un trajet au calendrier
export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(req: NextRequest) {
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
        const body = await req.json();
        const {
            group_id,
            date,
            driver_id,
            start_point,
            end_point,
            departure_time,
            return_time,
            capacity_max,
            notes
        } = body;

        if (!group_id || !date || !departure_time) {
            const response = NextResponse.json(
                { success: false, error: 'group_id, date et departure_time sont requis' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        const memberCheck = await query(
            `
            SELECT id FROM carpool_group_members 
            WHERE group_id = $1 AND parent_id = $2 AND status = 'accepted'
            `,
            [group_id, userId]
        );

        if (memberCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Vous devez être membre du groupe' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        if (driver_id) {
            const driverCheck = await query(
                `
                SELECT id FROM carpool_group_members 
                WHERE group_id = $1 AND parent_id = $2 AND status = 'accepted'
                `,
                [group_id, driver_id]
            );

            if (driverCheck.rowCount === 0) {
                const response = NextResponse.json(
                    { success: false, error: 'Le conducteur doit être membre du groupe' },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

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
                [driver_id, date, group_id]
            );

            if (conflictCheck.rowCount && conflictCheck.rowCount > 0) {
                const conflict = conflictCheck.rows[0];
                const response = NextResponse.json(
                    { 
                        success: false, 
                        error: `Ce parent est déjà assigné à conduire le ${date} dans le groupe "${conflict.group_name}"` 
                    },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }
        }

        const calendarEntry = await query(
            `
            INSERT INTO carpool_calendar (
                group_id,
                date,
                driver_id,
                start_point,
                end_point,
                departure_time,
                return_time,
                capacity_max,
                notes,
                status,
                created_at,
                updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'scheduled', NOW(), NOW())
            RETURNING *
            `,
            [
                group_id,
                date,
                driver_id || null,
                start_point || null,
                end_point || null,
                departure_time,
                return_time || null,
                capacity_max || 4,
                notes || null
            ]
        );

        const complete = await query(
            `
            SELECT 
                c.*,
                u.name as driver_name,
                u.phone as driver_phone,
                g.name as group_name
            FROM carpool_calendar c
            LEFT JOIN users u ON c.driver_id = u.id
            LEFT JOIN carpool_groups g ON c.group_id = g.id
            WHERE c.id = $1
            `,
            [calendarEntry.rows[0].id]
        );

        const response = NextResponse.json(
            {
                success: true,
                message: 'Trajet ajouté au calendrier',
                data: complete.rows[0]
            },
            { status: 201 }
        );
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur ajout calendrier:', error);
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

// GET - Récupérer le calendrier du groupe
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
        const group_id = searchParams.get('group_id');
        const start_date = searchParams.get('start_date');
        const end_date = searchParams.get('end_date');

        if (!group_id) {
            const response = NextResponse.json(
                { success: false, error: 'group_id est requis' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        const memberCheck = await query(
            `
            SELECT id FROM carpool_group_members 
            WHERE group_id = $1 AND parent_id = $2 AND status = 'accepted'
            `,
            [group_id, userId]
        );

        if (Number(memberCheck.rowCount) === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Vous devez être membre du groupe' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const conditions = ['c.group_id = $1'];
        const params: any[] = [group_id];
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
                c.capacity_max,
                c.notes,
                c.status,
                c.created_at,
                
                u.name as driver_name,
                u.phone as driver_phone,
                u.email as driver_email,
                
                (c.driver_id = $${paramIndex}) as is_my_turn
                
            FROM carpool_calendar c
            LEFT JOIN users u ON c.driver_id = u.id
            WHERE ${whereClause}
            ORDER BY c.date ASC, c.departure_time ASC
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
        console.error('❌ Erreur récupération calendrier:', error);
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

// PUT - Modifier une entrée du calendrier
export async function PUT(req: NextRequest) {
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
        const body = await req.json();
        const {
            calendar_id,
            driver_id,
            start_point,
            end_point,
            departure_time,
            return_time,
            notes,
            status
        } = body;

        if (!calendar_id) {
            const response = NextResponse.json(
                { success: false, error: 'calendar_id est requis' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        const entryCheck = await query(
            `
            SELECT c.*, m.parent_id
            FROM carpool_calendar c
            INNER JOIN carpool_group_members m ON c.group_id = m.group_id
            WHERE c.id = $1 AND m.parent_id = $2 AND m.status = 'accepted'
            `,
            [calendar_id, user.id]
        );

        if (entryCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Entrée introuvable ou non autorisée' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const updateFields = [];
        const updateValues = [];
        let paramIndex = 1;

        if (driver_id !== undefined) {
            updateFields.push(`driver_id = $${paramIndex++}`);
            updateValues.push(driver_id);
        }
        if (start_point !== undefined) {
            updateFields.push(`start_point = $${paramIndex++}`);
            updateValues.push(start_point);
        }
        if (end_point !== undefined) {
            updateFields.push(`end_point = $${paramIndex++}`);
            updateValues.push(end_point);
        }
        if (departure_time !== undefined) {
            updateFields.push(`departure_time = $${paramIndex++}`);
            updateValues.push(departure_time);
        }
        if (return_time !== undefined) {
            updateFields.push(`return_time = $${paramIndex++}`);
            updateValues.push(return_time);
        }
        if (notes !== undefined) {
            updateFields.push(`notes = $${paramIndex++}`);
            updateValues.push(notes);
        }
        if (status !== undefined) {
            updateFields.push(`status = $${paramIndex++}`);
            updateValues.push(status);
        }

        if (updateFields.length === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Aucune modification fournie' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        updateFields.push(`updated_at = NOW()`);
        updateValues.push(calendar_id);

        await query(
            `UPDATE carpool_calendar SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`,
            updateValues
        );

        const updated = await query(
            `
            SELECT 
                c.*,
                u.name as driver_name
            FROM carpool_calendar c
            LEFT JOIN users u ON c.driver_id = u.id
            WHERE c.id = $1
            `,
            [calendar_id]
        );

        const response = NextResponse.json({
            success: true,
            message: 'Calendrier mis à jour',
            data: updated.rows[0]
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur modification calendrier:', error);
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

// DELETE - Supprimer une entrée du calendrier
export async function DELETE(req: NextRequest) {
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
        const calendar_id = searchParams.get('calendar_id');

        if (!calendar_id) {
            const response = NextResponse.json(
                { success: false, error: 'calendar_id est requis' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        const entryCheck = await query(
            `
            SELECT c.*, m.parent_id
            FROM carpool_calendar c
            INNER JOIN carpool_group_members m ON c.group_id = m.group_id
            WHERE c.id = $1 AND m.parent_id = $2 AND m.status = 'accepted'
            `,
            [calendar_id, user.id]
        );

        if (entryCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Entrée introuvable ou non autorisée' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        await query(
            `DELETE FROM carpool_calendar WHERE id = $1`,
            [calendar_id]
        );

        return NextResponse.json({
            success: true,
            message: 'Entrée du calendrier supprimée'
        });

    } catch (error: any) {
        console.error('❌ Erreur suppression calendrier:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erreur serveur',
                details: error.message
            },
            { status: 500 }
        );
    }
}