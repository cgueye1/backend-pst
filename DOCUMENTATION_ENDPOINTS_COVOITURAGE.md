# 📚 Documentation Complète des Endpoints de Covoiturage

## 📋 Vue d'ensemble

Le système de covoiturage permet aux parents de créer des groupes, gérer un planning, échanger des jours de conduite, et gérer les remplacements.

---

## 🏗️ Architecture des Endpoints

### 1. **Gestion des Groupes** (`/api/parents/carpool/groups`)

#### `GET /api/parents/carpool/groups`
**Rôle :** Lister tous les groupes de covoiturage de l'utilisateur

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "École ABC",
      "description": "Groupe pour l'école ABC",
      "school_id": 5,
      "creator_id": 10,
      "status": "active",
      "member_count": 4,
      "is_member": true,
      "my_status": "accepted"
    }
  ]
}
```

#### `POST /api/parents/carpool/groups`
**Rôle :** Créer un nouveau groupe de covoiturage

**Body :**
```json
{
  "name": "École ABC",
  "description": "Groupe pour l'école ABC",
  "school_id": 5
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "École ABC",
    "creator_id": 10,
    "status": "active"
  }
}
```

---

### 2. **Membres d'un Groupe** (`/api/parents/carpool/groups/{groupId}/members`)

#### `GET /api/parents/carpool/groups/{groupId}/members`
**Rôle :** Lister tous les membres d'un groupe

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": 14,
      "name": "Moussa Fall",
      "email": "moussa@example.com",
      "phone": "+221771234567",
      "status": "accepted",
      "is_creator": true
    }
  ]
}
```

---

### 3. **Planning** (`/api/parents/carpool/groups/{groupId}/planning`)

#### `POST /api/parents/carpool/groups/{groupId}/planning`
**Rôle :** Créer un planning avec assignations automatiques

**Body :**
```json
{
  "start_date": "2025-12-10",
  "end_date": "2025-12-16",
  "start_point": "Dakar",
  "end_point": "Thies",
  "departure_time": "08:00:00",
  "return_time": "16:30:00"
}
```

**Fonctionnement :**
- Génère automatiquement des entrées dans `carpool_calendar` pour chaque jour entre `start_date` et `end_date`
- Répartit les jours de conduite entre tous les membres acceptés du groupe (rotation)
- Chaque membre est assigné à tour de rôle

**Réponse :**
```json
{
  "success": true,
  "message": "Planning créé avec 7 assignations",
  "data": {
    "group_id": 1,
    "start_date": "2025-12-10",
    "end_date": "2025-12-16",
    "assignments": [
      {
        "id": 1,
        "date": "2025-12-10",
        "driver_id": 10,
        "assigned_to_name": "Parent A",
        "confirmation_status": "pending"
      }
    ],
    "count": 7
  }
}
```

#### `GET /api/parents/carpool/groups/{groupId}/planning`
**Rôle :** Récupérer le planning d'un groupe

**Query params (optionnels) :**
- `start_date` : Filtrer par date de début
- `end_date` : Filtrer par date de fin

**Réponse :**
```json
{
  "success": true,
  "data": {
    "group_id": 1,
    "assignments": [
      {
        "id": 1,
        "date": "2025-12-10",
        "driver_id": 10,
        "assigned_to_name": "Parent A",
        "confirmation_status": "pending",
        "is_my_turn": true,
        "replacement_request": null
      }
    ],
    "count": 7
  }
}
```

---

### 4. **Calendrier** (`/api/parents/carpool/calendar`)

#### `GET /api/parents/carpool/calendar`
**Rôle :** Récupérer les entrées du calendrier

