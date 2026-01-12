/**
 * @swagger
 * /api/parents/children/schedules:
 *   get:
 *     summary: Récupérer les horaires d'un enfant
 *     description: Retourne la liste de tous les enfants avec leurs horaires personnalisés
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Personnaliser les horaires par jour pour un enfant
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
        const { child_id, schedules } = body;

        // Validation
        if (!child_id) {
            return NextResponse.json(
                { success: false, error: 'child_id est requis' },
                { status: 400 }
            );
        }

        if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'schedules doit être un tableau non vide. Format: [{ day: "monday", arrival_time: "08:00", departure_time: "16:30" }]'
                },
                { status: 400 }
            );
        }

        // Vérifier que l'enfant appartient bien au parent
        const ownerCheck = await query(
            `SELECT id, name FROM children WHERE id = $1 AND parent_id = $2`,
            [child_id, user.id]
        );

        if (ownerCheck.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Enfant introuvable ou non autorisé' },
                { status: 403 }
            );
        }

        const childName = ownerCheck.rows[0].name;

        // Valider chaque horaire
        const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        for (const schedule of schedules) {
            if (!schedule.day || !validDays.includes(schedule.day)) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Jour invalide. Valeurs acceptées: ${validDays.join(', ')}`
                    },
                    { status: 400 }
                );
            }

            if (!schedule.arrival_time || !schedule.departure_time) {
                return NextResponse.json(
                    { success: false, error: 'arrival_time et departure_time sont requis pour chaque horaire' },
                    { status: 400 }
                );
            }
        }

        // Supprimer les anciens horaires
        await query(
            `DELETE FROM child_schedules WHERE child_id = $1`,
            [child_id]
        );

        // Ajouter les nouveaux horaires
        for (const schedule of schedules) {
            await query(
                `
                INSERT INTO child_schedules (
                    child_id,
                    day_of_week,
                    arrival_time,
                    departure_time,
                    created_at
                )
                VALUES ($1, $2, $3, $4, NOW())
                `,
                [child_id, schedule.day, schedule.arrival_time, schedule.departure_time]
            );
        }

        // Récupérer l'enfant avec ses nouveaux horaires
        const updatedChild = await query(
            `
            SELECT 
                c.id,
                c.name,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', cs.id,
                            'day', cs.day_of_week,
                            'arrival_time', cs.arrival_time::text,
                            'departure_time', cs.departure_time::text
                        ) ORDER BY 
                            CASE cs.day_of_week
                                WHEN 'monday' THEN 1
                                WHEN 'tuesday' THEN 2
                                WHEN 'wednesday' THEN 3
                                WHEN 'thursday' THEN 4
                                WHEN 'friday' THEN 5
                                WHEN 'saturday' THEN 6
                                WHEN 'sunday' THEN 7
                            END
                    ) FILTER (WHERE cs.id IS NOT NULL),
                    '[]'::json
                ) as schedules
            FROM children c
            LEFT JOIN child_schedules cs ON c.id = cs.child_id
            WHERE c.id = $1
            GROUP BY c.id
            `,
            [child_id]
        );

        return NextResponse.json({
            success: true,
            message: `Horaires personnalisés pour ${childName} enregistrés avec succès`,
            data: updatedChild.rows[0]
        });

    } catch (error: any) {
        console.error('❌ Erreur personnalisation horaires:', error);
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

// ========================================
// GET - Récupérer les horaires d'un enfant
// ========================================
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
        const child_id = searchParams.get('child_id');

        if (!child_id) {
            return NextResponse.json(
                { success: false, error: 'child_id est requis dans les query params' },
                { status: 400 }
            );
        }

        // Vérifier que l'enfant appartient bien au parent
        const ownerCheck = await query(
            `SELECT id FROM children WHERE id = $1 AND parent_id = $2`,
            [child_id, user.id]
        );

        if (ownerCheck.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Enfant introuvable ou non autorisé' },
                { status: 403 }
            );
        }

        // Récupérer les horaires
        const result = await query(
            `
            SELECT 
                id,
                day_of_week as day,
                arrival_time::text as arrival_time,
                departure_time::text as departure_time,
                created_at
            FROM child_schedules
            WHERE child_id = $1
            ORDER BY 
                CASE day_of_week
                    WHEN 'monday' THEN 1
                    WHEN 'tuesday' THEN 2
                    WHEN 'wednesday' THEN 3
                    WHEN 'thursday' THEN 4
                    WHEN 'friday' THEN 5
                    WHEN 'saturday' THEN 6
                    WHEN 'sunday' THEN 7
                END
            `,
            [child_id]
        );

        return NextResponse.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });

    } catch (error: any) {
        console.error('❌ Erreur récupération horaires:', error);
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