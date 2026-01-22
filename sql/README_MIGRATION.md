# Migration : Rendre les champs drivers nullable

## Problème
L'erreur `null value in column "vehicle_color" of relation "drivers" violates not-null constraint` indique que la base de données a encore des contraintes NOT NULL sur les champs du driver.

## Solution
Exécutez le script SQL suivant dans votre base de données PostgreSQL.

## Méthode 1 : Via psql (recommandé)

```bash
psql -U votre_utilisateur -d votre_base_de_donnees -f backend/sql/fix_driver_nullable.sql
```

## Méthode 2 : Via pgAdmin ou autre outil SQL

1. Ouvrez votre outil de gestion de base de données (pgAdmin, DBeaver, etc.)
2. Connectez-vous à votre base de données
3. Ouvrez le fichier `backend/sql/fix_driver_nullable.sql`
4. Exécutez le script

## Méthode 3 : Via ligne de commande SQL directe

```sql
ALTER TABLE drivers 
    ALTER COLUMN license_document DROP NOT NULL,
    ALTER COLUMN id_document DROP NOT NULL,
    ALTER COLUMN vehicle_photo DROP NOT NULL,
    ALTER COLUMN vehicle_color DROP NOT NULL,
    ALTER COLUMN vehicle_plate DROP NOT NULL;
```

## Vérification

Après avoir exécuté le script, vous pouvez vérifier avec :

```sql
SELECT column_name, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'drivers' 
AND column_name IN ('vehicle_color', 'vehicle_plate', 'license_document', 'id_document', 'vehicle_photo');
```

Tous les champs doivent avoir `is_nullable = 'YES'`.

## Important
⚠️ **Cette migration est nécessaire pour que le code fonctionne correctement.** Sans elle, vous continuerez à avoir l'erreur 500 lors de la création ou modification d'utilisateurs avec le rôle driver.
