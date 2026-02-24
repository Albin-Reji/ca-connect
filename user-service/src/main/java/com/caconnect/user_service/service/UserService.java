package com.caconnect.user_service.service;

import com.caconnect.user_service.dto.RegisterRequest;
import com.caconnect.user_service.dto.UserResponse;
import com.caconnect.user_service.model.User;
import com.caconnect.user_service.model.UserRole;
import com.caconnect.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 *
 */
@Service
@RequiredArgsConstructor
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


    public UserResponse getUserById(String userId) {
        User user=userRepository.getReferenceById(userId);
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


    public Boolean isUserExistByUserId(String userId) {
        return userRepository.existsById(userId);
    }
}
