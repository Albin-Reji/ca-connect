package com.caconnect.messaging_service.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;

/**
 * STOMP channel interceptor that injects the user ID into every SEND frame's
 * native headers so that @Header("X-USER-ID") works in @MessageMapping handlers.
 *
 * WHY THIS IS NEEDED:
 *   @RequestHeader is an HTTP-only annotation — it does NOT work with @MessageMapping.
 *   This interceptor reads the Principal (set by UserHandshakeHandler during the
 *   WebSocket handshake) and copies the user ID into a STOMP header that the
 *   controller can read with @Header("X-USER-ID").
 *
 * FLOW:
 *   1. Client connects → UserHandshakeHandler sets Principal = {userId}
 *   2. Client sends STOMP SEND frame to /app/chat.send
 *   3. This interceptor fires preSend → reads Principal → adds X-USER-ID header
 *   4. MessageController.sendMessageViaWebSocket reads @Header("X-USER-ID")
 */
@Slf4j
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) return message;

        // On every SEND frame, inject the user ID from the Principal
        if (StompCommand.SEND.equals(accessor.getCommand())) {
            var principal = accessor.getUser();

            if (principal != null) {
                // Set the X-USER-ID header so @Header("X-USER-ID") resolves correctly
                accessor.setNativeHeader("X-USER-ID", principal.getName());
                log.debug("Injected X-USER-ID={} into STOMP SEND frame", principal.getName());
            } else {
                // Fallback: check if client already sent it as a STOMP header
                String clientUserId = accessor.getFirstNativeHeader("X-USER-ID");
                if (clientUserId != null) {
                    log.debug("Client provided X-USER-ID={} in STOMP header", clientUserId);
                } else {
                    log.warn("No userId available for STOMP SEND — message may fail");
                }
            }
        }

        return message;
    }
}
