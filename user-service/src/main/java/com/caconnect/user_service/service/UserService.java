package com.caconnect.user_service.service;

import com.caconnect.user_service.dto.RegisterRequest;
import com.caconnect.user_service.dto.UserResponse;
import com.caconnect.user_service.model.User;
import com.caconnect.user_service.model.UserRole;
import com.caconnect.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 *
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    public UserResponse register(RegisterRequest request) {
        User user= User.builder()
                .keyCloakId(request.getKeyCloakId())
                .email(request.getEmail())
                .password(request.getPassword())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(UserRole.USER)
                .build();

        User savedUser=userRepository.save(user);

        return mapToUserResponse(savedUser);

    }

    /**
     * Syncs a Keycloak-authenticated user to the local database.
     * Idempotent — if the user already exists (by keyCloakId), returns the existing record.
     * If new, creates a user record without a password (Keycloak handles authentication).
     *
     * @param request contains keyCloakId, email, firstName, lastName from the JWT token
     * @return the synced or existing user
     */
    public UserResponse syncKeycloakUser(RegisterRequest request) {
        // Check if user already exists by keyCloakId
        Optional<User> existingUser = userRepository.findByKeyCloakId(request.getKeyCloakId());

        if (existingUser.isPresent()) {
            log.info("User already exists in DB for keyCloakId: {}", request.getKeyCloakId());
            return mapToUserResponse(existingUser.get());
        }

        // Create new user — no password needed since Keycloak handles auth
        log.info("Creating new user in DB for keyCloakId: {}, email: {}", request.getKeyCloakId(), request.getEmail());
        User user = User.builder()
                .keyCloakId(request.getKeyCloakId())
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(UserRole.USER)
                .build();

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }


    public UserResponse getUserById(String keyCloakId) {
        User user=userRepository.getReferenceByKeyCloakId(keyCloakId);
        return mapToUserResponse(user);

    }

    public Boolean validateUserByKeyCloakId(String keyCloakId) {
        return userRepository.existsByKeyCloakId(keyCloakId);
    }

    public UserResponse mapToUserResponse(User user){
        return UserResponse.builder()
                .id(user.getId())
                .keyCloakId(user.getKeyCloakId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();

    }


    public Boolean isUserExistBykeyCloakId(String keyCloakId) {
        return userRepository.existsByKeyCloakId(keyCloakId);
    }
}

