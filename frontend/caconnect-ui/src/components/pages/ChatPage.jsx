// ─────────────────────────────────────────────────────────────────────────────
// ChatPage.jsx — Full-featured real-time chat with:
//   • Conversation history loading on mount (oldest-first display)
//   • "Load older messages" pagination without scroll jumping
//   • Optimistic UI — message appears instantly, swapped on server echo
//   • Delivery status: Sending… → Sent ✓ / Failed ✗ (with retry)
//   • WebSocket real-time updates for both sender and receiver
//
// ARCHITECTURE NOTES:
//   The backend MessageService.sendMessage() calls convertAndSendToUser for
//   BOTH sender and receiver, so the sender's handleIncomingMessage fires
//   for their own messages too. We use this echo to:
//     1. Replace the optimistic (pending) bubble with the server-confirmed one
//     2. Show the "Sent ✓" status once the real message arrives
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useNavigate, useParams } from "react-router-dom";
import { useWebSocket } from "./useWebSocket";

// ── Google Fonts (injected once) ────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fontLink);

// ── CSS (all styles scoped via class names) ─────────────────────────────────
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
  @keyframes pulse    { 0%,100%{opacity:1;} 50%{opacity:0.5;} }

  .chat-page {
    height: 100vh;
    background:radial-gradient(ellipse 80% 55% at 50% -5%, var(--slate) 0%, var(--navy) 68%);
    display: flex;
    flex-direction: column;
    color: var(--white);
  }

  /* ── Header ── */
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
  .header-left { display: flex; align-items: center; gap: 16px; }
  .back-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 40px; height: 40px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 50%; cursor: pointer;
    color: rgba(255,255,255,0.75); transition: all 0.22s ease;
  }
  .back-btn:hover { background: rgba(201,168,76,0.1); border-color: var(--gold); color: var(--gold); }
  .user-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-head); font-size: 16px; font-weight: 900;
    color: var(--navy); border: 2px solid rgba(201,168,76,0.4);
  }
  .user-info { display: flex; flex-direction: column; gap: 4px; }
  .user-name { font-size: 16px; font-weight: 700; color: var(--white); }
  .user-status { font-size: 12px; color: var(--muted); display: flex; align-items: center; gap: 6px; }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
  .connection-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 50px; font-size: 11px; font-weight: 700;
    background: rgba(16,185,129,0.1); color: var(--green); border: 1px solid rgba(16,185,129,0.25);
  }
  .connection-badge.disconnected {
    background: rgba(239,68,68,0.1); color: var(--red); border-color: rgba(239,68,68,0.25);
  }

  /* ── Messages ── */
  .chat-messages {
    flex: 1; overflow-y: auto; padding: 24px;
    display: flex; flex-direction: column; gap: 16px;
  }
  .chat-messages::-webkit-scrollbar { width: 8px; }
  .chat-messages::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); border-radius: 4px; }
  .chat-messages::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 4px; }
  .chat-messages::-webkit-scrollbar-thumb:hover { background: rgba(201,168,76,0.5); }

  .message-group { display: flex; gap: 12px; animation: fadeUp 0.3s ease both; }
  .message-group.sent { flex-direction: row-reverse; }
  .message-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 900; flex-shrink: 0;
    border: 2px solid rgba(201,168,76,0.3);
  }
  .message-content { max-width: 60%; display: flex; flex-direction: column; gap: 4px; }
  .message-group.sent .message-content { align-items: flex-end; }
  .message-bubble {
    padding: 12px 16px; border-radius: 18px;
    font-size: 14px; line-height: 1.5; word-wrap: break-word;
  }
  .message-group.received .message-bubble {
    background: rgba(255,255,255,0.08); color: var(--white); border-bottom-left-radius: 4px;
  }
  .message-group.sent .message-bubble {
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: var(--navy); border-bottom-right-radius: 4px;
  }

  /* Optimistic (pending) bubble — slightly dimmed until server confirms */
  .message-group.pending .message-bubble {
    opacity: 0.65;
  }
  /* Failed bubble — red tint */
  .message-group.failed .message-bubble {
    opacity: 0.75;
    border: 1.5px solid var(--red);
  }

  .message-meta { font-size: 11px; color: var(--muted); padding: 0 4px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

  /* Status labels */
  .message-status { font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 3px; }
  .message-status.sending   { color: var(--muted); font-style: italic; }
  .message-status.sent      { color: var(--muted); }
  .message-status.delivered { color: var(--gold); }
  .message-status.read      { color: var(--green); }
  .message-status.failed    { color: var(--red); }

  /* Retry button */
  .retry-btn {
    font-size: 11px; font-weight: 700; color: var(--red);
    background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3);
    border-radius: 12px; padding: 2px 10px; cursor: pointer;
    transition: all 0.2s; margin-left: 4px;
  }
  .retry-btn:hover { background: rgba(239,68,68,0.25); }

  /* ── Load older ── */
  .load-older-wrap { display: flex; justify-content: center; padding: 4px 0 8px; }
  .load-older-btn {
    font-size: 12px; font-weight: 600; color: var(--gold);
    background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.25);
    border-radius: 50px; padding: 8px 22px; cursor: pointer;
    transition: all 0.2s; font-family: var(--font-body);
  }
  .load-older-btn:hover { background: rgba(201,168,76,0.18); }
  .load-older-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Date divider ── */
  .date-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
  .date-divider::before, .date-divider::after { content: ''; flex: 1; height: 1px; background: var(--border-subtle); }
  .date-text { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

  /* ── Empty / Loading ── */
  .empty-state {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 12px; color: var(--muted);
  }
  .empty-icon { font-size: 48px; opacity: 0.5; }
  .empty-text { font-size: 14px; }
  .loading-messages { display: flex; justify-content: center; padding: 20px; }
  .spinner {
    width: 32px; height: 32px;
    border: 3px solid rgba(201,168,76,0.2);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  .mini-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(201,168,76,0.2);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Input area ── */
  .chat-input-area {
    background: rgba(13,30,56,0.85);
    border-top: 1px solid var(--border);
    padding: 20px 24px;
    backdrop-filter: blur(14px);
  }
  .input-wrapper { display: flex; gap: 12px; align-items: flex-end; }
  .message-input {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border-subtle);
    border-radius: 24px;
    padding: 12px 20px;
    font-size: 14px; font-family: var(--font-body); color: var(--white);
    outline: none; resize: none; max-height: 120px;
    transition: border-color 0.2s, background 0.2s;
  }
  .message-input:focus { border-color: var(--gold); background: rgba(201,168,76,0.06); }
  .message-input::placeholder { color: var(--muted); }
  .send-btn {
    width: 48px; height: 48px; border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: var(--navy); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; transition: all 0.2s; flex-shrink: 0;
  }
  .send-btn:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 4px 18px rgba(201,168,76,0.4); }
  .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  @media (max-width: 768px) {
    .message-content { max-width: 75%; }
  }
