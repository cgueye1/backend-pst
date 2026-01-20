
/**
 * @swagger
 * /api/drivers/trips/{id}/completed:
 *   put:
 *     summary: Terminer un trajet suivi d'alertes fin trajet
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

        // Mettre à jour le statut du trajet (SEULEMENT depuis in_progress - transition logique)
        const result = await query(
            `UPDATE trips
             SET status = 'completed'
             WHERE id = $1
               AND driver_id = $2
               AND status = 'in_progress'
             RETURNING *`,
            [tripId, driverId]
        );

        if (result.rows.length === 0) {
            const response = NextResponse.json(
                {
                    success: false,
                    message: "Trajet introuvable ou pas encore démarré. Un trajet doit être démarré avant d'être complété."
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

        // Créer une notification personnalisée par parent
        for (const parent of parents.rows) {
            const childrenNames = parent.children.map((child: any) => child.child_name);
            
            // Personnaliser le message selon le nombre d'enfants
            let description = '';
            if (childrenNames.length === 1) {
                description = `${childrenNames[0]} est arrivé(e) à destination en toute sécurité`;
            } else if (childrenNames.length === 2) {
                description = `${childrenNames[0]} et ${childrenNames[1]} sont arrivé(e)s à destination en toute sécurité`;
            } else {
                const lastChild = childrenNames[childrenNames.length - 1];
                const otherChildren = childrenNames.slice(0, -1).join(', ');
                description = `${otherChildren} et ${lastChild} sont arrivé(e)s à destination en toute sécurité`;
            }
            // Insérer UNE SEULE notification pour ce parent
            const notif = await query(
                `INSERT INTO notifications (libelle, type, description, emetteur_id)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id`,
                [
                    'Trajet terminé',
                    'trip_completed',
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
            message: "Trajet terminé avec succès",
            data: result.rows[0],
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur fin trajet:", error);
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