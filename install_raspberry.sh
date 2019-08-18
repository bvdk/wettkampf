#! /bin/bash

echo "start install dependencies";
sudo apt-get update && sudo apt-get -y dist-upgrade;
sudo apt-get -y install apt-transport-https ca-certificates software-properties-common;

echo "start install docker";
newgrp docker
sudo groupadd docker
sudo usermod -aG docker $USER;
curl -fsSL get.docker.com -o get-docker.sh && sh get-docker.sh;

echo "run docker";
sudo docker run hello-world;
