package com.caconnect.user_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing an application user.
 *
 * <p>This class maps to the {@code users} table in the database and stores
 * authentication details, personal information, role, and audit timestamps.</p>
 *
 * <p>Each user is uniquely identified by:
 * <ul>
 *     <li>Database UUID ({@code id})</li>
 *     <li>Keycloak ID ({@code keyCloakId})</li>
 *     <li>Email address ({@code email})</li>
 * </ul>
 *
 * <p>Timestamps are automatically handled by Hibernate.</p>
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

    /**
     * Primary unique identifier for the user.
     * Generated automatically as UUID.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /**
     * Unique identifier of the user in Keycloak authentication server.
     * Used to map application users with external identity provider.
     */
    @Column(unique = true, nullable = false)
    private String keyCloakId;

    /**
     * User email address.
     * Must be unique and not null.
     */
    @Column(unique = true, nullable = false)
    private String email;

    /**
     * Encrypted user password stored in database.
     * Required for authentication fallback or local login.
     */
    @Column(nullable = false)
    private String password;

    /**
     * User's first name.
     */
    private String firstName;

    /**
     * User's last name.
     */
    private String lastName;

    /**
     * Role assigned to the user (e.g., USER, ADMIN).
     * Stored as string in database.
     */
    @Enumerated(EnumType.STRING)
    private UserRole role;

    /**
     * Timestamp indicating when the user record was created.
     * Automatically populated on insert.
     */
    @CreationTimestamp
    private LocalDateTime createdAt;

    /**
     * Timestamp indicating when the user record was last updated.
     * Automatically updated on modification.
     */
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}