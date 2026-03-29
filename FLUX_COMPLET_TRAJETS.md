# 🔄 Flux Complet du Système de Trajets

## 📋 Vue d'ensemble

Le système permet aux **chauffeurs** de créer des trajets flexibles (aller, retour, ou aller-retour) et aux **parents** de voir et réserver uniquement les trajets compatibles avec l'emploi du temps de leurs enfants.

---

## 🚗 1. CRÉATION DE TRAJETS (Chauffeurs/Admins)

### A. Créer un trajet "aller" uniquement

**Endpoint :** `POST /api/drivers/trips`

**Body :**
```json
{
  "start_point": "Dakar, Plateau",
  "end_point": "École ABC, Almadies",
  "departure_time": "2024-12-25T08:00:00Z",
  "capacity_max": 4,
  "school_id": 1,
  "trip_type": "aller"
}
```

**Résultat :**
- ✅ Trajet créé avec `trip_type = 'aller'`
- ✅ Statut : `pending`
- ✅ Visible dans `/api/parents/trips/available` pour les parents dont les enfants vont à cette école

---

### B. Créer un trajet "retour" uniquement

**Endpoint :** `POST /api/drivers/trips`

**Body :**
```json
{
  "start_point": "École ABC, Almadies",
  "end_point": "Dakar, Plateau",
  "departure_time": "2024-12-25T16:00:00Z",  // Heure de départ du retour
  "capacity_max": 4,
  "school_id": 1,
  "trip_type": "retour"
}
```

**Résultat :**
- ✅ Trajet créé avec `trip_type = 'retour'`
- ✅ Statut : `pending`
- ✅ Visible dans `/api/parents/trips/available` pour les parents dont les enfants vont à cette école

---

### C. Créer un trajet "aller-retour"

**Endpoint :** `POST /api/drivers/trips`

**Body :**
```json
{
  "start_point": "Dakar, Plateau",
  "end_point": "École ABC, Almadies",
  "departure_time": "2024-12-25T08:00:00Z",
  "return_departure_time": "2024-12-25T16:00:00Z",
  "capacity_max": 4,
  "school_id": 1,
  "trip_type": "aller_retour"
}
```

**Résultat :**
- ✅ Trajet créé avec `trip_type = 'aller_retour'`
- ✅ Statut aller : `pending`
- ✅ Statut retour : `pending`
- ✅ Visible dans `/api/parents/trips/available` pour les parents dont les enfants vont à cette école

---

## 👨‍👩‍👧‍👦 2. VISUALISATION DES TRAJETS DISPONIBLES (Parents)

### Endpoint : `GET /api/parents/trips/available`

**Filtres automatiques appliqués :**

1. **Filtre par école** ✅
   - Uniquement les trajets dont `school_id` correspond aux écoles des enfants du parent

2. **Filtre par proximité** ✅
   - Uniquement les trajets dont le point de départ est proche de l'adresse du parent (rayon de 10 km)

3. **Filtre par emploi du temps** ✅
   - Pour trajets **aller** ou partie aller d'un **aller-retour** :
     - L'heure d'arrivée estimée (départ + 30 min) doit être **avant** `openTime` de l'enfant
     - Le jour doit correspondre à un jour où l'enfant va à l'école (`open = true`)
   
   - Pour trajets **retour** ou partie retour d'un **aller-retour** :
     - L'heure de départ doit être **après** `closeTime` de l'enfant
     - Le jour doit correspondre à un jour où l'enfant va à l'école (`open = true`)

4. **Filtre par disponibilité** ✅
   - Statut `pending`
   - Date/heure dans le futur
   - Places disponibles > 0

