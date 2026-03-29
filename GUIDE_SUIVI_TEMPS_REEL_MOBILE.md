# 📍 Guide Complet : Suivi en Temps Réel du Chauffeur sur Carte Mobile

## 🎯 Vue d'ensemble

Ce guide explique comment implémenter le suivi en temps réel de la position du chauffeur sur une carte Google Maps dans l'application mobile (Angular/Ionic).

---

## 📋 Architecture

### 1. **Côté Chauffeur (Mobile)**
- Envoie sa position GPS automatiquement toutes les 30 secondes
- Utilise l'API de géolocalisation du navigateur/appareil
- Envoie les données via `POST /api/drivers/trips/{id}/location`

### 2. **Côté Parent (Mobile)**
- Récupère la position en temps réel via `GET /api/parents/trips/{tripId}/realtime`
- Affiche la position sur une carte Google Maps
- Met à jour la position toutes les 5 secondes (polling)
- Dessine le trajet parcouru avec une ligne

---

## 🚗 Partie 1 : Chauffeur - Envoi de Position GPS

### Service Angular pour le Chauffeur

Créez un service `driver-location.service.ts` :

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, interval, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LocationData {
  latitude: number;
  longitude: number;
  speed?: number;
  accuracy?: number;
  heading?: number;
  direction?: 'aller' | 'retour';
}

@Injectable({
  providedIn: 'root'
})
export class DriverLocationService {
  private apiUrl = environment.apiUrl;
  private locationSubscription?: Subscription;
  private watchId?: number;

  constructor(private http: HttpClient) {}

  /**
   * Démarrer le suivi GPS et l'envoi automatique
   */
  startLocationTracking(tripId: number, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Vérifier si la géolocalisation est disponible
      if (!navigator.geolocation) {
        reject(new Error('Géolocalisation non supportée'));
        return;
      }

      // Demander les permissions
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Permissions accordées, démarrer le tracking
          this.watchId = navigator.geolocation.watchPosition(
            async (location) => {
              await this.sendLocationToServer(tripId, location, token);
            },
            (error) => {
              console.error('Erreur GPS:', error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 30000 // Utiliser une position de moins de 30 secondes
            }
          );

          // Envoyer la première position immédiatement
          await this.sendLocationToServer(tripId, position, token);
          resolve();
        },
        (error) => {
          reject(new Error('Permission de géolocalisation refusée'));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000
        }
      );
    });
  }

  /**
   * Envoyer la position au serveur
   */
  private async sendLocationToServer(
    tripId: number,
    position: GeolocationPosition,
    token: string
  ): Promise<void> {
    const locationData: LocationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed: position.coords.speed ? position.coords.speed * 3.6 : undefined, // m/s -> km/h
      accuracy: position.coords.accuracy,
      heading: position.coords.heading || undefined
    };

    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      await this.http.post(
        `${this.apiUrl}/drivers/trips/${tripId}/location`,
        locationData,
        { headers }
      ).toPromise();

      console.log('Position envoyée:', locationData);
    } catch (error) {
      console.error('Erreur envoi position:', error);
      // Optionnel : stocker en local pour envoi ultérieur
    }
  }

  /**
   * Arrêter le suivi GPS
   */
  stopLocationTracking(): void {
    if (this.watchId !== undefined) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = undefined;
    }
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
      this.locationSubscription = undefined;
    }
  }

  /**
   * Obtenir la position actuelle (une seule fois)
   */
  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000
        }
      );
    });
  }
}
```

### Utilisation dans le Composant Chauffeur

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DriverLocationService } from '../../services/driver-location.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-driver-trip-tracking',
  templateUrl: './driver-trip-tracking.component.html'
})
export class DriverTripTrackingComponent implements OnInit, OnDestroy {
  tripId!: number;
  isTracking = false;

  constructor(
    private route: ActivatedRoute,
    private locationService: DriverLocationService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.tripId = Number(this.route.snapshot.paramMap.get('id'));
  }

  async startTracking() {
    try {
      const token = this.authService.getToken();
      await this.locationService.startLocationTracking(this.tripId, token);
      this.isTracking = true;
      console.log('Suivi GPS démarré');
    } catch (error) {
      console.error('Erreur démarrage suivi:', error);
      alert('Impossible de démarrer le suivi GPS');
    }
  }

  stopTracking() {
    this.locationService.stopLocationTracking();
    this.isTracking = false;
    console.log('Suivi GPS arrêté');
  }

  ngOnDestroy() {
    this.stopTracking();
  }
}
```

