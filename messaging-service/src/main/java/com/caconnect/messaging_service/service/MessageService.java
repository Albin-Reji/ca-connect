package com.caconnect.messaging_service.service;


import com.caconnect.messaging_service.dto.MessageResponse;
import com.caconnect.messaging_service.dto.SendMessageRequest;
import com.caconnect.messaging_service.model.Message;
import com.caconnect.messaging_service.model.MessageStatus;
import com.caconnect.messaging_service.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // Build a consistent conversationId from two user IDs
    // Sorting ensures A→B and B→A both produce the same conversation ID
    public String buildConversationId(String userId1, String userId2) {
        String[] ids = {userId1, userId2};
        Arrays.sort(ids);
        return ids[0] + "_" + ids[1];
    }

    @Transactional
    public MessageResponse sendMessage(String senderId, SendMessageRequest request) {
        String conversationId = buildConversationId(senderId, request.getReceiverId());

        // Save message to DB
        Message message = Message.builder()
                .senderId(senderId)
                .receiverId(request.getReceiverId())
                .conversationId(conversationId)
                .content(request.getContent())
                .status(MessageStatus.SENT)
                .build();

        Message saved = messageRepository.save(message);
        MessageResponse response = toResponse(saved);

        // Push message to receiver's WebSocket topic in real time
        // Receiver subscribes to /user/{receiverId}/queue/messages
        messagingTemplate.convertAndSendToUser(
                request.getReceiverId(),
                "/queue/messages",
                response
        );

        // Also push back to sender so their UI updates instantly
        messagingTemplate.convertAndSendToUser(
                senderId,
                "/queue/messages",
                response
        );

        log.info("Message sent from {} to {} in conversation {}",
                senderId, request.getReceiverId(), conversationId);

        return response;
    }

    // Get conversation history between two users (paginated)
    public List<MessageResponse> getConversation(String userId1, String userId2, int page, int size) {
        String conversationId = buildConversationId(userId1, userId2);
        return messageRepository
                .findByConversationIdOrderBySentAtDesc(conversationId, PageRequest.of(page, size))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Get all conversations for a user (inbox)
    public List<MessageResponse> getInbox(String userId) {
        return messageRepository
                .findLatestMessagePerConversation(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Mark all messages in a conversation as read
    @Transactional
    public void markAsRead(String conversationId, String userId) {
        messageRepository.markConversationAsRead(conversationId, userId);

        // Notify sender that their messages were read
        messagingTemplate.convertAndSend(
                "/topic/read/" + conversationId,
                "READ"
        );
    }

    // Get unread message count
    public long getUnreadCount(String userId) {
        return messageRepository.countUnreadMessages(userId);
    }

    private MessageResponse toResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .senderId(message.getSenderId())
                .receiverId(message.getReceiverId())
                .conversationId(message.getConversationId())
                .content(message.getContent())
                .status(message.getStatus())
                .sentAt(message.getSentAt())
                .readAt(message.getReadAt())
                .build();
    }
}