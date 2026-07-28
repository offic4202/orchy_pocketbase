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
    echo "  ✗ Docker is not installed — will install now"
    missing=1
  else
    echo "  ✓ Docker found: $(docker --version)"
  fi

  if ! command -v docker compose &>/dev/null; then
    echo "  ✗ Docker Compose is not installed — will install now"
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
    echo "Installing missing prerequisites..."
    install_docker
  fi
}

install_docker() {
  echo "Installing Docker and Docker Compose..."

  if ! command -v docker &>/dev/null; then
    echo "  Installing Docker..."
    apt-get update -qq
    apt-get install -y -qq ca-certificates curl gnupg
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list
    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io
    echo "  ✓ Docker installed"
  fi

  if ! command -v docker compose &>/dev/null; then
    echo "  Installing Docker Compose plugin..."
    apt-get install -y -qq docker-compose-plugin
    echo "  ✓ Docker Compose installed"
  fi

  echo ""
  echo "  Docker installation complete. You may need to log out and back in"
  echo "  for Docker group membership to take effect."
  echo "  Verify with: docker --version && docker compose version"
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

start_services() {
  echo ""
  echo "Starting services..."
  docker compose -f docker-compose.prod.yml up -d --build
  echo "  ✓ Services started"
}

print_npm_instructions() {
  echo ""
  echo "============================================"
  echo "  Nginx Proxy Manager (NPM) Setup"
  echo "============================================"
  echo ""
  echo "Add these proxy hosts in your NPM dashboard:"
  echo ""
  if [ "${DEPLOY_TYPE}" = "subdirectory" ]; then
    echo "  Proxy Host: ${DOMAIN}"
    echo "  Forward to: http://127.0.0.1:3000"
    echo "  Path: ${BASE_PATH}/"
    echo ""
    echo "  Proxy Host: ${DOMAIN}"
    echo "  Forward to: http://127.0.0.1:8090"
    echo "  Path: ${BASE_PATH}/pb/"
  else
    echo "  Proxy Host: ${DOMAIN}"
    echo "  Forward to: http://127.0.0.1:3000"
    echo "  Path: /"
    echo ""
    echo "  Proxy Host: ${DOMAIN}"
    echo "  Forward to: http://127.0.0.1:8090"
    echo "  Path: /pb/"
  fi
  echo ""
  echo "Enable SSL for both proxy hosts in NPM."
  echo ""
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
  start_services
  wait_for_pocketbase
  init_pocketbase
  print_npm_instructions
  print_summary
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