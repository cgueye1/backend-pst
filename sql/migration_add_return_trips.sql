-- Migration: Ajout de la gestion des trajets aller-retour
-- Date: 2024
-- Description: Permet de créer un trajet aller-retour avec deux heures de départ

BEGIN;

-- Ajouter le champ trip_type pour distinguer aller, retour, ou aller-retour
ALTER TABLE trips
    ADD COLUMN IF NOT EXISTS trip_type VARCHAR(20) DEFAULT 'aller_retour'
        CHECK (trip_type IN ('aller', 'retour', 'aller_retour'));

-- Ajouter le champ return_departure_time pour l'heure de départ du retour
ALTER TABLE trips
    ADD COLUMN IF NOT EXISTS return_departure_time TIMESTAMP;

-- Créer un index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_trips_trip_type ON trips(trip_type);
CREATE INDEX IF NOT EXISTS idx_trips_return_departure_time ON trips(return_departure_time) WHERE return_departure_time IS NOT NULL;

-- Commentaires sur les colonnes
COMMENT ON COLUMN trips.trip_type IS 'Type de trajet: aller (matin uniquement), retour (après-midi uniquement), ou aller_retour (trajet combiné avec deux heures)';
COMMENT ON COLUMN trips.return_departure_time IS 'Heure de départ du trajet retour (pour les trajets aller_retour)';

COMMIT;

