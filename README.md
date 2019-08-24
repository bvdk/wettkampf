# Installation

First download the install script and docker-compose file

    wget https://raw.githubusercontent.com/bvdk/wettkampf/develop/install.sh -O install.sh
    wget https://raw.githubusercontent.com/bvdk/wettkampf/develop/docker-compose-production.yml -O docker-compose.yml

or if it´s a *raspberry pi*    

    wget https://raw.githubusercontent.com/bvdk/wettkampf/develop/install_raspberry.sh -O install.sh
    wget https://raw.githubusercontent.com/bvdk/wettkampf/develop/docker-compose-production-raspberry-pi.yml -O docker-compose.yml

then execute the following commands

    chmod +x install.sh
    ./install.sh

when the script finished and the computer rebooted run

    docker-compose up -d
    
# Troubleshooting

## Possible Errors
1. * Error

           ERROR: An HTTP request took too long to complete. Retry with --verbose to obtain debug information.
           If you encounter this issue regularly because of slow network conditions, consider setting COMPOSE_HTTP_TIMEOUT to a higher value (current value: 60).

   * Solution
   
           export DOCKER_CLIENT_TIMEOUT=120 && export COMPOSE_HTTP_TIMEOUT=120 && docker-compose up -d
           
   * Reason:
       * maybe a weak computer needs longer then the preconfigured 60 seconds to start up the docker containers,
        so we increase the waiting time to 120 seconds. If the error persists, try to increase the timeouts further.   
           
           
