package com.caconnect.location_service.model;

import lombok.Builder;
import lombok.Data;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NearestExamStageRequest {
    private Double latitude;
    private Double longitude;
    private Integer limit;
    private List<String> keyCloakIds;
}
