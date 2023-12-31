#!/usr/bin/env bash

set -e

role=${CONTAINER_ROLE:-app}
env=${APP_ENV:-production}

if [ "$env" != "local" ]; then
    echo "Caching configuration..."
fi

if [ "$role" = "app" ]; then
 
    exec apache2-foreground
 
# elif [ "$role" = "queue" ]; then
 
#     echo "Queue role"
#     exit 1
 
# elif [ "$role" = "scheduler" ]; then
 
    while [ true ]
    do 
        php /var/www/html/artisan schedule:run --verbose --no-interaction &
        sleep 60
    done
 
else
    echo "Could not match the container role \"$role\""
    exit 1
fi
