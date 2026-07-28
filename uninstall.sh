#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "============================================"
echo "  Orchies Visual - Uninstall Script"
echo "============================================"
echo ""

if [ -f docker-compose.prod.yml ]; then
  echo "Stopping and removing containers..."
  docker compose -f docker-compose.prod.yml down -v
  echo "  ✓ Containers and volumes removed"
else
  echo "No docker-compose.prod.yml found. Trying default..."
  docker compose down -v 2>/dev/null || true
  echo "  ✓ Default compose stopped"
fi

echo ""
echo "Removing Docker images..."
docker rmi orchies-nginx orchies-pocketbase orchies-frontend 2>/dev/null || true
echo "  ✓ Images removed (if they existed)"

echo ""
echo "Removing project data..."
rm -rf "${SCRIPT_DIR}/pb_data"
rm -rf "${SCRIPT_DIR}/node_modules"
rm -rf "${SCRIPT_DIR}/.next"
rm -rf "${SCRIPT_DIR}/deploy"
echo "  ✓ Project data removed"

echo ""
echo "Removing Nginx configuration..."
if [ -f /etc/nginx/conf.d/orchies.click.conf ]; then
  rm -f /etc/nginx/conf.d/orchies.click.conf
  echo "  ✓ Nginx config removed"
fi

echo ""
echo "Reloading Nginx..."
if command -v nginx &>/dev/null; then
  nginx -s reload 2>/dev/null || true
  echo "  ✓ Nginx reloaded"
fi

echo ""
echo "============================================"
echo "  Uninstall Complete"
echo "============================================"
echo ""
echo "The following may still need manual removal:"
echo "  - Docker volumes: docker volume ls | grep orchies"
echo "  - Docker network: docker network rm orchies-network"
echo "  - Project directory: rm -rf ${SCRIPT_DIR}"
echo ""