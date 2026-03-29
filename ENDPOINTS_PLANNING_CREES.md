# Endpoints de Planning Créés

## 📋 Résumé

Tous les endpoints manquants pour le système de planning ont été créés. Voici la liste complète :

---

## 🗄️ Modifications de la Base de Données

### Script SQL : `backend/sql/update_carpool_planning.sql`

**Modifications apportées :**

1. **Ajout du champ `confirmation_status` à `carpool_calendar`**
   - Valeurs possibles : `pending`, `confirmed`, `replacement_requested`
   - Par défaut : `pending`

2. **Création de la table `carpool_replacement_requests`**
   - Stocke les demandes de remplacement
   - Liée à `carpool_calendar` et `users`
   - Statuts : `pending`, `accepted`, `declined`

**⚠️ IMPORTANT :** Exécuter ce script SQL avant d'utiliser les nouveaux endpoints :
```bash
psql -d votre_base_de_donnees -f backend/sql/update_carpool_planning.sql
```

---

## 🆕 Nouveaux Endpoints

### 1. Créer un Planning avec Assignations Automatiques

**Endpoint :** `POST /api/parents/carpool/groups/:groupId/planning`

**Description :** Crée un planning pour un groupe avec des dates début/fin et génère automatiquement des assignations pour chaque jour en rotation entre les membres.

**Body :**
```json
{
  "start_date": "2025-12-10",
  "end_date": "2025-12-16",
  "start_point": "Place de la République" (optionnel),
  "end_point": "École Primaire" (optionnel),
  "departure_time": "08:00:00" (optionnel),
  "return_time": "16:30:00" (optionnel)
}
```

**Response :**
```json
{
  "success": true,
  "message": "Planning créé avec 7 assignations",
  "data": {
    "group_id": 1,
    "start_date": "2025-12-10",
    "end_date": "2025-12-16",
    "assignments": [...],
    "count": 7
  }
}
```

**Fichier :** `backend/app/api/parents/carpool/groups/[groupId]/planning/route.ts`

---

### 2. Récupérer le Planning d'un Groupe

**Endpoint :** `GET /api/parents/carpool/groups/:groupId/planning`

**Description :** Récupère le planning avec les assignations et leurs statuts de confirmation.

**Query Parameters :**
- `start_date` (optionnel) : Filtrer par date de début
- `end_date` (optionnel) : Filtrer par date de fin

**Response :**
```json
{
  "success": true,
  "data": {
    "group_id": 1,
    "assignments": [
      {
        "id": 1,
        "date": "2025-12-10",
        "driver_id": 14,
        "assigned_to_name": "Moussa Fall",
        "confirmation_status": "pending",
        "replacement_request": null,
        "is_my_turn": true
      }
    ],
    "count": 7
  }
}
```

**Fichier :** `backend/app/api/parents/carpool/groups/[groupId]/planning/route.ts`

---

### 3. Confirmer sa Disponibilité

**Endpoint :** `POST /api/parents/carpool/calendar/:calendarId/confirm`

**Description :** Confirme la disponibilité d'un parent pour un jour qui lui a été assigné.

**Response :**
```json
{
  "success": true,
  "message": "Disponibilité confirmée avec succès",
  "data": {
    "id": 1,
    "confirmation_status": "confirmed",
    ...
  }
}
```

**Fichier :** `backend/app/api/parents/carpool/calendar/[calendarId]/confirm/route.ts`

---

### 4. Demander un Remplacement

**Endpoint :** `POST /api/parents/carpool/calendar/:calendarId/replace`

**Description :** Demande un remplacement pour un jour assigné avec un motif.

**Body :**
```json
{
  "reason": "Je ne serai pas disponible ce jour-là"
}
```

**Response :**
```json
{
  "success": true,
  "message": "Demande de remplacement créée avec succès",
  "data": {
    "id": 1,
    "calendar_id": 5,
    "reason": "Je ne serai pas disponible ce jour-là",
    "status": "pending",
    ...
  }
}
```

