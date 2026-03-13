package com.caconnect.messaging_service.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SendMessageRequest {
    private String receiverId;
    private String content;
}
