package com.caconnect.messaging_service.dto;

import com.caconnect.messaging_service.model.MessageStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MessageResponse {

    private String id;
    private String senderId;
    private String receiverId;
    private String conversationId;
    private String content;
    private MessageStatus status;
    private LocalDateTime sentAt;
    private LocalDateTime readAt;
}