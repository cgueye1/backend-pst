-- Script SQL simple à exécuter pour corriger les contraintes NOT NULL
-- Exécutez ce script dans votre base de données PostgreSQL

-- Rendre les champs nullable
ALTER TABLE drivers 
    ALTER COLUMN license_document DROP NOT NULL,
    ALTER COLUMN id_document DROP NOT NULL,
    ALTER COLUMN vehicle_photo DROP NOT NULL,
    ALTER COLUMN vehicle_color DROP NOT NULL,
    ALTER COLUMN vehicle_plate DROP NOT NULL;

-- Vérification (optionnel - pour voir le résultat)
-- SELECT column_name, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'drivers' 
-- AND column_name IN ('vehicle_color', 'vehicle_plate', 'license_document', 'id_document', 'vehicle_photo');



















