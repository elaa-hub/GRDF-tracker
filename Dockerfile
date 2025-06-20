# Dockerfile (dans le dossier frontend)
FROM node:20

# Définir le dossier de travail
WORKDIR /app

# Copier package.json et lock pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste du code
COPY . .

# Build optimisé
RUN npm run build -- --configuration development --no-progress

# Répertoire final du build
CMD ["ls", "-la", "dist"]
