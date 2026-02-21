package com.nearca.user_service.controller.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

/**
 * Represents a user in the system.
 * <p>
 * This entity stores the essential details of a user including their unique identifier,
 * login credentials, personal information, and role within the application.
 * The entity automatically tracks creation and update timestamps.
 * </p>
 *
 * <p>Annotations used:</p>
 * <ul>
 *     <li>{@link jakarta.persistence.Entity}</li>
 *     <li>{@link jakarta.persistence.Table}</li>
 *     <li>{@link lombok.Data}</li>
 *     <li>{@link lombok.Builder}</li>
 *     <li>{@link lombok.AllArgsConstructor}</li>
 *     <li>{@link lombok.NoArgsConstructor}</li>
 * </ul>
 *
 * @author Albin
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true)
    private String userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
    private String firstName;
    private String lastName;

    @Enumerated(EnumType.STRING)
    private UserRole role=UserRole.USER;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