**Exemple de réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "trip_type": "aller",
      "departure_time": "2024-12-25T07:30:00Z",
      "start_point": "Dakar, Plateau",
      "end_point": "École ABC",
      "available_seats": 3,
      "driver_name": "Amadou Diallo",
      "driver_rating": 4.5
    },
    {
      "id": 2,
      "trip_type": "retour",
      "departure_time": "2024-12-25T16:30:00Z",
      "start_point": "École ABC",
      "end_point": "Dakar, Plateau",
      "available_seats": 2,
      "driver_name": "Mariama Ba",
      "driver_rating": 4.8
    },
    {
      "id": 3,
      "trip_type": "aller_retour",
      "departure_time": "2024-12-25T08:00:00Z",
      "return_departure_time": "2024-12-25T16:00:00Z",
      "start_point": "Dakar, Plateau",
      "end_point": "École ABC",
      "available_seats": 1,
      "driver_name": "Ibrahima Fall",
      "driver_rating": 5.0
    }
  ]
}
```

---

## 📅 3. EXEMPLE CONCRET : Emploi du temps d'un enfant

**Enfant :** Amadou, 8 ans
**École :** École ABC
**Emploi du temps :**
```json
{
  "day": "Lundi",
  "open": true,
  "openTime": "08:00",   // Arrivée à l'école
  "closeTime": "16:00"   // Départ de l'école
}
```

**Trajets acceptés pour le lundi :**

✅ **Trajet aller à 07:30** → Arrive à ~08:00 (compatible)
✅ **Trajet aller à 07:45** → Arrive à ~08:15 (compatible, marge de 30 min)
❌ **Trajet aller à 08:00** → Arrive à ~08:30 (trop tard)

✅ **Trajet retour à 16:30** → Part après 16:00 (compatible)
✅ **Trajet retour à 17:00** → Part après 16:00 (compatible)
❌ **Trajet retour à 15:30** → Part avant 16:00 (trop tôt)

✅ **Trajet aller-retour :**
   - Aller à 07:30 → ✅ Compatible
   - Retour à 16:30 → ✅ Compatible

---

## 🎫 4. RÉSERVATION (Parents)

### Scénario 1 : Réserver un trajet "aller" et un trajet "retour" séparés

**Étape 1 :** Parent réserve un trajet "aller"
- Trajet ID 1 (aller à 07:30)
- Enfant ajouté au trajet
- Places disponibles : 3 → 2

**Étape 2 :** Parent réserve un trajet "retour" (peut être un autre chauffeur)
- Trajet ID 2 (retour à 16:30)
- Même enfant ajouté au trajet
- Places disponibles : 2 → 1

**Résultat :**
- ✅ Enfant a un trajet aller avec chauffeur A
- ✅ Enfant a un trajet retour avec chauffeur B
- ✅ Flexibilité maximale

---

### Scénario 2 : Réserver un trajet "aller-retour" complet

**Étape 1 :** Parent réserve un trajet "aller-retour"
- Trajet ID 3 (aller à 08:00, retour à 16:00)
- Enfant ajouté au trajet
- Places disponibles : 1 → 0

**Résultat :**
- ✅ Enfant a un trajet aller-retour avec le même chauffeur
- ✅ Simplicité et cohérence

---

## 🚦 5. GESTION DU TRAJET (Chauffeur)

### Démarrer un trajet

**Endpoint :** `PUT /api/drivers/trips/{id}/start`

**Pour trajet "aller" :**
- Met `status = 'in_progress'`
- Active le suivi GPS

**Pour trajet "retour" :**
- Met `status = 'in_progress'`
- Active le suivi GPS

**Pour trajet "aller-retour" :**
- Si `direction = 'aller'` ou non spécifié : Met `status = 'in_progress'`
- Si `direction = 'retour'` : Met `return_status = 'in_progress'`

---

### Mettre à jour la position GPS

**Endpoint :** `POST /api/drivers/trips/{id}/location`

**Body :**
```json
{
  "latitude": 14.7167,
  "longitude": -17.4677,
  "accuracy": 10
}
```

**Résultat :**
- Position enregistrée dans `trip_locations`
- Parents peuvent suivre en temps réel via `GET /api/parents/trips/{id}/realtime`

---

### Terminer un trajet

**Endpoint :** `PUT /api/drivers/trips/{id}/completed`

**Pour trajet "aller" :**
- Met `status = 'completed'`
- Parents peuvent évaluer

**Pour trajet "retour" :**
- Met `status = 'completed'`
- Parents peuvent évaluer

**Pour trajet "aller-retour" :**
- Si `direction = 'aller'` : Met `status = 'completed'`
- Si `direction = 'retour'` : Met `return_status = 'completed'`
- Si les deux sont terminés : Statut global = `'completed'`

---

## 📊 6. RÉSUMÉ DU FLUX COMPLET

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CHAUFFEUR crée des trajets                               │
│    - Trajet "aller" à 07:30                                 │
│    - Trajet "retour" à 16:30                                │
│    - Trajet "aller-retour" (08:00 / 16:00)                 │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. SYSTÈME filtre automatiquement                           │
│    ✅ Par école (enfants du parent)                         │
│    ✅ Par proximité (10 km)                                 │
│    ✅ Par emploi du temps (openTime/closeTime)              │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. PARENT voit uniquement les trajets compatibles           │
│    - Trajet aller à 07:30 ✅                                │
│    - Trajet retour à 16:30 ✅                               │
│    - Trajet aller-retour ✅                                 │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. PARENT réserve                                            │
│    Option A : Aller séparé + Retour séparé                   │
│    Option B : Aller-retour complet                           │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. JOUR DU TRAJET                                            │
│    - Chauffeur démarre le trajet                             │
│    - Mise à jour GPS en temps réel                           │
│    - Parent suit via /realtime                              │
│    - Chauffeur termine le trajet                              │
│    - Parent évalue                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Points clés

1. **Flexibilité maximale** : Les parents peuvent combiner des trajets "aller" et "retour" de différents chauffeurs

2. **Filtrage intelligent** : Seuls les trajets vraiment compatibles sont affichés

3. **Emploi du temps personnalisé** : Chaque enfant peut avoir des horaires différents

4. **Gestion séparée** : Les trajets "aller" et "retour" sont gérés indépendamment

5. **Choix du parent** : Le parent décide s'il veut un trajet combiné ou séparé

---

## 📝 Exemple de journée complète

**Enfant :** Fatou, 10 ans
**École :** École XYZ
**Emploi du temps :** Lundi 08:00 - 16:00

**Matin (07:30) :**
- Parent réserve trajet "aller" ID 5 avec chauffeur A
- Chauffeur A démarre le trajet
- Fatou est emmenée à l'école
- Trajet terminé

**Soir (16:30) :**
- Parent réserve trajet "retour" ID 8 avec chauffeur B (différent)
- Chauffeur B démarre le trajet
- Fatou est ramenée à la maison
- Trajet terminé

**Alternative :**
- Parent réserve trajet "aller-retour" ID 12 avec chauffeur C
- Même chauffeur pour l'aller et le retour
- Plus simple mais moins flexible

---

## ✅ Avantages de cette approche

1. **Pour les parents :**
   - Plus de choix
   - Flexibilité dans la réservation
   - Trajets adaptés à l'emploi du temps

2. **Pour les chauffeurs :**
   - Peuvent se spécialiser (uniquement aller ou retour)
   - Meilleure gestion des horaires
   - Optimisation des trajets

3. **Pour le système :**
   - Meilleure utilisation des capacités
   - Plus de trajets disponibles
   - Filtrage intelligent automatique









