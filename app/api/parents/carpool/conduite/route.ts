/**
 * @swagger
 * /api/parents/carpool/conduite:
 *   get:
 *     summary:  Récupérer les propositions d'échange
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *   post:
 *      summary: Proposer un échange
 *      tags: [Parents]
 *   put:
 *      summary: Répondre à une proposition
 *      tags: [Parents]
 *
 */
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

import { setCorsHeaders, corsOptions } from '@/lib/cors';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST - Proposer un échange
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
            calendar_id,
            target_driver_id,
            original_date,
            proposed_date,
            exchange_type, // 'swap', 'give', 'request'
            message
        } = body;

        if (!group_id || !original_date || !exchange_type) {
            const response = NextResponse.json(
                { success: false, error: 'group_id, original_date et exchange_type sont requis' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        if (!['swap', 'give', 'request'].includes(exchange_type)) {
            const response = NextResponse.json(
                { success: false, error: 'exchange_type doit être: swap, give ou request' },
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

        if (target_driver_id) {
            const targetCheck = await query(
                `
                SELECT id FROM carpool_group_members 
                WHERE group_id = $1 AND parent_id = $2 AND status = 'accepted'
                `,
                [group_id, target_driver_id]
            );

            if (targetCheck.rowCount === 0) {
                const response = NextResponse.json(
                    { success: false, error: 'Le conducteur cible doit être membre du groupe' },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }
        }

        // Après l'insertion de l'échange
        const exchange = await query(
            `
                INSERT INTO carpool_exchanges (
                    group_id, calendar_id, requester_id, target_driver_id,
                    original_date, proposed_date, exchange_type, message, status, created_at
                ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending',NOW())
                    RETURNING *
            `,
            [
                group_id,
                calendar_id || null,
                userId,
                target_driver_id || null,
                original_date,
                proposed_date || null,
                exchange_type,
                message || null
            ]
        );

        // Récupérer les parents du groupe (hors demandeur)
        const parents = await query(
            `
                SELECT p.id as parent_id, u.name as parent_name
                FROM carpool_group_members p
                         INNER JOIN users u ON p.parent_id=u.id
                WHERE p.group_id=$1 AND p.status='accepted' AND p.parent_id <> $2
            `,
            [group_id, userId]
        );

        // Créer notification pour chaque parent
        for (const parent of parents.rows) {
            const notif = await query(
                `
        INSERT INTO notifications (libelle, type, description, emetteur_id, send_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `,
                [
                    'Nouvelle proposition d\'échange',
                    'carpool_exchange',
                    `Une nouvelle proposition d'échange a été faite pour votre groupe. Date: ${proposed_date || original_date}`,
                    userId,
                    new Date() // envoie immédiat
                ]
            );

            await query(
                `
        INSERT INTO notification_destinataires (notification_id, destinataire_id)
        VALUES ($1,$2)
        `,
                [notif.rows[0].id, parent.parent_id]
            );
        }


        const complete = await query(
            `
            SELECT 
                e.*,
                u_req.name as requester_name,
                u_req.email as requester_email,
                u_target.name as target_driver_name,
                u_target.email as target_driver_email,
                g.name as group_name
            FROM carpool_exchanges e
            LEFT JOIN users u_req ON e.requester_id = u_req.id
            LEFT JOIN users u_target ON e.target_driver_id = u_target.id
            LEFT JOIN carpool_groups g ON e.group_id = g.id
            WHERE e.id = $1
            `,
            [exchange.rows[0].id]
        );


        const response = NextResponse.json(
            {
                success: true,
                message: 'Proposition d\'échange créée avec succès',
                data: complete.rows[0]
            },
            { status: 201 }
        );
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur création échange:', error);
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

// GET - Récupérer les propositions d'échange
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
        const type = searchParams.get('type'); // 'sent', 'received', 'all'

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

        if (memberCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Vous devez être membre du groupe' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        let whereClause = 'e.group_id = $1';
        const params: any[] = [Number(group_id)];

        if (type === 'sent') {
            whereClause += ' AND e.requester_id = $2';
            params.push(userId);
        } else if (type === 'received') {
            whereClause += ' AND (e.target_driver_id = $2 OR e.target_driver_id IS NULL)';
            params.push(userId);
        }

        const result = await query(
            `
            SELECT 
                e.id,
                e.group_id,
                e.calendar_id,
                e.requester_id,
                e.target_driver_id,
                e.original_date,
                e.proposed_date,
                e.exchange_type,
                e.message,
                e.status,
                e.created_at,
                e.responded_at,
                
                u_req.name as requester_name,
                u_req.email as requester_email,
                u_req.phone as requester_phone,
                
                u_target.name as target_driver_name,
                u_target.email as target_driver_email,
                
                c.departure_time,
                c.start_point,
                c.end_point,
                
                (e.requester_id = $${params.length + 1}) as is_my_request,
                (e.target_driver_id = $${params.length + 1} OR e.target_driver_id IS NULL) as can_respond
                
            FROM carpool_exchanges e
            LEFT JOIN users u_req ON e.requester_id = u_req.id
            LEFT JOIN users u_target ON e.target_driver_id = u_target.id
            LEFT JOIN carpool_calendar c ON e.calendar_id = c.id
            WHERE ${whereClause}
            ORDER BY 
                CASE e.status
                    WHEN 'pending' THEN 1
                    WHEN 'accepted' THEN 2
                    WHEN 'declined' THEN 3
                    WHEN 'canceled' THEN 4
                END,
                e.created_at DESC
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
        console.error('❌ Erreur récupération échanges:', error);
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

// PUT - Répondre à une proposition
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
        const { exchange_id, action } = body; // action: 'accept', 'decline', 'cancel'

        if (!exchange_id || !action) {
            const response = NextResponse.json(
                { success: false, error: 'exchange_id et action sont requis' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        if (!['accept', 'decline', 'cancel'].includes(action)) {
            const response = NextResponse.json(
                { success: false, error: 'action doit être: accept, decline ou cancel' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        const exchangeCheck = await query(
            `SELECT * FROM carpool_exchanges WHERE id = $1 AND status = 'pending'`,
            [exchange_id]
        );

        if (exchangeCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Proposition introuvable ou déjà traitée' },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const exchange = exchangeCheck.rows[0];

        if (action === 'cancel') {
            if (exchange.requester_id !== userId) {
                const response = NextResponse.json(
                    { success: false, error: 'Seul le demandeur peut annuler la proposition' },
                    { status: 403 }
                );
                return setCorsHeaders(response, origin);
            }
        } else {
            if (exchange.target_driver_id && exchange.target_driver_id !== userId) {
                const response = NextResponse.json(
                    { success: false, error: 'Vous n\'êtes pas le destinataire de cette proposition' },
                    { status: 403 }
                );
                return setCorsHeaders(response, origin);
            }
        }

        const newStatus = action === 'accept' ? 'accepted' :
            action === 'decline' ? 'declined' : 'canceled';

        await query(
            `
            UPDATE carpool_exchanges 
            SET status = $1, responded_at = NOW()
            WHERE id = $2
            `,
            [newStatus, exchange_id]
        );

        if (action === 'accept' && exchange.calendar_id) {
            if (exchange.exchange_type === 'swap' && exchange.proposed_date) {
                await query(
                    `
                    UPDATE carpool_calendar 
                    SET driver_id = $1, updated_at = NOW()
                    WHERE id = $2
                    `,
                    [userId, exchange.calendar_id]
                );
            } else if (exchange.exchange_type === 'give') {
                await query(
                    `
                    UPDATE carpool_calendar 
                    SET driver_id = $1, updated_at = NOW()
                    WHERE id = $2
                    `,
                    [exchange.requester_id, exchange.calendar_id]
                );
            }
        }

        const response = NextResponse.json({
            success: true,
            message: action === 'accept' ? 'Échange accepté' :
                action === 'decline' ? 'Échange refusé' :
                    'Proposition annulée'
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur réponse échange:', error);
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