# 📚 Documentation Complète de la Gestion des Trajets

## 🎯 Vue d'ensemble

Le système de gestion des trajets permet aux **parents**, **chauffeurs** et **admins** d'interagir avec les trajets scolaires selon leurs rôles et permissions.

---

## 👨‍👩‍👧‍👦 PARENTS - Gestion des Trajets

### 📋 Endpoints disponibles

#### 1. **Voir mes trajets** 
`GET /api/parents/trips`

**Rôle :** Récupère tous les trajets où les enfants du parent sont passagers

**Données retournées :**
- Informations du trajet (départ, arrivée, heure, statut)
- Informations complètes du chauffeur (nom, téléphone, email, adresse, documents, véhicule)
- Liste de tous les passagers
- Informations de l'école
- Statut global (pour trajets aller-retour)

**Filtres :** Aucun (retourne tous les trajets des enfants du parent)

---

#### 2. **Voir les trajets disponibles**
`GET /api/parents/trips/available`

**Rôle :** Récupère les trajets disponibles pour réserver

**Filtres automatiques :**
- ✅ Trajets avec chauffeur assigné
- ✅ Date/heure de départ dans le futur
- ✅ Statut "pending" (disponible)
- ✅ **Filtre par école** : Uniquement les trajets dont l'école correspond aux écoles des enfants
- ✅ **Filtre de proximité** : Uniquement les trajets dont le point de départ est proche de l'adresse du parent (rayon de 10 km)
- ✅ **Filtre par emploi du temps** : Uniquement les trajets compatibles avec l'emploi du temps des enfants
  - Pour trajets **aller** ou partie aller d'un **aller-retour** : L'heure d'arrivée (départ + 30 min) doit être avant l'heure d'ouverture (`openTime`) de l'enfant
  - Pour trajets **retour** ou partie retour d'un **aller-retour** : L'heure de départ doit être après l'heure de fermeture (`closeTime`) de l'enfant
  - Le jour du trajet doit correspondre à un jour où l'enfant va à l'école (`open = true`)
- ✅ Places disponibles > 0

**Types de trajets affichés :**
- ✅ Trajets **aller** : Pour emmener les enfants à l'école le matin
- ✅ Trajets **retour** : Pour ramener les enfants de l'école le soir
- ✅ Trajets **aller-retour** : Trajet complet (aller + retour le même jour)

**Query params optionnels :**
- `school_id` : Filtrer par école
- `start_point` : Filtrer par point de départ
- `end_point` : Filtrer par point d'arrivée
- `min_available_seats` : Nombre minimum de places disponibles

**Données retournées :**
- Informations du trajet
- Nombre de places disponibles/occupées
- Informations du chauffeur (nom, téléphone, note moyenne)
- Liste des passagers actuels

---

#### 3. **Rechercher des trajets**
`GET /api/parents/trips/search`

**Rôle :** Recherche avancée de trajets avec multiples critères

**Query params :**
- `child_id` : ID de l'enfant
- `school_id` : ID de l'école
- `home_lat`, `home_lng` : Coordonnées GPS du domicile
- `date` : Date du trajet
- `departure_time_min`, `departure_time_max` : Plage horaire
- `min_rating` : Note minimale du chauffeur
- `verified_only` : Uniquement chauffeurs vérifiés
- `available_seats_min` : Places disponibles minimum
- `max_distance` : Distance maximale (km, défaut: 30)
- `max_price` : Prix maximum
- `max_duration` : Durée maximale (minutes)
- `sort_by` : Tri (optimized, distance, price, rating)
- `page`, `limit` : Pagination

**Fonctionnalités :**
- Calcul de distance GPS
- Tri intelligent (optimisé)
- Filtrage par proximité
- Filtrage par note du chauffeur

---

#### 4. **Détails d'un trajet**
`GET /api/parents/trips/{tripId}/details`

**Rôle :** Récupère les détails complets d'un trajet spécifique

**Données retournées :**
- Toutes les informations du trajet
- Informations complètes du chauffeur
- Liste détaillée des passagers avec leurs parents
- Statut en temps réel

---

#### 5. **Suivi en temps réel**
`GET /api/parents/trips/{tripId}/realtime`

**Rôle :** Suivi en temps réel de la position du chauffeur pendant le trajet

**Données retournées :**
- Position GPS actuelle du chauffeur
- Historique des positions
- Statut du trajet (pending, in_progress, completed)
- Temps estimé d'arrivée

---