**Query params :**
- `group_id` (requis) : ID du groupe
- `start_date` (optionnel) : Date de début
- `end_date` (optionnel) : Date de fin

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "group_id": 1,
      "date": "2025-12-10",
      "driver_id": 10,
      "start_point": "Dakar",
      "end_point": "Thies",
      "departure_time": "08:00:00",
      "return_time": "16:30:00",
      "confirmation_status": "pending"
    }
  ]
}
```

#### `POST /api/parents/carpool/calendar`
**Rôle :** Ajouter manuellement un trajet au calendrier

**Body :**
```json
{
  "group_id": 1,
  "date": "2025-12-10",
  "driver_id": 10,
  "start_point": "Dakar",
  "end_point": "Thies",
  "departure_time": "08:00:00",
  "return_time": "16:30:00"
}
```

---

### 5. **Confirmation** (`/api/parents/carpool/calendar/{calendarId}/confirm`)

#### `POST /api/parents/carpool/calendar/{calendarId}/confirm`
**Rôle :** Confirmer sa disponibilité pour un jour assigné

**Body :** Aucun (vide)

**Fonctionnement :**
- Le parent assigné confirme qu'il peut conduire ce jour
- Met à jour `confirmation_status` à `'confirmed'`

**Réponse :**
```json
{
  "success": true,
  "message": "Disponibilité confirmée",
  "data": {
    "id": 1,
    "confirmation_status": "confirmed"
  }
}
```

---

### 6. **Demande de Remplacement** (`/api/parents/carpool/calendar/{calendarId}/replace`)

#### `POST /api/parents/carpool/calendar/{calendarId}/replace`
**Rôle :** Demander un remplacement pour un jour assigné

**Body :**
```json
{
  "reason": "Urgence familiale, je ne peux pas conduire"
}
```

**Fonctionnement :**
- Le parent assigné demande à être remplacé
- Crée une demande dans `carpool_replacement_requests` avec statut `'pending'`
- Met à jour `confirmation_status` à `'replacement_requested'`

**Réponse :**
```json
{
  "success": true,
  "message": "Demande de remplacement créée avec succès",
  "data": {
    "id": 1,
    "calendar_id": 123,
    "requested_by": 10,
    "reason": "Urgence familiale",
    "status": "pending",
    "date": "2025-12-10"
  }
}
```

---

### 7. **Liste des Demandes de Remplacement** (`/api/parents/carpool/groups/{groupId}/replacement-requests`)

#### `GET /api/parents/carpool/groups/{groupId}/replacement-requests`
**Rôle :** Lister toutes les demandes de remplacement d'un groupe

**Query params (optionnel) :**
- `status` : Filtrer par statut (`pending`, `accepted`, `declined`)

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "calendar_id": 123,
      "date": "2025-12-10",
      "requested_by": 10,
      "requested_by_name": "Parent A",
      "original_driver_id": 10,
      "original_driver_name": "Parent A",
      "reason": "Urgence familiale",
      "status": "pending",
      "is_my_request": false,
      "can_respond": true
    }
  ],
  "count": 1
}
```

---

### 8. **Accepter/Refuser une Demande** (`/api/parents/carpool/replacement-requests/{requestId}`)

#### `POST /api/parents/carpool/replacement-requests/{requestId}`
**Rôle :** Accepter ou refuser une demande de remplacement

**Body :**
```json
{
  "action": "accept"  // ou "decline"
}
```

**Fonctionnement :**
- Si `"accept"` :
  - La demande passe au statut `'accepted'`
  - Le calendrier est mis à jour : le membre qui accepte devient le nouveau `driver_id`
  - Le statut de confirmation passe à `'confirmed'`
- Si `"decline"` :
  - La demande passe au statut `'declined'`
  - Le calendrier reste avec `replacement_requested`
  - Un autre membre peut toujours accepter

**Réponse (accept) :**
```json
{
  "success": true,
  "message": "Remplacement accepté, vous êtes maintenant assigné à ce jour",
  "data": {
    "id": 1,
    "status": "accepted",
    "responded_by": 11,
    "responded_by_name": "Parent B"
  }
}
```

---

### 9. **Invitations** (`/api/parents/carpool/invitations`)

#### `GET /api/parents/carpool/invitations`
**Rôle :** Lister les invitations de covoiturage

**Query params (optionnels) :**
- `status` : Filtrer par statut (`pending`, `accepted`, `declined`)

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "group_id": 1,
      "group_name": "École ABC",
      "invited_by": 10,
      "invited_by_name": "Parent A",
      "status": "pending",
      "invited_at": "2025-01-10T10:00:00Z"
    }
  ]
}
```

#### `POST /api/parents/carpool/invitations`
**Rôle :** Envoyer une invitation à un parent

**Body :**
```json
{
  "group_id": 1,
  "parent_id": 14,
  "message": "Rejoignez notre groupe de covoiturage !"
}
```

#### `PUT /api/parents/carpool/invitations`
**Rôle :** Accepter ou refuser une invitation

**Body :**
```json
{
  "invitation_id": 1,
  "action": "accept"  // ou "decline"
}
```

---

### 10. **Échanges de Conduite** (`/api/parents/carpool/conduite`)

#### `GET /api/parents/carpool/conduite`
**Rôle :** Récupérer les propositions d'échange

**Query params :**
- `group_id` (requis) : ID du groupe
- `type` (optionnel) : `sent`, `received`, `all`

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "exchange_type": "swap",
      "original_date": "2025-12-10",
      "proposed_date": "2025-12-15",
      "requester_id": 10,
      "target_driver_id": 11,
      "status": "pending"
    }
  ]
}
```

#### `POST /api/parents/carpool/conduite`
**Rôle :** Proposer un échange de conduite

**Body :**
```json
{
  "group_id": 1,
  "calendar_id": 123,
  "target_driver_id": 11,
  "original_date": "2025-12-10",
  "proposed_date": "2025-12-15",
  "exchange_type": "swap",  // "swap", "give", "request"
  "message": "Échangeons nos jours ?"
}
```

**Types d'échange :**
- `swap` : Échanger deux jours
- `give` : Donner son jour à quelqu'un
- `request` : Demander un jour à quelqu'un

