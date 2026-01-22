/**
 * Script de test direct pour vérifier que les notifications fonctionnent
 * À exécuter manuellement pour tester
 */

import { notifyAdmins, AdminNotificationTypes } from './services/notificationService';

async function testNotification() {
    console.log('🧪 Test de notification...');
    
    try {
        await notifyAdmins(
            'Test notification',
            'test',
            'Ceci est un test de notification',
            undefined
        );
        console.log('✅ Test réussi !');
    } catch (error) {
        console.error('❌ Test échoué:', error);
    }
}

// Décommenter pour tester
// testNotification();

