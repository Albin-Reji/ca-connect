package com.caconnect.location_service.service;

import com.caconnect.location_service.dto.LatLonLimitRequest;
import com.caconnect.location_service.dto.LocationRequest;
import com.caconnect.location_service.exception.InvalidLocationIdException;
import com.caconnect.location_service.exception.UserNotFoundException;
import com.caconnect.location_service.model.Location;
import com.caconnect.location_service.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@Service
public class LocationService {

    private final WebClient userServiceWebClient;
    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository,
                           @Qualifier("userServiceWebClient") WebClient userServiceWebClient) {
        this.locationRepository = locationRepository;
        this.userServiceWebClient = userServiceWebClient;
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
        return Mono.fromCallable(() ->
                locationRepository.findByLocationId(locationId)
                        .orElseThrow(() -> new InvalidLocationIdException("Location Id Not Found"))
        ).subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<List<Location>> getNearestLocation(LatLonLimitRequest req) {
        return Mono.fromCallable(() ->
                locationRepository.getNearestLocation(req.getLatitude(), req.getLongitude(), req.getLimit())
        ).subscribeOn(Schedulers.boundedElastic());
    }
    /* checking whether user exist for this fucntion()
        saveLocationToDB(LocationRequest locationRequest)
    * */
    public Mono<Boolean> isUserExist(String userId){
        return userServiceWebClient.get()
                .uri("/api/users/userId/{userId}", userId)
                .retrieve()
                .bodyToMono(Boolean.class);
    }
}
