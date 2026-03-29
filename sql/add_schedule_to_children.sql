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























