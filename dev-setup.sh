#!/bin/bash
# Development setup script for Liquor ARAMAC

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check Node.js version
check_node() {
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 20.18.1 or higher."
        exit 1
    fi
    
    local node_version=$(node -v | sed 's/v//')
    local required_version="20.18.1"
    
    if [ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" != "$required_version" ]; then
        log_error "Node.js version $node_version is too old. Please install version $required_version or higher."
        exit 1
    fi
    
    log_success "Node.js version $node_version is compatible"
}

# Setup environment
setup_env() {
    if [ ! -f .env.local ]; then
        log_info "Creating .env.local from env.example..."
        cp env.example .env.local
        log_warning "Please update .env.local with your actual configuration values"
    else
        log_info ".env.local already exists"
    fi
}

# Install dependencies
install_deps() {
    log_info "Installing dependencies..."
    npm ci
    log_success "Dependencies installed"
}

# Setup Convex
setup_convex() {
    log_info "Setting up Convex development environment..."
    
    # Check if Convex is configured
    if [ -z "$NEXT_PUBLIC_CONVEX_URL" ]; then
        log_warning "Convex URL not configured in environment"
        log_info "Run 'npx convex dev' to set up Convex"
    else
        log_info "Starting Convex development server..."
        npm run convex:dev &
        CONVEX_PID=$!
        log_info "Convex development server started (PID: $CONVEX_PID)"
    fi
}

# Build and test
build_test() {
    log_info "Running build test..."
    npm run build
    log_success "Build completed successfully"
    
    log_info "Running linter..."
    npm run lint
    log_success "Linting passed"
    
    log_info "Running TypeScript check..."
    npx tsc --noEmit
    log_success "TypeScript check passed"
}

# Start development server
start_dev() {
    log_info "Starting development server..."
    log_info "The application will be available at http://localhost:3000"
    npm run dev
}

main() {
    log_info "🚀 Setting up Liquor ARAMAC development environment..."
    
    check_node
    setup_env
    install_deps
    build_test
    
    # Ask user if they want to start the dev server
    echo
    read -p "Start development server now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_dev
    else
        log_info "Setup complete! Run 'npm run dev' to start the development server."
        log_info "Don't forget to configure your .env.local file with proper values."
    fi
}

# Handle command line arguments
case "${1:-}" in
    --env-only)
        setup_env
        ;;
    --build-only)
        build_test
        ;;
    --convex-only)
        setup_convex
        ;;
    *)
        main
        ;;
esac