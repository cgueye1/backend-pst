# Documentation - Réinitialisation de Mot de Passe

## Vue d'ensemble

Le système de réinitialisation de mot de passe permet aux utilisateurs de récupérer l'accès à leur compte en recevant un code OTP (One-Time Password) par **email** et/ou **SMS**.

## Configuration

### Variables d'environnement

Ajoutez ces variables dans votre fichier `.env` ou dans votre configuration Docker :

```env
# LAM SMS (LaFrica Mobile) - Service SMS principal
LAM_SMS_URL=https://lamsms.lafricamobile.com/api
LAM_SMS_ACCOUNT_ID=INNOV_&_IMPACT_&_AFRICA_01
LAM_SMS_PASSWORD=XhEAvqmsAO1BksR
LAM_SMS_SENDER=Seddo

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=votre_email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_application
```

### Configuration par défaut

Si les variables d'environnement ne sont pas définies, le système utilise les valeurs par défaut suivantes :

- **LAM SMS** : Les credentials fournis dans le code
- **Email** : Configuration Gmail par défaut (⚠️ À changer en production)

## Endpoints API

### 1. Demande de réinitialisation (`POST /api/auth/forgot-password`)

Envoie un code OTP à l'utilisateur.

**Requête :**
```json
{
  "contact": "user@example.com" // ou "+221771234567"
}
```

**Options avancées :**
```json
{
  "contact": "user@example.com",
  "sendBoth": true  // Envoie par email ET SMS si disponibles
}
```

**Réponse (200) :**
```json
{
  "message": "Code de réinitialisation envoyé par email",
  "channels": ["email"],
  "user": {
    "id": 1,
    "email": "user@example.com",
    "phone": "+221771234567"
  }
}
```

**Réponse avec les deux canaux :**
```json
{
  "message": "Code de réinitialisation envoyé par email et SMS",
  "channels": ["email", "SMS"],
  "user": {
    "id": 1,
    "email": "user@example.com",
    "phone": "+221771234567"
  }
}
```

### 2. Vérification du code OTP (`POST /api/auth/verify-otp`)

Vérifie que le code OTP fourni est valide.

**Requête :**
```json
{
  "userId": 1,
  "code": "1234"
}
```

**Réponse (200) :**
```json
{
  "message": "Code OTP vérifié",
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "code": "1234"
}
```

### 3. Réinitialisation du mot de passe (`POST /api/auth/reset-password`)

Met à jour le mot de passe de l'utilisateur après vérification du code OTP.

**Requête :**
```json
{
  "userId": 1,
  "code": "1234",
  "newPassword": "NouveauMotDePasse123!"
}
```

**Réponse (200) :**
```json
{
  "message": "Mot de passe réinitialisé avec succès"
}
```

## Flux complet

1. **Utilisateur demande la réinitialisation**
   - Fournit son email ou numéro de téléphone
   - Le système génère un code OTP (4 chiffres)
   - Le code est envoyé par email et/ou SMS
   - Le code expire après 15 minutes

2. **Utilisateur vérifie le code**
   - Fournit le code reçu
   - Le système vérifie la validité et l'expiration

3. **Utilisateur définit un nouveau mot de passe**
   - Fournit le code vérifié et le nouveau mot de passe
   - Le système met à jour le mot de passe
   - Le code OTP est supprimé après utilisation

## Service SMS LAM

Le service SMS utilise l'API **LAM (LaFrica Mobile)** pour l'envoi de SMS.

### Implémentation

Le service est implémenté dans `backend/lib/lamSms.ts` :

```typescript
import { sendOtpByLamSms } from "@/lib/lamSms";

// Envoi d'un code OTP
await sendOtpByLamSms("+221771234567", "1234");
```

### Format du numéro de téléphone

Le numéro doit être au format international avec le préfixe `+` :
- ✅ `+221771234567`
- ✅ `+221701234567`
- ❌ `771234567` (sans préfixe)
- ❌ `00221771234567` (format incorrect)

## Service Email

Le service email utilise **Nodemailer** avec support SMTP.

### Configuration recommandée

Pour Gmail :
1. Activer l'authentification à deux facteurs
2. Générer un mot de passe d'application
3. Utiliser ce mot de passe dans `EMAIL_PASSWORD`

## Gestion des erreurs

### Erreurs courantes

1. **Utilisateur introuvable (404)**
   - L'email ou le téléphone fourni n'existe pas dans la base de données

2. **Code invalide ou expiré (400)**
   - Le code OTP est incorrect ou a expiré (15 minutes)

3. **Échec d'envoi (500)**
   - Problème de configuration SMS/Email
   - Vérifier les variables d'environnement
   - Vérifier les logs du serveur

### Logs

Les logs incluent :
- ✅ Succès d'envoi (email/SMS)
- ❌ Erreurs d'envoi avec détails
- 📤 Tentatives d'envoi avec numéro/email

## Sécurité

- Les codes OTP expirent après **15 minutes**
- Les codes sont supprimés après utilisation
- Les mots de passe sont hashés avec **bcrypt**
- Un seul code actif par utilisateur à la fois

## Tests

Pour tester la réinitialisation de mot de passe :

```bash
# 1. Demander la réinitialisation
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"contact": "user@example.com"}'

# 2. Vérifier le code (utiliser le code reçu par email/SMS)
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "code": "1234"}'

# 3. Réinitialiser le mot de passe
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "code": "1234", "newPassword": "NouveauMotDePasse123!"}'
```

## Migration depuis Twilio

Le système a été migré de Twilio vers LAM SMS. Les anciennes variables Twilio sont toujours supportées mais ne sont plus utilisées pour la réinitialisation de mot de passe.

Pour migrer :
1. Ajouter les variables LAM SMS dans `.env`
2. Le système utilisera automatiquement LAM SMS
3. Les variables Twilio peuvent être conservées pour d'autres fonctionnalités


