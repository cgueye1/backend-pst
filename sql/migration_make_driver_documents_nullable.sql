-- Migration: Rendre les champs documents nullable pour permettre la création de drivers sans documents
-- Date: 2024
-- Description: Permet de créer et mettre à jour le statut des drivers même s'ils n'ont pas encore de documents

BEGIN;

-- Rendre les champs documents nullable
ALTER TABLE drivers 
    ALTER COLUMN license_document DROP NOT NULL,
    ALTER COLUMN id_document DROP NOT NULL,
    ALTER COLUMN vehicle_photo DROP NOT NULL;

-- Rendre aussi vehicle_color et vehicle_plate nullable pour permettre la création initiale
-- sans toutes les informations du véhicule
ALTER TABLE drivers 
    ALTER COLUMN vehicle_color DROP NOT NULL,
    ALTER COLUMN vehicle_plate DROP NOT NULL;

-- Mettre à jour les contraintes existantes pour permettre les valeurs NULL
-- (La contrainte unique_vehicle_plate doit permettre NULL)
-- PostgreSQL permet déjà les valeurs NULL dans les contraintes UNIQUE

COMMIT;

