# 🚗 Guide : Comment démarrer le retour après avoir terminé l'aller

## 📋 Processus complet

### 1️⃣ **Démarrage de l'aller (matin)**

Le chauffeur démarre le trajet aller :

```bash
PUT /api/drivers/trips/72/start
```

**Résultat :**
- `status` = `'in_progress'` (aller en cours)
- `return_status` = `'pending'` (retour en attente)
- Notification envoyée aux parents : "Trajet aller démarré"

---

### 2️⃣ **Fin de l'aller**

Le chauffeur termine l'aller :

```bash
PUT /api/drivers/trips/72/completed
```

**Résultat :**
- `status` = `'completed'` (aller terminé)
- `return_status` = `'pending'` (retour toujours en attente)
- Notification envoyée aux parents : "Trajet aller terminé"

---

### 3️⃣ **Démarrage du retour (soir)**

**Le chauffeur fait exactement la même chose : il appuie sur "Démarrer" !**

```bash
PUT /api/drivers/trips/72/start
```

**Le système détecte automatiquement :**
- ✅ L'aller est terminé (`status = 'completed'`)
- ✅ Le retour est en attente (`return_status = 'pending'`)
- ✅ **→ Démarrer automatiquement le retour !**

**Résultat :**
- `status` = `'completed'` (aller toujours terminé)
- `return_status` = `'in_progress'` (retour maintenant en cours)
- Notification envoyée aux parents : "Trajet retour démarré"

---

## 🎯 Deux façons de démarrer le retour

### Option 1 : Détection automatique (recommandé)

Le chauffeur fait simplement :
```bash
PUT /api/drivers/trips/72/start
```

Le système détecte automatiquement que :
- L'aller est terminé
- Le retour doit être démarré
- **→ Démarre le retour automatiquement**

### Option 2 : Forcer la direction

Le chauffeur peut aussi forcer explicitement :
```bash
PUT /api/drivers/trips/72/start?direction=retour
```

---

## 📱 Exemple d'utilisation (côté mobile)

```javascript
// Le chauffeur appuie sur "Démarrer" (matin)
async function startTrip(tripId) {
  const response = await fetch(`/api/drivers/trips/${tripId}/start`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  // Résultat: Aller démarré
}

// Le chauffeur appuie sur "Terminer" (après l'aller)
async function completeTrip(tripId) {
  const response = await fetch(`/api/drivers/trips/${tripId}/completed`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  // Résultat: Aller terminé
}

// Le chauffeur appuie à nouveau sur "Démarrer" (soir)
// → Le système détecte automatiquement que c'est le retour !
async function startReturnTrip(tripId) {
  const response = await fetch(`/api/drivers/trips/${tripId}/start`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  // Résultat: Retour démarré automatiquement !
}
```

---

## 🔄 Flux complet visuel

```
┌─────────────────────────────────────────────────────────┐
│  MATIN - Départ de l'aller                              │
│  PUT /api/drivers/trips/72/start                        │
│  → status: 'in_progress'                                 │
│  → return_status: 'pending'                             │
│  → Notification: "Trajet aller démarré"                │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Arrivée à l'école - Fin de l'aller                     │
│  PUT /api/drivers/trips/72/completed                    │
│  → status: 'completed'                                   │
│  → return_status: 'pending'                              │
│  → Notification: "Trajet aller terminé"                 │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  SOIR - Départ du retour                                │
│  PUT /api/drivers/trips/72/start                        │
│  → Le système détecte:                                   │
│    • status = 'completed' ✅                             │
│    • return_status = 'pending' ✅                         │
│    • → Démarre automatiquement le retour !              │
│  → status: 'completed' (inchangé)                        │
│  → return_status: 'in_progress'                         │
│  → Notification: "Trajet retour démarré"                │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Arrivée à destination - Fin du retour                  │
│  PUT /api/drivers/trips/72/completed?direction=retour  │
│  → status: 'completed'                                   │
│  → return_status: 'completed'                           │
│  → Notification: "Trajet retour terminé"                │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Avantages de cette approche

1. **Simplicité** : Le chauffeur fait toujours la même action ("Démarrer")
2. **Automatique** : Le système détecte intelligemment quelle direction démarrer
3. **Sécurisé** : Impossible de démarrer le retour si l'aller n'est pas terminé
4. **Intuitif** : Pas besoin de se souvenir de quel bouton appuyer

---

## ⚠️ Validations

Le système vérifie automatiquement :

1. ✅ **L'aller doit être terminé** avant de démarrer le retour
   - Si `status !== 'completed'` → Erreur : "Vous devez d'abord terminer le trajet aller"

2. ✅ **Le retour ne doit pas être déjà démarré**
   - Si `return_status === 'in_progress'` → Erreur : "Le retour est déjà en cours"

3. ✅ **Le trajet doit être de type aller-retour**
   - Si `trip_type !== 'aller_retour'` → Pas de retour possible

---

## 🎯 Résumé

**Pour démarrer le retour, le chauffeur fait exactement la même chose que pour démarrer l'aller :**

1. Appuie sur "Démarrer" → `PUT /api/drivers/trips/{id}/start`
2. Le système détecte automatiquement que l'aller est terminé
3. Le système démarre automatiquement le retour
4. Les parents sont notifiés

**C'est aussi simple que ça ! 🎉**