#### 6. **Contacter le chauffeur**
`POST /api/parents/trips/{tripId}/contact-driver`

**Rôle :** Permet au parent de contacter le chauffeur (SMS, appel, etc.)

---

#### 7. **Filtres disponibles**
`GET /api/parents/trips/filters`

**Rôle :** Récupère les options de filtres disponibles (écoles, points de départ, etc.)

---

### 🔒 Permissions Parents

- ✅ **Voir** : Tous les trajets où leurs enfants sont passagers
- ✅ **Rechercher** : Tous les trajets disponibles (filtrés par école et proximité)
- ✅ **Réserver** : Via l'endpoint de réservation (non détaillé ici)
- ❌ **Créer** : Les parents ne peuvent pas créer de trajets
- ❌ **Modifier** : Les parents ne peuvent pas modifier les trajets
- ❌ **Annuler** : Les parents peuvent annuler leurs réservations (pas le trajet lui-même)

---

## 🚗 CHAUFFEURS - Gestion des Trajets

### 📋 Endpoints disponibles

#### 1. **Voir mes trajets**
`GET /api/drivers/trips`

**Rôle :** Récupère tous les trajets du chauffeur connecté

**Query params :**
- `status` : Filtrer par statut (pending, completed, canceled)
- `date_from`, `date_to` : Filtrer par période
- `page`, `limit` : Pagination

**Données retournées :**
- Liste de tous les trajets du chauffeur
- Informations de l'école
- Liste détaillée des passagers avec leurs parents
- Statut global (pour trajets aller-retour)

---

#### 2. **Créer un trajet**
`POST /api/drivers/trips`

**Rôle :** Crée un nouveau trajet (aller, retour, ou aller-retour)

**Body requis :**
```json
{
  "start_point": "Dakar, Plateau",
  "end_point": "École ABC, Almadies",
  "departure_time": "2024-12-25T08:00:00Z",
  "capacity_max": 4,
  "school_id": 1,
  "trip_type": "aller",  // "aller", "retour", ou "aller_retour" (optionnel, auto-détecté)
  "return_departure_time": "2024-12-25T16:00:00Z",  // Requis pour "aller_retour"
  "is_recurring": false
}
```

**Types de trajets :**

1. **Trajet "aller"** :
   ```json
   {
     "trip_type": "aller",
     "departure_time": "2024-12-25T08:00:00Z"
     // return_departure_time non requis
   }
   ```

2. **Trajet "retour"** :
   ```json
   {
     "trip_type": "retour",
     "departure_time": "2024-12-25T16:00:00Z"  // Heure de départ du retour
     // return_departure_time non utilisé
   }
   ```

3. **Trajet "aller-retour"** :
   ```json
   {
     "trip_type": "aller_retour",
     "departure_time": "2024-12-25T08:00:00Z",
     "return_departure_time": "2024-12-25T16:00:00Z"  // Requis
   }
   ```

**Validations :**
- ✅ Chauffeur doit être approuvé (`status = 'Approuvé'`)
- ✅ Capacité du trajet ≤ capacité du véhicule
- ✅ Date de départ dans le futur
- ✅ Si `trip_type` non fourni : auto-détection selon `return_departure_time`
- ✅ Si aller-retour : `return_departure_time` requis, même jour et après `departure_time`

**Résultat :**
- Crée un trajet avec statut `pending`
- Si aller-retour : crée avec `trip_type = 'aller_retour'` et `return_status = 'pending'`

**Avantages de cette approche :**
- ✅ **Flexibilité** : Les parents peuvent réserver séparément un trajet "aller" et un trajet "retour" (avec des chauffeurs différents si besoin)
- ✅ **Modularité** : Les chauffeurs peuvent créer des trajets spécialisés (uniquement aller ou uniquement retour)
- ✅ **Optimisation** : Permet de mieux gérer les capacités et les horaires

---

#### 3. **Démarrer un trajet**
`PUT /api/drivers/trips/{id}/start`

**Rôle :** Démarre un trajet (aller ou retour)

**Query params :**
- `direction` : `'aller'` ou `'retour'` (optionnel, détecté automatiquement)

**Fonctionnement :**
- Pour trajet simple : Met `status = 'in_progress'`
- Pour aller-retour :
  - Si `direction = 'aller'` ou non spécifié : Met `status = 'in_progress'`
  - Si `direction = 'retour'` : Met `return_status = 'in_progress'`

---

#### 4. **Terminer un trajet**
`PUT /api/drivers/trips/{id}/completed`

**Rôle :** Marque un trajet comme terminé

