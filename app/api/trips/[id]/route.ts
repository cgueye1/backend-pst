/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Récupérer un trajet par son ID
 *     tags: [ADMIN]
 *   put:
 *     summary: Mettre à jour un trajet
 *     tags: [ADMIN]
 *   patch:
 *     summary: Affecter un chauffeur à un trajet (si non déjà affecté)
 *     tags: [ADMIN]
 *   delete:
 *     summary: Supprimer un trajet
 *     tags: [ADMIN]
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { setCorsHeaders, corsOptions } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

type Params = {
    params: Promise<{ id: string }>;
};

// GET: Récupérer un trajet par ID
// GET: Récupérer un trajet par ID avec info chauffeur
export async function GET(req: NextRequest, context: Params) {
    const origin = req.headers.get('origin');
    try {
        const { id } = await context.params;
        const numericId = Number(id);

        if (isNaN(numericId)) {
            const response = NextResponse.json({ error: 'ID invalide' }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        // Requête SQL avec jointure sur driver et user, incluant les coordonnées GPS
        const res = await query(
            `
      SELECT 
        t.*,
        t.start_latitude,
        t.start_longitude,
        t.end_latitude,
        t.end_longitude,
        d.id AS driver_id,
        d.user_id AS driver_user_id,
        u.name AS driver_name, 
        u.email AS driver_email
      FROM trips t
      LEFT JOIN drivers d ON t.driver_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE t.id = $1
      `,
            [numericId]
        );

        if (res.rowCount === 0) {
            const response = NextResponse.json({ error: 'Trajet non trouvé' }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        // Transformer le résultat pour inclure un objet chauffeur plus clair
        const trip = res.rows[0];
        const result = {
            ...trip,
            driver: trip.driver_id
                ? {
                    id: trip.driver_id,
                    userId: trip.driver_user_id,
                    name: trip.driver_name,
                    email: trip.driver_email,
                }
                : null, // null si pas de chauffeur
        };

        const response = NextResponse.json(result);
        return setCorsHeaders(response, origin);
    } catch (error) {
        console.error('GET trip error:', error);
        const response = NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}
// PUT: Mettre à jour un trajet complet
export async function PUT(req: NextRequest, context: Params) {
    const origin = req.headers.get('origin');
    try {
        const { id } = await context.params;
        const numericId = Number(id);

        if (isNaN(numericId)) {
            const response = NextResponse.json({ error: 'ID invalide' }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        const body = await req.json();
        const {
            driver_id,
            school_id,
            start_point,
            end_point,
            departure_time,
            capacity_max,
            status,
            is_recurring
        } = body;

        // Validation des champs requis
        if (!school_id || !start_point || !end_point || !departure_time) {
            const response = NextResponse.json(
                { error: 'Champs requis manquants (school_id, start_point, end_point, departure_time)' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        const res = await query(
            `UPDATE trips
             SET driver_id=$1, school_id=$2, start_point=$3, end_point=$4,
                 departure_time=$5, capacity_max=$6, status=$7, is_recurring=$8 
             WHERE id=$9
                 RETURNING *`,
            [
                driver_id || null,
                school_id,
                start_point,
                end_point,
                departure_time,
                capacity_max || 4,
                status || 'En attente',
                is_recurring || false,
                numericId
            ]
        );

        if (res.rowCount === 0) {
            const response = NextResponse.json({ error: 'Trajet non trouvé' }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        const response = NextResponse.json(res.rows[0]);
        return setCorsHeaders(response, origin);
    } catch (error: any) {
        console.error('PUT trip error:', error);
        const response = NextResponse.json(
            { error: error.message || 'Erreur lors de la mise à jour' },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}

// PATCH: Affecter un chauffeur à un trajet
export async function PATCH(req: NextRequest, context: Params) {
    const origin = req.headers.get('origin');
    try {
        const { id } = await context.params;
        const tripId = Number(id);

        if (isNaN(tripId)) {
            const response = NextResponse.json({ error: 'ID invalide' }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        const body = await req.json();
        const { driver_id } = body;

        if (!driver_id) {
            const response = NextResponse.json(
                { error: 'driver_id requis' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Récupération du trajet
        const tripResult = await query(
            `SELECT start_point, end_point, departure_time, driver_id 
             FROM trips 
             WHERE id = $1`,
            [tripId]
        );

        if (tripResult.rowCount === 0) {
            const response = NextResponse.json(
                { error: 'Trajet introuvable' },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const trip = tripResult.rows[0];

        // Optionnel: Vérifier si un chauffeur est déjà affecté
        if (trip.driver_id && trip.driver_id !== driver_id) {
            const response = NextResponse.json(
                {
                    error: 'Un chauffeur est déjà affecté à ce trajet',
                    current_driver_id: trip.driver_id
                },
                { status: 409 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérification des conflits d'horaire pour le chauffeur
        const conflictResult = await query(
            `SELECT id FROM trips
             WHERE driver_id = $1
               AND id != $2
               AND start_point = $3
               AND end_point = $4
               AND departure_time = $5`,
            [driver_id, tripId, trip.start_point, trip.end_point, trip.departure_time]
        );

        if (conflictResult.rowCount && conflictResult.rowCount > 0) {
            const response = NextResponse.json(
                { error: 'Ce chauffeur a déjà un trajet similaire à cette heure' },
                { status: 409 }
            );
            return setCorsHeaders(response, origin);
        }

        // Affectation du chauffeur
        const updateResult = await query(
            `UPDATE trips
             SET driver_id = $1, 
                 status = CASE WHEN status = 'En attente' THEN 'Confirmé' ELSE status END 
               WHERE id = $2
             RETURNING *`,
            [driver_id, tripId]
        );

        const response = NextResponse.json({
            message: 'Chauffeur affecté avec succès',
            trip: updateResult.rows[0]
        });
        return setCorsHeaders(response, origin);
    } catch (error: any) {
        console.error('PATCH trip (assign driver) error:', error);
        const response = NextResponse.json(
            { error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}

// DELETE: Supprimer un trajet
export async function DELETE(req: NextRequest, context: Params) {
    const origin = req.headers.get('origin');
    try {
        const { id } = await context.params;
        const numericId = Number(id);

        if (isNaN(numericId)) {
            const response = NextResponse.json({ error: 'ID invalide' }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        // Vérifier si le trajet existe avant suppression
        const checkResult = await query(
            'SELECT id, status FROM trips WHERE id=$1',
            [numericId]
        );

        if (checkResult.rowCount === 0) {
            const response = NextResponse.json({ error: 'Trajet non trouvé' }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        const trip = checkResult.rows[0];

        // Optionnel: Empêcher la suppression de trajets en cours
        if (trip.status === 'En cours') {
            const response = NextResponse.json(
                { error: 'Impossible de supprimer un trajet en cours' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Suppression
        await query('DELETE FROM trips WHERE id=$1', [numericId]);

        const response = NextResponse.json({
            success: true,
            message: 'Trajet supprimé avec succès'
        });
        return setCorsHeaders(response, origin);
    } catch (error: any) {
        console.error('DELETE trip error:', error);
        const response = NextResponse.json(
            { error: error.message || 'Erreur lors de la suppression' },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}