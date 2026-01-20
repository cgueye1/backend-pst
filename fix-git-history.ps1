# Script pour retirer les secrets de l'historique Git
# Ce script remplace le docker-compose.yml dans le commit problématique

Write-Host "🔧 Correction de l'historique Git pour retirer les secrets..." -ForegroundColor Yellow

# Sauvegarder le docker-compose.yml actuel
Write-Host "📦 Sauvegarde du docker-compose.yml actuel..." -ForegroundColor Cyan
Copy-Item docker-compose.yml docker-compose.yml.backup

# Créer une version du docker-compose.yml sans secrets réels pour le commit
Write-Host "📝 Création d'une version sans secrets pour l'historique..." -ForegroundColor Cyan

$dockerComposeContent = @"
services:
  postgres:
    image: postgres:16-alpine
    container_name: transport-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: passer
      POSTGRES_DB: PST_DB
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./sql/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql:ro
      - ./sql/systemeSMS.sql:/docker-entrypoint-initdb.d/02-systemeSMS.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend-network

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: transport-backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:passer@postgres:5432/PST_DB
      NODE_ENV: production
      PORT: 3000
      HOSTNAME: "0.0.0.0"
      ALLOWED_ORIGINS: "*"
      JWT_SECRET: "CHANGE_ME_IN_PRODUCTION"
      JWT_EXPIRES_IN: "1d"

      # URLs - IMPORTANT: Pour Docker local, utiliser localhost
      NEXT_PUBLIC_BASE_URL: "http://localhost:3000"

      # PayTech
      PAYTECH_API_KEY: "CHANGE_ME_IN_PRODUCTION"
      PAYTECH_API_SECRET: "CHANGE_ME_IN_PRODUCTION"
      PAYTECH_ENV: "test"

      # Twilio (SMS)
      TWILIO_ACCOUNT_SID: "CHANGE_ME_IN_PRODUCTION"
      TWILIO_AUTH_TOKEN: "CHANGE_ME_IN_PRODUCTION"
      TWILIO_PHONE: "CHANGE_ME_IN_PRODUCTION"

      # Google Maps
      GOOGLE_MAPS_API_KEY: "CHANGE_ME_IN_PRODUCTION"

      # Cron
      CRON_SECRET: "CHANGE_ME_IN_PRODUCTION"
    volumes:
      - ./uploads:/app/uploads
      - ./public/uploads:/app/public/uploads
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - backend-network

volumes:
  postgres_data:

networks:
  backend-network:
    driver: bridge
"@

# Utiliser git filter-branch pour remplacer le fichier dans l'historique
Write-Host "🔄 Modification de l'historique Git..." -ForegroundColor Cyan
Write-Host "⚠️  ATTENTION: Cette opération va réécrire l'historique Git!" -ForegroundColor Red
Write-Host ""

# Vérifier qu'on est sur la branche main
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -ne "main") {
    Write-Host "❌ Erreur: Vous devez être sur la branche 'main'" -ForegroundColor Red
    exit 1
}

# Créer un script temporaire pour git filter-branch
$filterScript = @"
#!/bin/sh
if git ls-files --error-unmatch docker-compose.yml > /dev/null 2>&1; then
    cat > docker-compose.yml << 'EOF'
services:
  postgres:
    image: postgres:16-alpine
    container_name: transport-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: passer
      POSTGRES_DB: PST_DB
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./sql/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql:ro
      - ./sql/systemeSMS.sql:/docker-entrypoint-initdb.d/02-systemeSMS.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend-network

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: transport-backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:passer@postgres:5432/PST_DB
      NODE_ENV: production
      PORT: 3000
      HOSTNAME: "0.0.0.0"
      ALLOWED_ORIGINS: "*"
      JWT_SECRET: "CHANGE_ME_IN_PRODUCTION"
      JWT_EXPIRES_IN: "1d"
      NEXT_PUBLIC_BASE_URL: "http://localhost:3000"
      PAYTECH_API_KEY: "CHANGE_ME_IN_PRODUCTION"
      PAYTECH_API_SECRET: "CHANGE_ME_IN_PRODUCTION"
      PAYTECH_ENV: "test"
      TWILIO_ACCOUNT_SID: "CHANGE_ME_IN_PRODUCTION"
      TWILIO_AUTH_TOKEN: "CHANGE_ME_IN_PRODUCTION"
      TWILIO_PHONE: "CHANGE_ME_IN_PRODUCTION"
      GOOGLE_MAPS_API_KEY: "CHANGE_ME_IN_PRODUCTION"
      CRON_SECRET: "CHANGE_ME_IN_PRODUCTION"
    volumes:
      - ./uploads:/app/uploads
      - ./public/uploads:/app/public/uploads
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - backend-network

volumes:
  postgres_data:

networks:
  backend-network:
    driver: bridge
EOF
    git add docker-compose.yml
fi
"@

$filterScript | Out-File -FilePath filter-script.sh -Encoding ASCII
chmod +x filter-script.sh

Write-Host "🚀 Exécution de git filter-branch..." -ForegroundColor Green
git filter-branch --force --index-filter "bash filter-script.sh" --prune-empty --tag-name-filter cat -- --all

# Nettoyer
Remove-Item filter-script.sh -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✅ Historique modifié avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Vérifiez l'historique avec: git log --oneline" -ForegroundColor Cyan
Write-Host "2. Forcez le push avec: git push origin main --force" -ForegroundColor Cyan
Write-Host "   ⚠️  ATTENTION: --force réécrit l'historique sur le serveur!" -ForegroundColor Red
Write-Host ""
Write-Host "💡 Le fichier docker-compose.yml.backup contient votre version originale" -ForegroundColor Cyan

