#!/bin/bash

bash ./travis/install.sh;
bash ./travis/build.sh;
bash ./travis/tag.sh;
bash ./travis/publish.sh;