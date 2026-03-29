-- Migration: Ajout du support des arrêts multiples (plusieurs écoles) pour un trajet
-- Date: 2025
-- Description: Permet à un trajet d'avoir plusieurs arrêts (écoles) au lieu d'une seule destination

BEGIN;

-- Créer une table pour les arrêts d'un trajet (écoles)
CREATE TABLE IF NOT EXISTS trip_stops (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    stop_order INTEGER NOT NULL DEFAULT 1, -- Ordre de l'arrêt (1 = premier arrêt, 2 = deuxième, etc.)
    estimated_arrival_time TIME, -- Heure d'arrivée estimée à cet arrêt
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(trip_id, school_id), -- Un trajet ne peut pas avoir deux fois la même école
    CONSTRAINT valid_stop_order CHECK (stop_order > 0)
);

-- Créer un index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_school_id ON trip_stops(school_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_order ON trip_stops(trip_id, stop_order);

-- Commentaire sur la table
COMMENT ON TABLE trip_stops IS 'Arrêts (écoles) d''un trajet. Un trajet peut avoir plusieurs arrêts dans un ordre spécifique.';

-- Migration des données existantes : créer un arrêt pour chaque trajet existant
-- Si un trajet a déjà un school_id, on crée un arrêt correspondant
INSERT INTO trip_stops (trip_id, school_id, stop_order, estimated_arrival_time)
SELECT 
    id as trip_id,
    school_id,
    1 as stop_order, -- Premier et seul arrêt
    NULL as estimated_arrival_time -- À calculer plus tard
FROM trips
WHERE school_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM trip_stops WHERE trip_stops.trip_id = trips.id
);

COMMIT;








