#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

DOMAIN="${1:-orchies.click}"
DEPLOY_TYPE="${2:-subdomain}"
BASE_PATH="${3:-/}"
REPO_URL="${4:-}"

echo "============================================"
echo "  Orchies Visual - Deployment Script"
echo "============================================"
echo ""
echo "Domain      : ${DOMAIN}"
echo "Deploy type : ${DEPLOY_TYPE}"
echo "Base path   : ${BASE_PATH}"
echo ""

if [ -z "${REPO_URL}" ]; then
  echo "ERROR: Repository URL is required."
  echo ""
  echo "Usage:"
  echo "  Subdomain: ./deploy.sh orchies.click subdomain / https://github.com/user/repo.git"
  echo "  Subdir:    ./deploy.sh orchies.click subdirectory /orchies https://github.com/user/repo.git"
  exit 1
fi

prerequisites() {
  echo "Checking prerequisites..."
  local missing=0

  if ! command -v docker &>/dev/null; then
    echo "  ✗ Docker is not installed"
    missing=1
  else
    echo "  ✓ Docker found: $(docker --version)"
  fi

  if ! command -v docker compose &>/dev/null; then
    echo "  ✗ Docker Compose is not installed"
    missing=1
  else
    echo "  ✓ Docker Compose found"
  fi

  if ! command -v git &>/dev/null; then
    echo "  ✗ Git is not installed"
    missing=1
  else
    echo "  ✓ Git found: $(git --version)"
  fi

  if [ "$missing" -eq 1 ]; then
    echo ""
    echo "Please install the missing prerequisites and try again."
    exit 1
  fi
}

clone_repo() {
  echo ""
  echo "Cloning repository..."
  rm -rf "${SCRIPT_DIR}/deploy"
  git clone "${REPO_URL}" "${SCRIPT_DIR}/deploy"
  cd "${SCRIPT_DIR}/deploy"
  echo "  ✓ Repository cloned"
}

configure_env() {
  echo ""
  echo "Configuring environment..."

  local pocketbase_admin_email="admin@${DOMAIN}"
  local pocketbase_admin_password
  pocketbase_admin_password=$(openssl rand -base64 24 2>/dev/null || python3 -c "import secrets,base64; print(base64.b64encode(secrets.token_bytes(18)).decode())")

  cat > .env <<EOF
DOMAIN=${DOMAIN}
DEPLOY_TYPE=${DEPLOY_TYPE}
BASE_PATH=${BASE_PATH}
NEXT_PUBLIC_POCKETBASE_URL=http://pocketbase:8090
POCKETBASE_ADMIN_EMAIL=${pocketbase_admin_email}
POCKETBASE_ADMIN_PASSWORD=${pocketbase_admin_password}
EOF

  echo "  ✓ .env file created"
  echo "  ✓ Admin email: ${pocketbase_admin_email}"
  echo "  ✓ Admin password: ${pocketbase_admin_password}"
}

configure_next_config() {
  echo ""
  echo "Configuring Next.js..."

  if [ "${DEPLOY_TYPE}" = "subdirectory" ]; then
    sed -i "s#process.env.BASE_PATH ||\"\"#'${BASE_PATH}'#" next.config.ts
    sed -i "s|__DOMAIN__|${DOMAIN}|g" next.config.ts
    echo "  ✓ basePath set to ${BASE_PATH} in next.config.ts"
  else
    sed -i "s#process.env.BASE_PATH ||\"\"#''#" next.config.ts
    sed -i "s|__DOMAIN__|${DOMAIN}|g" next.config.ts
    echo "  ✓ basePath set to (empty) in next.config.ts"
  fi
}

setup_nginx() {
  echo ""
  echo "Setting up Nginx configuration..."

  mkdir -p nginx/conf.d
  cp "${SCRIPT_DIR}/nginx/conf.d/orchies.click.conf" nginx/conf.d/orchies.click.conf

  sed -i "s|__DOMAIN__|${DOMAIN}|g" nginx/conf.d/orchies.click.conf
  sed -i "s|__BASE_PATH__|${BASE_PATH}|g" nginx/conf.d/orchies.click.conf

  if [ "${DEPLOY_TYPE}" = "subdirectory" ]; then
    sed -i "s|__FRONTEND_LOCATION__|${BASE_PATH}/|g" nginx/conf.d/orchies.click.conf
    sed -i "s|__PB_LOCATION__|${BASE_PATH}/pb/|g" nginx/conf.d/orchies.click.conf
    sed -i "s|__API_LOCATION__|${BASE_PATH}/api/|g" nginx/conf.d/orchies.click.conf
  else
    sed -i "s|__FRONTEND_LOCATION__|/|g" nginx/conf.d/orchies.click.conf
    sed -i "s|__PB_LOCATION__|/pb/|g" nginx/conf.d/orchies.click.conf
    sed -i "s|__API_LOCATION__|/api/|g" nginx/conf.d/orchies.click.conf
  fi

  echo "  ✓ Nginx configuration created at nginx/conf.d/orchies.click.conf"
}

start_services() {
  echo ""
  echo "Starting services..."
  docker compose -f docker-compose.prod.yml up -d --build
  echo "  ✓ Services started"
}

wait_for_pocketbase() {
  echo ""
  echo "Waiting for PocketBase to be ready..."
  local max_retries=60
  local retry=0

  while [ $retry -lt $max_retries ]; do
    if curl -sf http://127.0.0.1:8090/api/health &>/dev/null; then
      echo "  ✓ PocketBase is ready!"
      return 0
    fi
    retry=$((retry + 1))
    printf "."
    sleep 2
  done

  echo ""
  echo "ERROR: PocketBase did not become ready in time."
  exit 1
}

init_pocketbase() {
  echo ""
  echo "Initializing PocketBase collections and sample data..."
  docker compose -f docker-compose.prod.yml exec -T pocketbase bun run pb/init.mjs
  echo "  ✓ PocketBase initialized"
}

print_summary() {
  echo ""
  echo "============================================"
  echo "  Deployment Complete!"
  echo "============================================"
  echo ""
  echo "Website : https://${DOMAIN}${BASE_PATH}"
  echo "Admin   : https://${DOMAIN}/pb/_/"
  echo ""
  echo "PocketBase Credentials:"
  echo "  Email    : admin@${DOMAIN}"
  echo "  Password : (see .env file)"
  echo ""
  echo "Commands:"
  echo "  View logs   : docker compose -f docker-compose.prod.yml logs -f"
  echo "  Stop        : docker compose -f docker-compose.prod.yml down"
  echo "  Uninstall   : ${SCRIPT_DIR}/uninstall.sh"
  echo ""
}

main() {
  prerequisites
  clone_repo
  configure_env
  configure_next_config
  setup_nginx
  start_services
  wait_for_pocketbase
  init_pocketbase
  print_summary
}

main "$@"