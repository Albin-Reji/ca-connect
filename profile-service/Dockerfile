FROM openjdk:21-jre-slim

WORKDIR /app

COPY target/profile-service-*.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]
