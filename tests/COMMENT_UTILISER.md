# Comment utiliser api-test.html

## ⚠️ Problème "Failed to fetch" ?

Si vous voyez l'erreur "Failed to fetch", c'est probablement parce que vous ouvrez le fichier HTML directement (double-clic ou `file://`). Les navigateurs bloquent les requêtes CORS depuis `file://`.

## ✅ Solutions

### Option 1 : Extension Live Server (VS Code) - RECOMMANDÉ

1. Installez l'extension "Live Server" dans VS Code
2. Faites clic droit sur `api-test.html`
3. Sélectionnez "Open with Live Server"
4. Le fichier s'ouvrira sur `http://127.0.0.1:5500/tests/api-test.html`

### Option 2 : Python HTTP Server

```bash
# Dans le dossier backend
cd tests
python -m http.server 8000
```

Puis ouvrez : `http://localhost:8000/api-test.html`

### Option 3 : Node.js http-server

```bash
# Installez http-server globalement
npm install -g http-server

# Dans le dossier backend
cd tests
http-server -p 8000
```

Puis ouvrez : `http://localhost:8000/api-test.html`

### Option 4 : PHP (si installé)

```bash
# Dans le dossier backend/tests
php -S localhost:8000
```

Puis ouvrez : `http://localhost:8000/api-test.html`

## 🔧 Configuration

1. **URL du serveur** : Par défaut `http://86.106.181.31:3000`
   - Vous pouvez la modifier dans le champ "URL de base de l'API"

2. **Identifiants de test** :
   - Chauffeur : `driver@example.com` / `password123`
   - Parent : `parent@example.com` / `password123`
   - Admin : `admin@example.com` / `admin123`

## 📝 Ordre de test recommandé

1. **Se connecter** (Chauffeur, Parent, Admin)
2. **Créer un trajet** (Chauffeur ou Admin)
3. **Voir les trajets disponibles** (Parent)
4. **Réserver un trajet** (Parent)
5. **Démarrer le trajet** (Chauffeur)
6. **Suivre en temps réel** (Parent)
7. **Finaliser le trajet** (Chauffeur)

## 🐛 Dépannage

### Erreur CORS persistante

Vérifiez que :
- Le serveur API est bien démarré
- L'URL du serveur est correcte
- Vous n'ouvrez pas le fichier directement (file://)
- Vous utilisez un serveur HTTP local

### Test de connexion

Utilisez le bouton "🔍 Tester la connexion au serveur" dans l'interface pour vérifier que le serveur est accessible.

