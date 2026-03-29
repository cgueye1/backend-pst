-- ========================================
-- CORRECTION DE LA TAILLE DU CHAMP confirmation_status
-- ========================================
-- Le problème : 'replacement_requested' fait 22 caractères
-- mais le champ est défini comme VARCHAR(20)
-- Solution : Augmenter à VARCHAR(25)

-- Modifier la colonne pour accepter des valeurs plus longues
ALTER TABLE carpool_calendar 
ALTER COLUMN confirmation_status TYPE VARCHAR(25);

-- Vérifier que la contrainte CHECK est toujours en place
-- (Elle devrait être conservée automatiquement, mais on la recrée au cas où)
ALTER TABLE carpool_calendar 
DROP CONSTRAINT IF EXISTS carpool_calendar_confirmation_status_check;

ALTER TABLE carpool_calendar 
ADD CONSTRAINT carpool_calendar_confirmation_status_check 
CHECK (confirmation_status IN ('pending', 'confirmed', 'replacement_requested'));

-- Commentaire
COMMENT ON COLUMN carpool_calendar.confirmation_status IS 'Statut de confirmation: pending (en attente), confirmed (confirmé), replacement_requested (remplacement demandé)';









