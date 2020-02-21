#!/bin/bash

mkdir backend/src/public;
mkdir backend/dist/public;
cp -R frontend/build/* backend/src/public;
cp -R frontend/build/* backend/dist/public;

npm i -g pkg;

cd backend && pkg . -d