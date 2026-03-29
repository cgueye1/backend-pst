# ✅ Endpoints Corrigés pour Utiliser le Statut Global

## 🎯 Objectif

Tous les endpoints qui filtrent ou vérifient le statut d'un trajet utilisent maintenant le **statut global** qui combine `status` (aller) et `return_status` (retour).

---

## 📋 Endpoints Corrigés

### 1. ✅ `/api/trips` (GET) - Admin
**Fichier :** `app/api/trips/route.ts`

**Changements :**
- ✅ Ajout du support des filtres (status, driver_id, school_id, date_from, date_to)
- ✅ Utilisation du statut global pour filtrer par statut
- ✅ Ajout du champ `overall_status` dans la réponse
- ✅ Ajout de la pagination
- ✅ Amélioration de la réponse avec plus d'informations

**Avant :**
```typescript
// Récupérait tous les trajets sans filtres
SELECT t.id, t.start_point, t.end_point, ...
FROM trips t
WHERE t.driver_id IS NULL
```

**Après :**
```typescript
// Filtre par statut global et autres paramètres
WHERE (
    CASE 
        WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
            get_trip_overall_status(t.status, t.return_status, t.trip_type) = $1
        ELSE
            t.status = $1
    END
)
```

**Impact :** L'admin peut maintenant filtrer correctement les trajets par statut global.

---

### 2. ✅ `/api/drivers/trips` (GET)
**Fichier :** `app/api/drivers/trips/route.ts`

**Avant :**
```typescript
if (status) {
    whereClause += ` AND t.status = $${paramIndex++}`;
    params.push(status);
}
```

**Après :**
```typescript
if (status) {
    // Utiliser le statut global pour les trajets aller-retour
    whereClause += ` AND (
        CASE 
            WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
                get_trip_overall_status(t.status, t.return_status, t.trip_type) = $${paramIndex}
            ELSE
                t.status = $${paramIndex}
        END
    )`;
    params.push(status);
    paramIndex++;
}
```

**Impact :** Quand un chauffeur filtre par `?status=completed`, il verra uniquement les trajets complètement terminés (aller ET retour terminés).

---

### 2. ✅ `/api/parents/reservations` (GET)
**Fichier :** `app/api/parents/reservations/route.ts`

**Avant :**
```typescript
if (status !== "all") {
    conditions.push(`t.status = $${paramIndex++}`);
    params.push(status);
}
```

**Après :**
```typescript
if (status !== "all") {
    // Utiliser le statut global pour les trajets aller-retour
    conditions.push(`(
        CASE 
            WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
                get_trip_overall_status(t.status, t.return_status, t.trip_type) = $${paramIndex}
            ELSE
                t.status = $${paramIndex}
        END
    )`);
    params.push(status);
    paramIndex++;
}
```

**Impact :** Les parents voient correctement les trajets filtrés par statut global.

---

### 3. ✅ `/api/parents/reservations` (POST)
**Fichier :** `app/api/parents/reservations/route.ts`

**Avant :**
```typescript
if (trip.status !== 'pending') {
    // Erreur
}
```

**Après :**
```typescript
const { getTripOverallStatus } = await import('@/lib/tripStatusUtils');
const overallStatus = getTripOverallStatus(
    trip.status,
    trip.return_status || null,
    trip.trip_type || 'aller'
);

if (overallStatus !== 'pending') {
    // Erreur
}
```

**Impact :** Un parent ne peut réserver que si le trajet est vraiment en attente (ni l'aller ni le retour n'ont démarré).

---

### 4. ✅ `/api/drivers/dashboard` (GET)
**Fichier :** `app/api/drivers/dashboard/route.ts`

**Avant :**
```typescript
COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_trips,
COUNT(CASE WHEN t.status = 'canceled' THEN 1 END) as canceled_trips,
```

**Après :**
```typescript
COUNT(CASE 
    WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
        CASE WHEN get_trip_overall_status(t.status, t.return_status, t.trip_type) = 'completed' THEN 1 END
    ELSE
        CASE WHEN t.status = 'completed' THEN 1 END
END) as completed_trips,
```

**Impact :** Les statistiques du dashboard comptent correctement les trajets complétés (aller ET retour terminés).

---

### 5. ✅ `/api/parents/dashboard` (GET)
**Fichier :** `app/api/parents/dashboard/route.ts`

**Avant :**
```typescript
COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'completed') AS completed_trips,
COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'pending') AS upcoming_trips,
```

**Après :**
```typescript
COUNT(DISTINCT t.id) FILTER (
    WHERE CASE 
        WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
            get_trip_overall_status(t.status, t.return_status, t.trip_type) = 'completed'
        ELSE
            t.status = 'completed'
    END
) AS completed_trips,
```

**Impact :** Les statistiques du dashboard parent sont correctes.

---

### 6. ✅ `/api/evaluations` (POST)
**Fichier :** `app/api/evaluations/route.ts`

**Avant :**
```typescript
if (trip.status !== 'completed') {
    // Erreur
}
```

**Après :**
```typescript
const { getTripOverallStatus } = await import('@/lib/tripStatusUtils');
const overallStatus = getTripOverallStatus(
    trip.status,
    trip.return_status || null,
    trip.trip_type || 'aller'
);

if (overallStatus !== 'completed') {
    // Erreur
}
```

**Impact :** Un parent ne peut évaluer que les trajets complètement terminés (aller ET retour terminés).

---

## 🔧 Fonction SQL Utilisée

Tous les endpoints utilisent maintenant la fonction SQL `get_trip_overall_status()` créée dans :
- `sql/migration_add_trip_overall_status.sql`

Cette fonction calcule automatiquement le statut global en combinant `status` et `return_status`.

---

## 📊 Exemple de Comportement

### Avant (Incorrect)
```sql
-- Un trajet avec status='completed' et return_status='pending'
-- Serait considéré comme "completed" même si le retour n'est pas terminé
WHERE t.status = 'completed'
```

### Après (Correct)
```sql
-- Le même trajet serait considéré comme "partially_completed"
-- Car seul l'aller est terminé
WHERE get_trip_overall_status(t.status, t.return_status, t.trip_type) = 'completed'
-- Retourne uniquement les trajets vraiment complétés (aller ET retour)
```

---

## ✅ Endpoints qui N'ont PAS Besoin de Correction

Ces endpoints utilisent correctement `status` et `return_status` séparément :

- ✅ `/api/drivers/trips/{id}/start` - Gère les statuts séparément (correct)
- ✅ `/api/drivers/trips/{id}/completed` - Gère les statuts séparément (correct)
- ✅ `/api/drivers/trips/{id}/canceled` - Gère les statuts séparément (correct)
- ✅ `/api/parents/trips/{tripId}/realtime` - Affiche les deux statuts (correct)
- ✅ `/api/parents/trips/available` - Filtre par `status='pending'` (correct, car on veut les trajets pas encore démarrés)

---

## 🎯 Résumé

**6 endpoints corrigés** pour utiliser le statut global :
1. `/api/drivers/trips` (GET) - Filtre par statut
2. `/api/parents/reservations` (GET) - Filtre par statut
3. `/api/parents/reservations` (POST) - Vérification disponibilité
4. `/api/drivers/dashboard` (GET) - Statistiques
5. `/api/parents/dashboard` (GET) - Statistiques
6. `/api/evaluations` (POST) - Vérification trajet complété

**Tous les endpoints utilisent maintenant correctement le statut global ! ✅**

