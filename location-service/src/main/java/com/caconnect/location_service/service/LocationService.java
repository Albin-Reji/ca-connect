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

    public Location getLocationByUserId(String userId) {
        return locationRepository.getByUserId(userId);
    }

    public Location saveLocationToDB(LocationRequest locationRequest) {
        /* check the user exist in user DB*/
        Boolean isUserExistByUserId=isUserExist(locationRequest.getUserId()).block();

        if(Boolean.FALSE.equals(isUserExistByUserId)){
            throw new UserNotFoundException("UserId is Invalid :: InvalidLocationIdException");
        }
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
        return locationRepository.findByLocationId(locationId)
                .orElseThrow(()->
                        new InvalidLocationIdException("Location Id Not Found....."));
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
