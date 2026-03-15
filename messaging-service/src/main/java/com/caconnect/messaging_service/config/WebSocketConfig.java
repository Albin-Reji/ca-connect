package com.caconnect.messaging_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket/STOMP configuration for the messaging service.
 *
 * ARCHITECTURE:
 *   - Simple in-memory broker with /topic prefix
 *   - Each user subscribes to /topic/messages/{userId}
 *   - Backend sends to /topic/messages/{userId} using convertAndSend()
 *   - This avoids the need for Principal / user-destination resolution
 *     which is complex to set up with SockJS + Keycloak
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory message broker
        // /topic — for topic-based subscriptions (broadcast to all subscribers of that topic)
        config.enableSimpleBroker("/topic");
        // Prefix for messages FROM client TO server (@MessageMapping)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")  // For development — restrict in production
                .withSockJS();
    }
}