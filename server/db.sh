#!/bin/bash

# Run Laravel migration (by force, since it would be a prod-environment)
php artisan config:cache
php artisan route:cache
php artisan migrate
php artisan db:seed

# Run Apache in "foreground" mode (the default mode that runs in Docker)
apache2-foreground