# Création des Tables Covoiturage (Carpool)

## Problème

Les tables suivantes sont utilisées dans le code mais n'existent pas dans la base de données :
- `carpool_groups` - Groupes de covoiturage
- `carpool_group_members` - Membres des groupes
- `carpool_calendar` - Calendrier des trajets
- `carpool_exchanges` - Échanges de conduite

## Solution

Exécuter le script SQL `create_carpool_tables.sql` pour créer toutes les tables nécessaires.

## Exécution du script

### Option 1 : Via psql (ligne de commande)

```bash
psql -U postgres -d PST_DB -f sql/create_carpool_tables.sql
```

### Option 2 : Via Docker

```bash
# Copier le script dans le conteneur
docker cp sql/create_carpool_tables.sql transport-postgres:/tmp/

# Exécuter le script
docker exec -i transport-postgres psql -U postgres -d PST_DB < /tmp/create_carpool_tables.sql
```

### Option 3 : Via pgAdmin

1. Ouvrir pgAdmin
2. Se connecter à la base de données `PST_DB`
3. Ouvrir l'éditeur SQL
4. Copier-coller le contenu de `create_carpool_tables.sql`
5. Exécuter le script

## Vérification

Après l'exécution, vérifiez que les tables existent :

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'carpool%'
ORDER BY table_name;
```

Vous devriez voir :
- `carpool_calendar`
- `carpool_exchanges`
- `carpool_group_members`
- `carpool_groups`

## Structure des tables

### 1. carpool_groups
- `id` : Identifiant unique
- `name` : Nom du groupe
- `description` : Description du groupe
- `school_id` : École associée (optionnel)
- `creator_id` : Parent créateur du groupe
- `status` : Statut du groupe (active, inactive, archived)
- `created_at`, `updated_at` : Dates de création/modification

### 2. carpool_group_members
- `id` : Identifiant unique
- `group_id` : Référence au groupe
- `parent_id` : Référence au parent (utilisateur)
- `status` : Statut de l'invitation (pending, accepted, declined, rejected, left)
- `invited_at` : Date d'invitation
- `responded_at` : Date de réponse
- Contrainte UNIQUE sur (group_id, parent_id)

### 3. carpool_calendar
- `id` : Identifiant unique
- `group_id` : Référence au groupe
- `date` : Date du trajet
- `driver_id` : Parent qui conduit (optionnel)
- `start_point` : Point de départ
- `end_point` : Point d'arrivée
- `departure_time` : Heure de départ
- `return_time` : Heure de retour
- `capacity_max` : Capacité maximale
- `notes` : Notes additionnelles
- `status` : Statut du trajet (scheduled, completed, cancelled)
- `created_by` : Parent qui a créé l'entrée
- `created_at`, `updated_at` : Dates de création/modification

### 4. carpool_exchanges
- `id` : Identifiant unique
- `group_id` : Référence au groupe
- `calendar_id` : Référence à l'entrée du calendrier (optionnel)
- `requester_id` : Parent qui fait la demande
- `target_driver_id` : Parent cible de l'échange (optionnel)
- `original_date` : Date originale du trajet
- `proposed_date` : Date proposée pour l'échange (optionnel)
- `exchange_type` : Type (swap, give, request)
- `message` : Message accompagnant la proposition
- `status` : Statut (pending, accepted, declined, completed, canceled)
- `created_at`, `updated_at` : Dates de création/modification
- `responded_at` : Date de réponse

## Relations

- `carpool_groups` → `schools` (optionnel)
- `carpool_groups` → `users` (creator_id)
- `carpool_group_members` → `carpool_groups`
- `carpool_group_members` → `users` (parent_id)
- `carpool_calendar` → `carpool_groups`
- `carpool_calendar` → `users` (driver_id, created_by)
- `carpool_exchanges` → `carpool_groups`
- `carpool_exchanges` → `carpool_calendar` (optionnel)
- `carpool_exchanges` → `users` (requester_id, target_driver_id)

## Index créés

Pour optimiser les performances, les index suivants sont créés :
- Index sur `creator_id` dans `carpool_groups`
- Index sur `school_id` dans `carpool_groups`
- Index sur `group_id` dans `carpool_group_members`
- Index sur `parent_id` dans `carpool_group_members`
- Index sur `status` dans `carpool_group_members`
- Index sur `group_id` dans `carpool_calendar`
- Index sur `date` dans `carpool_calendar`
- Index sur `driver_id` dans `carpool_calendar`
- Index sur `group_id`, `requester_id`, `target_driver_id`, `status` dans `carpool_exchanges`

## Notes importantes

- Les tables utilisent `ON DELETE CASCADE` pour supprimer automatiquement les données liées
- Les contraintes CHECK garantissent la validité des statuts
- La contrainte UNIQUE sur `carpool_group_members` empêche les doublons
- Tous les champs de date/heure ont des valeurs par défaut

