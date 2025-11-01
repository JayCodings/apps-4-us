#!/bin/sh
set -e

# Set PHP timezone from environment
if [ -n "$TIMEZONE" ]; then
    echo "date.timezone = $TIMEZONE" > /usr/local/etc/php/conf.d/00-timezone.ini
    echo "Setting PHP timezone to: $TIMEZONE"
fi

# Set system timezone
if [ -n "$TZ" ]; then
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime
    echo $TZ > /etc/timezone
    echo "Setting system timezone to: $TZ"
fi

# Fix permissions for existing storage and cache directories
if [ -d "/var/www/html/storage" ]; then
    chown -R www-data:www-data /var/www/html/storage
    chmod -R 775 /var/www/html/storage
    echo "Fixed permissions for storage directory"
fi

if [ -d "/var/www/html/bootstrap/cache" ]; then
    chown -R www-data:www-data /var/www/html/bootstrap/cache
    chmod -R 775 /var/www/html/bootstrap/cache
    echo "Fixed permissions for bootstrap/cache directory"
fi

# Start supervisord
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf