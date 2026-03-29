# 📋 Explication du Système de Demandes de Remplacement

## 🎯 Vue d'ensemble

Le système de remplacement permet à un parent **assigné à conduire un jour donné** de demander à être remplacé par un autre membre du groupe de covoiturage.

---

## 👤 Qui demande à être remplacé ?

**Le parent qui est assigné à conduire** (dans le planning du groupe).

### Exemple de scénario :
1. Un planning est créé pour le groupe "École ABC"
2. Le système assigne automatiquement les jours aux membres :
   - **Parent A** → 15 janvier (conduire)
   - **Parent B** → 16 janvier (conduire)
   - **Parent C** → 17 janvier (conduire)
   - etc.

3. **Parent A** ne peut pas conduire le 15 janvier (maladie, urgence, etc.)
4. **Parent A** crée une **demande de remplacement** avec un motif

---

## ✅ Qui peut accepter/valider la demande ?

**N'importe quel autre membre du groupe** (sauf celui qui a fait la demande).

### Conditions pour accepter :
- ✅ Être membre du groupe (statut `accepted`)
- ✅ Ne pas être celui qui a créé la demande
- ✅ La demande doit être en statut `pending`

### Exemple :
- **Parent A** crée la demande de remplacement pour le 15 janvier
- **Parent B**, **Parent C**, **Parent D** (autres membres) voient la demande
- **Parent B** accepte → **Parent B** devient automatiquement le conducteur pour le 15 janvier
- **Parent A** est libéré de son obligation

---

## 🔄 Flux complet

### Étape 1 : Création de la demande
```
POST /api/parents/carpool/calendar/{calendarId}/replace
Body: { "reason": "Maladie, je ne peux pas conduire" }
```

**Qui peut faire ça ?**
- Le parent assigné à ce jour (`driver_id` dans `carpool_calendar`)

**Résultat :**
- Une demande est créée avec le statut `pending`
- Le statut du calendrier passe à `replacement_requested`
- Les autres membres du groupe peuvent voir cette demande

---

### Étape 2 : Visualisation des demandes
```
GET /api/parents/carpool/groups/{groupId}/replacement-requests
```

**Qui peut voir ça ?**
- Tous les membres du groupe

**Résultat :**
- Liste de toutes les demandes de remplacement du groupe
- Chaque demande montre :
  - Qui a demandé (`requested_by_name`)
  - Pour quel jour (`date`)
  - Le motif (`reason`)
  - Le statut (`pending`, `accepted`, `declined`)
  - Si c'est ma demande (`is_my_request`)
  - Si je peux répondre (`can_respond`)

---

### Étape 3 : Accepter ou refuser
```
POST /api/parents/carpool/replacement-requests/{requestId}
Body: { "action": "accept" } ou { "action": "decline" }
```

**Qui peut faire ça ?**
- N'importe quel membre du groupe (sauf celui qui a créé la demande)

**Si "accept" :**
- ✅ La demande passe au statut `accepted`
- ✅ Le calendrier est mis à jour : le nouveau conducteur (`responded_by`) devient le `driver_id`
- ✅ Le statut de confirmation passe à `confirmed`
- ✅ Le parent qui accepte est maintenant assigné à ce jour

**Si "decline" :**
- ❌ La demande passe au statut `declined`
- ⚠️ Le calendrier reste avec `replacement_requested`
- ⚠️ La demande reste visible mais marquée comme refusée
- ⚠️ Un autre membre peut toujours accepter (si la demande était encore `pending`)

---

## 📊 Exemple concret

### Situation initiale :
```
Planning du groupe "École ABC" - Janvier 2025
├── 15 janvier → Parent A (driver_id = 10)
├── 16 janvier → Parent B (driver_id = 11)
└── 17 janvier → Parent C (driver_id = 12)
```

### Parent A crée une demande :
```
POST /api/parents/carpool/calendar/123/replace
{ "reason": "Urgence familiale" }

Résultat :
- Demande créée : id = 1, status = "pending"
- Calendar 123 : confirmation_status = "replacement_requested"
```

### Les membres voient la demande :
```
GET /api/parents/carpool/groups/5/replacement-requests

Réponse :
[
  {
    "id": 1,
    "date": "2025-01-15",
    "requested_by_name": "Parent A",
    "original_driver_name": "Parent A",
    "reason": "Urgence familiale",
    "status": "pending",
    "is_my_request": true,    // Pour Parent A
    "can_respond": false       // Pour Parent A (c'est sa demande)
  }
]
```

### Parent B accepte :
```
POST /api/parents/carpool/replacement-requests/1
{ "action": "accept" }

Résultat :
- Demande : status = "accepted", responded_by = 11 (Parent B)
- Calendar 123 : driver_id = 11, confirmation_status = "confirmed"
```

### Situation finale :
```
Planning mis à jour :
├── 15 janvier → Parent B (driver_id = 11) ✅
├── 16 janvier → Parent B (driver_id = 11)
└── 17 janvier → Parent C (driver_id = 12)
```

---

## 🔒 Règles de sécurité

1. **Seul le parent assigné** peut créer une demande pour son jour
2. **Seuls les membres du groupe** peuvent voir les demandes
3. **On ne peut pas répondre à sa propre demande**
4. **Une seule demande en attente** par jour (pour éviter les doublons)
5. **Quand on accepte, on devient automatiquement le conducteur**

---

## 💡 Cas d'usage

### Cas 1 : Remplacement accepté
- ✅ Parent A demande → Parent B accepte → Parent B conduit

### Cas 2 : Remplacement refusé
- ❌ Parent A demande → Parent B refuse → La demande reste `pending`
- ⚠️ Parent C peut toujours accepter (si la demande est encore `pending`)

### Cas 3 : Plusieurs demandes
- Parent A demande remplacement pour le 15 janvier
- Parent B demande remplacement pour le 16 janvier
- Chaque demande est indépendante
- N'importe quel membre peut accepter n'importe quelle demande (sauf la sienne)

---

## 📝 Résumé

| Action | Qui peut faire | Résultat |
|--------|---------------|----------|
| **Créer une demande** | Parent assigné au jour | Demande créée, statut `pending` |
| **Voir les demandes** | Tous les membres du groupe | Liste des demandes |
| **Accepter** | N'importe quel membre (sauf demandeur) | Devient conducteur, demande `accepted` |
| **Refuser** | N'importe quel membre (sauf demandeur) | Demande `declined`, reste visible |

---

## 🎯 En résumé simple

1. **Parent assigné** → "Je ne peux pas conduire ce jour" → Crée une demande
2. **Autres membres** → Voient la demande dans la liste
3. **Un membre accepte** → Devient le nouveau conducteur pour ce jour
4. **Le parent initial** → Est libéré de son obligation

C'est un système de **solidarité entre parents** : si quelqu'un ne peut pas conduire, un autre membre du groupe peut le remplacer volontairement.









