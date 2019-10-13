FROM arm64v8/node:alpine

WORKDIR /usr/src/app

COPY ./docker/production-arm64v8/backend/cmd.sh ./cmd.sh
COPY ./backend/package.json ./
COPY ./backend/dist ./dist

EXPOSE 4000
CMD ./cmd.sh
