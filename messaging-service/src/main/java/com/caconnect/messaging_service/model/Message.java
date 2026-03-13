package com.caconnect.messaging_service.model;



import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "messages", indexes = {
        @Index(name = "idx_sender_receiver", columnList = "sender_id, receiver_id"),
        @Index(name = "idx_conversation", columnList = "conversation_id")
})
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    // Keycloak UUID of the sender
    @Column(name = "sender_id", nullable = false)
    private String senderId;

    // Keycloak UUID of the receiver
    @Column(name = "receiver_id", nullable = false)
    private String receiverId;

    // conversationId = sorted senderId + receiverId (so both users share one conversation)
    @Column(name = "conversation_id", nullable = false)
    private String conversationId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MessageStatus status = MessageStatus.SENT;

    @CreationTimestamp
    private LocalDateTime sentAt;

    private LocalDateTime readAt;
}