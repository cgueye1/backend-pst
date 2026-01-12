
/**
 * @swagger
 * /api/parents/carpool/calendar:
 *   post:
 *     summary: Ajouter un trajet au calendrier du covoiturage
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *   get:
 *     summary: Récupérer le calendrier du groupe
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *   put:
 *      summary: Modifier une entrée du calendrier
 *      tags: [Parents]
 *   delete:
 *      summary: Supprimer une entrée du calendrier
 *      tags: [Parents]
 */
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST - Ajouter un trajet au calendrier
export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user || user.role !== 'parent') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            );
        }

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
            return NextResponse.json(
                { success: false, error: 'group_id, date et departure_time sont requis' },
                { status: 400 }
            );
        }

        const memberCheck = await query(
            `
            SELECT id FROM carpool_group_members 
            WHERE group_id = $1 AND parent_id = $2 AND status = 'accepted'
            `,
            [group_id, user.id]
        );

        if (memberCheck.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Vous devez être membre du groupe' },
                { status: 403 }
            );
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
                return NextResponse.json(
                    { success: false, error: 'Le conducteur doit être membre du groupe' },
                    { status: 400 }
                );
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

        return NextResponse.json(
            {
                success: true,
                message: 'Trajet ajouté au calendrier',
                data: complete.rows[0]
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('❌ Erreur ajout calendrier:', error);
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

// GET - Récupérer le calendrier du groupe
export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user || user.role !== 'parent') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const group_id = searchParams.get('group_id');
        const start_date = searchParams.get('start_date');
        const end_date = searchParams.get('end_date');

        if (!group_id) {
            return NextResponse.json(
                { success: false, error: 'group_id est requis' },
                { status: 400 }
            );
        }

        const memberCheck = await query(
            `
            SELECT id FROM carpool_group_members 
            WHERE group_id = $1 AND parent_id = $2 AND status = 'accepted'
            `,
            [group_id, user.id]
        );

        if (memberCheck.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Vous devez être membre du groupe' },
                { status: 403 }
            );
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
            [...params, user.id]
        );

        return NextResponse.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });

    } catch (error: any) {
        console.error('❌ Erreur récupération calendrier:', error);
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

// PUT - Modifier une entrée du calendrier
export async function PUT(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user || user.role !== 'parent') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            );
        }

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
            return NextResponse.json(
                { success: false, error: 'calendar_id est requis' },
                { status: 400 }
            );
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
            return NextResponse.json(
                { success: false, error: 'Entrée introuvable ou non autorisée' },
                { status: 403 }
            );
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
            return NextResponse.json(
                { success: false, error: 'Aucune modification fournie' },
                { status: 400 }
            );
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

        return NextResponse.json({
            success: true,
            message: 'Calendrier mis à jour',
            data: updated.rows[0]
        });

    } catch (error: any) {
        console.error('❌ Erreur modification calendrier:', error);
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

// DELETE - Supprimer une entrée du calendrier
export async function DELETE(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user || user.role !== 'parent') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const calendar_id = searchParams.get('calendar_id');

        if (!calendar_id) {
            return NextResponse.json(
                { success: false, error: 'calendar_id est requis' },
                { status: 400 }
            );
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
            return NextResponse.json(
                { success: false, error: 'Entrée introuvable ou non autorisée' },
                { status: 403 }
            );
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