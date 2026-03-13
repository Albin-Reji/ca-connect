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
        log.info("frontend request: \n"+ request.toString());
        return userProfileService.saveUserProfile(request);
    }

    @GetMapping("/users/{keyCloakId}")
    public ResponseEntity<UserProfile> getUserProfile(@PathVariable("keyCloakId") String keyCloakId){
        return ResponseEntity.ok(userProfileService.getUserProfile(keyCloakId));
    }

    @GetMapping("/users/{keyCloakId}/nearest/{limit}")
    public Mono<ResponseEntity<List<Location>>> getNearestUsersOfSameExamStage(
            @PathVariable("keyCloakId") String keyCloakId,
            @PathVariable("limit") Integer limit,
            @RequestParam(value = "examStage", required = false) String examStage) {

        log.info("Searching nearby User: {} limit: {} examStage: {}", keyCloakId, limit, examStage);
        return userProfileService.getNearestUsersOfSameExamStage(keyCloakId, limit, examStage)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/users/{keyCloakId}/exist")
    public ResponseEntity<Boolean> isUserWithKeyCloakIdExist(@PathVariable("keyCloakId") String keyCloakId){
        log.info(" @GetMapping(\"/users/{keyCloakId}/exist\") from FRONTEND---");
        return ResponseEntity.ok(userProfileService.isUserWithKeyCloakIdExist(keyCloakId));
    }
}
