@echo off
echo Testing Location Service Startup...
echo.

echo Setting environment variables...
set DB_PASSWORD=postgres123
set GEO_CAGE_API_KEY=demo_key_for_testing

echo Starting Location Service...
cd location-service
mvn spring-boot:run

echo.
echo Location service test completed.