**Fichier :** `backend/app/api/parents/carpool/calendar/[calendarId]/replace/route.ts`

---

### 5. Accepter ou Refuser un Remplacement

**Endpoint :** `POST /api/parents/carpool/replacement-requests/:requestId`

**Description :** Permet à un membre du groupe d'accepter ou de refuser une demande de remplacement.

**Body :**
```json
{
  "action": "accept" // ou "decline"
}
```

**Response (accept) :**
```json
{
  "success": true,
  "message": "Remplacement accepté, vous êtes maintenant assigné à ce jour",
  "data": {...}
}
```

**Fichier :** `backend/app/api/parents/carpool/replacement-requests/[requestId]/route.ts`

---

### 6. Lister les Demandes de Remplacement

**Endpoint :** `GET /api/parents/carpool/groups/:groupId/replacement-requests`

**Description :** Récupère toutes les demandes de remplacement pour un groupe.

**Query Parameters :**
- `status` (optionnel) : Filtrer par statut (`pending`, `accepted`, `declined`)

**Response :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "calendar_id": 5,
      "reason": "Je ne serai pas disponible",
      "status": "pending",
      "requested_by_name": "Moussa Fall",
      "can_respond": true,
      ...
    }
  ],
  "count": 1
}
```

**Fichier :** `backend/app/api/parents/carpool/groups/[groupId]/replacement-requests/route.ts`

---

### 7. Lister les Membres d'un Groupe

**Endpoint :** `GET /api/parents/carpool/groups/:groupId/members`

**Description :** Récupère la liste des membres d'un groupe avec leurs informations.

**Response :**
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": 1,
        "parent_id": 14,
        "name": "Moussa Fall",
        "email": "moussa@example.com",
        "phone": "+221771234567",
        "initials": "MF",
        "is_creator": true,
        "is_me": false,
        "joined_at": "2025-01-12T01:11:56.726Z"
      }
    ],
    "count": 3
  }
}
```

**Fichier :** `backend/app/api/parents/carpool/groups/[groupId]/members/route.ts`

---

## 📊 Structure des Fichiers Créés

```
backend/
├── sql/
│   └── update_carpool_planning.sql          # Script de migration
└── app/api/parents/carpool/
    ├── groups/
    │   └── [groupId]/
    │       ├── planning/
    │       │   └── route.ts                  # POST/GET planning
    │       ├── replacement-requests/
    │       │   └── route.ts                  # GET demandes remplacement
    │       └── members/
    │           └── route.ts                  # GET membres
    ├── calendar/
    │   └── [calendarId]/
    │       ├── confirm/
    │       │   └── route.ts                  # POST confirmer
    │       └── replace/
    │           └── route.ts                  # POST demander remplacement
    └── replacement-requests/
        └── [requestId]/
            └── route.ts                      # POST accepter/refuser
```

---

## ✅ Checklist d'Implémentation

- [x] Script SQL pour modifications BDD
- [x] Endpoint POST planning (création automatique)
- [x] Endpoint GET planning (récupération avec statuts)
- [x] Endpoint POST confirm (confirmation disponibilité)
- [x] Endpoint POST replace (demande remplacement)
- [x] Endpoint POST replacement-requests (accepter/refuser)
- [x] Endpoint GET replacement-requests (lister)
- [x] Endpoint GET members (lister membres)

---

## 🚀 Prochaines Étapes

1. **Exécuter le script SQL** pour mettre à jour la base de données
2. **Tester les endpoints** avec Postman ou un client HTTP
3. **Intégrer dans le frontend** Angular pour utiliser ces nouveaux endpoints

---

## 📝 Notes Importantes

- Tous les endpoints nécessitent une authentification (bearer token)
- Seuls les parents peuvent utiliser ces endpoints
- L'utilisateur doit être membre du groupe pour accéder aux endpoints
- Les assignations sont créées en rotation automatique entre les membres
- Une seule demande de remplacement en attente par entrée de calendrier











