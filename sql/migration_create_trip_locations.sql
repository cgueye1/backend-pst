-- Migration: Créer une table pour stocker les positions GPS en temps réel pendant les trajets
-- Cette table permet de suivre la position du véhicule pendant un trajet actif

BEGIN;

-- Créer la table trip_locations pour stocker les positions GPS
CREATE TABLE IF NOT EXISTS trip_locations (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    direction VARCHAR(20) DEFAULT 'aller' CHECK (direction IN ('aller', 'retour')),
    speed DECIMAL(5, 2), -- Vitesse en km/h (optionnel)
    accuracy DECIMAL(5, 2), -- Précision du GPS en mètres (optionnel)
    heading DECIMAL(5, 2), -- Direction du véhicule en degrés (optionnel)
    created_at TIMESTAMP DEFAULT NOW()
);

-- Créer des index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_trip_locations_trip_id ON trip_locations(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_locations_driver_id ON trip_locations(driver_id);
CREATE INDEX IF NOT EXISTS idx_trip_locations_created_at ON trip_locations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trip_locations_trip_direction ON trip_locations(trip_id, direction, created_at DESC);

-- Index composite pour récupérer rapidement la dernière position d'un trajet
CREATE INDEX IF NOT EXISTS idx_trip_locations_latest ON trip_locations(trip_id, direction, created_at DESC);

-- Commentaires
COMMENT ON TABLE trip_locations IS 'Stocke les positions GPS en temps réel pendant les trajets actifs';
COMMENT ON COLUMN trip_locations.trip_id IS 'ID du trajet en cours';
COMMENT ON COLUMN trip_locations.driver_id IS 'ID du chauffeur (pour validation)';
COMMENT ON COLUMN trip_locations.latitude IS 'Latitude GPS';
COMMENT ON COLUMN trip_locations.longitude IS 'Longitude GPS';
COMMENT ON COLUMN trip_locations.direction IS 'Direction du trajet (aller ou retour)';
COMMENT ON COLUMN trip_locations.speed IS 'Vitesse du véhicule en km/h';
COMMENT ON COLUMN trip_locations.accuracy IS 'Précision du GPS en mètres';
COMMENT ON COLUMN trip_locations.heading IS 'Direction du véhicule en degrés (0-360)';
COMMENT ON COLUMN trip_locations.created_at IS 'Timestamp de la position';

COMMIT;

