#! /bin/bash

echo "start install dependencies";
sudo apt-get update && sudo apt-get -y dist-upgrade;
sudo apt-get -y install apt-transport-https ca-certificates software-properties-common;

echo "start install docker";
curl -fsSL get.docker.com -o get-docker.sh && sh get-docker.sh;
sudo usermod -aG docker pi;
sudo curl https://download.docker.com/linux/raspbian/gpg;
curl -fsSL https://yum.dockerproject.org/gpg | sudo apt-key add -;
sudo add-apt-repository "deb https://download.docker.com/linux/raspbian/ $(lsb_release -cs) stable";

echo "run docker";
sudo docker run hello-world;
