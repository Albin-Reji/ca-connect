package com.caconnect.user_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;


/**
 * Data Transfer Object (DTO) for registering a new user.
 * <p>
 * This object carries the necessary information from the client
 * to the backend for creating a new user account.
 * </p>
 *
 * <p>Fields include email, password, and personal details.</p>
 *
 * <p>Used in endpoints such as {@code /api/auth/register}.</p>
 *
 * @author Albin
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterRequest {
    @NotBlank(message = "Email is Required")
    @Email(message = "Invalid Email Format")
    private  String email;

    @NotBlank(message = "Password is Required")
    @Size(min = 6, message = "Password must have at least 6 character")
    private  String password;

    private String keyCloakId;
    private  String firstName;
    private  String lastName;
}
