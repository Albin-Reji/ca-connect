// ─────────────────────────────────────────────────────────────────────────────
// useWebSocket.js — STOMP-over-SockJS hook with callback-ref pattern
//
// KEY DESIGN DECISIONS:
//   1. Subscribes to /topic/messages/{userId} — a simple topic destination.
//      This avoids the need for Principal / user-destination resolution
//      which is complex to set up with SockJS.
//   2. onMessageReceived is stored in a ref so the WebSocket effect never
//      re-runs when the parent re-renders with a new function reference.
//   3. The effect only depends on [token, userId] — reconnection happens
//      only when auth credentials actually change.
//   4. sendMessage sends X-USER-ID as a STOMP native header so the backend
//      can identify the sender via SimpMessageHeaderAccessor.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useWebSocket(token, userId, onMessageReceived) {
    const [connected, setConnected] = useState(false);
    const clientRef = useRef(null);
    const subscriptionsRef = useRef([]);
    // Store userId in a ref so sendMessage always has the latest value
    const userIdRef = useRef(userId);

    // ── Callback ref pattern ─────────────────────────────────────────
    const onMessageRef = useRef(onMessageReceived);
    useEffect(() => {
        onMessageRef.current = onMessageReceived;
    }, [onMessageReceived]);

    useEffect(() => {
        userIdRef.current = userId;
    }, [userId]);

    // ── WebSocket lifecycle ──────────────────────────────────────────
    useEffect(() => {
        if (!token || !userId) return;

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8084/ws'),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            debug: (str) => console.log('[STOMP]', str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log('✅ WebSocket connected for user:', userId);
            setConnected(true);

            // ── Subscribe to TOPIC-based personal messages ──────────
            // Backend sends to /topic/messages/{userId} using convertAndSend
            // This is simpler than /user/{userId}/queue/messages because it
            // does NOT require a Principal on the WebSocket session.
            const sub = client.subscribe(
                `/topic/messages/${userId}`,
                (frame) => {
                    try {
                        const msg = JSON.parse(frame.body);
                        console.log('📨 Received message:', msg);
                        onMessageRef.current?.(msg);
                    } catch (err) {
                        console.error('Failed to parse WS message:', err);
                    }
                }
            );

            subscriptionsRef.current.push(sub);
        };

        client.onStompError = (frame) => {
            console.error('❌ STOMP error:', frame);
            setConnected(false);
        };

        client.onDisconnect = () => {
            console.log('🔌 WebSocket disconnected');
            setConnected(false);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
            subscriptionsRef.current = [];
            if (client.active) client.deactivate();
        };
    }, [token, userId]);

    // ── Publish a message ────────────────────────────────────────────
    // Sends to /app/chat.send with X-USER-ID as a STOMP native header.
    // The backend reads this via SimpMessageHeaderAccessor.getFirstNativeHeader().
    const sendMessage = useCallback((receiverId, content) => {
        if (!clientRef.current?.connected) {
            console.error('WebSocket not connected — cannot send');
            return false;
        }
        try {
            clientRef.current.publish({
                destination: '/app/chat.send',
                headers: {
                    'X-USER-ID': userIdRef.current,
                },
                body: JSON.stringify({ receiverId, content }),
            });
            return true;
        } catch (err) {
            console.error('Failed to send message via WS:', err);
            return false;
        }
    }, []);

    return { connected, sendMessage };
}