FROM node

WORKDIR /usr/src/app

EXPOSE 4000
CMD export DATABASE_URL=postgresql://bvdk:bvdkpw@postgres:5432/bvdk?schema=public && npm run watch
