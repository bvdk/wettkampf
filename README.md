Installation Raspberry Pi

First download the install script and docker-compose file

    wget https://raw.githubusercontent.com/bvdk/wettkampf/develop/install.sh -O install.sh
    wget https://raw.githubusercontent.com/bvdk/wettkampf/develop/docker-compose-production.yml -O docker-compose.yml

or if it´s a raspberry pi    

    wget https://raw.githubusercontent.com/bvdk/wettkampf/develop/install_raspberry.sh -O install.sh
    wget https://raw.githubusercontent.com/bvdk/wettkampf/develop/docker-compose-production-raspberry-pi.yml -O docker-compose.yml

then execute the following commands

    chmod +x install.sh
    ./install.sh

when the script finished and the computer rebooted run

    docker-compose up -d

