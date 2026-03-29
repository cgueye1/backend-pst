/**
 * @swagger
 * /api/parents/carpool/calendar/{calendarId}/replace:
 *   post:
 *     summary: Demander un remplacement pour un jour assigné
 *     description: Demande un remplacement pour un jour assigné avec un motif
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: calendarId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'entrée du calendrier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 maxLength: 500
 *                 description: Motif de la demande de remplacement (max 500 caractères)
 *     responses:
 *       201:
 *         description: Demande de remplacement créée avec succès
 *       400:
 *         description: Paramètres invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Entrée du calendrier introuvable
 */
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { setCorsHeaders, corsOptions } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = {
    params: Promise<{ calendarId: string }>;
};

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

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

        const { calendarId: calendarIdParam } = await context.params;
        const userId = Number(user.id);
        const calendarId = Number(calendarIdParam);
        const body = await req.json();
        const { reason } = body;

        if (!reason || reason.trim() === '') {
            const response = NextResponse.json(
                { success: false, error: 'Le motif est requis' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Limiter la longueur du motif à 500 caractères
        const MAX_REASON_LENGTH = 500;
        if (reason.length > MAX_REASON_LENGTH) {
            const response = NextResponse.json(
                { success: false, error: `Le motif ne peut pas dépasser ${MAX_REASON_LENGTH} caractères` },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier que l'entrée existe et que c'est bien assigné à l'utilisateur
        const calendarCheck = await query(
            `
            SELECT c.*, g.id as group_id
            FROM carpool_calendar c
            INNER JOIN carpool_groups g ON c.group_id = g.id
            WHERE c.id = $1 AND c.driver_id = $2
            `,
            [calendarId, userId]
        );

        if (!calendarCheck.rowCount || calendarCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Entrée introuvable ou ce n\'est pas votre jour assigné' },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const calendarEntry = calendarCheck.rows[0];

        // Vérifier qu'il n'y a pas déjà une demande de remplacement en attente
        const existingRequest = await query(
            `
            SELECT id FROM carpool_replacement_requests 
            WHERE calendar_id = $1 AND status = 'pending'
            `,
            [calendarId]
        );

        if (existingRequest.rowCount && existingRequest.rowCount > 0) {
            const response = NextResponse.json(
                { success: false, error: 'Une demande de remplacement est déjà en attente pour ce jour' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Créer la demande de remplacement
        const replacementRequest = await query(
            `
            INSERT INTO carpool_replacement_requests (
                calendar_id, requested_by, reason, status, created_at
            )
            VALUES ($1, $2, $3, 'pending', NOW())
            RETURNING *
            `,
            [calendarId, userId, reason]
        );

        // Mettre à jour le statut de confirmation du calendrier
        await query(
            `
            UPDATE carpool_calendar 
            SET confirmation_status = 'replacement_requested', updated_at = NOW()
            WHERE id = $1
            `,
            [calendarId]
        );

        // Récupérer la demande complète
        const completeRequest = await query(
            `
            SELECT 
                r.*,
                c.date,
                c.group_id,
                u.name as requested_by_name,
                u.email as requested_by_email
            FROM carpool_replacement_requests r
            INNER JOIN carpool_calendar c ON r.calendar_id = c.id
            INNER JOIN users u ON r.requested_by = u.id
            WHERE r.id = $1
            `,
            [replacementRequest.rows[0].id]
        );

        const response = NextResponse.json({
            success: true,
            message: 'Demande de remplacement créée avec succès',
            data: completeRequest.rows[0]
        }, { status: 201 });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur demande remplacement:', error);
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

