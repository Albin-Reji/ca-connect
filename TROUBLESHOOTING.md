# CAConnect Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. Location Service Startup Issues

#### Problem: `Could not resolve placeholder 'geoCage.api.key'`
**Cause**: Environment variable `GEO_CAGE_API_KEY` not set

**Solution**:
```bash
# Set environment variable (Windows)
set GEO_CAGE_API_KEY=your_actual_api_key

# Or create .env file
echo GEO_CAGE_API_KEY=your_actual_api_key > .env

# Or use the test script
test-location-service.bat
```

#### Problem: Database Connection Issues
**Cause**: PostgreSQL not running or incorrect credentials

**Solution**:
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Start PostgreSQL (Windows)
net start postgresql-x64-18

# Create database if missing
psql -U postgres -c "CREATE DATABASE ca_connect_db;"
```

### 2. Frontend Issues

#### Problem: CORS Errors
**Cause**: Frontend trying to connect to wrong port or CORS not configured

**Solution**:
```bash
# Check backend services are running
curl http://localhost:8080/actuator/health
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
curl http://localhost:8083/actuator/health

# Check frontend environment variables
cat frontend/caconnect-ui/.env
```

#### Problem: API Connection Errors
**Cause**: Frontend API URLs not pointing to gateway

**Solution**:
```bash
# Update frontend environment
echo VITE_API_BASE_URL=http://localhost:8080 > frontend/caconnect-ui/.env
```

### 3. Service Registration Issues

#### Problem: Services not registering with Eureka
**Cause**: Eureka not running or network issues

**Solution**:
```bash
# Check Eureka is running
curl http://localhost:8761

# Check service logs
tail -f logs/eureka.log
tail -f logs/user-service.log
tail -f logs/location-service.log
tail -f logs/profile-service.log
tail -f logs/gateway.log
```

### 4. Database Schema Issues

#### Problem: earthdistance extension not found
**Cause**: PostgreSQL extensions not installed

**Solution**:
```sql
-- Connect to database
psql -U postgres -d ca_connect_db

-- Install extensions
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;
```

### 5. Authentication Issues

#### Problem: JWT validation errors
**Cause**: Keycloak not running or wrong configuration

**Solution**:
```bash
# Check Keycloak is running
curl http://localhost:8090/realms/ca-connect/.well-known/openid_configuration

# Check Gateway JWT configuration
curl http://localhost:8080/actuator/health
```

## 🔧 Debugging Commands

### Check Service Status
```bash
# Check all services
netstat -an | findstr ":808"
netstat -an | findstr ":8761"

# Check Java processes
jps -l | grep -E "(gateway|user|location|profile|eureka)"
```

### Test API Endpoints
```bash
# Test Gateway
curl -X GET http://localhost:8080/actuator/health

# Test User Service
curl -X GET http://localhost:8081/actuator/health

# Test Location Service
curl -X GET http://localhost:8082/actuator/health

# Test Profile Service
curl -X GET http://localhost:8083/actuator/health

# Test Eureka
curl -X GET http://localhost:8761/eureka/apps
```

### Test Database Connection
```bash
# Test PostgreSQL connection
psql -h localhost -p 5432 -U postgres -d ca_connect_db -c "SELECT version();"

# Check tables
psql -h localhost -p 5432 -U postgres -d ca_connect_db -c "\dt"

# Check extensions
psql -h localhost -p 5432 -U postgres -d ca_connect_db -c "\dx"
```

## 📝 Log Analysis

### Service Logs Location
```
logs/
├── eureka.log
├── user-service.log
├── location-service.log
├── profile-service.log
└── gateway.log
```

### Common Log Patterns
- **BeanCreationException**: Environment variable issues
- **ConnectionRefused**: Service not running
- **404 Not Found**: API endpoint issues
- **CORS errors**: Frontend-backend communication issues

## 🚀 Quick Recovery Steps

### 1. Full Restart
```bash
# Stop all services
./stop.sh

# Clean up
rm -rf logs/
mkdir logs

# Start fresh
./start.sh
```

### 2. Database Reset
```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS ca_connect_db;"
psql -U postgres -c "CREATE DATABASE ca_connect_db;"
psql -U postgres -d ca_connect_db -f database/init.sql
```

### 3. Environment Reset
```bash
# Reset environment
cp .env.example .env
# Edit .env with correct values
```

## 📞 Getting Help

### Check System Requirements
- Java 21+ (`java -version`)
- Maven 3.8+ (`mvn -version`)
- Node.js 18+ (`node -version`)
- PostgreSQL 15+ (`psql --version`)
- Docker (optional) (`docker --version`)

### Common Port Conflicts
- 8080: Gateway
- 8081: User Service
- 8082: Location Service
- 8083: Profile Service
- 8761: Eureka
- 5432: PostgreSQL
- 8090: Keycloak

### Memory Requirements
- Minimum: 4GB RAM
- Recommended: 8GB RAM
- Each service: ~512MB

## 🎯 Production Checklist

### Before Deployment
- [ ] All environment variables set
- [ ] Database extensions installed
- [ ] SSL certificates configured
- [ ] Health checks passing
- [ ] Load balancer configured
- [ ] Monitoring setup
- [ ] Backup strategy defined

### After Deployment
- [ ] Services register with Eureka
- [ ] Health endpoints accessible
- [ ] Authentication flow working
- [ ] Database queries working
- [ ] Frontend connecting to backend
- [ ] Location services functional

---

## 📋 Issue Resolution Flow

1. **Check Environment Variables** - All required variables set?
2. **Check Database** - PostgreSQL running and accessible?
3. **Check Services** - All microservices starting?
4. **Check Network** - Ports available and accessible?
5. **Check Configuration** - YAML files correct?
6. **Check Dependencies** - All libraries and versions compatible?

## 🆘 Emergency Commands

### Force Kill All Services
```bash
# Windows
taskkill /F /IM java.exe
taskkill /F /IM node.exe

# Linux/Mac
pkill -f java
pkill -f node
```

### Clean Build
```bash
# Clean all Maven projects
find . -name "pom.xml" -execdir mvn clean \;

# Clean frontend
cd frontend/caconnect-ui && rm -rf node_modules package-lock.json
npm install
```

This troubleshooting guide should help resolve the most common issues encountered when running the CAConnect application.
