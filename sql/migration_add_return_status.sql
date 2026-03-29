-- Migration: Ajout du statut de retour pour gérer l'aller et le retour séparément
-- Date: 2024
-- Description: Permet de gérer séparément le statut de l'aller et du retour pour les trajets aller-retour

BEGIN;

-- Ajouter le champ return_status pour gérer le statut du retour séparément
ALTER TABLE trips
    ADD COLUMN IF NOT EXISTS return_status VARCHAR(20) DEFAULT NULL
        CHECK (return_status IN ('pending', 'in_progress', 'completed', 'canceled') OR return_status IS NULL);

-- Créer un index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_trips_return_status ON trips(return_status) WHERE return_status IS NOT NULL;

-- Commentaire sur la colonne
COMMENT ON COLUMN trips.return_status IS 'Statut du trajet retour (pour trajets aller-retour). NULL si pas de retour ou trajet aller uniquement';

-- Mettre à jour les trajets aller-retour existants
-- Si le trajet est completed et qu'il a un return_departure_time, mettre return_status à pending
UPDATE trips
SET return_status = CASE 
    WHEN status = 'completed' AND return_departure_time IS NOT NULL THEN 'pending'
    WHEN status = 'in_progress' AND return_departure_time IS NOT NULL THEN NULL
    ELSE NULL
END
WHERE trip_type = 'aller_retour' AND return_departure_time IS NOT NULL;

COMMIT;

