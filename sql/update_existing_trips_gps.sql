-- Script pour mettre à jour les trajets existants avec leurs coordonnées GPS
-- Ce script géocode les adresses des trajets existants et met à jour les colonnes GPS
-- 
-- NOTE: Ce script doit être exécuté via une application backend, pas directement en SQL
-- car il nécessite des appels API externes (Nominatim)

-- Pour exécuter ce script, utilisez plutôt l'endpoint API:
-- POST /api/trips/update-gps-coordinates
-- ou créez un script Node.js qui:
-- 1. Récupère tous les trajets sans coordonnées GPS
-- 2. Géocode chaque adresse
-- 3. Met à jour les colonnes GPS

-- Exemple de requête pour trouver les trajets à mettre à jour:
SELECT 
    id,
    start_point,
    end_point,
    start_latitude,
    start_longitude,
    end_latitude,
    end_longitude
FROM trips
WHERE start_latitude IS NULL 
   OR start_longitude IS NULL 
   OR end_latitude IS NULL 
   OR end_longitude IS NULL;

-- Après géocodage, la mise à jour se ferait ainsi:
-- UPDATE trips 
-- SET start_latitude = $1, start_longitude = $2, end_latitude = $3, end_longitude = $4
-- WHERE id = $5;



















