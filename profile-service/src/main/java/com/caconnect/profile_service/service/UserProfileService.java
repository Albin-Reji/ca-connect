package com.caconnect.profile_service.service;

import com.caconnect.profile_service.dto.LatitudeLongitude;
import com.caconnect.profile_service.dto.Location;
import com.caconnect.profile_service.dto.LocationRequest;
import com.caconnect.profile_service.dto.UserProfileRequest;
import com.caconnect.profile_service.model.Address;
import com.caconnect.profile_service.model.UserProfile;
import com.caconnect.profile_service.repository.UserProfileRepository;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@Slf4j
@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final WebClient geoWebClient;
    private final WebClient locationWebClient;

    @Value("${geoCage.api.key}")
    private String geoCageApiKey;

    public UserProfileService(
            @Qualifier("geoWebClient") WebClient geoWebClient,
            @Qualifier("locationWebClient") WebClient locationWebClient,
            UserProfileRepository userProfileRepository
    ) {

        this.geoWebClient = geoWebClient;
        this.locationWebClient = locationWebClient;
        this.userProfileRepository=userProfileRepository;
    }

    public Mono<UserProfile> saveUserProfile(UserProfileRequest request) {
        return getLatLong(request.getAddress())
                .flatMap(latLng -> saveLocationToDB(latLng, request.getKeyCloakId()))
                .flatMap(locationResponse -> {
                    UserProfile userProfile = UserProfile.builder()
                            .keyCloakId(request.getKeyCloakId())
                            .fullName(request.getFullName())
                            .age(request.getAge())
                            .address(request.getAddress())
                            .email(request.getEmail())
                            .locationId(locationResponse.getLocationId()) // Using ID from location-service
                            .phoneNumber(request.getPhoneNumber())
                            .examStage(request.getExamStage())
                            .build();

                    // Move the blocking JPA save to the dedicated thread pool
                    return Mono.fromCallable(() -> userProfileRepository.save(userProfile))
                            .subscribeOn(Schedulers.boundedElastic());
                });
    }

    public UserProfile getUserProfile(String keyCloakId) {
        return userProfileRepository.findByKeyCloakId(keyCloakId);
    }

    public Mono<Location> saveLocationToDB(LatitudeLongitude latitudeLongitude, String keyCloakId){
        log.info("Save Location to DB: "+latitudeLongitude.toString()+ " keyCloakId "+keyCloakId);
        LocationRequest request=LocationRequest.builder()
                .keyCloakId(keyCloakId)
                .latitude(latitudeLongitude.getLat())
                .longitude(latitudeLongitude.getLng())
                .build();

        return locationWebClient.post()
                .uri("/api/locations")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Location.class);

    }
//    return lat long of streetAddress, city, state, country
    public Mono<LatitudeLongitude> getLatLong(Address address){
        String addressStr= address.getStreetAddress() + " " +
                        address.getCity() + " " +
                        address.getState() + " " +
                        address.getCountry() + " ";

        return geoWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/geocode/v1/json")
                        .queryParam("q", addressStr)
                        .queryParam("key",geoCageApiKey )
                        .build()
                )
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(json->{
                    JsonNode results = json.path("results");
                    log.info("geometry Cordinates : "+results.toString());
                    JsonNode geometry = results.get(0).path("geometry");

                    double lat = geometry.path("lat").asDouble();
                    double lng = geometry.path("lng").asDouble();

                    return LatitudeLongitude.builder()
                            .lat(lat)
                            .lng(lng)
                            .build();
                });
    }


    public Mono<List<Location>> getNearestUsersOfSameExamStage(
            String keyCloakId,
            Integer limit
    ) {

        return Mono.fromCallable(() ->
                        userProfileRepository.findByKeyCloakId(keyCloakId)
                )
                .flatMap(currUserProfile ->

                        locationWebClient.get()
                                .uri("/api/locations/users/{keyCloakId}/location", keyCloakId)
                                .retrieve()
                                .bodyToMono(Location.class)

                                .flatMap(currentUserLocation -> {

                                    List<UserProfile> stageProfiles =
                                            userProfileRepository.findAllByExamStage(
                                                    currUserProfile.getExamStage()
                                            );
                                    log.info("STAGED USERPROFILE: {}",stageProfiles);
                                    List<String> stageKeyCloakIds = stageProfiles.stream()
                                            .map(UserProfile::getKeyCloakId)
                                            .filter(id -> !id.equals(keyCloakId))
                                            .toList();
                                    log.info("KeyCloakId OF SAME EXAM STAGE: {}",stageKeyCloakIds);

                                    return locationWebClient.get()
                                            .uri(uriBuilder -> uriBuilder
                                                    .path("/api/locations/nearestby/examstage")
                                                    .queryParam("latitude", currentUserLocation.getLatitude())
                                                    .queryParam("longitude", currentUserLocation.getLongitude())
                                                    .queryParam("limit", limit)
                                                    .queryParam("keyCloakIds", stageKeyCloakIds)
                                                    .build())
                                            .retrieve()
                                            .bodyToFlux(Location.class)
                                            .collectList();
                                })
                );
    }

    public Boolean isUserWithKeyCloakIdExist(String keyCloakId) {
        return userProfileRepository.existsByKeyCloakId(keyCloakId);
    }
}
