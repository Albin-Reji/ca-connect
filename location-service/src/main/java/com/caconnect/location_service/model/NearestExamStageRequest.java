package com.caconnect.location_service.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class NearestExamStageRequest {
    private Double latitude;
    private Double longitude;
    private Integer limit;
    private List<String> userIds;
}
