package com.caconnect.user_service.dto;

import com.caconnect.user_service.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Data Transfer Object (DTO) representing user information returned by the system.
 * <p>
 * This object is typically sent in API responses to provide client applications
 * with user details after registration, authentication, or fetching user profiles.
 * </p>
 *
 * <p>Fields include basic personal information, role, and timestamps for auditing.</p>
 *
 * @author Albin
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private String id;
    private String keyCloakId;
    private String email;
    private String firstName;
    private String lastName;
    private  UserRole role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
