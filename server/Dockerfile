FROM composer:2.5.4 as build
WORKDIR /app
COPY . /app
RUN composer install --optimize-autoloader --no-dev

FROM php:8.1.26RC1-apache
RUN docker-php-ext-install pdo pdo_mysql

EXPOSE 8080
COPY --from=build /app /var/www/
COPY docker/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY .env.example /var/www/.env
COPY docker/start.sh /usr/local/bin/start
COPY docker/uploads.ini /usr/local/etc/php/conf.d/uploads.ini

RUN chmod 777 -R /var/www/storage/ && \
    echo "Listen 8080" >> /etc/apache2/ports.conf && \
    chown -R www-data:www-data /var/www/ && \
    chmod u+x /usr/local/bin/start && \
    a2enmod rewrite

CMD [ "/usr/local/bin/start" ]