**Query params :**
- `direction` : `'aller'` ou `'retour'` (optionnel)

**Fonctionnement :**
- Pour trajet simple : Met `status = 'completed'`
- Pour aller-retour :
  - Si `direction = 'aller'` : Met `status = 'completed'`
  - Si `direction = 'retour'` : Met `return_status = 'completed'`
  - Si les deux sont terminés : Le statut global devient `'completed'`

---

#### 5. **Annuler un trajet**
`PUT /api/drivers/trips/{id}/canceled`

**Rôle :** Annule un trajet

**Fonctionnement :**
- Met le statut à `'canceled'`
- Notifie les parents des passagers
- Libère les places réservées

---

#### 6. **Mettre à jour la position GPS**
`POST /api/drivers/trips/{id}/location`

**Rôle :** Met à jour la position GPS du chauffeur pendant le trajet

**Body :**
```json
{
  "latitude": 14.7167,
  "longitude": -17.4677,
  "accuracy": 10
}
```

**Fonctionnement :**
- Enregistre la position dans `trip_locations`
- Permet le suivi en temps réel par les parents
- Historique des positions pour sécurité

---

### 🔒 Permissions Chauffeurs

- ✅ **Voir** : Uniquement leurs propres trajets
- ✅ **Créer** : Peuvent créer des trajets (si approuvé)
- ✅ **Modifier** : Peuvent modifier leurs trajets (avant le départ)
- ✅ **Démarrer** : Peuvent démarrer leurs trajets
- ✅ **Terminer** : Peuvent marquer leurs trajets comme terminés
- ✅ **Annuler** : Peuvent annuler leurs trajets
- ✅ **Position GPS** : Peuvent mettre à jour leur position
- ❌ **Voir autres trajets** : Ne peuvent pas voir les trajets des autres chauffeurs

---

## 👨‍💼 ADMINS - Gestion des Trajets

### 📋 Endpoints disponibles

Les admins ont généralement accès à tous les endpoints avec des permissions étendues :

#### Accès complet
- ✅ **Voir tous les trajets** : Tous les trajets du système
- ✅ **Voir tous les chauffeurs** : Liste complète des chauffeurs
- ✅ **Voir tous les parents** : Liste complète des parents
- ✅ **Modérer** : Approuver/refuser les chauffeurs
- ✅ **Statistiques** : Tableaux de bord avec statistiques globales
- ✅ **Gérer les écoles** : CRUD complet sur les écoles

### Endpoints spécifiques (si existants)

Les admins peuvent avoir des endpoints dédiés pour :
- Modération des trajets
- Gestion des utilisateurs
- Statistiques et rapports
- Gestion des paiements

---

## 🔄 Cycle de vie d'un trajet

### 1. **Création** (Chauffeur)
```
POST /api/drivers/trips
→ Trajet créé avec status = 'pending'
```

### 2. **Réservation** (Parent)
```
Parent réserve via l'interface
→ Enfant ajouté dans trip_children
→ Places disponibles diminuées
```

### 3. **Démarrage** (Chauffeur)
```
PUT /api/drivers/trips/{id}/start
→ status = 'in_progress'
→ Parents notifiés
→ Suivi GPS activé
```

### 4. **En cours** (Chauffeur)
```
POST /api/drivers/trips/{id}/location
→ Position GPS mise à jour régulièrement
→ Parents peuvent suivre en temps réel
```

### 5. **Terminaison** (Chauffeur)
```
PUT /api/drivers/trips/{id}/completed
→ status = 'completed'
→ Parents peuvent évaluer le trajet
```

### 6. **Annulation** (Chauffeur ou système)
```
PUT /api/drivers/trips/{id}/canceled
→ status = 'canceled'
→ Parents notifiés
→ Places libérées
```

---

## 📊 Statuts des trajets

### Statuts simples (trajet aller uniquement)
- `pending` : En attente de départ
- `in_progress` : En cours
- `completed` : Terminé
- `canceled` : Annulé

### Statuts pour trajets aller-retour
- **Aller** : `status` (pending, in_progress, completed, canceled)
- **Retour** : `return_status` (pending, in_progress, completed, canceled)
- **Statut global** : Calculé via `get_trip_overall_status()`
  - `pending` : Aller et retour en attente
  - `in_progress` : Au moins un en cours
  - `completed` : Les deux terminés
  - `canceled` : Au moins un annulé

---

## 🔐 Règles de sécurité

