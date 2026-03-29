# 📊 Guide : Comprendre les Statuts des Trajets

## 🎯 Vue d'ensemble

Un trajet aller-retour a **deux statuts séparés** :
- **`status`** : Statut de l'aller (pending, in_progress, completed, canceled)
- **`return_status`** : Statut du retour (pending, in_progress, completed, canceled, ou NULL)

Le **statut global** du trajet est calculé en combinant ces deux statuts.

---

## 📋 Statuts Individuels

### `status` (Aller)

| Statut | Description |
|--------|-------------|
| `pending` | L'aller n'a pas encore démarré |
| `in_progress` | L'aller est en cours |
| `completed` | L'aller est terminé |
| `canceled` | L'aller est annulé |

### `return_status` (Retour)

| Statut | Description |
|--------|-------------|
| `NULL` | Pas de retour (trajet aller uniquement) |
| `pending` | Le retour n'a pas encore démarré |
| `in_progress` | Le retour est en cours |
| `completed` | Le retour est terminé |
| `canceled` | Le retour est annulé |

---

## 🔄 Statut Global Calculé

Le statut global combine `status` et `return_status` :

| `status` (Aller) | `return_status` (Retour) | **Statut Global** | Description |
|------------------|--------------------------|-------------------|-------------|
| `pending` | `pending` | `pending` | Trajet en attente (ni l'aller ni le retour n'ont démarré) |
| `in_progress` | `pending` | `in_progress` | Aller en cours |
| `completed` | `pending` | `partially_completed` | Aller terminé, retour en attente |
| `completed` | `in_progress` | `in_progress` | Retour en cours |
| `completed` | `completed` | `completed` | Trajet complètement terminé ✅ |
| `canceled` | * | `canceled` | Trajet annulé (aller annulé) |
| * | `canceled` | `canceled` | Trajet annulé (retour annulé) |

---

## 📊 Exemples Concrets

### Exemple 1 : Trajet en attente

```json
{
  "status": "pending",
  "return_status": "pending",
  "trip_type": "aller_retour"
}
```

**Statut global :** `pending`  
**Signification :** Le trajet n'a pas encore démarré

---

### Exemple 2 : Aller en cours

```json
{
  "status": "in_progress",
  "return_status": "pending",
  "trip_type": "aller_retour"
}
```

**Statut global :** `in_progress`  
**Signification :** L'aller est en cours, le retour attend

---

### Exemple 3 : Aller terminé, retour en attente

```json
{
  "status": "completed",
  "return_status": "pending",
  "trip_type": "aller_retour"
}
```

**Statut global :** `partially_completed`  
**Signification :** L'aller est terminé, le retour n'a pas encore démarré

---

### Exemple 4 : Retour en cours

```json
{
  "status": "completed",
  "return_status": "in_progress",
  "trip_type": "aller_retour"
}
```

**Statut global :** `in_progress`  
**Signification :** Le retour est en cours

---

### Exemple 5 : Trajet complètement terminé

```json
{
  "status": "completed",
  "return_status": "completed",
  "trip_type": "aller_retour"
}
```

**Statut global :** `completed`  
**Signification :** L'aller ET le retour sont terminés ✅

---

### Exemple 6 : Trajet annulé

```json
{
  "status": "canceled",
  "return_status": "pending",
  "trip_type": "aller_retour"
}
```

**Statut global :** `canceled`  
**Signification :** Le trajet est annulé (l'aller a été annulé)

---

## 💻 Utilisation dans le Code

### Fonction utilitaire

```typescript
import { getTripOverallStatus } from '@/lib/tripStatusUtils';

const overallStatus = getTripOverallStatus(
    trip.status,           // 'completed'
    trip.return_status,    // 'in_progress'
    trip.trip_type         // 'aller_retour'
);
// Retourne: 'in_progress'
```

### Vérifications

```typescript
import { 
    isTripActive, 
    isTripCompleted, 
    isTripCanceled 
} from '@/lib/tripStatusUtils';

// Vérifier si le trajet est actif
if (isTripActive(trip.status, trip.return_status, trip.trip_type)) {
    console.log('Le trajet est en cours');
}

// Vérifier si le trajet est complété
if (isTripCompleted(trip.status, trip.return_status, trip.trip_type)) {
    console.log('Le trajet est terminé');
}
```

### Libellés

```typescript
import { 
    getOverallStatusLabel, 
    getDetailedStatusLabel 
} from '@/lib/tripStatusUtils';

// Libellé simple
const label = getOverallStatusLabel('partially_completed');
// Retourne: "Partiellement terminé (aller terminé, retour en attente)"

// Libellé détaillé
const detailed = getDetailedStatusLabel(
    'completed',
    'pending',
    'aller_retour'
);
// Retourne: "Aller: Terminé, Retour: En attente"
```

---

## 🗄️ Utilisation SQL

### Fonction SQL

```sql
-- Utiliser la fonction SQL
SELECT 
    id,
    status,
    return_status,
    get_trip_overall_status(status, return_status, trip_type) as overall_status
FROM trips
WHERE id = 72;
```

### Vue SQL

```sql
-- Utiliser la vue
SELECT 
    id,
    status,
    return_status,
    overall_status
FROM trips_with_overall_status
WHERE id = 72;
```

---

## 📊 Tableau Récapitulatif

| Étape | `status` | `return_status` | Statut Global | Action Possible |
|-------|----------|-----------------|---------------|----------------|
| **1. Création** | `pending` | `pending` | `pending` | Démarrer l'aller |
| **2. Aller démarré** | `in_progress` | `pending` | `in_progress` | Terminer l'aller |
| **3. Aller terminé** | `completed` | `pending` | `partially_completed` | Démarrer le retour |
| **4. Retour démarré** | `completed` | `in_progress` | `in_progress` | Terminer le retour |
| **5. Retour terminé** | `completed` | `completed` | `completed` | ✅ Trajet terminé |

---

## ✅ Points Importants

1. **Pour un trajet aller-retour :**
   - `status` gère l'aller
   - `return_status` gère le retour
   - Le statut global combine les deux

2. **Pour un trajet simple (aller uniquement) :**
   - `return_status` est `NULL`
   - Le statut global = `status`

3. **Le trajet est complété uniquement si :**
   - `status = 'completed'` ET
   - `return_status = 'completed'` (pour aller-retour)

4. **Le trajet est annulé si :**
   - `status = 'canceled'` OU
   - `return_status = 'canceled'`

---

## 🎯 Résumé

- **`status`** = Statut de l'aller
- **`return_status`** = Statut du retour
- **Statut global** = Combinaison des deux (calculé automatiquement)

**Le statut global dépend bien de l'aller ET du retour ! ✅**

