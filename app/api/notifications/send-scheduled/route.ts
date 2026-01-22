import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

/**
 * @swagger
 * /api/notifications/send-scheduled:
 *   get:
 *     summary: Envoyer les notifications planifiées dont la date d'envoi est arrivée
 *     tags: [CRON]
 *     description: |
 *       Ce CRON doit être exécuté fréquemment (toutes les 15 minutes ou toutes les heures)
 *       pour vérifier et envoyer les notifications dont send_at <= NOW() et sent = false
 *     security:
 *       - BearerAuth: []
 */
export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        // Sécurité : Vérifier que la requête vient d'un cron autorisé
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET || 'your-secret-key';

        if (authHeader !== `Bearer ${cronSecret}`) {
            const response = NextResponse.json(
                { success: false, message: "Non autorisé" },
                { status: 401 }
            );
            return setCorsHeaders(response, origin);
        }

        console.log('📤 Cron job - Envoi des notifications planifiées...');

        // 1. Trouver toutes les notifications planifiées dont l'heure d'envoi est arrivée
        // Note: Cette requête nécessite que les colonnes send_at et sent existent dans la table notifications
        // Si elles n'existent pas encore, cette API ne fonctionnera pas (voir GUIDE_IMPLEMENTATION_SEND_AT.md)
        const scheduledNotifications = await query(`
            SELECT 
                n.id,
                n.libelle,
                n.type,
                n.description,
                n.send_at,
                n.emetteur_id,
                nd.destinataire_id,
                u.email,
                u.name
            FROM notifications n
            JOIN notification_destinataires nd ON nd.notification_id = n.id
            LEFT JOIN users u ON u.id = nd.destinataire_id
            WHERE n.send_at IS NOT NULL
              AND n.sent = FALSE
              AND n.send_at <= NOW()
            ORDER BY n.send_at ASC
            LIMIT 100
        `);

        console.log(`📧 ${scheduledNotifications.rowCount} notifications à envoyer trouvées`);

        let notificationsSent = 0;
        let notificationsFailed = 0;

        for (const notif of scheduledNotifications.rows) {
            try {
                // Ici, vous pouvez ajouter la logique d'envoi réel :
                // - Envoi par email (via service email)
                // - Envoi par SMS (via service SMS)
                // - Push notification (via service push)
                // - etc.

                // Exemple d'envoi par email (à implémenter selon votre service email)
                // if (notif.email) {
                //     await emailService.send({
                //         to: notif.email,
                //         subject: notif.libelle,
                //         body: notif.description
                //     });
                // }

                // Pour l'instant, on marque juste comme envoyée
                // Dans un vrai système, vous feriez l'envoi réel avant de marquer comme sent

                // Marquer la notification comme envoyée
                await query(
                    `UPDATE notifications 
                     SET sent = TRUE 
                     WHERE id = $1`,
                    [notif.id]
                );

                notificationsSent++;
                console.log(`✅ Notification #${notif.id} envoyée à ${notif.name || 'utilisateur'} (ID: ${notif.destinataire_id})`);

            } catch (error: any) {
                notificationsFailed++;
                console.error(`❌ Erreur lors de l'envoi de la notification #${notif.id}:`, error);
                
                // Optionnel : marquer comme échouée pour retry plus tard
                // Vous pourriez ajouter une colonne error_message et retry_count
                // await query(`
                //     UPDATE notifications 
                //     SET error_message = $1, retry_count = COALESCE(retry_count, 0) + 1
                //     WHERE id = $2
                // `, [error.message, notif.id]);
            }
        }

        const response = NextResponse.json({
            success: true,
            message: "Notifications planifiées traitées",
            data: {
                found: scheduledNotifications.rowCount,
                sent: notificationsSent,
                failed: notificationsFailed
            }
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur cron send scheduled notifications:", error);
        
        // Si l'erreur est due à des colonnes manquantes, donner un message clair
        if (error.message && error.message.includes('column') && error.message.includes('does not exist')) {
            const errorResponse = NextResponse.json(
                { 
                    success: false, 
                    message: "Les colonnes send_at et sent n'existent pas dans la table notifications. Consultez GUIDE_IMPLEMENTATION_SEND_AT.md pour les ajouter.",
                    error: error.message 
                },
                { status: 500 }
            );
            return setCorsHeaders(errorResponse, origin);
        }

        const errorResponse = NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

/**
 * Fonction pour tester manuellement (endpoint admin)
 * Usage: POST /api/notifications/send-scheduled
 */
export async function POST(request: NextRequest) {
    return GET(request);
}

