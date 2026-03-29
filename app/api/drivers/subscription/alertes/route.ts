import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

import { setCorsHeaders, corsOptions } from '@/lib/cors';
/**
 * @swagger
 * /api/drivers/subscription/alertes:
 *   get:
 *     summary: Envoyer des alertes d'expiration d'abonnements
 *     description: >
 *       Endpoint cron. Autorisation via:
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
 *     responses:
 *       200:
 *         description: Traitement OK
 *       401:
 *         description: Non autorisé (secret manquant/invalide)
 *       500:
 *         description: Erreur serveur
 */

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(request: NextRequest) {
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
            return NextResponse.json(
                { 
                    success: false, 
                    message: "Non autorisé. Fournissez 'Authorization: Bearer {secret}' header ou '?cron_secret={secret}' query parameter." 
                },
                { status: 401 }
            );
        }

        console.log(' Cron job - Vérification des abonnements à expirer...');

        // 1. Abonnements expirant dans 7 jours
        const expiringSoonResult = await query(`
            SELECT 
                s.id as subscription_id,
                s.user_id,
                s.type,
                s.end_date,
                u.name,
                u.email,
                u.phone,
                (s.end_date - CURRENT_DATE) as days_remaining
            FROM subscriptions s
            JOIN users u ON u.id = s.user_id
            WHERE s.active = true
              AND s.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
              AND s.auto_renew = false
              AND NOT EXISTS (
                  SELECT 1 FROM notifications n
                  JOIN notification_destinataires nd ON nd.notification_id = n.id
                  WHERE nd.destinataire_id = s.user_id
                    AND n.type = 'subscription_expiring_soon'
                    AND n.date_creation::DATE = CURRENT_DATE
              )
        `);

        console.log(`📧 ${expiringSoonResult.rowCount} abonnements expirant bientôt trouvés`);

        // Envoyer des notifications pour les abonnements expirant bientôt
        for (const sub of expiringSoonResult.rows) {
            const notifResult = await query(
                `
                INSERT INTO notifications (libelle, type, description, emetteur_id)
                VALUES ($1, $2, $3, $4)
                RETURNING id
                `,
                [
                    'Abonnement bientôt expiré',
                    'subscription_expiring_soon',
                    `Votre abonnement ${sub.type} expire dans ${sub.days_remaining} jour(s). Pensez à le renouveler !`,
                    sub.user_id
                ]
            );

            await query(
                `INSERT INTO notification_destinataires (notification_id, destinataire_id)
                 VALUES ($1, $2)`,
                [notifResult.rows[0].id, sub.user_id]
            );

            console.log(` Alerte envoyée à ${sub.name} (${sub.email}) - Expire dans ${sub.days_remaining} jour(s)`);
        }

        // 2. Abonnements expirant aujourd'hui
        const expiringTodayResult = await query(`
            SELECT 
                s.id as subscription_id,
                s.user_id,
                s.type,
                s.end_date,
                u.name,
                u.email,
                u.phone
            FROM subscriptions s
            JOIN users u ON u.id = s.user_id
            WHERE s.active = true
              AND s.end_date::DATE = CURRENT_DATE
              AND s.auto_renew = false
        `);

        console.log(`  ${expiringTodayResult.rowCount} abonnements expirant aujourd'hui trouvés`);

        for (const sub of expiringTodayResult.rows) {
            const notifResult = await query(
                `
                INSERT INTO notifications (libelle, type, description, emetteur_id)
                VALUES ($1, $2, $3, $4)
                RETURNING id
                `,
                [
                    'Abonnement expiré aujourd\'hui',
                    'subscription_expiring_today',
                    `Votre abonnement ${sub.type} expire aujourd'hui. Renouvelez-le pour continuer à profiter du service !`,
                    sub.user_id
                ]
            );

            await query(
                `INSERT INTO notification_destinataires (notification_id, destinataire_id)
                 VALUES ($1, $2)`,
                [notifResult.rows[0].id, sub.user_id]
            );

            console.log(`  Alerte expiration immédiate envoyée à ${sub.name} (${sub.email})`);
        }

        // 3. Désactiver les abonnements expirés
        const expiredResult = await query(`
            UPDATE subscriptions
            SET active = false, updated_at = now()
            WHERE active = true
              AND end_date < CURRENT_DATE
            RETURNING id, user_id, type
        `);

        console.log(`  ${expiredResult.rowCount} abonnements expirés désactivés`);

        // Notifier les utilisateurs dont l'abonnement vient d'être désactivé
        for (const sub of expiredResult.rows) {
            const notifResult = await query(
                `
                INSERT INTO notifications (libelle, type, description, emetteur_id)
                VALUES ($1, $2, $3, $4)
                RETURNING id
                `,
                [
                    'Abonnement expiré',
                    'subscription_expired',
                    `Votre abonnement ${sub.type} a expiré. Renouvelez-le pour retrouver l'accès à vos services.`,
                    sub.user_id
                ]
            );

            await query(
                `INSERT INTO notification_destinataires (notification_id, destinataire_id)
                 VALUES ($1, $2)`,
                [notifResult.rows[0].id, sub.user_id]
            );

            console.log(`❌ Notification d'expiration envoyée pour subscription_id=${sub.id}`);
        }

        // 4. Renouveler automatiquement les abonnements avec auto_renew activé
        const autoRenewResult = await query(`
            SELECT 
                s.id as subscription_id,
                s.user_id,
                s.type,
                s.price,
                s.end_date,
                s.plan_id,
                sp.duration_days,
                u.name,
                u.email,
                spm.id as saved_payment_id
            FROM subscriptions s
            JOIN users u ON u.id = s.user_id
            LEFT JOIN subscription_plans sp ON sp.id = s.plan_id
            LEFT JOIN saved_payment_methods spm ON spm.user_id = s.user_id AND spm.is_default = true
            WHERE s.active = true
              AND s.auto_renew = true
              AND s.end_date = CURRENT_DATE
              AND spm.id IS NOT NULL
        `);

        console.log(`🔄 ${autoRenewResult.rowCount} abonnements à renouveler automatiquement`);

        for (const sub of autoRenewResult.rows) {
            try {
                await query('BEGIN');

                // Créer un paiement pour le renouvellement
                const paymentResult = await query(
                    `
                    INSERT INTO payments (
                        user_id, amount, status, method, payment_type, 
                        transaction_id, payment_provider
                    )
                    VALUES ($1, $2, 'paid', 'auto_renew', 'subscription_renewal', $3, 'System')
                    RETURNING id
                    `,
                    [
                        sub.user_id,
                        sub.price,
                        `AUTO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                    ]
                );

                const payment_id = paymentResult.rows[0].id;

                // Prolonger l'abonnement
                await query(
                    `
                    UPDATE subscriptions
                    SET 
                        end_date = end_date + ($1 || ' days')::INTERVAL,
                        payment_id = $2,
                        updated_at = now()
                    WHERE id = $3
                    `,
                    [sub.duration_days, payment_id, sub.subscription_id]
                );

                // Notification
                const notifResult = await query(
                    `
                    INSERT INTO notifications (libelle, type, description, emetteur_id)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id
                    `,
                    [
                        'Abonnement renouvelé automatiquement',
                        'subscription_auto_renewed',
                        `Votre abonnement ${sub.type} a été renouvelé automatiquement.`,
                        sub.user_id
                    ]
                );

                await query(
                    `INSERT INTO notification_destinataires (notification_id, destinataire_id)
                     VALUES ($1, $2)`,
                    [notifResult.rows[0].id, sub.user_id]
                );

                await query('COMMIT');

                console.log(`  Abonnement renouvelé automatiquement pour ${sub.name} (subscription_id=${sub.subscription_id})`);

            } catch (error) {
                await query('ROLLBACK');
                console.error(`  Erreur renouvellement automatique pour subscription_id=${sub.subscription_id}:`, error);

                // Notifier l'échec du renouvellement
                const notifResult = await query(
                    `
                    INSERT INTO notifications (libelle, type, description, emetteur_id)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id
                    `,
                    [
                        'Échec du renouvellement automatique',
                        'subscription_auto_renew_failed',
                        `Le renouvellement automatique de votre abonnement ${sub.type} a échoué. Veuillez vérifier vos informations de paiement.`,
                        sub.user_id
                    ]
                );

                await query(
                    `INSERT INTO notification_destinataires (notification_id, destinataire_id)
                     VALUES ($1, $2)`,
                    [notifResult.rows[0].id, sub.user_id]
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: "Alertes d'abonnement traitées avec succès",
            data: {
                expiring_soon: expiringSoonResult.rowCount,
                expiring_today: expiringTodayResult.rowCount,
                expired: expiredResult.rowCount,
                auto_renewed: autoRenewResult.rowCount
            }
        });

    } catch (error: any) {
        console.error("Erreur cron subscription alerts:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

/**
 * Fonction pour tester manuellement (endpoint admin)
 */
export async function POST(request: NextRequest) {
    return GET(request);
}