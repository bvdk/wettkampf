#!/bin/bash

docker run --rm --privileged multiarch/qemu-user-static:register --reset
docker build -f "docker/production-$ARCH/entry/Dockerfile" -t bvdk2019/entry .;
docker build -f "docker/production-$ARCH/backend/Dockerfile" -t bvdk2019/backend .;
docker build -f "docker/production-$ARCH/frontend/Dockerfile" -t bvdk2019/frontend .;
