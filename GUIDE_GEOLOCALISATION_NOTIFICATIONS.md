# 📍 Guide : Géolocalisation Automatique et Notifications en Temps Réel

## 🎯 Vue d'ensemble

Ce guide explique comment utiliser le système de **géolocalisation automatique** et les **notifications en temps réel** pour les trajets.

---

## 🗄️ Base de données

### Migration requise

Avant d'utiliser le système, exécutez la migration pour créer la table `trip_locations` :

```bash
psql -U votre_user -d votre_database -f sql/migration_create_trip_locations.sql
```

Ou via votre client PostgreSQL préféré.

### Structure de la table `trip_locations`

```sql
CREATE TABLE trip_locations (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id),
    driver_id INTEGER NOT NULL REFERENCES drivers(id),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    direction VARCHAR(20) DEFAULT 'aller',
    speed DECIMAL(5, 2),
    accuracy DECIMAL(5, 2),
    heading DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚗 Pour le Chauffeur

### 1. Envoyer la position GPS

**Endpoint :** `POST /api/drivers/trips/{id}/location`

**Authentification :** Bearer token (chauffeur)

**Body :**
```json
{
  "latitude": 14.7167,
  "longitude": -17.4677,
  "direction": "aller",  // optionnel, détecté automatiquement
  "speed": 45.5,         // optionnel, en km/h
  "accuracy": 10.0,      // optionnel, précision en mètres
  "heading": 180.0       // optionnel, direction en degrés (0-360)
}
```

**Exemple avec cURL :**
```bash
curl -X POST "http://localhost:3000/api/drivers/trips/72/location" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 14.7167,
    "longitude": -17.4677,
    "speed": 45.5
  }'
```

**Réponse :**
```json
{
  "success": true,
  "message": "Position GPS enregistrée avec succès",
  "data": {
    "location_id": 123,
    "trip_id": 72,
    "latitude": 14.7167,
    "longitude": -17.4677,
    "direction": "aller",
    "timestamp": "2026-02-13T08:15:00Z"
  }
}
```

### 2. Envoi automatique de position (côté mobile)

Pour un envoi automatique toutes les 30 secondes pendant un trajet actif :

```javascript
// Exemple JavaScript (React Native / Expo)
let locationInterval;

async function startLocationTracking(tripId, token) {
  // Démarrer le tracking GPS
  const locationSubscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 30000, // 30 secondes
      distanceInterval: 50, // 50 mètres
    },
    async (location) => {
      // Envoyer la position au serveur
      try {
        await fetch(`http://votre-api/api/drivers/trips/${tripId}/location`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            speed: location.coords.speed ? location.coords.speed * 3.6 : null, // m/s -> km/h
            accuracy: location.coords.accuracy,
            heading: location.coords.heading,
          }),
        });
      } catch (error) {
        console.error('Erreur envoi position:', error);
      }
    }
  );

  return locationSubscription;
}

// Arrêter le tracking
function stopLocationTracking(subscription) {
  subscription.remove();
}
```

---

## 👨‍👩‍👧 Pour le Parent

### 1. Suivre un trajet en temps réel

**Endpoint :** `GET /api/parents/trips/{tripId}/realtime`

**Authentification :** Bearer token (parent)

**Réponse :**
```json
{
  "success": true,
  "data": {
    "trip_id": 72,
    "trip_type": "aller_retour",
    "active_direction": "aller",
    "current_location": {
      "latitude": 14.7167,
      "longitude": -17.4677,
      "direction": "aller",
      "speed": 45.5,
      "accuracy": 10.0,
      "heading": 180.0,
      "timestamp": "2026-02-13T08:15:00Z"
    },
    "tracking": {
      "is_active": true,
      "active_direction": "aller",
      "minutes_since_start": 15,
      "estimated_arrival": "2026-02-13T08:30:00Z",
      "progress_percentage": 50
    }
  }
}
```

### 2. Polling automatique (côté mobile)

Pour mettre à jour la position toutes les 5 secondes :

```javascript
// Exemple JavaScript (React Native)
let pollingInterval;

function startRealtimeTracking(tripId, token, onLocationUpdate) {
  pollingInterval = setInterval(async () => {
    try {
      const response = await fetch(
        `http://votre-api/api/parents/trips/${tripId}/realtime`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success && data.data.current_location) {
        onLocationUpdate(data.data.current_location);
      }
    } catch (error) {
      console.error('Erreur récupération position:', error);
    }
  }, 5000); // Toutes les 5 secondes
}