#### `PUT /api/parents/carpool/conduite`
**Rôle :** Répondre à une proposition d'échange

**Body :**
```json
{
  "exchange_id": 1,
  "action": "accept"  // "accept", "decline", "cancel"
}
```

---

## 🔄 Flux Complet d'Utilisation

### Scénario 1 : Créer un groupe et un planning

```
1. POST /api/parents/carpool/groups
   → Créer un groupe "École ABC"

2. POST /api/parents/carpool/invitations
   → Inviter des parents à rejoindre le groupe

3. PUT /api/parents/carpool/invitations
   → Les parents acceptent les invitations

4. POST /api/parents/carpool/groups/{groupId}/planning
   → Créer un planning pour la semaine (10-16 décembre)
   → Le système assigne automatiquement les jours aux membres

5. GET /api/parents/carpool/groups/{groupId}/planning
   → Voir le planning créé
```

### Scénario 2 : Gérer les confirmations et remplacements

```
1. GET /api/parents/carpool/groups/{groupId}/planning
   → Parent A voit qu'il est assigné le 15 décembre

2. POST /api/parents/carpool/calendar/{calendarId}/confirm
   → Parent A confirme qu'il peut conduire

OU

2. POST /api/parents/carpool/calendar/{calendarId}/replace
   → Parent A demande un remplacement (raison: "Urgence")

3. GET /api/parents/carpool/groups/{groupId}/replacement-requests
   → Tous les membres voient la demande

4. POST /api/parents/carpool/replacement-requests/{requestId}
   → Parent B accepte de remplacer Parent A
   → Parent B devient automatiquement le conducteur pour le 15 décembre
```

### Scénario 3 : Échanger des jours

```
1. POST /api/parents/carpool/conduite
   → Parent A propose d'échanger son jour (10 déc) avec Parent B (15 déc)
   → Type: "swap"

2. GET /api/parents/carpool/conduite?group_id=1&type=received
   → Parent B voit la proposition

3. PUT /api/parents/carpool/conduite
   → Parent B accepte l'échange
   → Les jours sont automatiquement échangés dans le calendrier
```

---

## 📊 Statuts et États

### Statuts de confirmation (`confirmation_status`)
- `pending` : En attente de confirmation
- `confirmed` : Confirmé par le parent assigné
- `replacement_requested` : Demande de remplacement en cours

### Statuts de demande de remplacement (`status`)
- `pending` : En attente d'acceptation
- `accepted` : Acceptée par un membre
- `declined` : Refusée par un membre

### Statuts d'invitation (`status`)
- `pending` : En attente de réponse
- `accepted` : Acceptée
- `declined` : Refusée

### Statuts d'échange (`status`)
- `pending` : En attente de réponse
- `accepted` : Accepté
- `declined` : Refusé
- `cancelled` : Annulé

---

## 🔒 Règles de Sécurité

1. **Seuls les parents** peuvent accéder aux endpoints
2. **Seuls les membres du groupe** peuvent voir/modifier le planning
3. **Seul le parent assigné** peut confirmer ou demander un remplacement
4. **N'importe quel membre** (sauf le demandeur) peut accepter un remplacement
5. **Seuls les membres acceptés** (`status = 'accepted'`) sont pris en compte

---

## 📝 Résumé des Endpoints

| Endpoint | Méthode | Rôle |
|----------|---------|------|
| `/groups` | GET | Lister les groupes |
| `/groups` | POST | Créer un groupe |
| `/groups/{id}/members` | GET | Lister les membres |
| `/groups/{id}/planning` | POST | Créer un planning |
| `/groups/{id}/planning` | GET | Récupérer le planning |
| `/groups/{id}/replacement-requests` | GET | Lister les demandes de remplacement |
| `/calendar` | GET | Récupérer le calendrier |
| `/calendar` | POST | Ajouter un trajet |
| `/calendar/{id}/confirm` | POST | Confirmer sa disponibilité |
| `/calendar/{id}/replace` | POST | Demander un remplacement |
| `/replacement-requests/{id}` | POST | Accepter/refuser un remplacement |
| `/invitations` | GET | Lister les invitations |
| `/invitations` | POST | Envoyer une invitation |
| `/invitations` | PUT | Accepter/refuser une invitation |
| `/conduite` | GET | Lister les échanges |
| `/conduite` | POST | Proposer un échange |
| `/conduite` | PUT | Répondre à un échange |

---

## 🎯 Points Clés

1. **Planning automatique** : Le système répartit automatiquement les jours entre les membres
2. **Remplacements solidaires** : Si un parent ne peut pas conduire, un autre peut le remplacer
3. **Échanges flexibles** : Les parents peuvent échanger leurs jours entre eux
4. **Gestion par groupe** : Chaque groupe a son propre planning indépendant
5. **Statuts clairs** : Chaque action a un statut pour suivre l'état des demandes









