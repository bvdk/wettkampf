#! /bin/bash

echo "The following script installs all necessary dependencies for https://github.com/bvdk/wettkampf";
echo "";
echo "";
echo "The raspberry pi will restart after the installation";
read -p "Press enter to continue"

echo "start install dependencies";
sudo apt-get update && sudo apt-get -y dist-upgrade;
sudo apt-get -y install apt-transport-https ca-certificates software-properties-common;

echo "start install docker";
newgrp docker
sudo groupadd docker
sudo usermod -aG docker $USER;
curl -fsSL get.docker.com -o get-docker.sh && sh get-docker.sh;

sudo apt-get -y install docker-compose;

echo "{ \"storage-driver\": \"devicemapper\" }" | sudo tee /etc/docker/daemon.json

sudo reboot now;
