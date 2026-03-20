package com.caconnect.location_service.dto;

import lombok.Builder;
import lombok.Data;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LatLonLimitRequest {
    private Double latitude;
    private Double longitude;
    private Integer limit;
}
