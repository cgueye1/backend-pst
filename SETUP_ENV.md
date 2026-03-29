# Configuration du fichier .env

## Création du fichier .env

Sur votre serveur Linux, exécutez cette commande pour créer le fichier `.env` :

```bash
cd ~/backend
cat > .env << 'ENVEOF'
# ============================================
# Configuration Backend - Transport Scolaire
# ============================================

# ============================================
# Base de données
# ============================================
DATABASE_URL=postgresql://postgres:passer@postgres:5432/PST_DB
DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT=30000
DB_POOL_CONNECTION_TIMEOUT=2000
DATABASE_SSL=false

# ============================================
# Application
# ============================================
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ============================================
# Sécurité
# ============================================
ALLOWED_ORIGINS=*
JWT_SECRET=CHANGE_ME_IN_PRODUCTION_GENERATE_A_STRONG_SECRET
JWT_EXPIRES_IN=1d

# ============================================
# Email (Nodemailer)
# ============================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=mameabydrame3@gmail.com
EMAIL_PASSWORD=qnrjhdqgncwtkbhg

# ============================================
# LAM SMS (LaFrica Mobile) - Service SMS principal
# ============================================
LAM_SMS_URL=https://lamsms.lafricamobile.com/api
LAM_SMS_ACCOUNT_ID=INNOV_&_IMPACT_&_AFRICA_01
LAM_SMS_PASSWORD=XhEAvqmsAO1BksR
LAM_SMS_SENDER=Seddo

# ============================================
# Twilio (SMS) - Optionnel, remplacé par LAM SMS
# ============================================
TWILIO_ACCOUNT_SID=CHANGE_ME_IN_PRODUCTION
TWILIO_AUTH_TOKEN=CHANGE_ME_IN_PRODUCTION
TWILIO_PHONE=CHANGE_ME_IN_PRODUCTION

# ============================================
# PayTech (Paiement)
# ============================================
PAYTECH_API_KEY=CHANGE_ME_IN_PRODUCTION
PAYTECH_API_SECRET=CHANGE_ME_IN_PRODUCTION
PAYTECH_ENV=test

# ============================================
# Google Maps
# ============================================
GOOGLE_MAPS_API_KEY=CHANGE_ME_IN_PRODUCTION

# ============================================
# Cron / Tâches planifiées
# ============================================
CRON_SECRET=CHANGE_ME_IN_PRODUCTION
ENVEOF
```

## Alternative : Copier depuis .env.example

Si le fichier `.env.example` existe, vous pouvez simplement le copier :

```bash
cd ~/backend
cp .env.example .env
```

Puis modifiez les valeurs selon votre environnement avec votre éditeur préféré :

```bash
nano .env
# ou
vi .env
```

## Variables importantes à modifier

⚠️ **IMPORTANT** : Modifiez au minimum ces variables avant la production :

1. **JWT_SECRET** : Générez une clé secrète forte
   ```bash
   openssl rand -base64 32
   ```

2. **ALLOWED_ORIGINS** : Ajoutez les domaines de votre frontend
   ```
   ALLOWED_ORIGINS=https://votre-domaine.com,https://www.votre-domaine.com
   ```

3. **NEXT_PUBLIC_BASE_URL** : URL publique de votre backend
   ```
   NEXT_PUBLIC_BASE_URL=https://api.votre-domaine.com
   ```

4. **EMAIL_USER** et **EMAIL_PASSWORD** : Vos credentials email

5. **PAYTECH_API_KEY** et **PAYTECH_API_SECRET** : Vos clés PayTech

6. **GOOGLE_MAPS_API_KEY** : Votre clé API Google Maps

## Vérification

Après avoir créé le fichier `.env`, vérifiez qu'il existe :

```bash
ls -la ~/backend/.env
```

Vous devriez voir le fichier listé.

Ensuite, vous pouvez lancer Docker Compose :

```bash
cd ~/backend
docker compose up -d --build
```


