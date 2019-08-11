#!/bin/bash

VERSION="$(npx -c 'echo "$npm_package_version"')"

echo "$VERSION";
echo "$DOCKER_PASSWORD";
echo "$DOCKER_USERNAME";

docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD" --password-stdin;
docker push bvdk2019/entry:latest;
docker push bvdk2019/backend:latest;
docker push bvdk2019/frontend:latest;
docker push bvdk2019/entry:$VERSION;
docker push bvdk2019/backend:$VERSION;
docker push bvdk2019/frontend:$VERSION;
