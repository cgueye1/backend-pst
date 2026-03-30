-- ========================================
-- TABLES COVOITURAGE (CARPOOL)
-- ========================================

-- Table des groupes de covoiturage
CREATE TABLE IF NOT EXISTS carpool_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    school_id INTEGER REFERENCES schools(id) ON DELETE SET NULL,
    creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Table des membres des groupes de covoiturage
CREATE TABLE IF NOT EXISTS carpool_group_members (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES carpool_groups(id) ON DELETE CASCADE,
    parent_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'rejected', 'left')),
    invited_at TIMESTAMP DEFAULT now(),
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    
    -- Un parent ne peut être membre d'un groupe qu'une seule fois
    UNIQUE(group_id, parent_id)
);

-- Table du calendrier de covoiturage
CREATE TABLE IF NOT EXISTS carpool_calendar (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES carpool_groups(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    driver_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    start_point VARCHAR(255),
    end_point VARCHAR(255),
    departure_time TIME,
    return_time TIME,
    capacity_max INTEGER DEFAULT 4 CHECK (capacity_max > 0),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Table des échanges de conduite
CREATE TABLE IF NOT EXISTS carpool_exchanges (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES carpool_groups(id) ON DELETE CASCADE,
    calendar_id INTEGER REFERENCES carpool_calendar(id) ON DELETE SET NULL,
    requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_driver_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    original_date DATE NOT NULL,
    proposed_date DATE,
    exchange_type VARCHAR(20) NOT NULL CHECK (exchange_type IN ('swap', 'give', 'request')),
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'canceled')),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    responded_at TIMESTAMP
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_carpool_groups_creator ON carpool_groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_carpool_groups_school ON carpool_groups(school_id);
CREATE INDEX IF NOT EXISTS idx_carpool_group_members_group ON carpool_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_carpool_group_members_parent ON carpool_group_members(parent_id);
CREATE INDEX IF NOT EXISTS idx_carpool_group_members_status ON carpool_group_members(status);
CREATE INDEX IF NOT EXISTS idx_carpool_calendar_group ON carpool_calendar(group_id);
CREATE INDEX IF NOT EXISTS idx_carpool_calendar_date ON carpool_calendar(date);
CREATE INDEX IF NOT EXISTS idx_carpool_calendar_driver ON carpool_calendar(driver_id);
CREATE INDEX IF NOT EXISTS idx_carpool_exchanges_group ON carpool_exchanges(group_id);
CREATE INDEX IF NOT EXISTS idx_carpool_exchanges_requester ON carpool_exchanges(requester_id);
CREATE INDEX IF NOT EXISTS idx_carpool_exchanges_target_driver ON carpool_exchanges(target_driver_id);
CREATE INDEX IF NOT EXISTS idx_carpool_exchanges_status ON carpool_exchanges(status);
CREATE INDEX IF NOT EXISTS idx_carpool_exchanges_original_date ON carpool_exchanges(original_date);

-- Commentaires sur les tables
COMMENT ON TABLE carpool_groups IS 'Groupes de covoiturage créés par les parents';
COMMENT ON TABLE carpool_group_members IS 'Membres des groupes de covoiturage (parents)';
COMMENT ON TABLE carpool_calendar IS 'Calendrier des trajets de covoiturage par groupe';
COMMENT ON TABLE carpool_exchanges IS 'Échanges de conduite entre parents (demandes, offres, swaps)';

-- Commentaires sur les colonnes importantes
COMMENT ON COLUMN carpool_group_members.status IS 'Statut de l''invitation: pending (en attente), accepted (accepté), rejected (refusé), left (a quitté)';
COMMENT ON COLUMN carpool_calendar.driver_id IS 'ID du parent qui conduit (peut être NULL si non assigné)';
COMMENT ON COLUMN carpool_exchanges.exchange_type IS 'Type d''échange: request (demande), offer (offre), swap (échange)';

