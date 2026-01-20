BEGIN;

CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(150) NOT NULL,
                       email VARCHAR(150) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(20) NOT NULL CHECK (role IN ('admin','parent','driver')),
                       phone VARCHAR(30),
                       status VARCHAR(20) DEFAULT 'active',

                       created_at TIMESTAMP DEFAULT now()
);
-- Ajouter la colonne photo_profil pour tous les utilisateurs
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS photo_profil TEXT;

-- Créer un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_users_photo_profil ON users(photo_profil) WHERE photo_profil IS NOT NULL;

-- Commentaire sur la colonne
COMMENT ON COLUMN users.photo_profil IS 'URL ou chemin de la photo de profil de l''utilisateur';

ALTER TABLE users
    ADD COLUMN address TEXT;

CREATE TABLE schools (
                         id SERIAL PRIMARY KEY,
                         name VARCHAR(200) NOT NULL,
                         address TEXT,
                         opening_time TIME,
                         closing_time TIME
);

ALTER TABLE schools
    ADD COLUMN  created_at TIMESTAMP DEFAULT now();
ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Actif'
        CHECK (status IN ('Actif', 'Inactif'));

-- Update existing schools to have 'Actif' status if they don't have one
UPDATE schools SET status = 'Actif' WHERE status IS NULL;

-- Add schedule column to schools table to store daily schedules as JSON
ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS schedule JSONB DEFAULT '[
      {"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
      {"day": "Mardi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
      {"day": "Mercredi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
      {"day": "Jeudi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
      {"day": "Vendredi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
      {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"},
      {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}
    ]'::jsonb;

-- Add status column if not exists
ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Actif'
        CHECK (status IN ('Actif', 'Inactif'));

-- Update existing schools to have default schedule and status
UPDATE schools
SET schedule = '[
  {"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
  {"day": "Mardi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
  {"day": "Mercredi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
  {"day": "Jeudi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
  {"day": "Vendredi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
  {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"},
  {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}
]'::jsonb
WHERE schedule IS NULL;

UPDATE schools SET status = 'Actif' WHERE status IS NULL;


CREATE TABLE children (
                          id SERIAL PRIMARY KEY,
                          parent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                          name VARCHAR(150) NOT NULL,
                          school_id INTEGER REFERENCES schools(id),
                          address TEXT,
                          created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE drivers (
                         id SERIAL PRIMARY KEY,
                         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                         vehicle_brand TEXT ,         -- marque du véhicule
                         vehicle_color TEXT NOT NULL,         -- couleur du véhicule
                         vehicle_plate TEXT NOT NULL,         -- immatriculation du véhicule
                         license_document TEXT NOT NULL,      -- chemin/URL de la CNI de conduire
                         id_document TEXT NOT NULL,           -- chemin/URL du permis ou passeport
                         vehicle_photo TEXT NOT NULL  ,       -- chemin/URL de la photo du véhicule
                         created_at TIMESTAMP DEFAULT now()

);

ALTER TABLE drivers
    ADD COLUMN status VARCHAR(20) DEFAULT 'En attente'
        CHECK (status IN ('En attente', 'Approuvé', 'Refusé')),
    ADD CONSTRAINT unique_vehicle_plate UNIQUE (vehicle_plate),
    ADD CONSTRAINT unique_driver_user UNIQUE (user_id);
ALTER TABLE drivers
    ADD COLUMN photo_profil TEXT  ;

ALTER TABLE drivers ADD COLUMN capacity INTEGER DEFAULT 4 CHECK (capacity > 0 AND capacity <= 20);
 UPDATE drivers SET capacity = 4 WHERE capacity IS NULL;


CREATE TABLE trips (
                       id SERIAL PRIMARY KEY,
                       driver_id INTEGER REFERENCES drivers(id),
                       school_id INTEGER REFERENCES schools(id),
                       date TIMESTAMP,
                       start_time TIME,
                       end_time TIME,
                       status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','completed','canceled' )),
                       is_recurring BOOLEAN DEFAULT FALSE,
                       created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE trips
    DROP COLUMN date,
    DROP COLUMN start_time,
    DROP COLUMN end_time;

ALTER TABLE trips
ADD COLUMN  start_point VARCHAR(255) NOT NULL,
 ADD COLUMN   end_point VARCHAR(255) NOT NULL,

  ADD COLUMN    departure_time TIMESTAMP NOT NULL,

  ADD COLUMN   capacity_max INTEGER NOT NULL CHECK (capacity_max > 0);
ALTER TABLE trips
    ADD CONSTRAINT unique_trip_driver_time
        UNIQUE (start_point, end_point, departure_time, driver_id);

ALTER TABLE trips DROP CONSTRAINT trips_status_check;

ALTER TABLE trips
    ADD CONSTRAINT trips_status_check
        CHECK (status IN ('pending', 'in_progress', 'completed', 'canceled'));

ALTER TABLE trips
    ADD COLUMN distance_km DECIMAL(6,2),
    ADD COLUMN price INT;


CREATE TABLE trip_children (
                               trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
                               child_id INTEGER REFERENCES children(id) ON DELETE CASCADE,
                               PRIMARY KEY (trip_id, child_id)
);
ALTER TABLE trip_children
    ADD COLUMN
    created_at TIMESTAMP DEFAULT now();
CREATE TABLE payments (
                          id SERIAL PRIMARY KEY,
                          user_id INTEGER REFERENCES users(id),
                          amount NUMERIC(10,2) NOT NULL,
                          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('paid','pending','failed')),
                          method VARCHAR(50),
                          transaction_id VARCHAR(200),
                          created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE payments
      ADD COLUMN card_holder_name VARCHAR(150), -- Nom sur la carte
    ADD COLUMN card_last4 VARCHAR(4),          -- 4 derniers chiffres
    ADD COLUMN card_exp_month INTEGER,         -- Mois d'expiration
    ADD COLUMN card_exp_year INTEGER,          -- Année d'expiration
    ADD COLUMN mobile_number VARCHAR(30),      -- Pour Mobile Money
    ADD COLUMN payment_token VARCHAR(255);     -- Token généré par le prestataire


CREATE TABLE evaluations (
                             id SERIAL PRIMARY KEY,
                             trip_id INTEGER REFERENCES trips(id),
                             parent_id INTEGER REFERENCES users(id),
                             driver_id INTEGER REFERENCES drivers(id),
                             rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
                             comment TEXT,
                             created_at TIMESTAMP DEFAULT now()
);



CREATE TABLE subscriptions (
                               id SERIAL PRIMARY KEY,
                               user_id INTEGER REFERENCES users(id),
                               type VARCHAR(100),
                               price NUMERIC(10,2),
                               active BOOLEAN DEFAULT TRUE,
                               created_at TIMESTAMP DEFAULT now(),
                               updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE subscriptions
    ADD COLUMN start_date DATE DEFAULT CURRENT_DATE,
    ADD COLUMN end_date DATE,
    ADD CONSTRAINT unique_user_subscription UNIQUE (user_id, type, start_date);

CREATE TABLE support_tickets (
                                 id SERIAL PRIMARY KEY,
                                 user_id INTEGER REFERENCES users(id),
                                 subject VARCHAR(200),
                                 message TEXT,
                                 status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
                                 created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE password_resets (
                                 id SERIAL PRIMARY KEY,
                                 user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                                 code CHAR(4) NOT NULL,
                                 expires_at TIMESTAMP NOT NULL,
                                 created_at TIMESTAMP DEFAULT now()
);

-- Vues pour dashboard
CREATE VIEW dashboard_user_counts AS
SELECT role, count(*) as total FROM users GROUP BY role;

CREATE VIEW dashboard_revenue_monthly AS
SELECT date_trunc('month', created_at) as month, sum(amount) as total
FROM payments WHERE status='paid' GROUP BY 1 ORDER BY 1 DESC;





-- trips stats
CREATE VIEW v_trips_stats AS
SELECT status, count(*) AS total FROM trips GROUP BY status;



CREATE TABLE public_holidays (
                                 id SERIAL PRIMARY KEY,
                                 date DATE NOT NULL UNIQUE,
                                 label VARCHAR(150) NOT NULL
);

CREATE TABLE school_vacations (
                                  id SERIAL PRIMARY KEY,
                                  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                                  name VARCHAR(150) NOT NULL,
                                  start_date DATE NOT NULL,
                                  end_date DATE NOT NULL,
                                  created_at TIMESTAMP DEFAULT now(),

                                  CHECK (end_date >= start_date)
);




-- 2. Table des Incidents (Gestion des signalements)
CREATE TABLE incidents (
                           id SERIAL PRIMARY KEY,
                           type_de_problem VARCHAR(100) NOT NULL,
                           description TEXT NOT NULL,
                           status VARCHAR(20) DEFAULT 'En cours'
                               CHECK (status IN ('En cours', 'Resolu')),
    -- JSONB est excellent pour stocker les métadonnées des fichiers (nom, taille, url)
                           documents JSONB DEFAULT '[]'::jsonb,
                           created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add user_id to the incidents table
ALTER TABLE incidents ADD COLUMN user_id INTEGER NOT NULL REFERENCES users(id); -- Adjust 'users' to your actual table name

-- Optional: Add an index for performance on user_id queries
CREATE INDEX idx_incidents_user_id ON incidents(user_id);

-- 3. Table des Notifications (Alertes système)
CREATE TABLE notifications (
                               id SERIAL PRIMARY KEY  ,
                               libelle VARCHAR(255) NOT NULL,
                               type VARCHAR(100) NOT NULL,
                               description TEXT NOT NULL,
                               image_url VARCHAR(500),
                               emetteur_id INT NOT NULL,  -- ID de l'utilisateur qui publie
                               date_creation TIMESTAMP WITH TIME ZONE DEFAULT   CURRENT_TIMESTAMP,
                               statut VARCHAR(20)
                                   CHECK (statut IN('active', 'inactive') )DEFAULT 'active',
                               FOREIGN KEY (emetteur_id) REFERENCES users(id)
);

CREATE TABLE notification_destinataires (
                                            id SERIAL PRIMARY KEY  ,
                                            notification_id INT NOT NULL,
                                            destinataire_id INT,
                                            lu BOOLEAN DEFAULT FALSE,
                                            date_lecture TIMESTAMP WITH TIME ZONE DEFAULT   CURRENT_TIMESTAMP,
                                            FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
                                            FOREIGN KEY (destinataire_id) REFERENCES users(id)
);
-- 4. Fonction pour mettre à jour automatiquement le champ updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Triggers pour l'automatisation
CREATE TRIGGER update_incident_modtime BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE PROCEDURE update_modified_column();







-- ========================================
-- SCHÉMA COMPLET POUR ABONNEMENTS + PAIEMENTS
-- ========================================

-- 1. Table des plans d'abonnement (optionnel mais recommandé)
CREATE TABLE IF NOT EXISTS subscription_plans (
                                                  id SERIAL PRIMARY KEY,
                                                  name VARCHAR(100) NOT NULL,
                                                  description TEXT,
                                                  price NUMERIC(10,2) NOT NULL,
                                                  duration_days INTEGER NOT NULL DEFAULT 30,
                                                  features JSONB DEFAULT '[]'::jsonb,
                                                  role VARCHAR(20) CHECK (role IN ('driver', 'parent')),
                                                  active BOOLEAN DEFAULT true,
                                                  created_at TIMESTAMP DEFAULT now()
);

-- Plans par défaut
INSERT INTO subscription_plans (name, description, price, duration_days, role, features) VALUES
                                                                                             ('Chauffeur Mensuel', 'Abonnement mensuel pour chauffeur', 15000, 30, 'driver',
                                                                                              '[{"name": "Trajets illimités"}, {"name": "Support prioritaire"}, {"name": "Statistiques avancées"}]'::jsonb),
                                                                                             ('Chauffeur Trimestriel', 'Abonnement trimestriel pour chauffeur (-10%)', 40500, 90, 'driver',
                                                                                              '[{"name": "Trajets illimités"}, {"name": "Support prioritaire"}, {"name": "Statistiques avancées"}, {"name": "Économie de 10%"}]'::jsonb),
                                                                                             ('Parent Mensuel', 'Abonnement mensuel pour parent', 25000, 30, 'parent',
                                                                                              '[{"name": "Réservations illimitées"}, {"name": "Notifications en temps réel"}, {"name": "Support client"}]'::jsonb);

-- 2. Améliorer la table subscriptions existante
ALTER TABLE subscriptions
    ADD COLUMN IF NOT EXISTS plan_id INTEGER REFERENCES subscription_plans(id),
    ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS payment_id INTEGER REFERENCES payments(id);

-- 3. Améliorer la table payments pour gérer carte bancaire et mobile money
ALTER TABLE payments
    ADD COLUMN IF NOT EXISTS payment_type VARCHAR(20) CHECK (payment_type IN ('subscription', 'one_time')),
    ADD COLUMN IF NOT EXISTS subscription_id INTEGER REFERENCES subscriptions(id),
    ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(50);

-- Commentaires sur les colonnes existantes
COMMENT ON COLUMN payments.method IS 'card, mobile_money, or bank_transfer';
COMMENT ON COLUMN payments.card_holder_name IS 'Nom complet du titulaire de la carte';
COMMENT ON COLUMN payments.card_last4 IS 'Derniers 4 chiffres de la carte';
COMMENT ON COLUMN payments.card_exp_month IS 'Mois d\expiration (1-12)';
COMMENT ON COLUMN payments.card_exp_year IS 'Année d\expiration (ex: 2025)';
COMMENT ON COLUMN payments.mobile_number IS 'Numéro de téléphone pour mobile money';
COMMENT ON COLUMN payments.payment_token IS 'Token sécurisé généré par le processeur de paiement';

-- 4. Table pour stocker les méthodes de paiement sauvegardées (optionnel)
CREATE TABLE IF NOT EXISTS saved_payment_methods (
                                                     id SERIAL PRIMARY KEY,
                                                     user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Type de méthode
                                                     method_type VARCHAR(20) NOT NULL CHECK (method_type IN ('card', 'mobile_money')),

    -- Pour carte bancaire
                                                     card_holder_name VARCHAR(150),
                                                     card_last4 VARCHAR(4),
                                                     card_brand VARCHAR(20), -- Visa, Mastercard, etc.
                                                     card_exp_month INTEGER CHECK (card_exp_month BETWEEN 1 AND 12),
                                                     card_exp_year INTEGER CHECK (card_exp_year >= 2024),
                                                     card_token VARCHAR(255), -- Token du processeur de paiement

    -- Pour mobile money
                                                     mobile_number VARCHAR(30),
                                                     mobile_provider VARCHAR(50), -- Wave, Orange Money, Free Money, YUP, Wizall

    -- Métadonnées
                                                     is_default BOOLEAN DEFAULT false,
                                                     is_verified BOOLEAN DEFAULT false,
                                                     nickname VARCHAR(100), -- Ex: "Ma carte principale", "Mon compte Wave"

                                                     created_at TIMESTAMP DEFAULT now(),
                                                     updated_at TIMESTAMP DEFAULT now(),
                                                     last_used_at TIMESTAMP,

    -- Contraintes
                                                     CONSTRAINT check_card_fields CHECK (
                                                         method_type != 'card' OR (
                                                             card_holder_name IS NOT NULL AND
                                                             card_last4 IS NOT NULL AND
                                                             card_exp_month IS NOT NULL AND
                                                             card_exp_year IS NOT NULL
                                                             )
                                                         ),
                                                     CONSTRAINT check_mobile_fields CHECK (
                                                         method_type != 'mobile_money' OR (
                                                             mobile_number IS NOT NULL AND
                                                             mobile_provider IS NOT NULL
                                                             )
                                                         )
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_saved_payment_methods_user ON saved_payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_payment_methods_default ON saved_payment_methods(user_id, is_default) WHERE is_default = true;

-- 1. Ajouter la colonne metadata (JSONB pour stocker des données flexibles)
ALTER TABLE payments
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Ajouter un commentaire pour documenter
COMMENT ON COLUMN payments.metadata IS 'Données supplémentaires : token PayTech, infos transaction, custom_field, etc.';

-- 3. Créer un index GIN pour recherche rapide dans le JSONB
CREATE INDEX IF NOT EXISTS idx_payments_metadata ON payments USING GIN (metadata);

-- 5. Fonction pour gérer une seule méthode par défaut
CREATE OR REPLACE FUNCTION ensure_single_default_payment_method()
    RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = true THEN
        -- Désactiver toutes les autres méthodes par défaut de l'utilisateur
        UPDATE saved_payment_methods
        SET is_default = false
        WHERE user_id = NEW.user_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trigger_single_default_payment ON saved_payment_methods;
CREATE TRIGGER trigger_single_default_payment
    BEFORE INSERT OR UPDATE ON saved_payment_methods
    FOR EACH ROW
    WHEN (NEW.is_default = true)
EXECUTE FUNCTION ensure_single_default_payment_method();

-- 6. Vue pour les abonnements actifs avec détails de paiement
CREATE OR REPLACE VIEW v_active_subscriptions AS
SELECT
    s.id as subscription_id,
    s.user_id,
    u.name as user_name,
    u.email,
    u.role,
    s.type,
    s.price,
    s.start_date,
    s.end_date,
    s.active,
    s.auto_renew,
    (s.end_date - CURRENT_DATE) as days_remaining,
    CASE
        WHEN s.end_date < CURRENT_DATE THEN 'expired'
        WHEN s.end_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'expiring_soon'
        ELSE 'active'
        END as status,
    p.id as last_payment_id,
    p.amount as last_payment_amount,
    p.method as last_payment_method,
    p.status as last_payment_status,
    p.created_at as last_payment_date
FROM subscriptions s
         JOIN users u ON s.user_id = u.id
         LEFT JOIN payments p ON s.payment_id = p.id
WHERE s.active = true;

-- 7. Fonction pour vérifier l'expiration des abonnements (à exécuter périodiquement)
CREATE OR REPLACE FUNCTION expire_old_subscriptions()
    RETURNS INTEGER AS $$
DECLARE
    expired_count INTEGER;
BEGIN
    UPDATE subscriptions
    SET active = false
    WHERE active = true
      AND end_date < CURRENT_DATE;

    GET DIAGNOSTICS expired_count = ROW_COUNT;
    RETURN expired_count;
END;










$$ language 'plpgsql';




-- Ajouter la colonne schedule à la table children pour stocker les horaires personnalisés par jour
ALTER TABLE children
    ADD COLUMN IF NOT EXISTS schedule JSONB DEFAULT '[
      {"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
      {"day": "Mardi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
      {"day": "Mercredi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
      {"day": "Jeudi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
      {"day": "Vendredi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
      {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"},
      {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}
    ]'::jsonb;

-- Mettre à jour les enfants existants avec le schedule par défaut
UPDATE children
SET schedule = '[
  {"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
  {"day": "Mardi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
  {"day": "Mercredi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
  {"day": "Jeudi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
  {"day": "Vendredi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
  {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"},
  {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}
]'::jsonb
WHERE schedule IS NULL;

-- Commentaire sur la colonne
COMMENT ON COLUMN children.schedule IS 'Horaires personnalisés par jour pour l''enfant (peut différer de l''école)';



-- ========================================
-- SYSTÈME DE MESSAGERIE INTÉGRÉ
-- ========================================

-- 1. Table des conversations (entre deux utilisateurs ou groupes)
CREATE TABLE conversations (
                               id SERIAL PRIMARY KEY,
                               type VARCHAR(20) NOT NULL CHECK (type IN ('direct', 'group', 'support')),
                               title VARCHAR(200), -- Pour les conversations de groupe
                               trip_id INTEGER REFERENCES trips(id) ON DELETE SET NULL, -- Lien optionnel avec un trajet
                               created_by INTEGER REFERENCES users(id),
                               created_at TIMESTAMP DEFAULT now(),
                               updated_at TIMESTAMP DEFAULT now(),
                               last_message_at TIMESTAMP,
                               is_archived BOOLEAN DEFAULT false
);

-- Index pour performance
CREATE INDEX idx_conversations_trip ON conversations(trip_id);
CREATE INDEX idx_conversations_created_by ON conversations(created_by);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);

-- 2. Table des participants d'une conversation
CREATE TABLE conversation_participants (
                                           id SERIAL PRIMARY KEY,
                                           conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
                                           user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                           role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
                                           joined_at TIMESTAMP DEFAULT now(),
                                           left_at TIMESTAMP,
                                           is_muted BOOLEAN DEFAULT false,
                                           last_read_at TIMESTAMP DEFAULT now(),
                                           unread_count INTEGER DEFAULT 0,

                                           CONSTRAINT unique_conversation_participant UNIQUE (conversation_id, user_id)
);

-- Index pour performance
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_conversation_participants_conversation ON conversation_participants(conversation_id);

-- 3. Table des messages
CREATE TABLE messages (
                          id SERIAL PRIMARY KEY,
                          conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
                          sender_id INTEGER NOT NULL REFERENCES users(id),
                          parent_message_id INTEGER REFERENCES messages(id), -- Pour les réponses

    -- Contenu du message
                          content TEXT NOT NULL,
                          message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'document', 'location', 'system')),

    -- Pièces jointes
                          attachments JSONB DEFAULT '[]'::jsonb, -- [{url, name, size, type}]

    -- Métadonnées
                          metadata JSONB DEFAULT '{}'::jsonb, -- Données supplémentaires (coordonnées GPS, etc.)

    -- État
                          is_edited BOOLEAN DEFAULT false,
                          is_deleted BOOLEAN DEFAULT false,
                          deleted_at TIMESTAMP,

                          created_at TIMESTAMP DEFAULT now(),
                          updated_at TIMESTAMP DEFAULT now()
);

-- Index pour performance
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_parent ON messages(parent_message_id);

-- 4. Table des statuts de lecture (qui a lu quel message)
CREATE TABLE message_read_status (
                                     id SERIAL PRIMARY KEY,
                                     message_id INTEGER NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
                                     user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                     read_at TIMESTAMP DEFAULT now(),

                                     CONSTRAINT unique_message_read UNIQUE (message_id, user_id)
);

-- Index pour performance
CREATE INDEX idx_message_read_status_message ON message_read_status(message_id);
CREATE INDEX idx_message_read_status_user ON message_read_status(user_id);

-- 5. Table des messages signalés
CREATE TABLE reported_messages (
                                   id SERIAL PRIMARY KEY,
                                   message_id INTEGER NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
                                   reported_by INTEGER NOT NULL REFERENCES users(id),
                                   reason VARCHAR(50) NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'harassment', 'other')),
                                   description TEXT,
                                   status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'action_taken', 'dismissed')),
                                   reviewed_by INTEGER REFERENCES users(id),
                                   reviewed_at TIMESTAMP,
                                   created_at TIMESTAMP DEFAULT now()
);

-- Index pour performance
CREATE INDEX idx_reported_messages_status ON reported_messages(status);
CREATE INDEX idx_reported_messages_message ON reported_messages(message_id);

-- ========================================
-- TRIGGERS ET FONCTIONS
-- ========================================

-- 1. Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations
    SET updated_at = now(),
        last_message_at = now()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger sur les messages
DROP TRIGGER IF EXISTS trigger_update_conversation_timestamp ON messages;
CREATE TRIGGER trigger_update_conversation_timestamp
    AFTER INSERT ON messages
    FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();

-- 2. Fonction pour incrémenter le compteur de non-lus
CREATE OR REPLACE FUNCTION increment_unread_count()
    RETURNS TRIGGER AS $$
BEGIN
    -- Incrémenter pour tous les participants sauf l'expéditeur
    UPDATE conversation_participants
    SET unread_count = unread_count + 1
    WHERE conversation_id = NEW.conversation_id
      AND user_id != NEW.sender_id
      AND left_at IS NULL;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger sur les messages
DROP TRIGGER IF EXISTS trigger_increment_unread ON messages;
CREATE TRIGGER trigger_increment_unread
    AFTER INSERT ON messages
    FOR EACH ROW
EXECUTE FUNCTION increment_unread_count();

-- 3. Fonction pour réinitialiser le compteur quand un utilisateur lit
CREATE OR REPLACE FUNCTION reset_unread_count()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversation_participants
    SET unread_count = 0,
        last_read_at = NEW.read_at
    WHERE user_id = NEW.user_id
      AND conversation_id = (
        SELECT conversation_id FROM messages WHERE id = NEW.message_id
    );
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger sur les statuts de lecture
DROP TRIGGER IF EXISTS trigger_reset_unread ON message_read_status;
CREATE TRIGGER trigger_reset_unread
    AFTER INSERT ON message_read_status
    FOR EACH ROW
EXECUTE FUNCTION reset_unread_count();

-- ========================================
-- VUES UTILES
-- ========================================

-- 1. Vue des conversations avec dernier message
CREATE OR REPLACE VIEW v_conversations_with_last_message AS
SELECT
    c.id as conversation_id,
    c.type,
    c.title,
    c.trip_id,
    c.created_at,
    c.last_message_at,
    c.is_archived,
    m.id as last_message_id,
    m.content as last_message_content,
    m.message_type as last_message_type,
    m.sender_id as last_message_sender_id,
    u.name as last_message_sender_name,
    m.created_at as last_message_date,
    -- Compter le nombre de participants
    (SELECT COUNT(*) FROM conversation_participants cp
     WHERE cp.conversation_id = c.id AND cp.left_at IS NULL) as participant_count
FROM conversations c
         LEFT JOIN LATERAL (
    SELECT * FROM messages
    WHERE conversation_id = c.id
      AND is_deleted = false
    ORDER BY created_at DESC
    LIMIT 1
    ) m ON true
         LEFT JOIN users u ON m.sender_id = u.id;

-- 2. Vue des conversations d'un utilisateur avec compteur de non-lus
CREATE OR REPLACE VIEW v_user_conversations AS
SELECT
    cp.user_id,
    c.id as conversation_id,
    c.type,
    c.title,
    c.trip_id,
    c.last_message_at,
    c.is_archived,
    cp.unread_count,
    cp.is_muted,
    cp.last_read_at,
    -- Informations sur l'autre participant (pour conversations directes)
    CASE
        WHEN c.type = 'direct' THEN (
            SELECT u.name FROM conversation_participants cp2
                                   JOIN users u ON cp2.user_id = u.id
            WHERE cp2.conversation_id = c.id
              AND cp2.user_id != cp.user_id
            LIMIT 1
        )
        END as other_participant_name,
    CASE
        WHEN c.type = 'direct' THEN (
            SELECT cp2.user_id FROM conversation_participants cp2
            WHERE cp2.conversation_id = c.id
              AND cp2.user_id != cp.user_id
            LIMIT 1
        )
        END as other_participant_id
FROM conversation_participants cp
         JOIN conversations c ON cp.conversation_id = c.id
WHERE cp.left_at IS NULL;

-- 3. Vue des messages avec informations complètes
CREATE OR REPLACE VIEW v_messages_full AS
SELECT
    m.id,
    m.conversation_id,
    m.sender_id,
    u.name as sender_name,
    u.role as sender_role,
    m.parent_message_id,
    m.content,
    m.message_type,
    m.attachments,
    m.metadata,
    m.is_edited,
    m.is_deleted,
    m.created_at,
    m.updated_at,
    -- Compter combien de personnes ont lu
    (SELECT COUNT(*) FROM message_read_status mrs
     WHERE mrs.message_id = m.id) as read_count,
    -- Compter les réponses
    (SELECT COUNT(*) FROM messages m2
     WHERE m2.parent_message_id = m.id) as reply_count
FROM messages m
         JOIN users u ON m.sender_id = u.id;

-- ========================================
-- FONCTIONS UTILITAIRES
-- ========================================

-- 1. Créer ou obtenir une conversation directe entre deux utilisateurs
CREATE OR REPLACE FUNCTION get_or_create_direct_conversation(
    user1_id INTEGER,
    user2_id INTEGER
)
    RETURNS INTEGER AS $$
DECLARE
    conv_id INTEGER;
BEGIN
    -- Chercher une conversation existante
    SELECT c.id INTO conv_id
    FROM conversations c
    WHERE c.type = 'direct'
      AND EXISTS (
        SELECT 1 FROM conversation_participants cp1
        WHERE cp1.conversation_id = c.id
          AND cp1.user_id = user1_id
          AND cp1.left_at IS NULL
    )
      AND EXISTS (
        SELECT 1 FROM conversation_participants cp2
        WHERE cp2.conversation_id = c.id
          AND cp2.user_id = user2_id
          AND cp2.left_at IS NULL
    )
    LIMIT 1;

    -- Si pas trouvée, créer une nouvelle conversation
    IF conv_id IS NULL THEN
        INSERT INTO conversations (type, created_by)
        VALUES ('direct', user1_id)
        RETURNING id INTO conv_id;

        -- Ajouter les deux participants
        INSERT INTO conversation_participants (conversation_id, user_id)
        VALUES (conv_id, user1_id), (conv_id, user2_id);
    END IF;

    RETURN conv_id;
END;
$$ LANGUAGE 'plpgsql';

-- 2. Marquer tous les messages d'une conversation comme lus
CREATE OR REPLACE FUNCTION mark_conversation_as_read(
    p_conversation_id INTEGER,
    p_user_id INTEGER
)
    RETURNS VOID AS $$
BEGIN
    -- Insérer les statuts de lecture pour tous les messages non lus
    INSERT INTO message_read_status (message_id, user_id, read_at)
    SELECT m.id, p_user_id, now()
    FROM messages m
    WHERE m.conversation_id = p_conversation_id
      AND m.sender_id != p_user_id
      AND NOT EXISTS (
        SELECT 1 FROM message_read_status mrs
        WHERE mrs.message_id = m.id AND mrs.user_id = p_user_id
    )
    ON CONFLICT (message_id, user_id) DO NOTHING;

    -- Réinitialiser le compteur
    UPDATE conversation_participants
    SET unread_count = 0,
        last_read_at = now()
    WHERE conversation_id = p_conversation_id
      AND user_id = p_user_id;
END;
$$ LANGUAGE 'plpgsql';

-- 3. Obtenir le nombre total de messages non lus pour un utilisateur
CREATE OR REPLACE FUNCTION get_total_unread_messages(p_user_id INTEGER)
    RETURNS INTEGER AS $$
DECLARE
    total INTEGER;
BEGIN
    SELECT COALESCE(SUM(unread_count), 0) INTO total
    FROM conversation_participants
    WHERE user_id = p_user_id
      AND left_at IS NULL
      AND is_muted = false;

    RETURN total;
END;
$$ LANGUAGE 'plpgsql';

-- ========================================
-- DONNÉES D'EXEMPLE (OPTIONNEL)
-- ========================================

-- Commentaire sur l'utilisation du metadata dans messages
COMMENT ON COLUMN messages.metadata IS 'Données flexibles: {location: {lat, lng}, trip_status: "arrived", custom_fields: {}}';
COMMENT ON COLUMN messages.attachments IS 'Tableau de fichiers: [{url: "...", name: "...", size: 1024, type: "image/jpeg"}]';

-- Commentaire sur les types de conversations
COMMENT ON COLUMN conversations.type IS 'direct: entre 2 utilisateurs, group: plusieurs utilisateurs, support: avec équipe technique';

COMMIT;