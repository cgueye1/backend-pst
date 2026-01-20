

/**
 * @swagger
 * /api/drivers/trips/{id}/start:
 *   put:
 *     summary: Démarrer un trajet suivi d'alerte debut trajet
 *     tags: [CHAUFFEUR]
 */

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { setCorsHeaders, corsOptions } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const origin = request.headers.get('origin');
    try {
        // Récupérer l'utilisateur connecté
        const user = await getUserFromRequest(request);

        if (!user || user.role !== 'driver') {
            const response = NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        // Récupérer le driver et vérifier le statut
        const driverResult = await query(
            `SELECT id, status FROM drivers WHERE user_id = $1`,
            [user.id]
        );

        if (driverResult.rowCount === 0) {
            const response = NextResponse.json({ error: 'Chauffeur introuvable' }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        const driver = driverResult.rows[0];
        if (driver.status !== 'Approuvé') {
            const response = NextResponse.json(
                {
                    error: 'Votre compte chauffeur est en attente d\'approbation',
                    status: driver.status
                },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const driverId = driver.id;
        const { id: tripId } = await params;

        // Vérifier le trajet avant de le démarrer
        const tripCheck = await query(
            `SELECT id, departure_time, status FROM trips WHERE id = $1 AND driver_id = $2`,
            [tripId, driverId]
        );

        if (tripCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, message: "Trajet introuvable" },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const trip = tripCheck.rows[0];

        // Vérifier que le trajet n'est pas dans le passé
        if (new Date(trip.departure_time) < new Date()) {
            const response = NextResponse.json(
                { success: false, message: "Impossible de démarrer un trajet dans le passé" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier qu'il y a des enfants réservés
        const childrenCount = await query(
            `SELECT COUNT(*) as count FROM trip_children WHERE trip_id = $1`,
            [tripId]
        );

        if (Number(childrenCount.rows[0].count) === 0) {
            const response = NextResponse.json(
                { success: false, message: "Aucun enfant réservé pour ce trajet" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Mettre à jour le statut du trajet (seulement depuis pending)
        const result = await query(
            `UPDATE trips
             SET status = 'in_progress'
             WHERE id = $1 AND driver_id = $2 AND status = 'pending'
             RETURNING *`,
            [tripId, driverId]
        );

        if (result.rows.length === 0) {
            const response = NextResponse.json(
                {
                    success: false,
                    message: "Trajet introuvable ou déjà démarré/terminé"
                },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        // Récupérer les parents
        const parents = await query(
            `SELECT
                u.id as parent_id,
                u.name as parent_name,
                json_agg(
                    json_build_object(
                        'child_id', c.id,
                        'child_name', c.name
                    )
                ) as children
            FROM trip_children tc
            JOIN children c ON tc.child_id = c.id
            JOIN users u ON c.parent_id = u.id
            WHERE tc.trip_id = $1
            GROUP BY u.id, u.name`,
            [tripId]
        );

        const startPoint = result.rows[0].start_point;

        // Créer une notification personnalisée par parent
        for (const parent of parents.rows) {
            const childrenNames = parent.children.map((child: any) => child.child_name);
            
            // Personnaliser le message selon le nombre d'enfants
            let description = '';
            if (childrenNames.length === 1) {
                description = `Le trajet pour ${childrenNames[0]} a commencé vers ${startPoint}`;
            } else if (childrenNames.length === 2) {
                description = `Le trajet pour ${childrenNames[0]} et ${childrenNames[1]} a commencé vers ${startPoint}`;
            } else {
                const lastChild = childrenNames[childrenNames.length - 1];
                const otherChildren = childrenNames.slice(0, -1).join(', ');
                description = `Le trajet pour ${otherChildren} et ${lastChild} a commencé vers ${startPoint}`;
            }
            // Insérer UNE SEULE notification pour ce parent
            const notif = await query(
                `INSERT INTO notifications (libelle, type, description, emetteur_id)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id`,
                [
                    'Trajet démarré',
                    'trip_started',
                    description,
                    user.id
                ]
            );

            // Insérer le destinataire
            await query(
                `INSERT INTO notification_destinataires (notification_id, destinataire_id)
                 VALUES ($1, $2)`,
                [notif.rows[0].id, parent.parent_id]
            );
        }

        const response = NextResponse.json({
            success: true,
            message: "Trajet démarré avec succès",
            data: result.rows[0],
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur démarrage trajet:", error);
        const errorResponse = NextResponse.json(
            {
                success: false,
                message: error.message,
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}
