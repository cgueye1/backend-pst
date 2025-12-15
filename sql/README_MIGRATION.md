# Migration SQL - Ajout de la colonne schedule et status

Pour ajouter les colonnes `schedule` (horaires par jour) et `status` à la table `schools`, exécutez le script SQL suivant dans votre base de données PostgreSQL :

```sql
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
```

## Comment exécuter

### Option 1 : Via psql (ligne de commande)
```bash
psql -U votre_utilisateur -d votre_base_de_donnees -f backend/sql/add_schedule_to_schools.sql
```

### Option 2 : Via un client PostgreSQL (pgAdmin, DBeaver, etc.)
1. Ouvrez votre client PostgreSQL
2. Connectez-vous à votre base de données
3. Exécutez le contenu du fichier `backend/sql/add_schedule_to_schools.sql`

### Option 3 : Via psql interactif
```bash
psql -U votre_utilisateur -d votre_base_de_donnees
```
Puis copiez-collez les commandes SQL ci-dessus.

## Vérification

Après l'exécution, vérifiez que les colonnes ont été ajoutées :
```sql
\d schools
```

Vous devriez voir les colonnes `schedule` (type jsonb) et `status` (type varchar(20)).

## Fonctionnalités

Une fois cette migration effectuée :
- ✅ Les horaires peuvent être configurés par jour (Lundi à Dimanche)
- ✅ Les mêmes horaires sont visibles dans la création, modification et détails
- ✅ Le changement de statut des écoles fonctionnera correctement
