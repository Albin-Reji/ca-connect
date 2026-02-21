package com.nearca.user_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
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
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String keyCloakId;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;
    private String firstName;
    private String lastName;

    @Enumerated(EnumType.STRING)
    private static final UserRole role = UserRole.USER;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