### Parents
- Ne peuvent voir que les trajets de leurs enfants
- Filtrage automatique par école et proximité
- Ne peuvent pas modifier les trajets

### Chauffeurs
- Ne peuvent voir que leurs propres trajets
- Doivent être approuvés pour créer des trajets
- Capacité limitée par leur véhicule
- Ne peuvent pas voir les trajets des autres

### Admins
- Accès complet à tous les trajets
- Peuvent modérer et gérer
- Statistiques globales

---

## 📝 Résumé des Endpoints par Rôle

| Action | Parent | Chauffeur | Admin |
|--------|--------|-----------|-------|
| **Voir mes trajets** | ✅ | ✅ | ✅ (tous) |
| **Voir trajets disponibles** | ✅ | ❌ | ✅ |
| **Rechercher trajets** | ✅ | ❌ | ✅ |
| **Créer un trajet** | ❌ | ✅ | ✅ |
| **Modifier un trajet** | ❌ | ✅ (siens) | ✅ |
| **Démarrer un trajet** | ❌ | ✅ (siens) | ✅ |
| **Terminer un trajet** | ❌ | ✅ (siens) | ✅ |
| **Annuler un trajet** | ❌ | ✅ (siens) | ✅ |
| **Mettre à jour GPS** | ❌ | ✅ (siens) | ✅ |
| **Suivre en temps réel** | ✅ | ❌ | ✅ |
| **Contacter chauffeur** | ✅ | ❌ | ✅ |
| **Évaluer un trajet** | ✅ | ❌ | ❌ |

---

## 🎯 Points clés

1. **Séparation des rôles** : Chaque rôle a des permissions spécifiques
2. **Filtrage intelligent** : Les parents voient uniquement les trajets pertinents :
   - Même école que les enfants
   - Proximité géographique (rayon de 10 km)
   - **Compatibilité avec l'emploi du temps des enfants** (horaires d'arrivée/départ)
3. **Trajets aller-retour** : Gestion complète avec statuts séparés
4. **Suivi GPS** : Position en temps réel pour sécurité
5. **Notifications** : Parents notifiés des changements de statut
6. **Évaluations** : Parents peuvent évaluer les trajets complétés
7. **Emploi du temps personnalisé** : Chaque enfant peut avoir un emploi du temps différent de l'école

---

## 🔄 Flux typique

### Scénario 1 : Parent réserve un trajet

```
1. Parent cherche des trajets
   → GET /api/parents/trips/available
   → Filtre automatique par école et proximité

2. Parent sélectionne un trajet
   → Voir détails : GET /api/parents/trips/{id}/details

3. Parent réserve (via interface)
   → Enfant ajouté au trajet
   → Places disponibles diminuées

4. Jour du trajet
   → Chauffeur démarre : PUT /api/drivers/trips/{id}/start
   → Parent suit en temps réel : GET /api/parents/trips/{id}/realtime
   → Chauffeur met à jour position : POST /api/drivers/trips/{id}/location

5. Trajet terminé
   → Chauffeur termine : PUT /api/drivers/trips/{id}/completed
   → Parent peut évaluer : POST /api/evaluations
```

### Scénario 2 : Chauffeur crée un trajet

```
1. Chauffeur crée un trajet
   → POST /api/drivers/trips
   → Trajet visible dans /api/parents/trips/available

2. Parents réservent
   → Places se remplissent

3. Jour du trajet
   → Chauffeur démarre et gère le trajet
   → Mise à jour GPS régulière

4. Trajet terminé
   → Chauffeur marque comme terminé
   → Parents peuvent évaluer
```

---

## 📌 Notes importantes

1. **Filtrage automatique** : Les parents voient automatiquement uniquement les trajets pertinents :
   - Même école
   - Proximité géographique
   - **Compatibilité avec l'emploi du temps** (nouveau)
2. **Emploi du temps des enfants** : 
   - Chaque enfant a un emploi du temps personnalisé (`schedule` JSONB)
   - Définit les jours où l'enfant va à l'école (`open: true/false`)
   - Définit les heures d'arrivée (`openTime`) et de départ (`closeTime`)
   - Les trajets sont filtrés pour correspondre à ces horaires
3. **Approbation chauffeur** : Les chauffeurs doivent être approuvés pour créer des trajets
4. **Capacité véhicule** : La capacité du trajet ne peut pas dépasser celle du véhicule
5. **Trajets aller-retour** : Gestion séparée des statuts aller/retour
6. **Suivi GPS** : Historique complet des positions pour sécurité
7. **Notifications** : Système de notifications pour les changements importants

