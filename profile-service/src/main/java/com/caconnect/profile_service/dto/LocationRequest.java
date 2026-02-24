package com.caconnect.profile_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LocationRequest {
    private String userId;
    private Double latitude;
    private Double longitude;
}

