#!/bin/sh

yarn install --only=production;
node dist/start.js;
