#!/bin/bash

VERSION="$(npx -c 'echo "$npm_package_version"')"

docker tag bvdk2019/entry "bvdk2019/entry:$ARCH-$VERSION";
docker tag bvdk2019/backend "bvdk2019/backend:$ARCH-$VERSION";
docker tag bvdk2019/frontend "bvdk2019/frontend:$ARCH-$VERSION";
