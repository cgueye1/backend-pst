/**
 * @swagger
 * /api/parents/carpool/groups:
 *   get:
 *     summary: Récupérer les groupes
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Créer un groupe de covoiturage
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: modifier un groupe
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: supprimer un groupe
 *     tags: [Parents]

 */
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST - Créer un groupe
export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user || user.role !== 'parent') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé. Seuls les parents peuvent créer des groupes.' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { name, description, school_id } = body;

        if (!name) {
            return NextResponse.json(
                { success: false, error: 'Le nom du groupe est requis' },
                { status: 400 }
            );
        }

        if (school_id) {
            const schoolCheck = await query(
                `SELECT id FROM schools WHERE id = $1`,
                [school_id]
            );

            if (schoolCheck.rowCount === 0) {
                return NextResponse.json(
                    { success: false, error: 'École introuvable' },
                    { status: 404 }
                );
            }
        }

        const groupResult = await query(
            `
            INSERT INTO carpool_groups (name, description, school_id, creator_id, created_at, updated_at)
            VALUES ($1, $2, $3, $4, NOW(), NOW())
            RETURNING *
            `,
            [name, description || null, school_id || null, user.id]
        );

        const newGroup = groupResult.rows[0];

        await query(
            `
            INSERT INTO carpool_group_members (group_id, parent_id, status, invited_at, responded_at)
            VALUES ($1, $2, 'accepted', NOW(), NOW())
            `,
            [newGroup.id, user.id]
        );

        const completeGroup = await query(
            `
            SELECT 
                g.*,
                s.name as school_name,
                s.address as school_address,
                u.name as creator_name,
                u.email as creator_email,
                (SELECT COUNT(*) FROM carpool_group_members WHERE group_id = g.id AND status = 'accepted') as members_count
            FROM carpool_groups g
            LEFT JOIN schools s ON g.school_id = s.id
            LEFT JOIN users u ON g.creator_id = u.id
            WHERE g.id = $1
            `,
            [newGroup.id]
        );

        return NextResponse.json(
            {
                success: true,
                message: 'Groupe de covoiturage créé avec succès',
                data: completeGroup.rows[0]
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('  Erreur création groupe:', error);
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

// GET - Récupérer les groupes
export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user || user.role !== 'parent') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            );
        }

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
                u.name as creator_name,
                
                m.status as membership_status,
                m.invited_at,
                
                (SELECT COUNT(*) FROM carpool_group_members WHERE group_id = g.id AND status = 'accepted') as members_count,
                
                (g.creator_id = $1) as is_creator
                
            FROM carpool_groups g
            INNER JOIN carpool_group_members m ON g.id = m.group_id
            LEFT JOIN schools s ON g.school_id = s.id
            LEFT JOIN users u ON g.creator_id = u.id
            WHERE m.parent_id = $1
            ORDER BY g.created_at DESC
            `,
            [user.id]
        );

        return NextResponse.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });

    } catch (error: any) {
        console.error('❌ Erreur récupération groupes:', error);
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

// PUT - Modifier un groupe
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
        const { group_id, name, description, status } = body;

        if (!group_id) {
            return NextResponse.json(
                { success: false, error: 'group_id est requis' },
                { status: 400 }
            );
        }

        const ownerCheck = await query(
            `SELECT id FROM carpool_groups WHERE id = $1 AND creator_id = $2`,
            [group_id, user.id]
        );

        if (ownerCheck.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Seul le créateur peut modifier le groupe' },
                { status: 403 }
            );
        }

        const updateFields = [];
        const updateValues = [];
        let paramIndex = 1;

        if (name !== undefined) {
            updateFields.push(`name = $${paramIndex++}`);
            updateValues.push(name);
        }
        if (description !== undefined) {
            updateFields.push(`description = $${paramIndex++}`);
            updateValues.push(description);
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
        updateValues.push(group_id);

        await query(
            `UPDATE carpool_groups SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`,
            updateValues
        );

        const updated = await query(
            `
            SELECT 
                g.*,
                s.name as school_name,
                (SELECT COUNT(*) FROM carpool_group_members WHERE group_id = g.id AND status = 'accepted') as members_count
            FROM carpool_groups g
            LEFT JOIN schools s ON g.school_id = s.id
            WHERE g.id = $1
            `,
            [group_id]
        );

        return NextResponse.json({
            success: true,
            message: 'Groupe mis à jour avec succès',
            data: updated.rows[0]
        });

    } catch (error: any) {
        console.error('❌ Erreur modification groupe:', error);
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

// DELETE - Supprimer un groupe
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
        const group_id = searchParams.get('group_id');

        if (!group_id) {
            return NextResponse.json(
                { success: false, error: 'group_id est requis' },
                { status: 400 }
            );
        }

        const ownerCheck = await query(
            `SELECT id, name FROM carpool_groups WHERE id = $1 AND creator_id = $2`,
            [group_id, user.id]
        );

        if (ownerCheck.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Seul le créateur peut supprimer le groupe' },
                { status: 403 }
            );
        }

        const groupName = ownerCheck.rows[0].name;

        await query(
            `DELETE FROM carpool_groups WHERE id = $1`,
            [group_id]
        );

        return NextResponse.json({
            success: true,
            message: `Groupe "${groupName}" supprimé avec succès`
        });

    } catch (error: any) {
        console.error('❌ Erreur suppression groupe:', error);
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