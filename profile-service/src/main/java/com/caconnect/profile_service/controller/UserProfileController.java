package com.caconnect.profile_service.controller;

import com.caconnect.profile_service.dto.UserProfileRequest;
import com.caconnect.profile_service.model.UserProfile;
import com.caconnect.profile_service.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @PostMapping("/")
    public Mono<ResponseEntity<UserProfile>> saveUserProfile(@RequestBody UserProfileRequest request){
        return userProfileService.saveUserProfile(request)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserProfile> getUserProfile(@PathVariable("userId") String userId){
        return ResponseEntity.ok(userProfileService.getUserProfile(userId));
    }
}
