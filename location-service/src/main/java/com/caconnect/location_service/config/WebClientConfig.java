package com.caconnect.location_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${geoCage.api.key}")
    private String geoCageApiKey;

    @Bean(name = "userServiceWebClient")
    public WebClient userServiceWebClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:8081")
                .build();
    }

    @Bean(name = "openCageWebClient")
    public WebClient openCageWebClient() {
        return WebClient.builder()
                .baseUrl("https://api.opencagedata.com")
                .build();
    }
}
