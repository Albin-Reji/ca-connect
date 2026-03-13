import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useNavigate, useParams } from "react-router-dom";
import { useWebSocket } from "./useWebSocket";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fontLink);

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy:#0a1628; --navy2:#0f2040; --navy3:#162a50;
    --gold:#c9a84c; --gold2:#e8c97a; --gold3:#f5dfa0;
    --slate:#1e3a5f; --muted:#7a8fa6; --white:#ffffff;
    --border:rgba(201,168,76,0.2); --border-subtle:rgba(255,255,255,0.08);
    --green:#10b981; --red:#ef4444;
    --font-head:'Playfair Display',serif; --font-body:'DM Sans',sans-serif;
  }
  body { font-family:var(--font-body); background:var(--navy); overflow: hidden; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
  @keyframes fadeIn   { from{opacity:0;} to{opacity:1;} }
  @keyframes shimmer  { 0%{background-position:-400px 0;} 100%{background-position:400px 0;} }
  @keyframes pulse    { 0%,100%{opacity:1;} 50%{opacity:0.5;} }

  .chat-page {
    height: 100vh;
    background:radial-gradient(ellipse 80% 55% at 50% -5%, var(--slate) 0%, var(--navy) 68%);
    display: flex;
    flex-direction: column;
    color: var(--white);
  }

  .chat-header {
    background: rgba(13,30,56,0.85);
    border-bottom: 1px solid var(--border);
    padding: 20px 24px;
    backdrop-filter: blur(14px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    animation: fadeUp 0.5s ease both;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 50%;
    cursor: pointer;
    color: rgba(255,255,255,0.75);
    transition: all 0.22s ease;
  }
  .back-btn:hover {
    background: rgba(201,168,76,0.1);
    border-color: var(--gold);
    color: var(--gold);
  }

  .user-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-head);
    font-size: 16px;
    font-weight: 900;
    color: var(--navy);
    border: 2px solid rgba(201,168,76,0.4);
    position: relative;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .user-name {
    font-size: 16px;
    font-weight: 700;
    color: var(--white);
  }

  .user-status {
    font-size: 12px;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--green);
    animation: pulse 2s infinite;
  }

  .connection-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 50px;
    font-size: 11px;
    font-weight: 700;
    background: rgba(16,185,129,0.1);
    color: var(--green);
    border: 1px solid rgba(16,185,129,0.25);
  }

  .connection-badge.disconnected {
    background: rgba(239,68,68,0.1);
    color: var(--red);
    border-color: rgba(239,68,68,0.25);
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .chat-messages::-webkit-scrollbar {
    width: 8px;
  }

  .chat-messages::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.03);
    border-radius: 4px;
  }

  .chat-messages::-webkit-scrollbar-thumb {
    background: rgba(201,168,76,0.3);
    border-radius: 4px;
  }

  .chat-messages::-webkit-scrollbar-thumb:hover {
    background: rgba(201,168,76,0.5);
  }

  .message-group {
    display: flex;
    gap: 12px;
    animation: fadeUp 0.3s ease both;
  }

  .message-group.sent {
    flex-direction: row-reverse;
  }

  .message-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 900;
    flex-shrink: 0;
    border: 2px solid rgba(201,168,76,0.3);
  }

  .message-content {
    max-width: 60%;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .message-group.sent .message-content {
    align-items: flex-end;
  }

  .message-bubble {
    padding: 12px 16px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
  }

  .message-group.received .message-bubble {
    background: rgba(255,255,255,0.08);
    color: var(--white);
    border-bottom-left-radius: 4px;
  }

  .message-group.sent .message-bubble {
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: var(--navy);
    border-bottom-right-radius: 4px;
  }

  .message-time {
    font-size: 11px;
    color: var(--muted);
    padding: 0 4px;
  }

  .date-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 20px 0;
  }

  .date-divider::before,
  .date-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-subtle);
  }

  .date-text {
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--muted);
  }

  .empty-icon {
    font-size: 48px;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 14px;
  }

  .chat-input-area {
    background: rgba(13,30,56,0.85);
    border-top: 1px solid var(--border);
    padding: 20px 24px;
    backdrop-filter: blur(14px);
  }

  .input-wrapper {
    display: flex;
    gap: 12px;
    align-items: flex-end;
  }

  .message-input {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border-subtle);
    border-radius: 24px;
    padding: 12px 20px;
    font-size: 14px;
    font-family: var(--font-body);
    color: var(--white);
    outline: none;
    resize: none;
    max-height: 120px;
    transition: border-color 0.2s, background 0.2s;
  }

  .message-input:focus {
    border-color: var(--gold);
    background: rgba(201,168,76,0.06);
  }

  .message-input::placeholder {
    color: var(--muted);
  }

  .send-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: var(--navy);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .send-btn:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 18px rgba(201,168,76,0.4);
  }

  .send-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .loading-messages {
    display: flex;
    justify-content: center;
    padding: 20px;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(201,168,76,0.2);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .message-content {
      max-width: 75%;
    }
  }
