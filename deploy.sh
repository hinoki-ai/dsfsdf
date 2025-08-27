#!/bin/bash

# Liquor Store Deployment Script
# This script handles production deployment with health checks

set -e  # Exit on any error

echo "🚀 Starting Liquor Store Deployment..."

# Configuration
CONTAINER_NAME="liquor-aramac-app"
IMAGE_NAME="ghcr.io/kuromatsu/liquor:latest"
HEALTH_URL="http://localhost:3000/api/health"
MAX_RETRIES=30
RETRY_INTERVAL=10

# Function to check if container is healthy
check_health() {
    echo "🏥 Checking application health..."
    for i in $(seq 1 $MAX_RETRIES); do
        if curl -f "$HEALTH_URL" &>/dev/null; then
            echo "✅ Application is healthy!"
            return 0
        fi
        echo "⏳ Waiting for application to start ($i/$MAX_RETRIES)..."
        sleep $RETRY_INTERVAL
    done
    echo "❌ Health check failed after $MAX_RETRIES attempts"
    return 1
}

# Function to rollback on failure
rollback() {
    echo "🔄 Rolling back to previous version..."
    if docker ps -a --filter "name=${CONTAINER_NAME}_backup" --format "{{.Names}}" | grep -q "${CONTAINER_NAME}_backup"; then
        docker stop $CONTAINER_NAME 2>/dev/null || true
        docker rm $CONTAINER_NAME 2>/dev/null || true
        docker rename "${CONTAINER_NAME}_backup" $CONTAINER_NAME
        docker start $CONTAINER_NAME
        echo "✅ Rollback completed"
    else
        echo "⚠️ No backup container found for rollback"
    fi
}

# Main deployment process
main() {
    echo "📋 Pre-deployment checks..."
    
    # Check if Docker is running
    if ! docker info &>/dev/null; then
        echo "❌ Docker is not running or accessible"
        exit 1
    fi

    # Check if required environment variables are set
    if [ -z "$NEXT_PUBLIC_CONVEX_URL" ]; then
        echo "⚠️ Warning: NEXT_PUBLIC_CONVEX_URL not set in environment"
    fi

    echo "🛑 Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down --remove-orphans || true

    # Backup existing container if it exists
    if docker ps -a --filter "name=$CONTAINER_NAME" --format "{{.Names}}" | grep -q "$CONTAINER_NAME"; then
        echo "💾 Creating backup of current container..."
        docker stop $CONTAINER_NAME 2>/dev/null || true
        docker rename $CONTAINER_NAME "${CONTAINER_NAME}_backup" 2>/dev/null || true
    fi

    echo "🏗️ Building and starting new containers..."
    if ! docker-compose -f docker-compose.prod.yml up -d --build; then
        echo "❌ Failed to start containers"
        rollback
        exit 1
    fi

    echo "⏳ Waiting for containers to be ready..."
    sleep 20

    # Health check
    if ! check_health; then
        echo "❌ Deployment failed - health check unsuccessful"
        rollback
        exit 1
    fi

    # Cleanup backup container on successful deployment
    if docker ps -a --filter "name=${CONTAINER_NAME}_backup" --format "{{.Names}}" | grep -q "${CONTAINER_NAME}_backup"; then
        echo "🗑️ Cleaning up backup container..."
        docker rm "${CONTAINER_NAME}_backup" 2>/dev/null || true
    fi

    # Final validation
    echo "🧪 Running final validation tests..."
    
    # Test key endpoints
    TEST_URLS=(
        "http://localhost:3000/api/health"
        "http://localhost:3000/"
        "http://localhost:3000/es"
    )

    for url in "${TEST_URLS[@]}"; do
        if ! curl -f -s "$url" > /dev/null; then
            echo "⚠️ Warning: $url is not responding correctly"
        else
            echo "✅ $url is responding"
        fi
    done

    echo "🎉 Deployment completed successfully!"
    echo "📊 Application Status:"
    docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo "🔗 Application URL: https://liquor.aramac.dev"
    echo "🏥 Health Check: $HEALTH_URL"
}

# Trap to ensure cleanup on script exit
trap 'echo "🛑 Deployment script interrupted"' INT TERM

# Execute main function
main "$@"
