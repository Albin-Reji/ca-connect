package com.caconnect.location_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean(name = "userServiceWebClient")
    public WebClient userServiceWebClient(){
        return WebClient.builder()
                .baseUrl("http://localhost:8081")
                .build();
    }
}