`;

const AVATAR_COLORS = ["#c9a84c", "#4ea8de", "#63e6be", "#a78bfa", "#f472b6", "#f77f00", "#34d399"];

function getInitials(name = "") {
    return name.split(" ").slice(0, 2).map(n => n[0]?.toUpperCase()).join("") || "?";
}

function avatarColor(id = "") {
    return AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];
}

function formatTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ChatPage() {
    const { token, tokenData } = useContext(AuthContext);
    const navigate = useNavigate();
    const { userId: otherUserId } = useParams();

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [otherUserProfile, setOtherUserProfile] = useState(null);
    const messagesEndRef = useRef(null);

    const myUserId = tokenData?.sub;

    // Handle incoming WebSocket messages
    const handleIncomingMessage = useCallback((msg) => {
        // Only add if it's part of this conversation
        if (msg.senderId === otherUserId || msg.receiverId === otherUserId) {
            setMessages(prev => {
                // Avoid duplicates
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, msg].sort((a, b) =>
                    new Date(a.sentAt) - new Date(b.sentAt)
                );
            });
        }
    }, [otherUserId]);

    const { connected, sendMessage: sendWsMessage } = useWebSocket(token, myUserId, handleIncomingMessage);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load other user's profile
    useEffect(() => {
        if (!otherUserId || !token) return;

        fetch(`http://localhost:8080/api/profiles/users/${otherUserId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => setOtherUserProfile(data))
            .catch(err => console.error('Failed to load profile:', err));
    }, [otherUserId, token]);

    // Load conversation history
    useEffect(() => {
        if (!myUserId || !otherUserId || !token) return;

        setLoading(true);
        fetch(`http://localhost:8080/api/messages/conversation/${otherUserId}?page=0&size=100`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-USER-ID': myUserId
            }
        })
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                // Reverse to show oldest first
                setMessages(data.reverse());
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load messages:', err);
                setLoading(false);
            });
    }, [myUserId, otherUserId, token]);

    const handleSend = () => {
        if (!inputText.trim() || !connected) return;

        const success = sendWsMessage(otherUserId, inputText.trim());
        if (success) {
            setInputText('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const otherUserColor = avatarColor(otherUserId || '');
    const myColor = avatarColor(myUserId || '');
    const otherUserInitials = getInitials(otherUserProfile?.fullName);
    const myInitials = getInitials(tokenData?.name || tokenData?.preferred_username);

    // Group messages by date
    const messagesByDate = messages.reduce((acc, msg) => {
        const date = formatDate(msg.sentAt);
        if (!acc[date]) acc[date] = [];
        acc[date].push(msg);
        return acc;
    }, {});

    return (
        <>
            <style>{css}</style>
            <div className="chat-page">
                <div className="chat-header">
                    <div className="header-left">
                        <button className="back-btn" onClick={() => navigate(-1)}>
                            ←
                        </button>
                        <div className="user-avatar" style={{ background: `${otherUserColor}22` }}>
                            <span style={{ color: otherUserColor }}>{otherUserInitials}</span>
                        </div>
                        <div className="user-info">
                            <div className="user-name">
                                {otherUserProfile?.fullName || 'Loading...'}
                            </div>
                            <div className="user-status">
                                <div className="status-dot" />
                                Online
                            </div>
                        </div>
                    </div>
                    <div className={`connection-badge ${connected ? '' : 'disconnected'}`}>
                        {connected ? '🟢 Connected' : '🔴 Disconnected'}
                    </div>
                </div>

                <div className="chat-messages">
                    {loading ? (
                        <div className="loading-messages">
                            <div className="spinner" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">💬</div>
                            <div className="empty-text">No messages yet. Start the conversation!</div>
                        </div>
                    ) : (
                        Object.entries(messagesByDate).map(([date, msgs]) => (
                            <div key={date}>
                                <div className="date-divider">
                                    <div className="date-text">{date}</div>
                                </div>
                                {msgs.map((msg) => {
                                    const isSent = msg.senderId === myUserId;
                                    const color = isSent ? myColor : otherUserColor;
                                    const initials = isSent ? myInitials : otherUserInitials;

                                    return (
                                        <div key={msg.id} className={`message-group ${isSent ? 'sent' : 'received'}`}>
                                            <div className="message-avatar" style={{ background: `${color}22` }}>
                                                <span style={{ color }}>{initials}</span>
                                            </div>
                                            <div className="message-content">
                                                <div className="message-bubble">
                                                    {msg.content}
                                                </div>
                                                <div className="message-time">
                                                    {formatTime(msg.sentAt)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area">
                    <div className="input-wrapper">
                        <textarea
                            className="message-input"
                            placeholder="Type a message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            rows={1}
                        />
                        <button
                            className="send-btn"
                            onClick={handleSend}
                            disabled={!inputText.trim() || !connected}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}