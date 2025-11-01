#!/bin/bash

# Helper script für lokale Entwicklung
# Führt alle notwendigen Befehle aus um Änderungen zu übernehmen

echo "🔄 Refreshing development environment..."

# Clear all caches
echo "📦 Clearing caches..."
docker compose exec backend php artisan cache:clear
docker compose exec backend php artisan config:clear
docker compose exec backend php artisan route:clear
docker compose exec backend php artisan view:clear

# Regenerate autoload
echo "🔧 Regenerating autoloader..."
docker compose exec backend composer dump-autoload

# Reload Octane
echo "🚀 Reloading Octane..."
docker compose exec backend php artisan octane:reload

echo "✅ Development environment refreshed!"