---

## 👨‍👩‍👧 Partie 2 : Parent - Affichage sur Carte en Temps Réel

### Service Angular pour le Parent

Créez un service `realtime-tracking.service.ts` :

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, interval, BehaviorSubject } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface RealtimeTripData {
  trip_id: number;
  trip_type: string;
  active_direction: 'aller' | 'retour' | null;
  current_location: {
    latitude: number;
    longitude: number;
    direction: string;
    speed?: number;
    accuracy?: number;
    heading?: number;
    timestamp: string;
  } | null;
  tracking: {
    is_active: boolean;
    active_direction: string;
    minutes_since_start: number | null;
    estimated_arrival: string | null;
    progress_percentage: number;
  };
  current_leg: {
    direction: string;
    start_point: string;
    end_point: string;
    start_coordinates: { latitude: number; longitude: number };
    end_coordinates: { latitude: number; longitude: number };
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class RealtimeTrackingService {
  private apiUrl = environment.apiUrl;
  private trackingSubject = new BehaviorSubject<RealtimeTripData | null>(null);
  public tracking$ = this.trackingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Récupérer les données de suivi en temps réel
   */
  getRealtimeData(tripId: number, token: string): Observable<RealtimeTripData> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<{ success: boolean; data: RealtimeTripData }>(
      `${this.apiUrl}/parents/trips/${tripId}/realtime`,
      { headers }
    ).pipe(
      switchMap(response => {
        if (response.success) {
          this.trackingSubject.next(response.data);
          return [response.data];
        }
        throw new Error('Erreur récupération données');
      }),
      catchError(error => {
        console.error('Erreur récupération suivi:', error);
        throw error;
      })
    );
  }

  /**
   * Démarrer le polling automatique (toutes les 5 secondes)
   */
  startPolling(tripId: number, token: string): Observable<RealtimeTripData> {
    return interval(5000).pipe(
      switchMap(() => this.getRealtimeData(tripId, token)),
      catchError(error => {
        console.error('Erreur polling:', error);
        return [];
      })
    );
  }
}
```

### Composant Parent avec Carte Google Maps

```typescript
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RealtimeTrackingService, RealtimeTripData } from '../../services/realtime-tracking.service';
import { AuthService } from '../../services/auth.service';
import { GOOGLE_MAPS_CONFIG } from '../../core/config/api.config';

/// <reference types="google.maps" />

