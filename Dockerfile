FROM node:20

WORKDIR /app

COPY dist ./dist

RUN npm install -g http-server

CMD ["http-server", "dist"]
