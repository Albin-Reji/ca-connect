package com.caconnect.messaging_service.repository;

import com.caconnect.messaging_service.model.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {

    // Get all messages in a conversation (paginated, newest first)
    List<Message> findByConversationIdOrderBySentAtDesc(String conversationId, Pageable pageable);

    // Get all conversations for a user (latest message per conversation)
    @Query("""
        SELECT m FROM Message m
        WHERE m.id IN (
            SELECT MAX(m2.id) FROM Message m2
            WHERE m2.senderId = :userId OR m2.receiverId = :userId
            GROUP BY m2.conversationId
        )
        ORDER BY m.sentAt DESC
    """)
    List<Message> findLatestMessagePerConversation(@Param("userId") String userId);

    // Count unread messages for a user
    @Query("""
        SELECT COUNT(m) FROM Message m
        WHERE m.receiverId = :userId
        AND m.status != 'READ'
    """)
    long countUnreadMessages(@Param("userId") String userId);

    // Mark all messages in a conversation as READ
    @Modifying
    @Query("""
        UPDATE Message m SET m.status = 'READ'
        WHERE m.conversationId = :conversationId
        AND m.receiverId = :userId
        AND m.status != 'READ'
    """)
    void markConversationAsRead(
            @Param("conversationId") String conversationId,
            @Param("userId") String userId
    );
}