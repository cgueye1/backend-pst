-- Migration: Ajouter UNIQUEMENT les colonnes GPS pour stocker les coordonnées réelles
-- Les colonnes distance_km, price, start_point, end_point existent déjà dans votre table
-- Ce script ajoute seulement les coordonnées GPS (start_latitude, start_longitude, end_latitude, end_longitude)
-- pour permettre l'affichage de l'itinéraire sur la carte avec de vraies coordonnées GPS

-- Vérifier si les colonnes GPS n'existent pas déjà avant de les ajouter
DO $$
BEGIN
    -- Ajouter start_latitude si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'trips' AND column_name = 'start_latitude'
    ) THEN
        ALTER TABLE trips ADD COLUMN start_latitude DECIMAL(10,8);
        RAISE NOTICE 'Colonne start_latitude ajoutée';
    ELSE
        RAISE NOTICE 'Colonne start_latitude existe déjà';
    END IF;

    -- Ajouter start_longitude si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'trips' AND column_name = 'start_longitude'
    ) THEN
        ALTER TABLE trips ADD COLUMN start_longitude DECIMAL(11,8);
        RAISE NOTICE 'Colonne start_longitude ajoutée';
    ELSE
        RAISE NOTICE 'Colonne start_longitude existe déjà';
    END IF;

    -- Ajouter end_latitude si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'trips' AND column_name = 'end_latitude'
    ) THEN
        ALTER TABLE trips ADD COLUMN end_latitude DECIMAL(10,8);
        RAISE NOTICE 'Colonne end_latitude ajoutée';
    ELSE
        RAISE NOTICE 'Colonne end_latitude existe déjà';
    END IF;

    -- Ajouter end_longitude si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'trips' AND column_name = 'end_longitude'
    ) THEN
        ALTER TABLE trips ADD COLUMN end_longitude DECIMAL(11,8);
        RAISE NOTICE 'Colonne end_longitude ajoutée';
    ELSE
        RAISE NOTICE 'Colonne end_longitude existe déjà';
    END IF;
END $$;
