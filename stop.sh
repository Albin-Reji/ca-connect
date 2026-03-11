#!/bin/bash

# CAConnect Application Stop Script
# This script stops all running services

set -e

echo "🛑 Stopping CAConnect Application..."

# Load PIDs if file exists
if [ -f logs/pids.sh ]; then
    source logs/pids.sh
    
    echo "Stopping services..."
    
    if [ ! -z "$FRONTEND_PID" ]; then
        echo "⚛️ Stopping Frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$GATEWAY_PID" ]; then
        echo "🌐 Stopping Gateway (PID: $GATEWAY_PID)..."
        kill $GATEWAY_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$PROFILE_PID" ]; then
        echo "👨 Stopping Profile Service (PID: $PROFILE_PID)..."
        kill $PROFILE_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$LOCATION_PID" ]; then
        echo "📍 Stopping Location Service (PID: $LOCATION_PID)..."
        kill $LOCATION_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$USER_PID" ]; then
        echo "👤 Stopping User Service (PID: $USER_PID)..."
        kill $USER_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$EUREKA_PID" ]; then
        echo "🔍 Stopping Eureka (PID: $EUREKA_PID)..."
        kill $EUREKA_PID 2>/dev/null || true
    fi
    
    # Clean up PID file
    rm logs/pids.sh
    
    echo "✅ All services stopped!"
else
    echo "⚠️ No PID file found. Attempting to kill by process name..."
    
    # Kill by process name as fallback
    pkill -f "java.*gateway" || true
    pkill -f "java.*user-service" || true
    pkill -f "java.*location-service" || true
    pkill -f "java.*profile-service" || true
    pkill -f "java.*eureka" || true
    pkill -f "node.*vite" || true
    
    echo "✅ Attempted to stop all services!"
fi

echo "🧹 Cleaning up any remaining processes..."
pkill -f "mvn.*spring-boot:run" || true

echo "📝 Application stopped. Check logs/ directory for logs."
