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