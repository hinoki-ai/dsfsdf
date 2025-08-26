#!/bin/bash
# Production deployment script for Liquor ARAMAC

set -e  # Exit on any error

# Configuration
PROJECT_NAME="liquor-aramac"
DOCKER_IMAGE="ghcr.io/kuromatsu/liquor:latest"
HEALTH_ENDPOINT="https://liquor.aramac.dev/api/health"
MAX_WAIT_TIME=120

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    # Check if docker-compose is installed
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check if environment file exists
    if [ ! -f .env.local ]; then
        log_warning ".env.local not found, using env.example"
        cp env.example .env.local
    fi
    
    log_success "Prerequisites check passed"
}

# Build the application
build_app() {
    log_info "Building Next.js application..."
    npm run build
    log_success "Application built successfully"
}

# Deploy Convex database
deploy_convex() {
    log_info "Deploying Convex database..."
    if npm run convex:deploy; then
        log_success "Convex database deployed successfully"
    else
        log_warning "Convex deployment failed or skipped"
    fi
}

# Deploy with Docker Compose
deploy_containers() {
    log_info "Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down || true
    
    log_info "Pulling latest images..."
    docker-compose -f docker-compose.prod.yml pull || log_warning "Pull failed, will build locally"
    
    log_info "Starting containers..."
    docker-compose -f docker-compose.prod.yml up -d --build
}

# Wait for services to be healthy
wait_for_health() {
    log_info "Waiting for services to be healthy..."
    
    local wait_time=0
    while [ $wait_time -lt $MAX_WAIT_TIME ]; do
        if curl -f -s "$HEALTH_ENDPOINT" > /dev/null 2>&1; then
            log_success "Health check passed"
            return 0
        fi
        
        sleep 5
        wait_time=$((wait_time + 5))
        log_info "Waiting... ($wait_time/${MAX_WAIT_TIME}s)"
    done
    
    log_error "Health check failed after ${MAX_WAIT_TIME} seconds"
    return 1
}

# Run smoke tests
run_smoke_tests() {
    log_info "Running smoke tests..."
    
    # Test main endpoints
    local endpoints=("/" "/productos" "/api/health")
    local base_url="https://liquor.aramac.dev"
    
    for endpoint in "${endpoints[@]}"; do
        local url="${base_url}${endpoint}"
        if curl -f -s "$url" > /dev/null 2>&1; then
            log_success "✓ $url"
        else
            log_error "✗ $url"
            return 1
        fi
    done
    
    log_success "All smoke tests passed"
}

# Rollback function
rollback() {
    log_warning "Rolling back deployment..."
    docker-compose -f docker-compose.prod.yml down
    # Add rollback logic here (e.g., restore previous image)
    log_info "Rollback completed"
}

# Main deployment function
main() {
    log_info "Starting deployment of $PROJECT_NAME..."
    
    # Trap errors and rollback
    trap 'log_error "Deployment failed! Rolling back..."; rollback; exit 1' ERR
    
    check_prerequisites
    build_app
    deploy_convex
    deploy_containers
    
    if wait_for_health; then
        if run_smoke_tests; then
            log_success "🚀 Deployment completed successfully!"
            log_info "Application is running at: https://liquor.aramac.dev"
        else
            log_error "Smoke tests failed"
            rollback
            exit 1
        fi
    else
        log_error "Health checks failed"
        rollback
        exit 1
    fi
}

# Handle command line arguments
case "${1:-}" in
    --check-health)
        wait_for_health
        ;;
    --smoke-test)
        run_smoke_tests
        ;;
    --rollback)
        rollback
        ;;
    *)
        main
        ;;
esac