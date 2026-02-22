package com.caconnect.user_service.controller;

import com.caconnect.user_service.dto.RegisterRequest;
import com.caconnect.user_service.dto.UserResponse;
import com.caconnect.user_service.service.UserService;
import com.caconnect.user_service.util.ApiResponse;
import com.caconnect.user_service.util.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller responsible for managing user-related operations.
 *
 * <p>Provides endpoints for:</p>
 * <ul>
 *     <li>User registration</li>
 *     <li>Fetching user details by ID</li>
 *     <li>Validating user existence via Keycloak ID</li>
 * </ul>
 *
 * <p>All responses (except validation) are wrapped inside {@link ApiResponse}
 * to maintain consistent API response structure.</p>
 *
 * Base path: {@code /api/users}
 *
 * @author Albin
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * Registers a new user in the system.
     *
     * @param request registration details including email, password, and name
     * @return ApiResponse containing created user details
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        log.info("Registering new user with email: {}", request.getEmail());

        return ApiResponses.ok(
                userService.register(request),
                "User Registered Successfully"
        );
    }

    /**
     * Retrieves user information by user ID.
     *
     * @param userId unique identifier of the user
     * @return ApiResponse containing user details
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable("userId") String userId) {

        log.info("Fetching user with id: {}", userId);

        return ApiResponses.ok(
                userService.getUserById(userId),
                String.format("Fetch User id %s From USERS DB", userId)
        );
    }

    /**
     * Validates whether a user exists for the given Keycloak ID.
     *
     * <p>This endpoint is typically used internally by other services
     * for authentication/authorization checks.</p>
     *
     * @param keyCloakId Keycloak unique user identifier
     * @return true if user exists, false otherwise
     */
    @GetMapping("/validate/{keyCloakId}")
    public ResponseEntity<Boolean> validateUserByKeyCloakId(
            @PathVariable("keyCloakId") String keyCloakId) {

        log.info("Validating user existence for keycloakId: {}", keyCloakId);

        return ResponseEntity.ok(
                userService.validateUserByKeyCloakId(keyCloakId)
        );
    }
}