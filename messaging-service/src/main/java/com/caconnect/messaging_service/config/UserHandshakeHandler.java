package com.caconnect.messaging_service.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

/**
 * Custom handshake handler that extracts the user ID from the WebSocket
 * handshake request and sets it as the Principal on the session.
 *
 * WHY THIS IS NEEDED:
 *   Spring's convertAndSendToUser(userId, ...) needs a Principal to map
 *   which WebSocket session belongs to which user. Without this, messages
 *   sent via convertAndSendToUser would never reach the correct client.
 *
 * HOW IT WORKS:
 *   The frontend connects to /ws?userId={keycloakId}. This handler reads
 *   the query parameter and creates a StompPrincipal with that userId.
 */
@Slf4j
public class UserHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(
            ServerHttpRequest request,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {
        // Extract userId from query parameter: /ws?userId=xxx
        String query = request.getURI().getQuery();
        String userId = null;

        if (query != null) {
            for (String param : query.split("&")) {
                String[] kv = param.split("=", 2);
                if (kv.length == 2 && "userId".equals(kv[0])) {
                    userId = kv[1];
                    break;
                }
            }
        }

        if (userId != null && !userId.isBlank()) {
            log.info("WebSocket handshake — userId from query param: {}", userId);
            return new StompPrincipal(userId);
        }

        log.warn("WebSocket handshake — no userId found in query params");
        return null;
    }

    /**
     * Simple Principal implementation that wraps a user ID string.
     * Used by Spring's user-destination resolution (convertAndSendToUser).
     */
    public static class StompPrincipal implements Principal {
        private final String name;

        public StompPrincipal(String name) {
            this.name = name;
        }

        @Override
        public String getName() {
            return name;
        }
    }
}
