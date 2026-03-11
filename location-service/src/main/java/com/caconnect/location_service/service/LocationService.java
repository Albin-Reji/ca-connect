package com.caconnect.location_service.service;

import com.caconnect.location_service.dto.LatLonLimitRequest;
import com.caconnect.location_service.dto.LocationRequest;
import com.caconnect.location_service.dto.OpenCageResponse;
import com.caconnect.location_service.exception.InvalidLocationIdException;
import com.caconnect.location_service.exception.UserNotFoundException;
import com.caconnect.location_service.model.Location;
import com.caconnect.location_service.model.NearestExamStageRequest;
import com.caconnect.location_service.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@Service
public class LocationService {

    private final WebClient userServiceWebClient;
    private final WebClient openCageWebClient;
    private final LocationRepository locationRepository;

    @Value("${geoCage.api.key}")
    private String geoCageApiKey;

    public LocationService(LocationRepository locationRepository,
            @Qualifier("userServiceWebClient") WebClient userServiceWebClient,
            @Qualifier("openCageWebClient") WebClient openCageWebClient) {
        this.locationRepository = locationRepository;
        this.userServiceWebClient = userServiceWebClient;
        this.openCageWebClient = openCageWebClient;
    }

    public Mono<Location> saveLocationToDB(LocationRequest locationRequest) {
        return isUserExist(locationRequest.getUserId())
                .defaultIfEmpty(false)
                .onErrorReturn(false) // ← handles 404/500 from user-service too
                .flatMap(exists -> {
                    if (Boolean.FALSE.equals(exists)) {
                        return Mono.error(new UserNotFoundException("UserId is Invalid"));
                    }
                    Location location = Location.builder()
                            .userId(locationRequest.getUserId())
                            .latitude(locationRequest.getLatitude())
                            .longitude(locationRequest.getLongitude())
                            .build();
                    // JPA is blocking → offload to boundedElastic
                    return Mono.fromCallable(() -> locationRepository.save(location))
                            .subscribeOn(Schedulers.boundedElastic());
                });
    }

    public Mono<Location> getLocationByUserId(String userId) {
        return Mono.fromCallable(() -> locationRepository.getByUserId(userId))
                .subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<Location> getLocationByLocationId(String locationId) {
        return Mono.fromCallable(() -> locationRepository.findByLocationId(locationId)
                .orElseThrow(() -> new InvalidLocationIdException("Location Id Not Found")))
                .subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<List<Location>> getNearestLocation(LatLonLimitRequest req) {
        return Mono.fromCallable(
                () -> locationRepository.getNearestLocation(req.getLatitude(), req.getLongitude(), req.getLimit()))
                .subscribeOn(Schedulers.boundedElastic());
    }

    /*
     * checking whether user exist for this fucntion()
     * saveLocationToDB(LocationRequest locationRequest)
     */
    public Mono<Boolean> isUserExist(String userId) {
        return userServiceWebClient.get()
                .uri("/api/users/userId/{userId}", userId)
                .retrieve()
                .bodyToMono(Boolean.class);
    }

    public Mono<Location> updateLocationByUserId(String userId, LocationRequest locationRequest) {
        return isUserExist(userId)
                .defaultIfEmpty(false)
                .onErrorReturn(false)
                .flatMap(exists -> {
                    if (Boolean.FALSE.equals(exists)) {
                        return Mono.error(new UserNotFoundException("UserId is Invalid"));
                    }
                    return Mono.fromCallable(() -> locationRepository.getByUserId(userId))
                            .subscribeOn(Schedulers.boundedElastic())
                            .flatMap(existingLocation -> {
                                existingLocation.setLatitude(locationRequest.getLatitude());
                                existingLocation.setLongitude(locationRequest.getLongitude());
                                return Mono.fromCallable(() -> locationRepository.save(existingLocation))
                                        .subscribeOn(Schedulers.boundedElastic());
                            });
                });
    }

    public Mono<Void> deleteLocationByUserId(String userId) {
        return Mono.<Void>defer(() -> {
            Location location = locationRepository.getByUserId(userId);
            locationRepository.delete(location);
            return Mono.empty();
        }).subscribeOn(Schedulers.boundedElastic());
    }

    public List<Location> getNearestLocationByExamStage(NearestExamStageRequest request) {
        return locationRepository.findNearestByUserIds(
                request.getLatitude(),
                request.getLongitude(),
                request.getLimit(),
                request.getUserIds());
    }

    /**
     * Geocode address to coordinates using OpenCage API
     */
    public Mono<OpenCageResponse.Result> geocodeAddress(String address) {
        return openCageWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/geocode/v1/json")
                        .queryParam("q", address)
                        .queryParam("key", geoCageApiKey)
                        .queryParam("limit", 1)
                        .build())
                .retrieve()
                .bodyToMono(OpenCageResponse.class)
                .map(response -> {
                    if (response.getResults() == null || response.getResults().isEmpty()) {
                        throw new RuntimeException("No results found for address: " + address);
                    }
                    return response.getResults().get(0);
                });
    }

    /**
     * Save location with address geocoding
     */
    public Mono<Location> saveLocationWithAddress(String userId, String address) {
        return geocodeAddress(address)
                .flatMap(result -> {
                    Location location = Location.builder()
                            .userId(userId)
                            .latitude(result.getGeometry().getLat())
                            .longitude(result.getGeometry().getLng())
                            .build();
                    return Mono.fromCallable(() -> locationRepository.save(location))
                            .subscribeOn(Schedulers.boundedElastic());
                });
    }
}
