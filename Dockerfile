FROM node:20

WORKDIR /app

COPY dist/DevExtreme-app ./dist

RUN npm install -g http-server

CMD ["http-server", "dist"]
