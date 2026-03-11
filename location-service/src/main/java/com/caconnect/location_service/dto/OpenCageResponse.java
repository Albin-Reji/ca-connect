package com.caconnect.location_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class OpenCageResponse {
    private List<Result> results;
    
    @Data
    public static class Result {
        private Geometry geometry;
        private String formatted;
        private Components components;
    }
    
    @Data
    public static class Geometry {
        private double lat;
        private double lng;
    }
    
    @Data
    public static class Components {
        private String city;
        private String state;
        private String country;
        @JsonProperty("postcode")
        private String postcode;
    }
}
