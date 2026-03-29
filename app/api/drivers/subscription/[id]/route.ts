import {NextRequest, NextResponse} from "next/server";
import {getUserFromRequest} from "@/lib/auth";
import {query} from "@/lib/db";
import { setCorsHeaders, corsOptions } from "@/lib/cors";

/**
 * @swagger
 * /api/drivers/subscription/{id}:
 *   delete:
 *     summary: Résilier l'abonnement
 *     tags: [CHAUFFEUR]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'abonnement (subscription_id)
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Raison de résiliation (optionnel)
 *                 example: "Je n'utilise plus le service"
 *               cancel_immediately:
 *                 type: boolean
 *                 description: true = résiliation immédiate, false = à la fin de la période
 *                 default: false
 *     responses:
 *       200:
 *         description: Résiliation enregistrée
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Abonnement actif introuvable
 *       500:
 *         description: Erreur serveur
 */
export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);

        if (!user || user.role !== "driver") {
            const response = NextResponse.json(
                { success: false, message: "Non autorisé" },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const { id } = await params;
        const subscription_id = Number(id);

        let reason: string | undefined;
        let cancel_immediately = false;
        try {
            const body = await request.json();
            reason = body?.reason;
            cancel_immediately = Boolean(body?.cancel_immediately);
        } catch {
            // body optionnel
        }

        if (!subscription_id || Number.isNaN(subscription_id)) {
            const response = NextResponse.json(
                { success: false, message: "ID d'abonnement requis" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Récupérer l'abonnement
        const subResult = await query(
            `
            SELECT s.*, sp.name as plan_name
            FROM subscriptions s
            LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
            WHERE s.id = $1 AND s.user_id = $2 AND s.active = true
            `,
            [subscription_id, user.id]
        );

        if (subResult.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, message: "Abonnement actif introuvable" },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const subscription = subResult.rows[0];

        await query('BEGIN');

        try {
            if (cancel_immediately) {
                // Résiliation immédiate
                await query(
                    `
                    UPDATE subscriptions
                    SET 
                        active = false,
                        auto_renew = false,
                        canceled_at = now(),
                        cancellation_reason = $1,
                        updated_at = now()
                    WHERE id = $2
                    `,
                    [reason || 'Résiliation à la demande de l\'utilisateur', subscription_id]
                );
            } else {
                // Résiliation à la fin de la période
                await query(
                    `
                    UPDATE subscriptions
                    SET 
                        auto_renew = false,
                        canceled_at = now(),
                        cancellation_reason = $1,
                        updated_at = now()
                    WHERE id = $2
                    `,
                    [reason || 'Résiliation programmée', subscription_id]
                );
            }

            await query('COMMIT');

            // Notification
            const notifResult = await query(
                `
                INSERT INTO notifications (libelle, type, description, emetteur_id)
                VALUES ($1, $2, $3, $4)
                RETURNING id
                `,
                [
                    'Abonnement résilié',
                    'subscription_canceled',
                    cancel_immediately
                        ? `Votre abonnement ${subscription.plan_name} a été résilié immédiatement`
                        : `Votre abonnement ${subscription.plan_name} sera résilié à la fin de la période en cours`,
                    user.id
                ]
            );

            await query(
                `INSERT INTO notification_destinataires (notification_id, destinataire_id)
                 VALUES ($1, $2)`,
                [notifResult.rows[0].id, user.id]
            );

            const response = NextResponse.json({
                success: true,
                message: cancel_immediately
                    ? "Abonnement résilié immédiatement"
                    : "Abonnement programmé pour résiliation à la fin de la période",
                data: {
                    subscription_id,
                    canceled_at: new Date(),
                    active_until: cancel_immediately ? new Date() : subscription.end_date
                }
            });
            return setCorsHeaders(response, origin);

        } catch (error) {
            await query('ROLLBACK');
            throw error;
        }

    } catch (error: any) {
        console.error("Erreur résiliation abonnement:", error);
        const errorResponse = NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}