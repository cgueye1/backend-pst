# 🔍 Diagnostic - Erreur "Failed to fetch"

## Problème
Toutes les requêtes échouent avec l'erreur "Failed to fetch". Cela indique que le navigateur ne peut **pas du tout** se connecter au serveur, pas seulement un problème CORS.

## Causes possibles

### 1. Serveur non démarré ou inaccessible
Le serveur à `http://86.106.181.31:3000` n'est peut-être pas accessible depuis votre machine.

**Solution:**
```bash
# Sur le serveur, vérifiez que Next.js tourne
ps aux | grep node

# Ou testez depuis le serveur lui-même
curl http://localhost:3000/api/test
```

### 2. Serveur écoute seulement sur localhost
Par défaut, Next.js peut écouter seulement sur `127.0.0.1` (localhost), ce qui empêche les connexions externes.

**Solution:**
Modifiez le script de démarrage pour écouter sur toutes les interfaces:
```bash
# Dans package.json ou script de démarrage
next start -H 0.0.0.0 -p 3000
```

Ou dans `next.config.js`:
```javascript
module.exports = {
  // ... autres configs
  server: {
    host: '0.0.0.0',
    port: 3000
  }
}
```

### 3. Firewall bloque le port 3000
Le firewall du serveur peut bloquer les connexions entrantes sur le port 3000.

**Solution (Ubuntu/Debian):**
```bash
# Autoriser le port 3000
sudo ufw allow 3000/tcp

# Ou pour un firewall iptables
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
```

### 4. Problème de réseau
Vous n'êtes peut-être pas sur le même réseau que le serveur, ou il y a un problème de routage.

**Solution:**
- Vérifiez que vous pouvez ping le serveur: `ping 86.106.181.31`
- Vérifiez que le port est ouvert: `telnet 86.106.181.31 3000` ou `nc -zv 86.106.181.31 3000`

### 5. Serveur derrière un proxy/NAT
Le serveur peut être derrière un NAT ou un proxy qui ne redirige pas correctement.

**Solution:**
- Configurez le port forwarding si nécessaire
- Utilisez un tunnel SSH si le serveur est sur un réseau privé

## Tests à effectuer

### Test 1: Depuis le serveur lui-même
```bash
# Connectez-vous au serveur et testez
curl http://localhost:3000/api/test
curl http://127.0.0.1:3000/api/test
curl http://86.106.181.31:3000/api/test
```

### Test 2: Depuis votre machine (Node.js)
```bash
# Utilisez le script de test
cd tests
node test-server-connection.js
```

### Test 3: Depuis votre navigateur
Ouvrez directement dans votre navigateur:
- http://86.106.181.31:3000/api/test

Si cela ne fonctionne pas, le problème est au niveau réseau/serveur, pas CORS.

### Test 4: Vérifier les processus
```bash
# Sur le serveur
netstat -tulpn | grep 3000
# ou
ss -tulpn | grep 3000
```

Vous devriez voir quelque chose comme:
```
tcp  0  0  0.0.0.0:3000  0.0.0.0:*  LISTEN  node
```

Si vous voyez `127.0.0.1:3000` au lieu de `0.0.0.0:3000`, le serveur n'écoute que sur localhost.

## Solutions rapides

### Solution 1: Utiliser un tunnel SSH
Si le serveur est sur un réseau privé:
```bash
ssh -L 3000:localhost:3000 user@86.106.181.31
```
Puis utilisez `http://localhost:3000` dans votre navigateur.

### Solution 2: Utiliser ngrok (pour tests)
```bash
# Sur le serveur
ngrok http 3000
```
Utilisez l'URL fournie par ngrok.

### Solution 3: Modifier la configuration Next.js
Assurez-vous que Next.js écoute sur toutes les interfaces:
```bash
# Dans votre script de démarrage
HOST=0.0.0.0 PORT=3000 npm start
```

## Vérification finale

Une fois le serveur accessible, testez avec:
1. Le fichier `test-connection.html` (via un serveur HTTP local)
2. Le script Node.js `test-server-connection.js`
3. Directement dans le navigateur: http://86.106.181.31:3000/api/test

Si tous ces tests passent, alors le problème était bien la configuration du serveur, pas CORS.

