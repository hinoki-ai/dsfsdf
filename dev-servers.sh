#!/bin/bash

# Simple script to run both Convex and Next.js servers for local development
# Usage: ./dev-servers.sh

echo "🚀 Starting Liquor ARAMAC development servers..."

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill 0
}

# Set trap to cleanup on script exit
trap cleanup EXIT

# Start Convex server in background
echo "📡 Starting Convex backend server..."
npm run convex:dev &
CONVEX_PID=$!

# Wait a moment for Convex to initialize
sleep 3

# Start Next.js development server
echo "🌐 Starting Next.js frontend server..."
npm run dev:port3000 &
NEXTJS_PID=$!

echo ""
echo "✅ Both servers started!"
echo "   - Next.js: http://localhost:3000"
echo "   - Convex: http://localhost:3210 (dashboard)"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait