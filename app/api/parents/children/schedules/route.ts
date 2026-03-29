/**
 * @swagger
 * /api/parents/children/schedules:
 *   get:
 *     summary: Récupérer les horaires des enfants
 *     description: Récupère les horaires personnalisés de tous les enfants du parent.
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
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
 *     summary: Mettre à jour les horaires d'un enfant
 *     description: Met à jour les horaires personnalisés d'un enfant.
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - child_id
 *               - schedule
 *             properties:
 *               child_id:
 *                 type: integer
 *               schedule:
 *                 type: object
 *                 description: Horaires hebdomadaires en JSON
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

import { setCorsHeaders, corsOptions } from '@/lib/cors';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Mapping des jours entre format API (anglais) et format base de données (français)
const DAY_MAPPING_EN_TO_FR: { [key: string]: string } = {
    'monday': 'Lundi',
    'tuesday': 'Mardi',
    'wednesday': 'Mercredi',
    'thursday': 'Jeudi',
    'friday': 'Vendredi',
    'saturday': 'Samedi',
    'sunday': 'Dimanche'
};

const DAY_MAPPING_FR_TO_EN: { [key: string]: string } = {
    'Lundi': 'monday',
    'Mardi': 'tuesday',
    'Mercredi': 'wednesday',
    'Jeudi': 'thursday',
    'Vendredi': 'friday',
    'Samedi': 'saturday',
    'Dimanche': 'sunday'
};

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

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
        const { child_id, schedules } = body;

        // Validation
        if (!child_id) {
            const response = NextResponse.json(
                { success: false, error: 'child_id est requis' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
            const response = NextResponse.json(
                {
                    success: false,
                    error: 'schedules doit être un tableau non vide. Format: [{ day: "monday", arrival_time: "08:00", departure_time: "16:30" }]'
                },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier que l'enfant appartient bien au parent
        const ownerCheck = await query(
            `SELECT id, name FROM children WHERE id = $1 AND parent_id = $2`,
            [child_id, user.id]
        );

        if (ownerCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Enfant introuvable ou non autorisé' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const childName = ownerCheck.rows[0].name;

        // Valider et convertir les horaires au format JSONB attendu
        const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const scheduleArray = [];

        for (const schedule of schedules) {
            if (!schedule.day || !validDays.includes(schedule.day)) {
                const response = NextResponse.json(
                    {
                        success: false,
                        error: `Jour invalide. Valeurs acceptées: ${validDays.join(', ')}`
                    },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            if (!schedule.arrival_time || !schedule.departure_time) {
                const response = NextResponse.json(
                    { success: false, error: 'arrival_time et departure_time sont requis pour chaque horaire' },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            // Convertir au format JSONB attendu
            scheduleArray.push({
                day: DAY_MAPPING_EN_TO_FR[schedule.day],
                open: true,
                openTime: schedule.arrival_time,
                closeTime: schedule.departure_time
            });
        }

        // Mettre à jour la colonne schedule dans la table children
        await query(
            `UPDATE children SET schedule = $1::jsonb WHERE id = $2`,
            [JSON.stringify(scheduleArray), child_id]
        );

        // Récupérer l'enfant avec ses nouveaux horaires
        const updatedChild = await query(
            `
            SELECT 
                c.id,
                c.name,
                c.schedule
            FROM children c
            WHERE c.id = $1
            `,
            [child_id]
        );

        // Convertir le format JSONB au format attendu par l'API
        const schedule = updatedChild.rows[0].schedule || [];
        const formattedSchedules = Array.isArray(schedule) ? schedule.map((item: any) => ({
            day: DAY_MAPPING_FR_TO_EN[item.day] || item.day.toLowerCase(),
            arrival_time: item.openTime || item.arrival_time,
            departure_time: item.closeTime || item.departure_time,
            open: item.open !== undefined ? item.open : true
        })) : [];

        const response = NextResponse.json({
            success: true,
            message: `Horaires personnalisés pour ${childName} enregistrés avec succès`,
            data: {
                id: updatedChild.rows[0].id,
                name: updatedChild.rows[0].name,
                schedules: formattedSchedules
            }
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur personnalisation horaires:', error);
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

// ========================================
// GET - Récupérer les horaires d'un enfant
// ========================================
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

        const { searchParams } = new URL(req.url);
        const child_id = searchParams.get('child_id');

        if (!child_id) {
            const response = NextResponse.json(
                { success: false, error: 'child_id est requis dans les query params' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier que l'enfant appartient bien au parent
        const ownerCheck = await query(
            `SELECT id FROM children WHERE id = $1 AND parent_id = $2`,
            [child_id, user.id]
        );

        if (ownerCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Enfant introuvable ou non autorisé' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        // Récupérer les horaires depuis la colonne schedule
        const result = await query(
            `
            SELECT 
                id,
                name,
                schedule
            FROM children
            WHERE id = $1
            `,
            [child_id]
        );

        if (result.rows.length === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Enfant introuvable' },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        // Convertir le format JSONB au format attendu par l'API
        const schedule = result.rows[0].schedule || [];
        const formattedSchedules = Array.isArray(schedule) ? schedule.map((item: any) => ({
            day: DAY_MAPPING_FR_TO_EN[item.day] || item.day.toLowerCase(),
            arrival_time: item.openTime || item.arrival_time,
            departure_time: item.closeTime || item.departure_time,
            open: item.open !== undefined ? item.open : true
        })) : [];

        const response = NextResponse.json({
            success: true,
            data: formattedSchedules,
            count: formattedSchedules.length
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur récupération horaires:', error);
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