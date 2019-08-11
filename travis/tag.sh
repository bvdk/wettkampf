#!/bin/bash

docker tag bvdk2019/entry bvdk2019/entry:$VERSION;
docker tag bvdk2019/backend bvdk2019/backend:$VERSION;
docker tag bvdk2019/frontend bvdk2019/frontend:$VERSION;
