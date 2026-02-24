package com.caconnect.profile_service.dto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Location {
    private String locationId;
    private String userId;
    private Double latitude;
    private Double longitude;

}
