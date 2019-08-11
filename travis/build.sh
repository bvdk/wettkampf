#!/bin/bash

docker build -f docker/production/entry/Dockerfile -t bvdk2019/entry .;
docker build -f docker/production/backend/Dockerfile -t bvdk2019/backend .;
docker build -f docker/production/frontend/Dockerfile -t bvdk2019/frontend .;
