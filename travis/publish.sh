#!/bin/bash

VERSION="$(npx -c 'echo "$npm_package_version"')"

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin;
docker push bvdk2019/entry:latest;
docker push bvdk2019/entry:$VERSION;
docker push bvdk2019/backend:latest;
docker push bvdk2019/backend:$VERSION;
docker push bvdk2019/frontend:latest;
docker push bvdk2019/frontend:$VERSION;
