FROM nginx:alpine

COPY ./docker/production-amd64/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./frontend/build /usr/share/nginx/html
