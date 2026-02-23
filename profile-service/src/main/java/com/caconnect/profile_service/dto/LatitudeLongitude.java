package com.caconnect.profile_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LatitudeLongitude {
    private Double lat;
    private Double lng;
}
