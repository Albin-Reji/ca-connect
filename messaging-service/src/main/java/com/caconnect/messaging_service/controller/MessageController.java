package com.caconnect.messaging_service.controller;
import com.caconnect.messaging_service.dto.SendMessageRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import com.caconnect.messaging_service.dto.MessageResponse;
import com.caconnect.messaging_service.service.MessageService;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    // ─────────────────────────────────────────────
    // WebSocket endpoint — real-time message sending
    // Client sends to: /app/chat.send
    // ─────────────────────────────────────────────
    @MessageMapping("/chat.send")
    public void sendMessageViaWebSocket(
            @Payload SendMessageRequest request,
            @RequestHeader("X-USER-ID") String userId // injected from WebSocket session
    ) {
        // Keycloak user ID
        log.info("WS message from {} to {}", userId, request.getReceiverId());
        messageService.sendMessage(userId, request);
    }

    // ─────────────────────────────────────────────
    // REST endpoint — send message via HTTP
    // ─────────────────────────────────────────────
    @PostMapping("/send")
    public MessageResponse sendMessage(
            @RequestBody SendMessageRequest request,
            @RequestHeader("X-USER-ID") String userId
    ) {
        return messageService.sendMessage(userId, request);
    }

    // Get conversation history between current user and another user
    @GetMapping("/conversation/{otherUserId}")
    public List<MessageResponse> getConversation(
            @PathVariable String otherUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader("X-USER-ID") String userId
    ) {
        return messageService.getConversation(userId, otherUserId, page, size);
    }

    // Get all conversations (inbox) for the current user
    @GetMapping("/inbox")
    public List<MessageResponse> getInbox( @RequestHeader("X-USER-ID") String userId) {
        return messageService.getInbox(userId);
    }

    // Mark a conversation as read
    @PutMapping("/conversation/{conversationId}/read")
    public void markAsRead(
            @PathVariable String conversationId,
            @RequestHeader("X-USER-ID") String userId
    ) {
        messageService.markAsRead(conversationId, userId);
    }

    // Get total unread message count for the current user
    @GetMapping("/unread/count")
    public long getUnreadCount( @RequestHeader("X-USER-ID") String userId) {

        return messageService.getUnreadCount(userId);
    }
}