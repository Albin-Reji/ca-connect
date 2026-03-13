import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useWebSocket(token, userId, onMessageReceived) {
    const [connected, setConnected] = useState(false);
    const clientRef = useRef(null);
    const subscriptionsRef = useRef([]);

    useEffect(() => {
        if (!token || !userId) return;

        // Create WebSocket connection
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
            console.log('✅ WebSocket connected');
            setConnected(true);

            // Subscribe to personal message queue
            const sub = client.subscribe(`/user/${userId}/queue/messages`, (message) => {
                try {
                    const msg = JSON.parse(message.body);
                    console.log('📨 Message received:', msg);
                    if (onMessageReceived) onMessageReceived(msg);
                } catch (err) {
                    console.error('Failed to parse message:', err);
                }
            });
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
            subscriptionsRef.current.forEach(sub => sub.unsubscribe());
            subscriptionsRef.current = [];
            if (client.active) {
                client.deactivate();
            }
        };
    }, [token, userId, onMessageReceived]);

    const sendMessage = useCallback((receiverId, content) => {
        if (!clientRef.current?.connected) {
            console.error('WebSocket not connected');
            return false;
        }

        try {
            clientRef.current.publish({
                destination: '/app/chat.send',
                body: JSON.stringify({
                    receiverId,
                    content,
                }),
            });
            return true;
        } catch (err) {
            console.error('Failed to send message:', err);
            return false;
        }
    }, []);

    return { connected, sendMessage };
}