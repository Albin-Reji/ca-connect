package com.caconnect.location_service.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "location")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String locationId;

    @Column(unique = true, nullable = false)
    private String userId;

    private Double latitude;

    private Double longitude;

}
