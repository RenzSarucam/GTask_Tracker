#!/bin/sh
set -e

if [ -d /var/www/html-src ]; then
    rsync -a --delete /var/www/html-src/ /var/www/html/
    chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
fi

exec "$@"
