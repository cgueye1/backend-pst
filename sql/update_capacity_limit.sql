-- Migration: Augmenter la limite de capacité de 20 à 50
-- Date: 2024
-- Description: Permet aux drivers d'avoir une capacité jusqu'à 50 passagers

BEGIN;

-- Supprimer l'ancienne contrainte CHECK
ALTER TABLE drivers DROP CONSTRAINT IF EXISTS drivers_capacity_check;

-- Ajouter la nouvelle contrainte avec limite à 50
ALTER TABLE drivers 
    ADD CONSTRAINT drivers_capacity_check 
    CHECK (capacity > 0 AND capacity <= 50);

COMMIT;



















