package com.caconnect.messaging_service.controller;

import com.caconnect.messaging_service.dto.SendMessageRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.*;
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

    // ─────────────────────────────────────────────────────────────────
    // WebSocket endpoint — real-time message sending
    // Client sends to: /app/chat.send
    //
    // IMPORTANT: Uses SimpMessageHeaderAccessor to read STOMP native headers.
    // @RequestHeader is HTTP-only and does NOT work with @MessageMapping.
    // @Header can be unreliable across Spring versions for native STOMP headers.
    // SimpMessageHeaderAccessor.getFirstNativeHeader() is the most reliable way
    // to read client-sent STOMP headers in a @MessageMapping handler.
    // ─────────────────────────────────────────────────────────────────
    @MessageMapping("/chat.send")
    public void sendMessageViaWebSocket(
            @Payload SendMessageRequest request,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        // Read X-USER-ID from STOMP native headers (sent by the frontend)
        String userId = headerAccessor.getFirstNativeHeader("X-USER-ID");

        if (userId == null || userId.isBlank()) {
            log.error("No X-USER-ID header in STOMP message — cannot process");
            return;
        }

        log.info("WS message from {} to {}", userId, request.getReceiverId());
        messageService.sendMessage(userId, request);
    }

    // ─────────────────────────────────────────────────────────────────
    // REST endpoint — send message via HTTP
    // @RequestHeader is correct for HTTP endpoints
    // ─────────────────────────────────────────────────────────────────
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
    public List<MessageResponse> getInbox(@RequestHeader("X-USER-ID") String userId) {
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
    public long getUnreadCount(@RequestHeader("X-USER-ID") String userId) {
        return messageService.getUnreadCount(userId);
    }
}