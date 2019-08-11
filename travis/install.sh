#!/bin/bash

cd backend && npm i && npm run build && cd ../frontend && npm i && npm run build && cd ..;
