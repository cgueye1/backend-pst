# 🚗 Guide Complet : Processus du Chauffeur pour un Trajet Aller-Retour

## 📋 Scénario Complet : DKR → Yoff (École) → DKR

### 🕐 **MATIN - 8h00 : Départ de DKR vers l'école**

#### Étape 1 : Le chauffeur démarre le trajet aller

**Action :** Le chauffeur appuie sur "Démarrer le trajet"

**API Call :**
```bash
PUT /api/drivers/trips/72/start
```

**Ce qui se passe :**
- ✅ Le système détecte que c'est l'aller (car `status = 'pending'`)
- ✅ `status` passe de `'pending'` → `'in_progress'`
- ✅ `return_status` reste `'pending'`
- ✅ Notification envoyée aux parents : "Le trajet aller pour [enfant] a commencé"

**État du trajet :**
```
status: 'in_progress'        ← Aller en cours
return_status: 'pending'    ← Retour en attente
```

---

### 🏫 **Arrivée à l'école - 8h30 : Fin de l'aller**

#### Étape 2 : Le chauffeur termine l'aller

**Action :** Le chauffeur appuie sur "Terminer le trajet"

**API Call :**
```bash
PUT /api/drivers/trips/72/completed
```

**Ce qui se passe :**
- ✅ Le système détecte que c'est l'aller (car `status = 'in_progress'`)
- ✅ `status` passe de `'in_progress'` → `'completed'`
- ✅ `return_status` reste `'pending'`
- ✅ Notification envoyée aux parents : "[enfant] est arrivé(e) à destination (trajet aller) en toute sécurité"

**État du trajet :**
```
status: 'completed'         ← Aller terminé ✅
return_status: 'pending'    ← Retour toujours en attente
```

**Le chauffeur peut maintenant :**
- Faire une pause
- Attendre l'heure de retour (16h00)
- Faire d'autres trajets

---

### 🕐 **SOIR - 16h00 : Départ de l'école vers DKR**

#### Étape 3 : Le chauffeur démarre le retour

**Action :** Le chauffeur appuie sur "Démarrer le trajet" (encore une fois !)

**API Call :**
```bash
PUT /api/drivers/trips/72/start
```

**Ce qui se passe :**
- ✅ Le système détecte automatiquement :
  - `status = 'completed'` (aller terminé) ✅
  - `return_status = 'pending'` (retour en attente) ✅
  - **→ C'est donc le retour qu'il faut démarrer !**
- ✅ `status` reste `'completed'` (inchangé)
- ✅ `return_status` passe de `'pending'` → `'in_progress'`
- ✅ Notification envoyée aux parents : "Le trajet retour pour [enfant] a commencé"

**État du trajet :**
```
status: 'completed'         ← Aller terminé ✅
return_status: 'in_progress' ← Retour en cours 🚗
```

---

### 🏠 **Arrivée à DKR - 16h30 : Fin du retour**

#### Étape 4 : Le chauffeur termine le retour

**Action :** Le chauffeur appuie sur "Terminer le trajet"

**API Call :**
```bash
PUT /api/drivers/trips/72/completed?direction=retour
```

**OU simplement (détection automatique) :**
```bash
PUT /api/drivers/trips/72/completed
```

**Ce qui se passe :**
- ✅ Le système détecte que c'est le retour (car `return_status = 'in_progress'`)
- ✅ `status` reste `'completed'`
- ✅ `return_status` passe de `'in_progress'` → `'completed'`
- ✅ Notification envoyée aux parents : "[enfant] est arrivé(e) à destination (trajet retour) en toute sécurité"

**État du trajet :**
```
status: 'completed'         ← Aller terminé ✅
return_status: 'completed' ← Retour terminé ✅
```

**🎉 Le trajet aller-retour est maintenant complètement terminé !**

---

## 📱 Exemple d'Interface Mobile

### Matin - Départ

