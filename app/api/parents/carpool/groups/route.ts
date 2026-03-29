/**
 * @swagger
 * /api/parents/carpool/groups:
 *   get:
 *     summary: Récupérer les groupes
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []

 *     responses:
 *       200:
 *         description: Liste des groupes
 *       401:
 *         description: Non autorisé
 *   post:
 *     summary: Créer un groupe de covoiturage
 *     description: Crée un nouveau groupe de covoiturage
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               school_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Groupe créé avec succès
 *       400:
 *         description: Paramètres invalides
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: École introuvable
 *   put:
 *     summary: Modifier un groupe
 *     description: Modifie les informations d'un groupe de covoiturage
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
 *             properties:
 *               group_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Groupe mis à jour avec succès
 *       400:
 *         description: Paramètres invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé (seul le créateur peut modifier)
 *   delete:
 *     summary: Supprimer un groupe
 *     description: Supprime un groupe de covoiturage
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: group_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du groupe à supprimer
 *     responses:
 *       200:
 *         description: Groupe supprimé avec succès
 *       400:
 *         description: Paramètres invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé (seul le créateur peut supprimer)
 *     tags: [Parents]

 */
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

import { setCorsHeaders, corsOptions } from '@/lib/cors';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST - Créer un groupe
export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const user = await getUserFromRequest(req);

        if (!user || user.role !== 'parent') {
            const response = NextResponse.json(
                { success: false, error: 'Non autorisé. Seuls les parents peuvent créer des groupes.' },
                { status: 401 }
            );
            return setCorsHeaders(response, origin);
        }

        const body = await req.json();
        const { name, description, school_id } = body;

        if (!name) {
            const response = NextResponse.json(
                { success: false, error: 'Le nom du groupe est requis' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        if (school_id) {
            const schoolCheck = await query(
                `SELECT id FROM schools WHERE id = $1`,
                [school_id]
            );

            if (schoolCheck.rowCount === 0) {
                const response = NextResponse.json(
                    { success: false, error: 'École introuvable' },
                    { status: 404 }
                );
                return setCorsHeaders(response, origin);
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

        const response = NextResponse.json(
            {
                success: true,
                message: 'Groupe de covoiturage créé avec succès',
                data: completeGroup.rows[0]
            },
            { status: 201 }
        );
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('  Erreur création groupe:', error);
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

// GET - Récupérer les groupes
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

        // Convertir user.id en nombre pour éviter les problèmes de type
        const userId = Number(user.id);

        // Debug: logger l'ID de l'utilisateur
        console.log('🔍 User ID original:', user.id, 'Type:', typeof user.id);
        console.log('🔍 User ID converti:', userId, 'Type:', typeof userId);

        // Vérifier d'abord si des groupes existent
        const allGroupsCheck = await query(
            `SELECT COUNT(*) as total FROM carpool_groups`
        );
        console.log('📊 Total groupes dans la base:', allGroupsCheck.rows[0]?.total);

        // Vérifier les groupes où l'utilisateur est créateur
        const creatorCheck = await query(
            `SELECT COUNT(*) as total FROM carpool_groups WHERE creator_id = $1`,
            [userId]
        );
        console.log('👤 Groupes créés par user:', creatorCheck.rows[0]?.total);

        // Vérifier les membres
        const memberCheck = await query(
            `SELECT COUNT(*) as total FROM carpool_group_members WHERE parent_id = $1`,
            [userId]
        );
        console.log('👥 Membres pour user:', memberCheck.rows[0]?.total);

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
                
                COALESCE(m.status, CASE WHEN g.creator_id = $1 THEN 'accepted' ELSE NULL END) as membership_status,
                m.invited_at,
                
                (SELECT COUNT(*) FROM carpool_group_members WHERE group_id = g.id AND status = 'accepted') as members_count,
                
                (g.creator_id = $1) as is_creator
                
            FROM carpool_groups g
            LEFT JOIN carpool_group_members m ON g.id = m.group_id AND m.parent_id = $1
            LEFT JOIN schools s ON g.school_id = s.id
            LEFT JOIN users u ON g.creator_id = u.id
            WHERE (m.parent_id = $1 OR g.creator_id = $1)
            ORDER BY g.created_at DESC
            `,
            [userId]
        );

        console.log('✅ Résultat requête:', result.rows.length, 'groupes trouvés');

        const response = NextResponse.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur récupération groupes:', error);
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

// PUT - Modifier un groupe
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

        const body = await req.json();
        const { group_id, name, description, status } = body;

        if (!group_id) {
            const response = NextResponse.json(
                { success: false, error: 'group_id est requis' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        const ownerCheck = await query(
            `SELECT id FROM carpool_groups WHERE id = $1 AND creator_id = $2`,
            [group_id, user.id]
        );

        if (ownerCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Seul le créateur peut modifier le groupe' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
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
            const response = NextResponse.json(
                { success: false, error: 'Aucune modification fournie' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
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

        const response = NextResponse.json({
            success: true,
            message: 'Groupe mis à jour avec succès',
            data: updated.rows[0]
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur modification groupe:', error);
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

// DELETE - Supprimer un groupe
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

        const { searchParams } = new URL(req.url);
        const group_id = searchParams.get('group_id');

        if (!group_id) {
            const response = NextResponse.json(
                { success: false, error: 'group_id est requis' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        const ownerCheck = await query(
            `SELECT id, name FROM carpool_groups WHERE id = $1 AND creator_id = $2`,
            [group_id, user.id]
        );

        if (ownerCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Seul le créateur peut supprimer le groupe' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const groupName = ownerCheck.rows[0].name;

        await query(
            `DELETE FROM carpool_groups WHERE id = $1`,
            [group_id]
        );

        const response = NextResponse.json({
            success: true,
            message: `Groupe "${groupName}" supprimé avec succès`
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur suppression groupe:', error);
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