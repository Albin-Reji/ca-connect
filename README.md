# CAConnect - Chartered Accountant Networking Platform

A full-stack microservices application that connects CA students with nearby peers preparing for the same exam stages.

## 🏗️ Architecture

### Frontend
- **React 19** with Vite
- **Material UI** for components
- **Redux Toolkit** for state management
- **OAuth2 PKCE** with Keycloak for authentication
- **Axios** for API communication

### Backend Services
- **API Gateway** (Port 8080) - Spring Cloud Gateway with JWT validation
- **User Service** (Port 8081) - User management and authentication
- **Location Service** (Port 8082) - Geocoding and location-based search
- **Profile Service** (Port 8083) - User profiles and peer matching
- **Eureka Discovery** (Port 8761) - Service discovery

### Infrastructure
- **PostgreSQL** - Primary database
- **Keycloak** - Authentication server (localhost:8090)
- **OpenCage API** - Geocoding service
- **Docker Compose** - Container orchestration

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Set your PostgreSQL password and OpenCage API key
```

### 2. Database Setup
```bash
# Create database and extensions
psql -U postgres -c "CREATE DATABASE ca_connect_db;"
psql -U postgres -d ca_connect_db -f database/init.sql
```

### 3. Backend Services

#### Option A: Docker Compose (Recommended)
```bash
# Build and start all services
docker-compose up --build

# Services will be available at:
# Gateway: http://localhost:8080
# Frontend: http://localhost:3000
# Eureka: http://localhost:8761
```

#### Option B: Manual Start
```bash
# Start Eureka (in separate terminal)
cd eureka && mvn spring-boot:run

# Start User Service (in separate terminal)
cd user-service && mvn spring-boot:run

# Start Location Service (in separate terminal)
cd location-service && mvn spring-boot:run

# Start Profile Service (in separate terminal)
cd profile-service && mvn spring-boot:run

# Start Gateway (in separate terminal)
cd gateway && mvn spring-boot:run
```

### 4. Frontend
```bash
cd frontend/caconnect-ui
npm install
npm run dev

# Frontend will be available at http://localhost:5173
```

## 📋 API Endpoints

### Gateway Routes
- `/api/users/**` → User Service
- `/api/profiles/**` → Profile Service  
- `/api/locations/**` → Location Service

### Key Endpoints

#### User Service
- `POST /api/users/register` - Register new user
- `GET /api/users/{userId}` - Get user by ID
- `GET /api/users/validate/{keyCloakId}` - Validate user exists

#### Profile Service
- `POST /api/profiles/` - Create user profile
- `GET /api/profiles/users/{userId}` - Get user profile
- `GET /api/profiles/users/{userId}/nearest/{limit}` - Find nearby peers

#### Location Service
- `POST /api/locations/` - Save location
- `GET /api/locations/users/{userId}/location` - Get user location
- `PUT /api/locations/users/{userId}/location` - Update location
- `DELETE /api/locations/users/{userId}/location` - Delete location

## 🔐 Authentication Flow

1. **User Registration** via Keycloak
2. **JWT Token** issued after successful login
3. **Token Validation** at Gateway level
4. **Service-to-Service** communication with validated tokens

## 🌍 Location Services

### OpenCage Integration
- Address geocoding to latitude/longitude
- Location-based peer matching
- Haversine distance calculation

### Distance Calculation
Using PostgreSQL earthdistance extension for efficient location queries:
```sql
-- Find nearest locations
SELECT * FROM location
ORDER BY earth_distance(
    ll_to_earth(latitude, longitude),
    ll_to_earth(:lat, :lon)
)
LIMIT :limit
```

## 🛠️ Development

### Environment Variables
```bash
# Required
DB_PASSWORD=your_postgres_password
GEO_CAGE_API_KEY=your_opencage_api_key

# Optional
VITE_API_BASE_URL=http://localhost:8080
KEYCLOAK_URL=http://localhost:8090
```

### Database Schema
- **users** - User authentication data
- **user_profile** - Extended profile information
- **location** - Geographic coordinates

### Service Communication
- **Eureka Discovery** for service registration
- **WebClient** for inter-service communication
- **Load Balancing** through Gateway

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
mvn test

# Run specific service tests
cd user-service && mvn test
```

### Frontend Tests
```bash
cd frontend/caconnect-ui
npm test
```

## 📊 Monitoring

### Service Health
- Eureka Dashboard: http://localhost:8761
- Gateway Health: http://localhost:8080/actuator/health
- Service Health: http://localhost:808X/actuator/health

### Logs
```bash
# Docker logs
docker-compose logs -f [service-name]

# Manual service logs
# Check console output of each service
```

## 🚀 Production Deployment

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Configuration
- Use `application-prod.yaml` for production settings
- Configure external database connections
- Set up SSL certificates
- Configure production Keycloak

## 🔧 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Check database exists
psql -U postgres -l
```

#### Service Registration
```bash
# Check Eureka dashboard
curl http://localhost:8761/eureka/apps

# Verify service health
curl http://localhost:8081/actuator/health
```

#### Frontend Build
```bash
# Clear node modules
rm -rf node_modules package-lock.json
npm install
```

### Port Conflicts
Default ports can be changed in `.env`:
- Gateway: 8080
- User Service: 8081
- Location Service: 8082
- Profile Service: 8083
- Eureka: 8761
- Frontend: 3000/5173

## 📝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For issues and questions:
- Create GitHub issue
- Check troubleshooting section
- Review service logs
