FROM tobi312/rpi-nginx:alpine

COPY ./docker/production-arm64v8/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./frontend/build /var/www/html
