FROM openjdk:21-jre-slim

WORKDIR /app

COPY target/location-service-*.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]
