-- PostgreSQL extensions for CAConnect database
-- Enable earth distance extension for location-based queries

-- Create extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS earthdistance;

-- Enable cube extension (required by earthdistance)
CREATE EXTENSION IF NOT EXISTS cube;

-- Create the ca_connect_db if it doesn't exist
-- This should be run as postgres user
-- CREATE DATABASE IF NOT EXISTS ca_connect_db;

-- Grant privileges to the postgres user
-- GRANT ALL PRIVILEGES ON DATABASE ca_connect_db TO postgres;

-- Create custom function for calculating distance between two points
-- This is a fallback if earthdistance is not available
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DOUBLE PRECISION, 
    lon1 DOUBLE PRECISION, 
    lat2 DOUBLE PRECISION, 
    lon2 DOUBLE PRECISION
) RETURNS DOUBLE PRECISION AS $$
BEGIN
    RETURN 6371 * acos(
        cos(radians(lat1)) * cos(radians(lat2)) * 
        cos(radians(lon2) - radians(lon1)) + 
        sin(radians(lat1)) * sin(radians(lat2))
    );
END;
$$ LANGUAGE plpgsql;

-- Add indexes for better performance
-- These will be created after tables exist
-- CREATE INDEX IF NOT EXISTS idx_location_user_id ON location(user_id);
-- CREATE INDEX IF NOT EXISTS idx_user_profile_user_id ON user_profile(user_id);
-- CREATE INDEX IF NOT EXISTS idx_user_profile_exam_stage ON user_profile(exam_stage);
-- CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
-- CREATE INDEX IF NOT EXISTS idx_users_keycloak_id ON users(keycloak_id);
