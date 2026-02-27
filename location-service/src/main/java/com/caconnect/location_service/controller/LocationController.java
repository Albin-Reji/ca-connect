package com.caconnect.location_service.controller;

import com.caconnect.location_service.dto.LatLonLimitRequest;
import com.caconnect.location_service.dto.LocationRequest;
import com.caconnect.location_service.model.Location;
import com.caconnect.location_service.model.NearestExamStageRequest;
import com.caconnect.location_service.service.LocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @PostMapping("/")
    public Mono<ResponseEntity<Location>> saveLocationToDB(@RequestBody LocationRequest locationRequest) {
        return locationService.saveLocationToDB(locationRequest)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/users/{userId}/location")
    public Mono<ResponseEntity<Location>> getLocationByUserId(@PathVariable String userId) {
        return locationService.getLocationByUserId(userId)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/{locationId}")
    public Mono<ResponseEntity<Location>> getLocationByLocationId(@PathVariable String locationId) {
        return locationService.getLocationByLocationId(locationId)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/nearest")
    public Mono<ResponseEntity<List<Location>>> getNearestLocation(@ModelAttribute LatLonLimitRequest request) {
        return locationService.getNearestLocation(request)
                .map(ResponseEntity::ok);
    }
    @GetMapping("/nearestby/examstage")
    public ResponseEntity<List<Location>> getNearestLocationByExamStage(@ModelAttribute NearestExamStageRequest request){
        return ResponseEntity.ok(locationService.getNearestLocationByExamStage(request));
    }
}
