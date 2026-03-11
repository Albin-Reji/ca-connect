package com.caconnect.profile_service.controller;

import com.caconnect.profile_service.dto.Location;
import com.caconnect.profile_service.dto.UserProfileRequest;
import com.caconnect.profile_service.model.UserProfile;
import com.caconnect.profile_service.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @PostMapping("/")
    public Mono<UserProfile> saveUserProfile(@RequestBody UserProfileRequest request){
        log.info("request from frontend: "+request.toString());
        return userProfileService.saveUserProfile(request);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserProfile> getUserProfile(@PathVariable("userId") String userId){
        return ResponseEntity.ok(userProfileService.getUserProfile(userId));
    }

    @GetMapping("/users/{userId}/nearest/{limit}")
    public Mono<ResponseEntity<List<Location>>> getNearestUsersOfSameExamStage(@PathVariable("userId") String userId,
                                                                         @PathVariable("limit") Integer limit){
        return userProfileService.getNearestUsersOfSameExamStage(userId, limit)
                .map(ResponseEntity::ok);
    }
}
