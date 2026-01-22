-- Script de test pour vérifier les notifications admin
-- À exécuter dans votre base de données PostgreSQL

-- 1. Vérifier les admins actifs
SELECT id, name, email, role, status 
FROM users 
WHERE role = 'admin' AND status = 'active';

-- 2. Vérifier les notifications récentes
SELECT 
    n.id,
    n.libelle,
    n.type,
    n.description,
    n.date_creation,
    n.emetteur_id,
    COUNT(nd.id) as nb_destinataires
FROM notifications n
LEFT JOIN notification_destinataires nd ON n.id = nd.notification_id
GROUP BY n.id
ORDER BY n.date_creation DESC
LIMIT 10;

-- 3. Vérifier les notifications pour un admin spécifique
-- Remplacez 1 par l'ID de votre admin
SELECT 
    n.id,
    n.libelle,
    n.type,
    n.description,
    n.date_creation,
    nd.lu,
    nd.date_lecture
FROM notifications n
INNER JOIN notification_destinataires nd ON n.id = nd.notification_id
WHERE nd.destinataire_id = 1  -- Remplacez par l'ID de votre admin
ORDER BY n.date_creation DESC
LIMIT 10;

-- 4. Vérifier les notifications non lues pour un admin
SELECT COUNT(*) as notifications_non_lues
FROM notification_destinataires nd
INNER JOIN notifications n ON nd.notification_id = n.id
WHERE nd.destinataire_id = 1  -- Remplacez par l'ID de votre admin
  AND nd.lu = false
  AND n.statut = 'active';

