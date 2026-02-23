package com.caconnect.profile_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean(name = "geoWebClient")
    public WebClient geoWebClient(){
        return WebClient.builder()
                .baseUrl("https://api.opencagedata.com")
                .build();
    }
    @Bean(name = "locationWebClient")
    public WebClient locationWebClient(){
        return WebClient.builder()
                .baseUrl("http://localhost:8082/api/locations")
                .build();
    }
}
