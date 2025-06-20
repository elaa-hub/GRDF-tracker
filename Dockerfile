FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# ✅ On supprime manuellement le verrou si présent
RUN rm -f ./node_modules/.ngcc_lock_file

# ✅ On build ensuite proprement
RUN npm run build -- --configuration development --no-progress

CMD ["npx", "http-server", "dist"]
