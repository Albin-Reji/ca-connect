# ── Build stage ──
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B --no-transfer-progress

# Build the application
COPY src ./src
RUN mvn clean package -DskipTests --no-transfer-progress

# ── Runtime stage ──
FROM eclipse-temurin:21-jre-alpine AS run
WORKDIR /app

# Install curl for health checks & add non-root user
RUN apk add --no-cache curl && \
    addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app/target/*.jar app.jar
RUN chown appuser:appgroup app.jar

USER appuser
EXPOSE 8084

HEALTHCHECK --interval=15s --timeout=5s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8084/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