```
┌─────────────────────────────────┐
│  🚗 Trajet #72                  │
│  DKR → Yoff (École)             │
│                                  │
│  [DÉMARRER] ← Appuie ici         │
│                                  │
│  Statut: En attente             │
└─────────────────────────────────┘
```

**Après avoir appuyé :**
```
┌─────────────────────────────────┐
│  🚗 Trajet #72                  │
│  DKR → Yoff (École)             │
│                                  │
│  [TERMINER] ← Appuie quand      │
│              tu arrives          │
│                                  │
│  Statut: En cours (Aller) 🚗    │
└─────────────────────────────────┘
```

---

### Arrivée à l'école

```
┌─────────────────────────────────┐
│  🚗 Trajet #72                  │
│  DKR → Yoff (École)             │
│                                  │
│  [TERMINER] ← Appuie ici        │
│                                  │
│  Statut: En cours (Aller) 🚗    │
└─────────────────────────────────┘
```

**Après avoir appuyé :**
```
┌─────────────────────────────────┐
│  🚗 Trajet #72                  │
│  DKR → Yoff (École)             │
│                                  │
│  Aller: ✅ Terminé               │
│  Retour: ⏳ En attente (16h00)   │
│                                  │
│  [DÉMARRER RETOUR] ← Apparaît   │
│  quand c'est l'heure            │
└─────────────────────────────────┘
```

---

### Soir - Départ retour

```
┌─────────────────────────────────┐
│  🚗 Trajet #72                  │
│  Yoff (École) → DKR             │
│                                  │
│  [DÉMARRER RETOUR] ← Appuie ici │
│                                  │
│  Aller: ✅ Terminé               │
│  Retour: ⏳ En attente          │
└─────────────────────────────────┘
```

**Après avoir appuyé :**
```
┌─────────────────────────────────┐
│  🚗 Trajet #72                  │
│  Yoff (École) → DKR             │
│                                  │
│  [TERMINER] ← Appuie quand      │
│              tu arrives          │
│                                  │
│  Statut: En cours (Retour) 🚗   │
└─────────────────────────────────┘
```

---

### Arrivée à DKR

```
┌─────────────────────────────────┐
│  🚗 Trajet #72                  │
│  Yoff (École) → DKR             │
│                                  │
│  [TERMINER] ← Appuie ici        │
│                                  │
│  Statut: En cours (Retour) 🚗   │
└─────────────────────────────────┘
```

**Après avoir appuyé :**
```
┌─────────────────────────────────┐
│  🚗 Trajet #72                  │
│  Yoff (École) → DKR             │
│                                  │
│  Aller: ✅ Terminé               │
│  Retour: ✅ Terminé              │
│                                  │
│  🎉 Trajet complété !            │
└─────────────────────────────────┘
```

---

## 🔄 Résumé des 4 Actions

| Action | Endpoint | Résultat |
|--------|----------|----------|
| **1. Démarrer aller** | `PUT /start` | `status: 'in_progress'` |
| **2. Terminer aller** | `PUT /completed` | `status: 'completed'` |
| **3. Démarrer retour** | `PUT /start` | `return_status: 'in_progress'` |
| **4. Terminer retour** | `PUT /completed` | `return_status: 'completed'` |

---

## ✅ Checklist pour le Chauffeur

### Matin
- [ ] Appuie sur "Démarrer" → Aller commence
- [ ] Arrive à l'école
- [ ] Appuie sur "Terminer" → Aller terminé

### Soir
- [ ] Appuie sur "Démarrer" → Retour commence (détection automatique)
- [ ] Arrive à destination
- [ ] Appuie sur "Terminer" → Retour terminé

---

## 🎯 Points Clés à Retenir

1. **Même bouton "Démarrer"** pour l'aller ET le retour
2. **Le système détecte automatiquement** quelle direction démarrer
3. **L'aller doit être terminé** avant de démarrer le retour
4. **4 actions simples** : Démarrer → Terminer → Démarrer → Terminer

---

**C'est aussi simple que ça ! 🚗✨**

