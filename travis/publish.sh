#!/bin/bash

VERSION="$(npx -c 'echo "$npm_package_version"')"

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin;

docker push "bvdk2019/entry:$ARCH-latest";
docker push "bvdk2019/backend:$ARCH-latest";
docker push "bvdk2019/frontend:$ARCH-latest";

docker push "bvdk2019/entry:$ARCH-$VERSION";
docker push "bvdk2019/backend:$ARCH-$VERSION";
docker push "bvdk2019/frontend:$ARCH-$VERSION";