`;

// ── Constants & helpers ─────────────────────────────────────────────────────

const PAGE_SIZE = 20; // messages per page, matches backend default
const AVATAR_COLORS = ["#c9a84c", "#4ea8de", "#63e6be", "#a78bfa", "#f472b6", "#f77f00", "#34d399"];

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((n) => n[0]?.toUpperCase()).join("") || "?";
}

function avatarColor(id = "") {
  return AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Generates a temporary client-side id for optimistic (pending) messages */
function tempId() {
  return `tmp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/**
 * Safely extract an array of messages from the API response.
 * Handles both raw `List<MessageResponse>` and Spring `Page<MessageResponse>`
 * (which wraps the array inside `.content`).
 */
function extractMessages(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  return [];
}

// ── Component ───────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { token, tokenData } = useContext(AuthContext);
  const navigate = useNavigate();
  const { userId: otherUserId } = useParams();

  // ── State ──────────────────────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);             // initial page load
  const [loadingOlder, setLoadingOlder] = useState(false);   // "load older" in progress
  const [hasMorePages, setHasMorePages] = useState(true);    // false when API returns < PAGE_SIZE
  const [otherUserProfile, setOtherUserProfile] = useState(null);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const pageRef = useRef(0); // tracks the next page to fetch for pagination
  const myUserId = tokenData?.sub;

  // ─────────────────────────────────────────────────────────────────
  // handleIncomingMessage — Real-time WebSocket handler
  //
  // Flow:
  //   1. User types → handleSend() → optimistic bubble (pending: true)
  //   2. WS publish → backend saves to DB → broadcasts to BOTH users
  //   3. This handler fires for the sender too (echo)
  //   4. We replace the pending bubble with the real server message
  //      (matched by senderId + receiverId + content + _pending flag)
  //   5. If the message is from the OTHER user, we simply append it
  // ─────────────────────────────────────────────────────────────────
  const handleIncomingMessage = useCallback(
    (msg) => {
      // Only process messages belonging to THIS conversation
      const isRelevant =
        (msg.senderId === myUserId && msg.receiverId === otherUserId) ||
        (msg.senderId === otherUserId && msg.receiverId === myUserId);

      if (!isRelevant) return;

      setMessages((prev) => {
        // Skip if this exact server message is already in the list
        if (prev.some((m) => m.id === msg.id && !m._pending)) return prev;

        // If this is MY echo — replace the matching pending bubble
        if (msg.senderId === myUserId) {
          const pendingIdx = prev.findIndex(
            (m) =>
              m._pending &&
              m.content === msg.content &&
              m.receiverId === msg.receiverId
          );
          if (pendingIdx !== -1) {
            const updated = [...prev];
            // Swap the optimistic entry for the confirmed server message
            updated[pendingIdx] = msg; // real message with proper id, sentAt, status
            return updated;
          }
        }

        // Otherwise it's an incoming message from the other user — append
        if (prev.some((m) => m.id === msg.id)) return prev; // dedup
        return [...prev, msg];
      });
    },
    [myUserId, otherUserId]
  );

  // ── WebSocket connection ───────────────────────────────────────────
  const { connected, sendMessage: sendWsMessage } = useWebSocket(
    token,
    myUserId,
    handleIncomingMessage
  );

  // ── Auto-scroll to bottom on new messages ─────────────────────────
  // Only auto-scroll when a NEW message is appended (not when loading older).
  // We detect this by checking if the user is already near the bottom.
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    // Auto-scroll if user is within 150px of the bottom (or on initial load)
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 150;

    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ── Load other user's profile ──────────────────────────────────────
  useEffect(() => {
    if (!otherUserId || !token) return;
    fetch(`http://localhost:8080/api/profiles/users/${otherUserId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOtherUserProfile(data))
      .catch((err) => console.error("Failed to load profile:", err));
  }, [otherUserId, token]);

  // ─────────────────────────────────────────────────────────────────
  // fetchConversation — Load a page of conversation history
  //
  // page=0 is the newest page. We reverse so oldest messages appear first.
  // For page > 0 ("load older"), we PREPEND and preserve scroll position
  // so the user doesn't experience a jarring jump.
  // ─────────────────────────────────────────────────────────────────
  const fetchConversation = useCallback(
    async (page = 0) => {
      if (!myUserId || !otherUserId || !token) return;

      const isInitial = page === 0;
      if (isInitial) setLoading(true);
      else setLoadingOlder(true);

      try {
        const res = await fetch(
          `http://localhost:8080/api/messages/conversation/${otherUserId}?page=${page}&size=${PAGE_SIZE}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-USER-ID": myUserId,
            },
          }
        );

        if (!res.ok) {
          console.error(`Conversation API returned ${res.status}`);
          return;
        }

        const data = await res.json();
        const fetched = extractMessages(data);

        // If we got fewer than PAGE_SIZE, there are no more older pages
        if (fetched.length < PAGE_SIZE) {
          setHasMorePages(false);
        }

        // API returns newest-first → reverse to get oldest-first for display
        const oldestFirst = fetched.slice().reverse();

        if (isInitial) {
          // First page load — set messages and scroll to bottom
          setMessages(oldestFirst);
          // Scroll to bottom after render
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
          }, 50);
        } else {
          // Pagination — prepend older messages while preserving scroll position
          const container = chatContainerRef.current;
          const prevScrollHeight = container?.scrollHeight || 0;

          setMessages((prev) => [...oldestFirst, ...prev]);

          // After React renders the prepended messages, restore scroll position
          // so the viewport stays on the same message the user was looking at
          requestAnimationFrame(() => {
            if (container) {
              const newScrollHeight = container.scrollHeight;
              container.scrollTop = newScrollHeight - prevScrollHeight;
            }
          });
        }

        // Track the next page to fetch
        pageRef.current = page + 1;
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        if (isInitial) setLoading(false);
        else setLoadingOlder(false);
      }
    },
    [myUserId, otherUserId, token]
  );

  // ── Initial load — fetch page 0 on mount ──────────────────────────
  useEffect(() => {
    pageRef.current = 0;
    setHasMorePages(true);
    setMessages([]);
    fetchConversation(0);
  }, [fetchConversation]);

  // ── Load older handler ─────────────────────────────────────────────
  const handleLoadOlder = () => {
    if (loadingOlder || !hasMorePages) return;
    fetchConversation(pageRef.current);
  };

  // ─────────────────────────────────────────────────────────────────
  // handleSend — Send a new message
  //
  // 1. Create an optimistic bubble with _pending: true (shown instantly)
  // 2. Attempt to publish via WebSocket
  // 3. If WS publish fails → mark bubble as _failed with retry capability
  // 4. If WS succeeds → backend echoes back the confirmed message
  //    → handleIncomingMessage replaces the pending bubble
  // ─────────────────────────────────────────────────────────────────
  const handleSend = () => {
    const text = inputText.trim();
    if (!text || !connected) return;

    const optimisticId = tempId();

    // 1️⃣  Optimistic update — show bubble immediately
    const optimistic = {
      id: optimisticId,
      senderId: myUserId,
      receiverId: otherUserId,
      content: text,
      sentAt: new Date().toISOString(),
      _pending: true,   // not yet confirmed by server
      _failed: false,    // WS publish didn't fail
    };

    setMessages((prev) => [...prev, optimistic]);
    setInputText("");

    // 2️⃣  Publish over WebSocket
    const ok = sendWsMessage(otherUserId, text);

    if (!ok) {
      // 3️⃣  WS publish failed — mark the bubble as failed
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticId ? { ...m, _pending: false, _failed: true } : m
        )
      );
    }
    // If ok === true, we wait for the server echo in handleIncomingMessage
  };

  // ── Retry a failed message ─────────────────────────────────────────
  const handleRetry = (failedMsg) => {
    // Reset the message to pending state
    setMessages((prev) =>
      prev.map((m) =>
        m.id === failedMsg.id ? { ...m, _pending: true, _failed: false } : m
      )
    );

    // Try sending again
    const ok = sendWsMessage(failedMsg.receiverId, failedMsg.content);

    if (!ok) {
      // Still failing — mark as failed again
      setMessages((prev) =>
        prev.map((m) =>
          m.id === failedMsg.id ? { ...m, _pending: false, _failed: true } : m
        )
      );
    }
  };

  // ── Keyboard handler ───────────────────────────────────────────────
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Derived values ─────────────────────────────────────────────────
  const otherUserColor = avatarColor(otherUserId || "");
  const myColor = avatarColor(myUserId || "");
  const otherUserInitials = getInitials(otherUserProfile?.fullName);
  const myInitials = getInitials(tokenData?.name || tokenData?.preferred_username);

  // Group messages by calendar date for dividers
  const messagesByDate = messages.reduce((acc, msg) => {
    const date = formatDate(msg.sentAt);
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  // ─────────────────────────────────────────────────────────────────
  // renderStatusLabel — Render the delivery status for a sent message
  // ─────────────────────────────────────────────────────────────────
  const renderStatusLabel = (msg, isSent) => {
    // Pending — waiting for server echo
    if (msg._pending) {
      return <span className="message-status sending">Sending…</span>;
    }

    // Failed — WS publish failed
    if (msg._failed) {
      return (
        <>
          <span className="message-status failed">Failed ✗</span>
          <button className="retry-btn" onClick={() => handleRetry(msg)}>
            Retry
          </button>
        </>
      );
    }

    // Confirmed — show status only for sender's own messages
    if (isSent && msg.status) {
      const statusMap = {
        READ: { label: "✓✓ Read", cls: "read" },
        DELIVERED: { label: "✓✓ Delivered", cls: "delivered" },
        SENT: { label: "✓ Sent", cls: "sent" },
      };
      const s = statusMap[msg.status] || statusMap.SENT;
      return <span className={`message-status ${s.cls}`}>{s.label}</span>;
    }

    return null;
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="chat-page">

        {/* ── Header ── */}
        <div className="chat-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate(-1)}>←</button>
            <div className="user-avatar" style={{ background: `${otherUserColor}22` }}>
              <span style={{ color: otherUserColor }}>{otherUserInitials}</span>
            </div>
            <div className="user-info">
              <div className="user-name">{otherUserProfile?.fullName || "Loading..."}</div>
              <div className="user-status">
                <div className="status-dot" />
                Online
              </div>
            </div>
          </div>
          <div className={`connection-badge ${connected ? "" : "disconnected"}`}>
            {connected ? "🟢 Connected" : "🔴 Disconnected"}
          </div>
        </div>

        {/* ── Messages ── */}
        <div className="chat-messages" ref={chatContainerRef}>

          {/* Loading spinner for initial load */}
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
            <>
              {/* ── "Load older messages" button ── */}
              {hasMorePages && (
                <div className="load-older-wrap">
                  <button
                    className="load-older-btn"
                    onClick={handleLoadOlder}
                    disabled={loadingOlder}
                  >
                    {loadingOlder ? (
                      <><span className="mini-spinner" /> Loading…</>
                    ) : (
                      "↑ Load older messages"
                    )}
                  </button>
                </div>
              )}

              {/* ── Message groups by date ── */}
              {Object.entries(messagesByDate).map(([date, msgs]) => (
                <div key={date}>
                  <div className="date-divider">
                    <div className="date-text">{date}</div>
                  </div>
                  {msgs.map((msg) => {
                    const isSent = msg.senderId === myUserId;
                    const color = isSent ? myColor : otherUserColor;
                    const initials = isSent ? myInitials : otherUserInitials;

                    // Determine CSS modifier classes
                    let groupClass = `message-group ${isSent ? "sent" : "received"}`;
                    if (msg._pending) groupClass += " pending";
                    if (msg._failed) groupClass += " failed";

                    return (
                      <div key={msg.id} className={groupClass}>
                        <div
                          className="message-avatar"
                          style={{ background: `${color}22` }}
                        >
                          <span style={{ color }}>{initials}</span>
                        </div>
                        <div className="message-content">
                          <div className="message-bubble">{msg.content}</div>
                          <div className="message-meta">
                            {/* Always show the timestamp (or nothing if pending) */}
                            {!msg._pending && !msg._failed && (
                              <span>{formatTime(msg.sentAt)}</span>
                            )}
                            {/* Status label for sender's messages */}
                            {isSent && renderStatusLabel(msg, isSent)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}

          {/* Invisible anchor — auto-scroll target */}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Input ── */}
        <div className="chat-input-area">
          <div className="input-wrapper">
            <textarea
              className="message-input"
              placeholder={connected ? "Type a message…" : "Reconnecting…"}
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