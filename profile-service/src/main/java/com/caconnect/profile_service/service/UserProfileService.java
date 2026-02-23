package com.caconnect.profile_service.service;

import com.caconnect.profile_service.dto.LatitudeLongitude;
import com.caconnect.profile_service.dto.Location;
import com.caconnect.profile_service.dto.LocationRequest;
import com.caconnect.profile_service.dto.UserProfileRequest;
import com.caconnect.profile_service.model.Address;
import com.caconnect.profile_service.model.UserProfile;
import com.caconnect.profile_service.repository.UserProfileRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

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
                .flatMap(latLng -> saveLocationToDB(latLng, request.getUserId()))
                .flatMap(locationResponse -> {
                    // 1. Build the entity
                    UserProfile userProfile = UserProfile.builder()
                            .userId(request.getUserId())
                            .fullName(request.getFullName())
                            .age(request.getAge())
                            .address(request.getAddress())
                            .email(request.getEmail())
                            .locationId(locationResponse.getLocationId())
                            .phoneNumber(request.getPhoneNumber())
                            .examStage(request.getExamStage())
                            .build();

                    // 2. Wrap the blocking JPA call in a Mono
                    // 3. Move execution to the boundedElastic scheduler
                    return Mono.fromCallable(() -> userProfileRepository.save(userProfile))
                            .subscribeOn(Schedulers.boundedElastic());
                });
    }

    public UserProfile getUserProfile(String userId) {
        return userProfileRepository.getByUserId(userId);
    }

    public Mono<Location> saveLocationToDB(LatitudeLongitude latitudeLongitude, String userId){
        LocationRequest request=LocationRequest.builder()
                .userId(userId)
                .latitude(latitudeLongitude.getLat())
                .longitude(latitudeLongitude.getLng())
                .build();

        return locationWebClient.post()
                .uri("/")
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

                    JsonNode geometry = results.get(0).path("geometry");

                    double lat = geometry.path("lat").asDouble();
                    double lng = geometry.path("lng").asDouble();

                    return LatitudeLongitude.builder()
                            .lat(lat)
                            .lng(lng)
                            .build();
                });
    }
}
