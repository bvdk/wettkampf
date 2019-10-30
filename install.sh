#! /bin/bash

echo "The following script installs all necessary dependencies for https://github.com/bvdk/wettkampf";
echo "The installation can take a while.";
echo "";
echo "The Computer will restart after the installation";
echo "";
read -p "Press enter to continue"

echo "start install dependencies";
sudo apt-get update && sudo apt-get -y dist-upgrade;
sudo apt-get -y install curl apt-transport-https ca-certificates gnupg-agent software-properties-common;

echo "start install docker";
if ! [ -x "$(command -v docker)" ]; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -;
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable";
    sudo apt-get install docker-ce docker-ce-cli containerd.io;

    sudo curl -L https://github.com/docker/compose/releases/download/1.25.0-rc3/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose;
    sudo chmod +x /usr/local/bin/docker-compose;
    sudo usermod -aG docker $USER;
fi


