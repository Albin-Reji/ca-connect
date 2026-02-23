package com.caconnect.location_service.controller;

import com.caconnect.location_service.dto.LatLonLimitRequest;
import com.caconnect.location_service.dto.LocationRequest;
import com.caconnect.location_service.model.Location;
import com.caconnect.location_service.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @PostMapping("/")
    public ResponseEntity<Location> saveLocationToDB(@RequestBody LocationRequest locationRequest){
        return ResponseEntity.ok(
                locationService.saveLocationToDB(locationRequest)
        );
    }

    @GetMapping("/users/{userId}/location")
    public ResponseEntity<Location> getLocationByUserId(@PathVariable("userId") String userId){
        return ResponseEntity.ok(
            locationService.getLocationByUserId(userId)
        );
    }

    @GetMapping("/nearest")
    public ResponseEntity<List<Location>> getNearestLocation(@ModelAttribute LatLonLimitRequest request){
        return ResponseEntity.ok(locationService.getNearestLocation(request));
    }
}
