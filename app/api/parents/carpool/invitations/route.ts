
/**
 * @swagger
 * /api/parents/carpool/invitations:
 *   get:
 *     summary:  Récupérer les invitations
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *   post:
 *      summary: Inviter une famille
 *      tags: [Parents]
 *   put:
 *      summary: Répondre à une invitation
 *      tags: [Parents]
 *
 */
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST - Inviter une famille
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
        const { group_id, parent_email } = body;

        if (!group_id || !parent_email) {
            return NextResponse.json(
                { success: false, error: 'group_id et parent_email sont requis' },
                { status: 400 }
            );
        }

        const groupCheck = await query(
            `
            SELECT g.id, g.name, g.creator_id
            FROM carpool_groups g
            INNER JOIN carpool_group_members m ON g.id = m.group_id
            WHERE g.id = $1 AND m.parent_id = $2 AND m.status = 'accepted'
            `,
            [group_id, user.id]
        );

        if (groupCheck.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Groupe introuvable ou vous n\'en êtes pas membre' },
                { status: 403 }
            );
        }

        const parentCheck = await query(
            `SELECT id, name, email FROM users WHERE email = $1 AND role = 'parent'`,
            [parent_email]
        );

        if (parentCheck.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Aucun parent trouvé avec cet email' },
                { status: 404 }
            );
        }

        const invitedParent = parentCheck.rows[0];

        const memberCheck = await query(
            `SELECT id, status FROM carpool_group_members WHERE group_id = $1 AND parent_id = $2`,
            [group_id, invitedParent.id]
        );

        if (Number(memberCheck.rowCount) > 0) {
            const currentStatus = memberCheck.rows[0].status;
            return NextResponse.json(
                {
                    success: false,
                    error: `Cette famille est déjà ${
                        currentStatus === 'accepted' ? 'membre du groupe' :
                            currentStatus === 'pending' ? 'invitée (en attente)' :
                                'a décliné l\'invitation'
                    }`
                },
                {status: 400}
            );
        } else {
            const invitation = await query(
                `
                INSERT INTO carpool_group_members (group_id, parent_id, status, invited_at)
                VALUES ($1, $2, 'pending', NOW())
                RETURNING *
                `,
                [group_id, invitedParent.id]
            );
            return NextResponse.json(
                {
                    success: true,
                    message: `Invitation envoyée à ${invitedParent.name}`,
                    data: {
                        ...invitation.rows[0],
                        parent_name: invitedParent.name,
                        parent_email: invitedParent.email
                    }
                },
                {status: 201}
            );
        }

    } catch (error: any) {
        console.error('❌ Erreur invitation:', error);
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

// GET - Récupérer les invitations
export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user || user.role !== 'parent') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            );
        }
        const userid= user.id;
        console.log(userid)

        const { searchParams } = new URL(req.url);
        const group_id = searchParams.get('group_id');
        const type = searchParams.get('type');

        if (type === 'received') {
            const result = await query(
                `
                SELECT 
                    m.id,
                    m.group_id,
                    m.status,
                    m.invited_at,
                    g.name as group_name,
                    g.description as group_description,
                    s.name as school_name,
                    u.name as inviter_name
                FROM carpool_group_members m
                INNER JOIN carpool_groups g ON m.group_id = g.id
                LEFT JOIN schools s ON g.school_id = s.id
                LEFT JOIN users u ON g.creator_id = u.id
                WHERE m.parent_id = $1 AND m.status = 'pending'
                ORDER BY m.invited_at DESC
                 `,
                [user.id]
            );

            return NextResponse.json({
                success: true,
                data: result.rows,
                count: result.rows.length
            });
        }

        if (group_id) {
            const result = await query(
                `
                SELECT 
                    m.id,
                    m.parent_id,
                    m.status,
                    m.invited_at,
                    m.responded_at,
                    u.name as parent_name,
                    u.email as parent_email,
                    u.phone as parent_phone
                FROM carpool_group_members m
                INNER JOIN users u ON m.parent_id = u.id
                WHERE m.group_id = $1
                ORDER BY 
                    CASE m.status
                        WHEN 'accepted' THEN 1
                        WHEN 'pending' THEN 2
                        WHEN 'declined' THEN 3
                    END,
                    m.invited_at DESC
                `,
                [group_id]
            );

            return NextResponse.json({
                success: true,
                data: result.rows,
                count: result.rows.length
            });
        }

        return NextResponse.json(
            { success: false, error: 'Paramètre group_id ou type=received requis' },
            { status: 400 }
        );

    } catch (error: any) {
        console.error('❌ Erreur récupération invitations:', error);
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

// PUT - Répondre à une invitation
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
        const { invitation_id, action } = body;

        if (!invitation_id || !action) {
            return NextResponse.json(
                { success: false, error: 'invitation_id et action sont requis' },
                { status: 400 }
            );
        }

        if (!['accept', 'decline'].includes(action)) {
            return NextResponse.json(
                { success: false, error: 'action doit être "accept" ou "decline"' },
                { status: 400 }
            );
        }

        const invitationCheck = await query(
            `
            SELECT m.*, g.name as group_name
            FROM carpool_group_members m
            INNER JOIN carpool_groups g ON m.group_id = g.id
            WHERE m.id = $1 AND m.parent_id = $2 AND m.status = 'pending'
            `,
            [invitation_id, user.id]
        );

        if (invitationCheck.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Invitation introuvable ou déjà traitée' },
                { status: 404 }
            );
        }

        const invitation = invitationCheck.rows[0];
        const newStatus = action === 'accept' ? 'accepted' : 'declined';

        await query(
            `
            UPDATE carpool_group_members 
            SET status = $1, responded_at = NOW()
            WHERE id = $2
            `,
            [newStatus, invitation_id]
        );

        return NextResponse.json({
            success: true,
            message: action === 'accept'
                ? `Vous avez rejoint le groupe "${invitation.group_name}"`
                : `Invitation au groupe "${invitation.group_name}" déclinée`
        });

    } catch (error: any) {
        console.error('❌ Erreur réponse invitation:', error);
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