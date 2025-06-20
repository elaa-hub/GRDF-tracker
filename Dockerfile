# frontend/Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration development --no-progress

CMD ["npm", "run", "test:login"]
