FROM node:20

# Crée le répertoire d'app
WORKDIR /app

# Build argument : chemin du dossier Angular
ARG APP_DIR

# Copie le build Angular dans /app/dist
COPY ${APP_DIR} ./dist

# Installe un serveur statique (http-server)
RUN npm install -g http-server

# Démarre le serveur
CMD ["http-server", "dist"]
