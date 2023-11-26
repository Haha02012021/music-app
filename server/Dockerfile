FROM composer:2.5.4 as build
WORKDIR /app
COPY . /app
RUN sudo apt-get update
RUN sudo apt-get install apache2 libapache2-mod-wsgi
RUN composer install --optimize-autoloader --no-dev

FROM php:8.1.25-cli
RUN docker-php-ext-install pdo pdo_mysql

EXPOSE 8080
COPY --from=build /app /var/www/
COPY docker/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY .env.example /var/www/.env
RUN chmod 777 -R /var/www/storage/ && \
    echo "Listen 8080" >> /etc/apache2/ports.conf && \
    chown -R www-data:www-data /var/www/ && \
    sudo a2enmod rewrite

RUN php artisan config:cache
RUN php artisan event:cache
RUN php artisan route:cache
RUN php artisan migrate
RUN php artisan db:seed