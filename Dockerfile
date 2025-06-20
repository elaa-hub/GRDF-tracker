# Utilise une image Node officielle
FROM node:20

# Dossier de travail
WORKDIR /app

# Étape 1 : Copie uniquement les fichiers package.json
COPY package*.json ./

# Étape 2 : Installation propre
RUN npm ci --prefer-offline --no-audit

# Étape 3 : Copie du reste (code Angular sans node_modules)
COPY . .

# Supprime le verrou Angular s’il existe
RUN rm -f ./node_modules/.ngcc_lock_file

# Build production sans progress bar
RUN npm run build -- --configuration production --no-progress

# Pour test local (optionnel)
CMD ["npx", "http-server", "dist"]
