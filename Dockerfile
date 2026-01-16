FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Build de l'application Next.js
RUN npm run build

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

# Créer le dossier uploads si nécessaire
RUN mkdir -p /app/uploads

# Exposer le port
EXPOSE 3000

# Démarrer l'application (Next.js standalone génère server.js dans .next/standalone)
CMD ["node", ".next/standalone/server.js"]
