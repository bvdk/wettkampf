FROM node

WORKDIR /usr/src/app

COPY ./backend/schema.prisma ./
COPY ./backend/package.json ./

RUN npm install --only=production

COPY ./backend/migrations ./migrations
COPY ./backend/dist ./dist
COPY ./backend/fonts ./fonts

EXPOSE 4000
CMD export DATABASE_URL=postgresql://bvdk:bvdkpw@postgres:5432/bvdk?schema=public && npm run prisma:prod && npm run prisma:seed && node dist