// Arrêter le polling
function stopRealtimeTracking() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
}
```

---

## 🔔 Notifications Automatiques

### Types de notifications

Le système envoie automatiquement des notifications aux parents pour :

1. **Trajet démarré** (`trip_started`)
   - Quand le chauffeur démarre l'aller ou le retour
   - Message personnalisé avec le nom des enfants

2. **Trajet terminé** (`trip_completed`)
   - Quand le chauffeur termine l'aller ou le retour
   - Confirmation d'arrivée en toute sécurité

3. **Trajet annulé** (`trip_canceled`)
   - Quand le chauffeur annule un trajet
   - Information sur l'annulation

### Récupérer les notifications

**Endpoint :** `GET /api/notifications/user`

**Authentification :** Bearer token

**Réponse :**
```json
{
  "success": true,
  "notifications": [
    {
      "id": 123,
      "libelle": "Trajet aller démarré",
      "type": "trip_started",
      "description": "Le trajet aller pour Amadou a commencé vers DKR",
      "lu": false,
      "date_creation": "2026-02-13T08:00:00Z"
    }
  ]
}
```

---

## 🔄 Flux Complet

### 1. Démarrage du trajet (matin - aller)

```
1. Chauffeur démarre le trajet → PUT /api/drivers/trips/72/start
2. Système détecte automatiquement que c'est l'aller
3. Notification envoyée à tous les parents : "Trajet aller démarré"
4. Chauffeur envoie sa position toutes les 30 secondes → POST /api/drivers/trips/72/location
5. Parents suivent en temps réel → GET /api/parents/trips/72/realtime
```

### 2. Fin de l'aller

```
1. Chauffeur termine l'aller → PUT /api/drivers/trips/72/completed
2. Notification envoyée : "Trajet aller terminé"
3. Le système attend le retour
```

### 3. Démarrage du retour (soir)

```
1. Chauffeur démarre le retour → PUT /api/drivers/trips/72/start?direction=retour
   (ou automatiquement détecté)
2. Notification envoyée : "Trajet retour démarré"
3. Chauffeur envoie sa position (direction: "retour")
4. Parents suivent le retour en temps réel
```

### 4. Fin du retour

```
1. Chauffeur termine le retour → PUT /api/drivers/trips/72/completed?direction=retour
2. Notification envoyée : "Trajet retour terminé"
3. Le trajet est complètement terminé
```

---

## 📱 Intégration Mobile

### React Native / Expo

```javascript
import * as Location from 'expo-location';

// Demander les permissions
const { status } = await Location.requestForegroundPermissionsAsync();
if (status !== 'granted') {
  alert('Permission de localisation refusée');
  return;
}

// Démarrer le tracking
const subscription = await Location.watchPositionAsync(
  {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 30000,
    distanceInterval: 50,
  },
  async (location) => {
    // Envoyer au serveur
    await sendLocationToServer(tripId, location);
  }
);
```

### Flutter

```dart
import 'package:geolocator/geolocator.dart';

StreamSubscription<Position>? positionStream;

void startLocationTracking(int tripId) {
  positionStream = Geolocator.getPositionStream(
    locationSettings: LocationSettings(
      accuracy: LocationAccuracy.balanced,
      distanceFilter: 50, // mètres
      timeLimit: Duration(seconds: 30),
    ),
  ).listen((Position position) {
    // Envoyer au serveur
    sendLocationToServer(tripId, position);
  });
}
```

---

## ⚠️ Points Importants

1. **Permissions GPS** : Assurez-vous que l'application mobile a les permissions GPS
2. **Batterie** : Le tracking GPS consomme de la batterie, optimisez l'intervalle
3. **Précision** : Utilisez `LocationAccuracy.Balanced` pour un bon compromis
4. **Réseau** : Gérer les cas où le réseau est indisponible (queue locale)
5. **Sécurité** : Valider que le chauffeur est bien le propriétaire du trajet

---

## 🐛 Dépannage

### La position n'apparaît pas

1. Vérifier que le trajet est bien `in_progress`
2. Vérifier que la direction correspond (aller/retour)
3. Vérifier les logs serveur pour les erreurs
4. Vérifier que la migration a été exécutée

### Les notifications ne sont pas reçues

1. Vérifier que les parents sont bien associés au trajet
2. Vérifier les logs serveur
3. Vérifier que la table `notifications` existe
4. Vérifier les permissions de l'utilisateur

---

## 📊 Statistiques

Pour récupérer l'historique des positions d'un trajet :

```sql
SELECT 
    latitude,
    longitude,
    direction,
    speed,
    created_at
FROM trip_locations
WHERE trip_id = 72
ORDER BY created_at ASC;
```

---

## ✅ Checklist d'implémentation

- [ ] Exécuter la migration `migration_create_trip_locations.sql`
- [ ] Tester l'endpoint `/api/drivers/trips/{id}/location`
- [ ] Tester l'endpoint `/api/parents/trips/{tripId}/realtime`
- [ ] Vérifier que les notifications sont créées
- [ ] Implémenter le tracking GPS côté mobile
- [ ] Implémenter le polling côté parent
- [ ] Tester le flux complet (démarrage → position → fin)

---

**🎉 Votre système de géolocalisation et notifications est maintenant opérationnel !**

