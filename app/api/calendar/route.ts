/**
 * @swagger
 * /api/calendar:
 *   get:
 *     summary: Récupérer les événements du calendrier
 *     description: >
 *       Retourne les vacances scolaires (si schoolId est fourni)
 *       ou les jours fériés pour un mois et une année donnés.
 *     tags: [ADMIN]

 *
 *   post:
 *     summary: Créer un événement
 *     description: >
 *       Crée un événement de type vacances scolaires (HOLIDAY)
 *       ou jour férié (FERIE).
 *     tags: [ADMIN]

*/


import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

import { setCorsHeaders, corsOptions } from '@/lib/cors';
/**
 * GET /api/calendar
 * Récupère les événements (vacances + jours fériés) pour un mois donné
 */
export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const { searchParams } = new URL(req.url);
        const schoolId = searchParams.get('schoolId');
        const month = parseInt(searchParams.get('month') || '0');
        const year = parseInt(searchParams.get('year') || '0');

        if (!month || !year || month < 1 || month > 12) {
            const response = NextResponse.json(
                { error: 'Paramètres invalides (month et year requis)' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        //   PAS D'ÉCOLE → PAS DE VACANCES
        if (schoolId) {
            const vacationsQuery = `
                SELECT
                    id,
                    name AS title,
                    start_date,
                    end_date,
                    school_id AS "schoolId",
                    'HOLIDAY' AS type
                FROM school_vacations
                WHERE school_id = $1
                  AND (
                    (start_date <= DATE '${year}-${month}-31'
                        AND end_date >= DATE '${year}-${month}-01')
                    )
            `;

            const vacations = await query(vacationsQuery, [schoolId]);
            const events = [
                ...vacations.rows.map(v => ({
                    ...v,
                    type: 'HOLIDAY',
                    schoolId: v.school_id,
                    start_date: v.start_date.toISOString().split('T')[0],
                    end_date: v.end_date.toISOString().split('T')[0]
                }))
            ];
            const response = NextResponse.json(events);
            return setCorsHeaders(response, origin);
        }
        
        // Jours fériés (toujours récupérés, pas de filtre école)
        const holidays = await query(
            `
      SELECT 
        id, 
        label AS title, 
        date AS start_date, 
        date AS end_date
      FROM public_holidays
      WHERE EXTRACT(MONTH FROM date) = $1
        AND EXTRACT(YEAR FROM date) = $2
      `,
            [month, year]
        );

        // Fusion des deux types d'événements
        const events = [
            ...holidays.rows.map(h => ({
                ...h,
                type: 'FERIE',
                schoolId: null,
                start_date: h.start_date.toISOString().split('T')[0],
                end_date: h.end_date.toISOString().split('T')[0]
            }))
        ];

        const response = NextResponse.json(events);
        return setCorsHeaders(response, origin);
    } catch (error) {
        console.error('Erreur GET /api/calendar:', error);
        const response = NextResponse.json(
            { error: 'Erreur serveur lors de la récupération des événements' },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}

/**
 * POST /api/calendar
 * Crée un nouvel événement (vacances ou jour férié)
 */
export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const body = await req.json();
        const { schoolId, name, startDate, endDate, type } = body;

        // Validation
        if (!type || !startDate || !name) {
            const response = NextResponse.json(
                { error: 'Champs obligatoires: type, startDate, name' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        if (!['HOLIDAY', 'FERIE'].includes(type)) {
            const response = NextResponse.json(
                { error: 'Type invalide (doit être HOLIDAY ou FERIE)' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Validation spécifique aux vacances
        if (type === 'HOLIDAY') {
            if (!schoolId) {
                const response = NextResponse.json(
                    { error: 'schoolId requis pour les vacances' },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }
            if (!endDate) {
                const response = NextResponse.json(
                    { error: 'endDate requis pour les vacances' },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            // Insertion dans school_vacations
            const result = await query(
                `INSERT INTO school_vacations (school_id, name, start_date, end_date)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
                [schoolId, name, startDate, endDate]
            );

            const response = NextResponse.json({
                message: 'Vacances créées avec succès',
                id: result.rows[0].id
            });
            return setCorsHeaders(response, origin);
        }

        // Type FERIE
        const result = await query(
            `INSERT INTO public_holidays (label, date) 
       VALUES ($1, $2)
       RETURNING id`,
            [name, startDate]
        );

        const response = NextResponse.json({
            message: 'Jour férié créé avec succès',
            id: result.rows[0].id
        });
        return setCorsHeaders(response, origin);
    } catch (error) {
        console.error('Erreur POST /api/calendar:', error);
        const response = NextResponse.json(
            { error: 'Erreur serveur lors de la création de l\'événement' },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}
