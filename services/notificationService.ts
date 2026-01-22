import { query } from '@/lib/db';

/**
 * Service pour créer des notifications automatiques pour les admins
 */

/**
 * Récupère tous les IDs des admins
 */
async function getAdminIds(): Promise<number[]> {
    const result = await query(
        `SELECT id FROM users WHERE role = 'admin' AND status = 'active'`,
        []
    );
    return result.rows.map((row: any) => row.id);
}

/**
 * Crée une notification pour tous les admins
 */
export async function notifyAdmins(
    libelle: string,
    type: string,
    description: string,
    emetteurId?: number | null
): Promise<void> {
    try {
        console.log(`🔔 notifyAdmins appelé: "${libelle}" (type: ${type})`);

        // Récupérer les IDs des admins
        const adminIds = await getAdminIds();
        console.log(`👥 Admins trouvés: ${adminIds.length}`, adminIds);

        if (adminIds.length === 0) {
            console.warn('⚠️ Aucun admin trouvé pour recevoir la notification');
            console.warn('⚠️ Vérifiez qu\'il y a au moins un utilisateur avec role="admin" et status="active"');
            return;
        }

        // Créer la notification
        console.log(`📝 Création de la notification...`);
        const notifResult = await query(
            `INSERT INTO notifications (libelle, type, description, emetteur_id)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
            [libelle, type, description, emetteurId || null]
        );

        const notificationId = notifResult.rows[0].id;
        console.log(`✅ Notification créée avec ID: ${notificationId}`);

        // Envoyer à tous les admins
        console.log(`📤 Envoi aux ${adminIds.length} admin(s)...`);
        for (const adminId of adminIds) {
            try {
                await query(
                    `INSERT INTO notification_destinataires (notification_id, destinataire_id, lu)
                     VALUES ($1, $2, false)`,
                    [notificationId, adminId]
                );
                console.log(`  ✓ Notification envoyée à l'admin ID: ${adminId}`);
            } catch (insertError) {
                console.error(`  ❌ Erreur insertion pour admin ${adminId}:`, insertError);
            }
        }

        console.log(`✅ Notification "${libelle}" envoyée avec succès à ${adminIds.length} admin(s)`);

        // Vérification finale : compter les destinataires créés
        const verifyResult = await query(
            `SELECT COUNT(*) as count FROM notification_destinataires WHERE notification_id = $1`,
            [notificationId]
        );
        console.log(`✅ Vérification: ${verifyResult.rows[0].count} destinataire(s) créé(s) pour la notification ${notificationId}`);

    } catch (error) {
        console.error('❌ Erreur lors de la création de notification admin:', error);
        console.error('Détails:', {
            message: (error as Error).message,
            stack: (error as Error).stack
        });
        // Ne pas faire échouer l'opération principale si la notification échoue
    }
}

/**
 * Types de notifications pour l'admin
 */
export const AdminNotificationTypes = {
    // Utilisateurs
    NEW_DRIVER_REGISTRATION: 'new_driver_registration',
    NEW_PARENT_REGISTRATION: 'new_parent_registration',
    DRIVER_STATUS_CHANGE: 'driver_status_change',
    USER_DELETED: 'user_deleted',
    USER_STATUS_CHANGE: 'user_status_change',

    // Trajets
    TRIP_CREATED: 'trip_created',
    TRIP_CANCELED: 'trip_canceled',
    TRIP_ISSUE: 'trip_issue',

    // Incidents
    NEW_INCIDENT: 'new_incident',
    CRITICAL_INCIDENT: 'critical_incident',
    INCIDENT_RESOLVED: 'incident_resolved',

    // Paiements
    PAYMENT_FAILED: 'payment_failed',
    SUBSCRIPTION_EXPIRED: 'subscription_expired',
    PAYMENT_PENDING: 'payment_pending',

    // Système
    SYSTEM_ERROR: 'system_error',
    SECURITY_ALERT: 'security_alert',

    // Demandes
    REFUND_REQUEST: 'refund_request',
    DATA_MODIFICATION_REQUEST: 'data_modification_request',
    COMPLAINT: 'complaint',
} as const;

