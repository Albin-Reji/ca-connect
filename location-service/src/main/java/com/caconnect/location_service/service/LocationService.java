package com.caconnect.location_service.service;

import com.caconnect.location_service.dto.LatLonLimitRequest;
import com.caconnect.location_service.dto.LocationRequest;
import com.caconnect.location_service.model.Location;
import com.caconnect.location_service.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;

    public Location getLocationByUserId(String userId) {
        return locationRepository.getByUserId(userId);
    }

    public Location saveLocationToDB(LocationRequest locationRequest) {
        Location location=Location.builder()
                .userId(locationRequest.getUserId())
                .latitude(locationRequest.getLatitude())
                .longitude(locationRequest.getLongitude())
                .build();
        return locationRepository.save(location);
    }

    public List<Location> getNearestLocation(LatLonLimitRequest latLonLimitRequest) {
        return locationRepository.getNearestLocation(
                latLonLimitRequest.getLatitude(),
                latLonLimitRequest.getLongitude(),
                latLonLimitRequest.getLimit());
    }

    public Location getLocationByLocationId(String locationId) {
        return locationRepository.findByLocationId(locationId);
    }
}
