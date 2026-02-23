package com.caconnect.location_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LatLonLimitRequest {
    private Double latitude;
    private Double longitude;
    private Integer limit;
}
