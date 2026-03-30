FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Copier le script de correction du serveur
COPY fix-server-hostname.js ./

# next build exécute le code des routes (collecte des pages). Sans URL, la validation DB peut échouer.
# La vraie DATABASE_URL doit être fournie au runtime (Dockploy / compose). Surcharge possible via build-arg.
ARG DATABASE_URL_BUILD=postgresql://build:build@127.0.0.1:5432/build
ENV DATABASE_URL=$DATABASE_URL_BUILD

ARG JWT_SECRET_BUILD=buildtime-jwt-secret-placeholder-change-at-runtime-min-32chars
ENV JWT_SECRET=$JWT_SECRET_BUILD

# Build de l'application Next.js (le script fix-server-hostname.js sera exécuté automatiquement)
RUN npm run build && \
    echo "✅ Build completed. Checking for standalone output..." && \
    if [ -d "/app/.next/standalone" ]; then \
      echo "✅ Standalone directory found"; \
      ls -la /app/.next/standalone/ | head -10; \
      if [ -f "/app/.next/standalone/server.js" ]; then \
        echo "✅ server.js found in standalone"; \
        echo "" && \
        echo "=== Checking standalone package.json ===" && \
        if [ -f "/app/.next/standalone/package.json" ]; then \
          echo "📦 Found package.json in standalone:"; \
          cat /app/.next/standalone/package.json | grep -A 5 '"scripts"' || echo "No scripts section"; \
        else \
          echo "⚠️  No package.json in standalone directory"; \
        fi; \
      else \
        echo "❌ server.js NOT found in standalone!"; \
        exit 1; \
      fi; \
    else \
      echo "❌ Standalone directory NOT found!"; \
      echo "Listing .next directory:"; \
      ls -la /app/.next/ 2>/dev/null || echo ".next directory not found"; \
      exit 1; \
    fi

# Image de production
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copier les fichiers nécessaires depuis le builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copier le script de correction du serveur dans l'image finale
COPY --from=builder /app/fix-server-hostname.js ./

# Client PostgreSQL + scripts SQL : init au démarrage si la base est vide (voir scripts/docker-entrypoint.sh)
RUN apk add --no-cache postgresql-client
COPY sql/ ./sql/
# Sources des routes : nécessaires à swagger-jsdoc pour GET /api/swagger.json en production
COPY --from=builder /app/app/api ./app/api
COPY scripts/docker-entrypoint.sh ./docker-entrypoint.sh
RUN sed -i 's/\r$//' ./docker-entrypoint.sh 2>/dev/null || true && chmod +x ./docker-entrypoint.sh

# Vérifier que les fichiers existent et exécuter le script
RUN echo "=== DEBUG: Listing /app directory ===" && \
    ls -la /app/ | head -20 && \
    echo "" && \
    echo "=== DEBUG: Checking for server.js ===" && \
    if [ -f "/app/server.js" ]; then \
      echo "✅ server.js found at /app/server.js"; \
      echo "=== Running fix-server-hostname.js ==="; \
      node fix-server-hostname.js || echo "Script warning (may already be fixed)"; \
      echo "=== Script completed ==="; \
    else \
      echo "❌ server.js not found at /app/server.js!"; \
      echo "Listing /app:"; \
      ls -la /app/; \
      echo "Searching for server.js in subdirectories..."; \
      find /app -name "server.js" -type f 2>/dev/null || echo "No server.js found anywhere"; \
      exit 1; \
    fi && \
    echo "" && \
    echo "=== Checking and fixing package.json ===" && \
    if [ -f "/app/package.json" ]; then \
      echo "📦 Found package.json"; \
      echo "Current start script:"; \
      cat /app/package.json | grep -A 2 '"start"' || echo "No start script found"; \
      echo "🔧 Fixing package.json start script to use server.js..."; \
      sed -i 's|"start":\s*"[^"]*"|"start": "node server.js"|g' /app/package.json && \
      sed -i 's|\.next/standalone/server\.js|server.js|g' /app/package.json && \
      sed -i 's|node \.next/standalone/server\.js|node server.js|g' /app/package.json && \
      echo "✅ package.json fixed"; \
      echo "New start script:"; \
      cat /app/package.json | grep -A 2 '"start"' || echo "No start script found"; \
    else \
      echo "⚠️  No package.json found, creating one..."; \
      echo '{"name":"backend","version":"1.0.0","scripts":{"start":"node server.js"}}' > /app/package.json; \
      echo "✅ Created package.json"; \
    fi && \
    echo "" && \
    echo "=== Final verification ===" && \
    echo "server.js exists:" && \
    ls -la /app/server.js && \
    echo "First 5 lines of server.js:" && \
    head -5 /app/server.js && \
    echo "" && \
    echo "package.json start script:" && \
    cat /app/package.json | grep -A 2 '"start"' || echo "No start script"

# Créer le dossier uploads si nécessaire
RUN mkdir -p /app/uploads

# Exposer le port
EXPOSE 3000

# Vérification finale
RUN echo "=== Final structure check ===" && \
    echo "Files in /app:" && \
    ls -la /app/ | grep -E "(server\.js|package\.json)" && \
    echo "" && \
    echo "Checking server.js location:" && \
    [ -f "/app/server.js" ] && echo "✅ server.js is at /app/server.js" || (echo "❌ server.js not found!" && exit 1) && \
    echo "" && \
    echo "Checking package.json start script:" && \
    if [ -f "/app/package.json" ]; then \
      grep '"start"' /app/package.json || echo "No start script in package.json (good, we use CMD)"; \
    fi

# Démarrer l'application (init SQL optionnelle puis node server.js)
# Le script fix-server-hostname.js a modifié server.js pour écouter sur 0.0.0.0
ENTRYPOINT ["./docker-entrypoint.sh"]
