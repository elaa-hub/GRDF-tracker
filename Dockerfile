# Étape 1 : build Angular
FROM node:20 AS builder

WORKDIR /app

# Copie uniquement les fichiers nécessaires pour l'installation
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Copie tout le code source
COPY . .

# Build Angular (tu peux ajouter --configuration=production si besoin)
RUN npm run build

# Étape 2 : serveur statique avec http-server
FROM node:20

WORKDIR /app

# Installe http-server
RUN npm install -g http-server

# Copie le build généré depuis l’étape précédente
COPY --from=builder /app/dist/DevExtreme-app ./dist

# Expose port 8080 (par défaut http-server utilise 8080)
EXPOSE 8080

# Commande de démarrage
CMD ["http-server", "dist"]
