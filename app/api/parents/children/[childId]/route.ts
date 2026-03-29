/**
 * @swagger
 * /api/parents/children/{childId}:
 *   get:
 *     summary: Récupérer un enfant par ID
 *     description: Récupère les informations détaillées d'un enfant spécifique.
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: childId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'enfant
 *     responses:
 *       200:
 *         description: Succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Ressource non trouvée
 *       500:
 *         description: Erreur serveur
 *   put:
 *     summary: Mettre à jour un enfant
 *     description: Met à jour les informations d'un enfant.
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: childId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID childId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               school_id:
 *                 type: integer
 *               birth_date:
 *                 type: string
 *                 format: date
 *               grade:
 *                 type: string
 *     responses:
 *       200:
 *         description: Succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Ressource non trouvée
 *       500:
 *         description: Erreur serveur
 *   delete:
 *     summary: Supprimer un enfant
 *     description: Supprime un enfant du compte du parent.
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: childId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID childId
 *     responses:
 *       200:
 *         description: Succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Ressource non trouvée
 *       500:
 *         description: Erreur serveur
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { z } from 'zod';
import { setCorsHeaders, corsOptions } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = {
    params: Promise<{ childId: string }>;
};

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(req: NextRequest, context: Params) {
    try {
        const origin = req.headers.get('origin');
        const user = await getUserFromRequest(req);

        if (!user || user.role !== 'parent') {
            const errorResponse = NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 403 }
            );
            return setCorsHeaders(errorResponse, origin);
        }

        const { childId } = await context.params;

        const result = await query(
            `
      SELECT 
        c.id,
        c.name,
        c.address,
        c.schedule,
        c.created_at,
        
        -- École
        s.id as school_id,
        s.name as school_name,
        s.address as school_address,
        s.opening_time,
        s.closing_time,
        s.schedule as school_schedule,
        
        -- Trajets
        json_agg(
          DISTINCT jsonb_build_object(
            'trip_id', t.id,
            'departure_time', t.departure_time,
            'status', t.status,
            'start_point', t.start_point,
            'end_point', t.end_point,
            'is_recurring', t.is_recurring,
            'driver_name', u_driver.name,
            'driver_phone', u_driver.phone
          ) ORDER BY t.departure_time DESC
        ) FILTER (WHERE t.id IS NOT NULL) as trips
        
      FROM children c
      LEFT JOIN schools s ON c.school_id = s.id
      LEFT JOIN trip_children tc ON c.id = tc.child_id
      LEFT JOIN trips t ON tc.trip_id = t.id
      LEFT JOIN drivers d ON t.driver_id = d.id
      LEFT JOIN users u_driver ON d.user_id = u_driver.id
      
      WHERE c.id = $1 AND c.parent_id = $2
      
      GROUP BY c.id, s.id
      `,
            [childId, user.id]
        );

        if (result.rows.length === 0) {
            const errorResponse = NextResponse.json(
                { success: false, error: 'Enfant introuvable' },
                { status: 404 }
            );
            return setCorsHeaders(errorResponse, origin);
        }

        const response = NextResponse.json({
            success: true,
            data: result.rows[0]
        });

        return setCorsHeaders(response, origin);

    } catch (error) {
        console.error('Erreur récupération enfant:', error);
        const origin = req.headers.get('origin');
        const errorResponse = NextResponse.json(
            { success: false, error: 'Erreur serveur' },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

export async function PUT(req: NextRequest, context: Params) {
    try {
        const origin = req.headers.get('origin');
        const user = await getUserFromRequest(req);

        if (!user || user.role !== 'parent') {
            const errorResponse = NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 403 }
            );
            return setCorsHeaders(errorResponse, origin);
        }

        const { childId } = await context.params;
        const body = await req.json();
        const { name, school_id, address, schedule } = body;

        // Vérifier que l'enfant appartient au parent
        const childCheck = await query(
            `SELECT id FROM children WHERE id = $1 AND parent_id = $2`,
            [childId, user.id]
        );

        if (childCheck.rowCount === 0 || !childCheck.rowCount) {
            const errorResponse = NextResponse.json(
                { success: false, error: 'Enfant introuvable ou non autorisé' },
                { status: 403 }
            );
            return setCorsHeaders(errorResponse, origin);
        }

        // Validation avec Zod
        const createChildSchema = z.object({
            name: z.string().min(1).max(150).optional(),
            school_id: z.number().int().positive().optional(),
            address: z.string().optional(),
            schedule: z.array(z.any()).optional()
        });

        try {
            if (name || school_id || address || schedule) {
                createChildSchema.partial().parse({ name, school_id, address, schedule });
            }
        } catch (validationError: any) {
            if (validationError instanceof z.ZodError) {
                const errorResponse = NextResponse.json(
                    { success: false, error: 'Données invalides', details: validationError.issues },
                    { status: 400 }
                );
                return setCorsHeaders(errorResponse, origin);
            }
        }

        // Validation basique
        if (name && name.trim() === '') {
            const errorResponse = NextResponse.json(
                { success: false, error: 'Le nom ne peut pas être vide' },
                { status: 400 }
            );
            return setCorsHeaders(errorResponse, origin);
        }

        // Construire la requête SQL dynamiquement
        const updates: string[] = [];
        const queryParams: any[] = [];
        let paramIndex = 1;

        if (name !== undefined) {
            updates.push(`name = $${paramIndex++}`);
            queryParams.push(name);
        }

        if (school_id !== undefined) {
            updates.push(`school_id = $${paramIndex++}`);
            queryParams.push(school_id);
        }

        if (address !== undefined) {
            updates.push(`address = $${paramIndex++}`);
            queryParams.push(address);
        }

        if (schedule !== undefined && Array.isArray(schedule)) {
            updates.push(`schedule = $${paramIndex++}`);
            queryParams.push(JSON.stringify(schedule));
        }

        if (updates.length === 0) {
            const errorResponse = NextResponse.json(
                { success: false, error: 'Aucune donnée à mettre à jour' },
                { status: 400 }
            );
            return setCorsHeaders(errorResponse, origin);
        }

        queryParams.push(childId, user.id);

        let result;
        try {
            result = await query(
                `
          UPDATE children
          SET ${updates.join(', ')}
          WHERE id = $${paramIndex} AND parent_id = $${paramIndex + 1}
          RETURNING id, name, school_id, address, schedule, created_at
          `,
                queryParams
            );
        } catch (dbError: any) {
            // Fallback si la colonne schedule n'existe pas
            if (dbError.message && dbError.message.includes('column "schedule"')) {
                console.warn('Colonne schedule inexistante, mise à jour sans schedule');
                const updatesWithoutSchedule = updates.filter(u => !u.includes('schedule'));
                const paramsWithoutSchedule = queryParams.slice(0, -2); // Retirer childId et user.id
                
                // Retirer le schedule des params
                const scheduleIndex = updates.findIndex(u => u.includes('schedule'));
                if (scheduleIndex >= 0) {
                    paramsWithoutSchedule.splice(scheduleIndex, 1);
                }
                
                paramsWithoutSchedule.push(childId, user.id);
                
                result = await query(
                    `
            UPDATE children
            SET ${updatesWithoutSchedule.join(', ')}
            WHERE id = $${paramsWithoutSchedule.length - 1} AND parent_id = $${paramsWithoutSchedule.length}
            RETURNING id, name, school_id, address, created_at
            `,
                    paramsWithoutSchedule
                );
            } else {
                throw dbError;
            }
        }

        const response = NextResponse.json({
            success: true,
            message: 'Enfant mis à jour',
            data: result.rows[0]
        });

        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('Erreur mise à jour enfant:', error);
        const origin = req.headers.get('origin');
        const errorResponse = NextResponse.json(
            { success: false, error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

export async function DELETE(req: NextRequest, context: Params) {
    try {
        const origin = req.headers.get('origin');
        const user = await getUserFromRequest(req);

        if (!user || user.role !== 'parent') {
            const errorResponse = NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 403 }
            );
            return setCorsHeaders(errorResponse, origin);
        }

        const { childId } = await context.params;

        // Vérifier que l'enfant appartient au parent
        const childCheck = await query(
            `SELECT id FROM children WHERE id = $1 AND parent_id = $2`,
            [childId, user.id]
        );

        if (childCheck.rowCount === 0 || !childCheck.rowCount) {
            const errorResponse = NextResponse.json(
                { success: false, error: 'Enfant introuvable ou non autorisé' },
                { status: 404 }
            );
            return setCorsHeaders(errorResponse, origin);
        }

        // Vérifier s'il y a des trajets à venir
        const upcomingTripsCheck = await query(
            `
      SELECT COUNT(*) as count
      FROM trip_children tc
      INNER JOIN trips t ON tc.trip_id = t.id
      WHERE tc.child_id = $1
        AND t.departure_time > NOW()
        AND t.status = 'pending'
      `,
            [childId]
        );

        if (parseInt(upcomingTripsCheck.rows[0]?.count || '0') > 0) {
            const errorResponse = NextResponse.json(
                {
                    success: false,
                    error: 'Impossible de supprimer cet enfant. Il a des trajets à venir.'
                },
                { status: 400 }
            );
            return setCorsHeaders(errorResponse, origin);
        }

        // Supprimer l'enfant
        await query(
            `DELETE FROM children WHERE id = $1 AND parent_id = $2`,
            [childId, user.id]
        );

        const response = NextResponse.json({
            success: true,
            message: 'Enfant supprimé avec succès'
        });

        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('Erreur suppression enfant:', error);
        const origin = req.headers.get('origin');
        const errorResponse = NextResponse.json(
            { success: false, error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}
