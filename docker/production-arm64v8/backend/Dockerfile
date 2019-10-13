FROM arm64v8/node:alpine

WORKDIR /usr/src/app

COPY ./backend/package.json ./
COPY ./backend/dist ./dist

EXPOSE 4000
CMD yarn install --only=production && node dist/start.js
