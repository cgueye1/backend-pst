import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

import { setCorsHeaders, corsOptions } from '@/lib/cors';
/**
 * @swagger
 * /api/parents/alertes:
 *   get:
 *     summary: Envoyer des rappels de trajets (Cron Job)
 *     description: >
 *       Endpoint cron pour envoyer des rappels aux parents pour les trajets à venir.
 *       Autorisation via:
 *       - header `Authorization: Bearer {CRON_SECRET}` OU
 *       - query `?cron_secret={CRON_SECRET}`
 *     tags: [CRON]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: false
 *         schema:
 *           type: string
 *         description: "Bearer {CRON_SECRET}"
 *       - in: query
 *         name: cron_secret
 *         required: false
 *         schema:
 *           type: string
 *         description: Secret cron alternatif
 *       - in: query
 *         name: unread_only
 *         required: false
 *         schema:
 *           type: boolean
 *           default: false
 *         description: unread_only
 *     responses:
 *       200:
 *         description: Succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé (secret manquant/invalide)
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Ressource non trouvée
 *       500:
 *         description: Erreur serveur
 *   post:
 *     summary: Créer une alerte
 *     description: Crée une nouvelle alerte pour le parent.
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
 *               - title
 *               - message
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Alerte importante"
 *               message:
 *                 type: string
 *                 example: "Message de l'alerte"
 *               type:
 *                 type: string
 *                 enum: ["info","warning","error"]
 *                 default: info
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

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        // Sécurité : Vérifier que la requête vient d'un cron autorisé
        // Supporte deux méthodes : header Authorization OU query parameter cron_secret
        const authHeader = request.headers.get('authorization');
        const searchParams = request.nextUrl.searchParams;
        const cronSecretParam = searchParams.get('cron_secret');
        
        const cronSecret = process.env.CRON_SECRET || 'your-secret-key';

        // Vérifier soit le header Authorization, soit le query parameter
        const isValid = 
            authHeader === `Bearer ${cronSecret}` || 
            cronSecretParam === cronSecret;

        if (!isValid) {
            const response = NextResponse.json(
                { 
                    success: false, 
                    message: "Non autorisé. Fournissez 'Authorization: Bearer {secret}' header ou '?cron_secret={secret}' query parameter." 
                },
                { status: 401 }
            );
            return setCorsHeaders(response, origin);
        }

        console.log('🔄 Cron job - Vérification des trajets à rappeler...');

        // 1. Rappels à envoyer : trajets qui partent dans 2 jours (envoyer le rappel aujourd'hui)
        // On cherche les trajets dont le départ est dans 2 jours ET qui n'ont pas encore reçu de rappel
        const remindersResult = await query(`
            SELECT DISTINCT
                t.id as trip_id,
                t.departure_time,
                t.start_point,
                t.end_point,
                t.driver_id,
                u.id as parent_id,
                u.name,
                u.email,
                u.phone
            FROM trips t
            JOIN trip_children tc ON t.id = tc.trip_id
            JOIN children c ON tc.child_id = c.id
            JOIN users u ON c.parent_id = u.id
            WHERE t.departure_time::DATE = CURRENT_DATE + INTERVAL '2 days'
              AND t.status IN ('pending', 'in_progress')
              AND NOT EXISTS (
                  -- Vérifier qu'aucune notification de rappel n'a déjà été envoyée pour ce trajet et ce parent
                  SELECT 1 
                  FROM notifications n
                  JOIN notification_destinataires nd ON nd.notification_id = n.id
                  WHERE n.type = 'trip_reminder'
                    AND n.description LIKE '%' || t.id || '%'
                    AND nd.destinataire_id = u.id
                    AND n.date_creation::DATE = CURRENT_DATE
              )
        `);

        console.log(`📧 ${remindersResult.rowCount} trajets à rappeler trouvés (départ dans 2 jours)`);

        let notificationsSent = 0;

        for (const trip of remindersResult.rows) {
            try {
                // Formater la date de départ
                const departureDate = new Date(trip.departure_time);
                const formattedDate = departureDate.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                // Créer la notification (envoyée immédiatement)
                const notifResult = await query(
                    `INSERT INTO notifications (libelle, type, description, emetteur_id)
                     VALUES ($1, $2, $3, $4)
                     RETURNING id`,
                    [
                        'Rappel trajet à venir',
                        'trip_reminder',
                        `Rappel : un trajet est prévu le ${formattedDate} de ${trip.start_point} à ${trip.end_point}. [Trip ID: ${trip.trip_id}]`,
                        trip.driver_id || trip.parent_id // émetteur = driver si disponible, sinon parent
                    ]
                );

                // Associer le parent destinataire
                await query(
                    `INSERT INTO notification_destinataires (notification_id, destinataire_id)
                     VALUES ($1, $2)`,
                    [notifResult.rows[0].id, trip.parent_id]
                );

                notificationsSent++;
                console.log(`✅ Rappel envoyé à ${trip.name} (${trip.email}) pour le trajet #${trip.trip_id}`);
            } catch (error: any) {
                console.error(`❌ Erreur lors de l'envoi du rappel pour trip_id=${trip.trip_id}:`, error);
                // Continuer avec les autres trajets même en cas d'erreur
            }
        }

        const response = NextResponse.json({
            success: true,
            message: "Rappels des trajets envoyés avec succès",
            data: {
                trips_found: remindersResult.rowCount,
                notifications_sent: notificationsSent
            }
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur cron trip reminders:", error);
        const errorResponse = NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

/**
 * Fonction pour tester manuellement (endpoint admin)
 */
export async function POST(request: NextRequest) {
    return GET(request);
}
