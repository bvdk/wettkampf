FROM arm64v8/node:alpine

WORKDIR /usr/src/app

COPY ./backend/package.json ./
COPY ./backend/dist ./dist

RUN yarn install --only=production

EXPOSE 4000
CMD node dist/start.js
