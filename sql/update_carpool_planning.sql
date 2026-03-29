-- ========================================
-- MISE À JOUR POUR LE SYSTÈME DE PLANNING
-- ========================================

-- 1. Ajouter le champ confirmation_status à carpool_calendar
-- Note: VARCHAR(25) car 'replacement_requested' fait 22 caractères
ALTER TABLE carpool_calendar 
ADD COLUMN IF NOT EXISTS confirmation_status VARCHAR(25) DEFAULT 'pending' 
CHECK (confirmation_status IN ('pending', 'confirmed', 'replacement_requested'));

-- 2. Créer la table des demandes de remplacement
CREATE TABLE IF NOT EXISTS carpool_replacement_requests (
    id SERIAL PRIMARY KEY,
    calendar_id INTEGER NOT NULL REFERENCES carpool_calendar(id) ON DELETE CASCADE,
    requested_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP DEFAULT now(),
    responded_at TIMESTAMP,
    responded_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_carpool_calendar_confirmation_status ON carpool_calendar(confirmation_status);
CREATE INDEX IF NOT EXISTS idx_carpool_replacement_requests_calendar ON carpool_replacement_requests(calendar_id);
CREATE INDEX IF NOT EXISTS idx_carpool_replacement_requests_requested_by ON carpool_replacement_requests(requested_by);
CREATE INDEX IF NOT EXISTS idx_carpool_replacement_requests_status ON carpool_replacement_requests(status);

-- 4. Index unique partiel : Un calendrier ne peut avoir qu'une seule demande de remplacement en attente
CREATE UNIQUE INDEX IF NOT EXISTS idx_carpool_replacement_requests_unique_pending 
ON carpool_replacement_requests(calendar_id) 
WHERE status = 'pending';

-- 5. Commentaires
COMMENT ON COLUMN carpool_calendar.confirmation_status IS 'Statut de confirmation: pending (en attente), confirmed (confirmé), replacement_requested (remplacement demandé)';
COMMENT ON TABLE carpool_replacement_requests IS 'Demandes de remplacement pour les jours assignés dans le planning';

