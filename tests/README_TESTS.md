# Guide de Test - API Transport Scolaire

Ce dossier contient une collection Postman complète pour tester tous les endpoints de l'API de transport scolaire.

## 📁 Fichiers

- `API_Test_Collection.postman_collection.json` : Collection Postman avec tous les endpoints
- `Postman_Environment.postman_environment.json` : Variables d'environnement Postman

## 🚀 Installation

1. **Installer Postman** (si ce n'est pas déjà fait)
   - Télécharger depuis [postman.com](https://www.postman.com/downloads/)

2. **Importer la collection**
   - Ouvrir Postman
   - Cliquer sur "Import"
   - Sélectionner `API_Test_Collection.postman_collection.json`

3. **Importer l'environnement**
   - Cliquer sur "Import"
   - Sélectionner `Postman_Environment.postman_environment.json`
   - Sélectionner cet environnement dans le menu déroulant en haut à droite

## 📋 Flux de Test Complet

### Étape 1 : Authentification
1. **Login Chauffeur** → Sauvegarde automatique du token dans `driver_token`
2. **Login Parent** → Sauvegarde automatique du token dans `parent_token`
3. **Login Admin** → Sauvegarde automatique du token dans `admin_token`

### Étape 2 : Création de Trajet
1. **Créer Trajet Aller-Retour (Chauffeur)**
   - Crée un trajet DKR → Yoff (8h) avec retour Yoff → DKR (16h)
   - Sauvegarde automatique de l'ID du trajet dans `trip_id`

2. **OU Créer Trajet Aller-Retour (Admin)**
   - Alternative pour créer un trajet via l'admin

3. **Récupérer les trajets du chauffeur**
   - Vérifier que le trajet a bien été créé

### Étape 3 : Réservation (Parent)
1. **Récupérer les trajets disponibles**
   - Voir tous les trajets disponibles avec les informations du chauffeur

2. **Détails d'un trajet**
   - Voir les détails complets d'un trajet spécifique

3. **Réserver un trajet (Aller-Retour)**
   - Réserve automatiquement l'aller ET le retour
   - Utilise `trip_id` et `child_id` (à définir dans l'environnement)

4. **Voir mes réservations**
   - Vérifier que la réservation a bien été effectuée

### Étape 4 : Démarrage du Trajet (Chauffeur)
1. **Démarrer un trajet**
   - Change le statut de `pending` à `in_progress`
   - Envoie des notifications aux parents

2. **Voir les trajets en cours**
   - Vérifier que le trajet est bien en cours

### Étape 5 : Suivi en Temps Réel (Parent)
1. **Suivi en temps réel du trajet**
   - Position actuelle, statut, temps écoulé, etc.

### Étape 6 : Finalisation du Trajet (Chauffeur)
1. **Finaliser un trajet**
   - Change le statut de `in_progress` à `completed`
   - Envoie des notifications aux parents

## 🔧 Configuration

### Variables d'environnement à configurer

Dans Postman, configurez ces variables dans l'environnement :

- `base_url` : URL de base de votre API (ex: `http://86.106.181.31:3000`)
- `driver_token` : Token JWT du chauffeur (sauvegardé automatiquement après login)
- `parent_token` : Token JWT du parent (sauvegardé automatiquement après login)
- `admin_token` : Token JWT de l'admin (sauvegardé automatiquement après login)
- `trip_id` : ID du trajet créé (sauvegardé automatiquement après création)
- `child_id` : ID de l'enfant à réserver (à définir manuellement)

### Exemple de données de test

**Chauffeur :**
- Email: `driver@example.com`
- Password: `password123`

**Parent :**
- Email: `parent@example.com`
- Password: `password123`

**Admin :**
- Email: `admin@example.com`
- Password: `admin123`

## 📝 Notes Importantes

1. **Ordre d'exécution** : Suivez l'ordre des étapes pour que les tests fonctionnent correctement
2. **Tokens** : Les tokens sont sauvegardés automatiquement après chaque login
3. **ID du trajet** : L'ID du trajet est sauvegardé automatiquement après création
4. **Dates** : Modifiez les dates dans les requêtes pour qu'elles soient dans le futur
5. **IDs** : Assurez-vous que les `school_id`, `child_id`, etc. existent dans votre base de données

## 🧪 Tests Automatisés

Chaque requête contient des scripts de test qui :
- Sauvegardent automatiquement les tokens
- Sauvegardent l'ID du trajet créé
- Affichent des messages de confirmation dans la console

## 🔍 Vérifications

Après chaque étape, vérifiez :
- ✅ Les tokens sont sauvegardés
- ✅ L'ID du trajet est sauvegardé après création
- ✅ La réservation inclut bien l'aller ET le retour
- ✅ Le statut du trajet change correctement (pending → in_progress → completed)

## 🐛 Dépannage

Si une requête échoue :
1. Vérifiez que les tokens sont valides
2. Vérifiez que les IDs existent dans la base de données
3. Vérifiez que les dates sont dans le futur
4. Vérifiez les logs du serveur pour plus de détails