@Component({
  selector: 'app-parent-realtime-tracking',
  templateUrl: './parent-realtime-tracking.component.html',
  styleUrls: ['./parent-realtime-tracking.component.css']
})
export class ParentRealtimeTrackingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  tripId!: number;
  tripData: RealtimeTripData | null = null;
  map: google.maps.Map | null = null;
  driverMarker: google.maps.Marker | null = null;
  routePolyline: google.maps.Polyline | null = null;
  pathCoordinates: google.maps.LatLng[] = [];
  private pollingSubscription?: Subscription;
  private directionsService?: google.maps.DirectionsService;
  private directionsRenderer?: google.maps.DirectionsRenderer;

  constructor(
    private route: ActivatedRoute,
    private trackingService: RealtimeTrackingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.tripId = Number(this.route.snapshot.paramMap.get('id'));
    this.startPolling();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeMap();
    }, 500);
  }

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
    if (this.driverMarker) {
      this.driverMarker.setMap(null);
    }
    if (this.routePolyline) {
      this.routePolyline.setMap(null);
    }
  }

  /**
   * Initialiser la carte Google Maps
   */
  initializeMap() {
    if (!this.mapContainer || !this.mapContainer.nativeElement) {
      console.error('Conteneur de carte introuvable');
      return;
    }

    if (typeof google === 'undefined' || !google.maps) {
      console.error('Google Maps API non chargée');
      return;
    }

    // Initialiser la carte
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: GOOGLE_MAPS_CONFIG.defaultCenter,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true
    });

    // Initialiser les services de directions
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: true, // On utilise nos propres marqueurs
      polylineOptions: {
        strokeColor: '#2563EB',
        strokeWeight: 4,
        strokeOpacity: 0.6
      }
    });

    // Si on a déjà des données, les afficher
    if (this.tripData) {
      this.updateMap();
    }
  }

  /**
   * Démarrer le polling automatique
   */
  startPolling() {
    const token = this.authService.getToken();
    
    this.pollingSubscription = this.trackingService.startPolling(
      this.tripId,
      token
    ).subscribe(
      (data) => {
        this.tripData = data;
        this.updateMap();
      },
      (error) => {
        console.error('Erreur polling:', error);
      }
    );
  }

  /**
   * Mettre à jour la carte avec les nouvelles données
   */
  updateMap() {
    if (!this.map || !this.tripData) return;

    const location = this.tripData.current_location;
    if (!location) {
      console.warn('Aucune position disponible');
      return;
    }

    const position = new google.maps.LatLng(
      location.latitude,
      location.longitude
    );

    // Mettre à jour ou créer le marqueur du chauffeur
    if (!this.driverMarker) {
      // Créer un marqueur personnalisé avec icône de voiture
      this.driverMarker = new google.maps.Marker({
        position: position,
        map: this.map,
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          strokeColor: '#FF0000',
          strokeWeight: 3,
          fillColor: '#FF0000',
          fillOpacity: 1,
          rotation: location.heading || 0
        },
        title: 'Position du chauffeur',
        animation: google.maps.Animation.DROP
      });
    } else {
      // Animer le déplacement du marqueur
      this.animateMarker(this.driverMarker, position, location.heading || 0);
    }

    // Ajouter la position au tracé du trajet
    this.pathCoordinates.push(position);

    // Dessiner la ligne du trajet parcouru
    if (this.pathCoordinates.length > 1) {
      if (!this.routePolyline) {
        this.routePolyline = new google.maps.Polyline({
          path: this.pathCoordinates,
          geodesic: true,
          strokeColor: '#00FF00',
          strokeOpacity: 1.0,
          strokeWeight: 4,
          map: this.map
        });
      } else {
        this.routePolyline.setPath(this.pathCoordinates);
      }
    }

    // Centrer la carte sur la position actuelle
    this.map.setCenter(position);
    this.map.setZoom(15);

    // Afficher l'itinéraire si on a les points de départ et d'arrivée
    if (this.tripData.current_leg) {
      this.drawRoute(
        this.tripData.current_leg.start_coordinates,
        this.tripData.current_leg.end_coordinates
      );
    }
  }

  /**
   * Animer le déplacement du marqueur
   */
  private animateMarker(
    marker: google.maps.Marker,
    newPosition: google.maps.LatLng,
    heading: number
  ) {
    const startPosition = marker.getPosition() as google.maps.LatLng;
    if (!startPosition) return;

    const startLat = startPosition.lat();
    const startLng = startPosition.lng();
    const endLat = newPosition.lat();
    const endLng = newPosition.lng();

    let step = 0;
    const steps = 20; // Nombre d'étapes pour l'animation
    const duration = 1000; // Durée en ms

    const animate = () => {
      step++;
      const progress = step / steps;

      const lat = startLat + (endLat - startLat) * progress;
      const lng = startLng + (endLng - startLng) * progress;

      marker.setPosition(new google.maps.LatLng(lat, lng));
      
      // Mettre à jour la rotation si disponible
      if (heading !== undefined) {
        const icon = marker.getIcon() as google.maps.Symbol;
        if (icon && typeof icon === 'object') {
          marker.setIcon({
            ...icon,
            rotation: heading
          });
        }
      }

      if (step < steps) {
        setTimeout(animate, duration / steps);
      }
    };

    animate();
  }

  /**
   * Dessiner l'itinéraire complet
   */
  private drawRoute(
    startCoords: { latitude: number; longitude: number },
    endCoords: { latitude: number; longitude: number }
  ) {
    if (!this.directionsService || !this.directionsRenderer) return;

    const request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(startCoords.latitude, startCoords.longitude),
      destination: new google.maps.LatLng(endCoords.latitude, endCoords.longitude),
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && this.directionsRenderer) {
        this.directionsRenderer.setDirections(result);
      }
    });
  }

  /**
   * Formater le temps écoulé
   */
  getFormattedTime(minutes: number | null): string {
    if (!minutes) return '0 min';
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
  }
}
```

### Template HTML

```html
<div class="realtime-tracking-container">
  <!-- Informations du trajet -->
  <div class="trip-info" *ngIf="tripData">
    <h2>Suivi en Temps Réel</h2>
    
    <div class="status-card">
      <div class="status-item">
        <span class="label">Statut:</span>
        <span class="value" [class.active]="tripData.tracking.is_active">
          {{ tripData.tracking.is_active ? 'En cours' : 'Arrêté' }}
        </span>
      </div>
      
      <div class="status-item" *ngIf="tripData.tracking.minutes_since_start">
        <span class="label">Temps écoulé:</span>
        <span class="value">{{ getFormattedTime(tripData.tracking.minutes_since_start) }}</span>
      </div>
      
      <div class="status-item" *ngIf="tripData.tracking.progress_percentage">
        <span class="label">Progression:</span>
        <span class="value">{{ tripData.tracking.progress_percentage }}%</span>
      </div>
    </div>
  </div>

  <!-- Carte Google Maps -->
  <div class="map-container">
    <div #mapContainer id="realtime-map" class="map"></div>
  </div>

  <!-- Légende -->
  <div class="legend">
    <div class="legend-item">
      <span class="legend-icon car-icon">🚗</span>
      <span>Position du chauffeur</span>
    </div>
    <div class="legend-item">
      <span class="legend-line" style="background: #00FF00;"></span>
      <span>Trajet parcouru</span>
    </div>
    <div class="legend-item">
      <span class="legend-line" style="background: #2563EB;"></span>
      <span>Itinéraire prévu</span>
    </div>
  </div>
</div>
```

### Styles CSS

```css
.realtime-tracking-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.trip-info {
  padding: 16px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.status-card {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.status-item {
  display: flex;
  flex-direction: column;
}

.status-item .label {
  font-size: 12px;
  color: #666;
}

.status-item .value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.status-item .value.active {
  color: #10B981;
}

.map-container {
  flex: 1;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

.legend {
  padding: 12px 16px;
  background: white;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.legend-icon {
  font-size: 20px;
}

.legend-line {
  width: 30px;
  height: 4px;
  border-radius: 2px;
}
```

---

## 🔧 Configuration

### 1. Ajouter les permissions dans `manifest.json` (Ionic/Capacitor)

```json
{
  "permissions": {
    "geolocation": {
      "description": "Nécessaire pour le suivi GPS des trajets"
    }
  }
}
```

### 2. Variables d'environnement

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

---

## ✅ Checklist d'implémentation

- [ ] Créer le service `DriverLocationService` pour le chauffeur
- [ ] Créer le service `RealtimeTrackingService` pour le parent
- [ ] Implémenter le composant de suivi pour le chauffeur
- [ ] Implémenter le composant de suivi pour le parent avec carte
- [ ] Tester l'envoi de position GPS
- [ ] Tester la réception et l'affichage sur la carte
- [ ] Ajouter les permissions GPS dans le manifest
- [ ] Tester sur appareil réel (pas seulement simulateur)

---

## 🎯 Fonctionnalités Avancées (Optionnel)

### 1. Historique du trajet
Afficher toutes les positions précédentes avec des marqueurs différents.

### 2. Estimation d'arrivée
Calculer et afficher le temps estimé d'arrivée basé sur la vitesse actuelle.

### 3. Notifications push
Notifier le parent quand le chauffeur est proche de l'arrivée.

### 4. Mode économie d'énergie
Réduire la fréquence de mise à jour quand l'app est en arrière-plan.

---

**🎉 Votre système de suivi en temps réel est maintenant prêt !**





