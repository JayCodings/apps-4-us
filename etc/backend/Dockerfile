# Stage 1: Dependencies
FROM composer:2 AS vendor

WORKDIR /app

COPY backend/composer.json backend/composer.lock ./
RUN composer install \
    --ignore-platform-reqs \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist \
    --no-dev \
    --optimize-autoloader

# Stage 2: Application
FROM php:8.4-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    supervisor \
    nginx \
    brotli-dev \
    shadow \
    $PHPIZE_DEPS

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql opcache pcntl bcmath gd

# Install Redis extension for cache/sessions
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Create www-data user with same UID/GID as host user
# These will be passed from docker-compose.yaml
ARG UID=1000
ARG GID=1000

RUN deluser www-data 2>/dev/null || true \
    && delgroup www-data 2>/dev/null || true \
    && addgroup -g ${GID} www-data \
    && adduser -D -u ${UID} -G www-data -s /bin/sh www-data

# Set working directory
WORKDIR /var/www/html

# Configure PHP
COPY etc/backend/php.ini /usr/local/etc/php/conf.d/99-laravel.ini

# Configure Supervisor
COPY etc/backend/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Configure Nginx
COPY etc/backend/nginx.conf /etc/nginx/nginx.conf

# Copy entrypoint script
COPY etc/backend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Set permissions - this will apply when the volume is mounted
# Using || true to prevent build failures if directories don't exist yet
RUN chown -R www-data:www-data /var/www/html 2>/dev/null || true

# Expose ports
EXPOSE 80 9000

# Use entrypoint for timezone configuration
ENTRYPOINT ["/docker-entrypoint.sh"]