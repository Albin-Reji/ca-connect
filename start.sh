#!/bin/bash

# CAConnect Application Startup Script
# This script starts all services in the correct order

set -e

echo "🚀 Starting CAConnect Application..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# Load environment variables
source .env

echo "📊 Starting PostgreSQL..."
# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

echo "🔍 Starting Eureka Service..."
cd eureka
mvn spring-boot:run > ../logs/eureka.log 2>&1 &
EUREKA_PID=$!
echo "Eureka PID: $EUREKA_PID"
cd ..

# Wait for Eureka to start
echo "⏳ Waiting for Eureka to start..."
sleep 30

echo "👤 Starting User Service..."
cd user-service
mvn spring-boot:run > ../logs/user-service.log 2>&1 &
USER_PID=$!
echo "User Service PID: $USER_PID"
cd ..

sleep 15

echo "📍 Starting Location Service..."
cd location-service
mvn spring-boot:run > ../logs/location-service.log 2>&1 &
LOCATION_PID=$!
echo "Location Service PID: $LOCATION_PID"
cd ..

sleep 15

echo "👨 Starting Profile Service..."
cd profile-service
mvn spring-boot:run > ../logs/profile-service.log 2>&1 &
PROFILE_PID=$!
echo "Profile Service PID: $PROFILE_PID"
cd ..

sleep 15

echo "🌐 Starting Gateway..."
cd gateway
mvn spring-boot:run > ../logs/gateway.log 2>&1 &
GATEWAY_PID=$!
echo "Gateway PID: $GATEWAY_PID"
cd ..

sleep 20

echo "⚛️ Starting Frontend..."
cd frontend/caconnect-ui
npm run dev > ../../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ../..

# Create logs directory if it doesn't exist
mkdir -p logs

# Save PIDs to file for cleanup
echo "EUREKA_PID=$EUREKA_PID" > logs/pids.sh
echo "USER_PID=$USER_PID" >> logs/pids.sh
echo "LOCATION_PID=$LOCATION_PID" >> logs/pids.sh
echo "PROFILE_PID=$PROFILE_PID" >> logs/pids.sh
echo "GATEWAY_PID=$GATEWAY_PID" >> logs/pids.sh
echo "FRONTEND_PID=$FRONTEND_PID" >> logs/pids.sh

echo ""
echo "✅ CAConnect Application Started!"
echo ""
echo "📋 Service URLs:"
echo "   🌐 Frontend:        http://localhost:5173"
echo "   🚪 Gateway:         http://localhost:8080"
echo "   👤 User Service:     http://localhost:8081"
echo "   📍 Location Service: http://localhost:8082"
echo "   👨 Profile Service:  http://localhost:8083"
echo "   🔍 Eureka:          http://localhost:8761"
echo ""
echo "📊 Health Checks:"
echo "   Gateway:    curl http://localhost:8080/actuator/health"
echo "   User Svc:   curl http://localhost:8081/actuator/health"
echo "   Location:    curl http://localhost:8082/actuator/health"
echo "   Profile:     curl http://localhost:8083/actuator/health"
echo ""
echo "📝 Logs are available in the logs/ directory"
echo "💡 Run './stop.sh' to stop all services"
echo ""
echo "Press Ctrl+C to stop monitoring (services will continue running)"

# Monitor services
trap 'echo "🛑 Stopping monitoring..."; exit 0' INT

while true; do
    sleep 60
    echo "📈 $(date): All services running..."
done
