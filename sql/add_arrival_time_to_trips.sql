-- Migration: Ajout de l'heure d'arrivée explicite pour les trajets
-- Date: 2024
-- Description: Permet de spécifier explicitement l'heure d'arrivée lors de la création d'un trajet

BEGIN;

-- Ajouter le champ arrival_time pour l'heure d'arrivée du trajet aller
ALTER TABLE trips
    ADD COLUMN IF NOT EXISTS arrival_time TIMESTAMP;

-- Ajouter le champ return_arrival_time pour l'heure d'arrivée du trajet retour
ALTER TABLE trips
    ADD COLUMN IF NOT EXISTS return_arrival_time TIMESTAMP;

-- Créer des index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_trips_arrival_time ON trips(arrival_time) WHERE arrival_time IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_trips_return_arrival_time ON trips(return_arrival_time) WHERE return_arrival_time IS NOT NULL;

-- Commentaires sur les colonnes
COMMENT ON COLUMN trips.arrival_time IS 'Heure d''arrivée prévue pour le trajet aller (peut être calculée automatiquement si non fournie)';
COMMENT ON COLUMN trips.return_arrival_time IS 'Heure d''arrivée prévue pour le trajet retour (peut être calculée automatiquement si non fournie)';

COMMIT;









