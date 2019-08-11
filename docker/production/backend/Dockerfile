FROM node:alpine

WORKDIR /usr/src/app

COPY ./backend/package.json ./

RUN npm install --only=production

COPY ./backend ./
RUN npm run build

EXPOSE 4000
CMD node dist/start.js
