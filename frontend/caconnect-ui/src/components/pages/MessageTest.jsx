import { useState, useContext } from "react";
import { AuthContext } from "react-oauth2-code-pkce";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0c0c0f;
    --surface: #141418;
    --border: #2a2a35;
    --accent: #00ffb3;
    --accent2: #7b5ea7;
    --text: #e8e8f0;
    --muted: #5a5a72;
    --error: #ff4d6d;
    --font-head: 'Syne', sans-serif;
    --font-mono: 'Space Mono', monospace;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(0,255,179,0.4); }
    50%       { box-shadow: 0 0 0 10px rgba(0,255,179,0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes scan {
    0%   { top: 0%; }
    100% { top: 100%; }
  }

  .mt-page {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--font-mono);
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    position: relative;
    overflow: hidden;
  }

  /* grid overlay */
  .mt-page::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,255,179,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,179,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .mt-shell {
    width: 100%;
    max-width: 560px;
    position: relative;
    z-index: 1;
    animation: fadeIn 0.6s ease both;
  }

  /* ── Terminal Header ── */
  .mt-terminal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 0 60px rgba(0,255,179,0.06), 0 24px 60px rgba(0,0,0,0.6);
  }

  .mt-titlebar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 18px;
    background: rgba(255,255,255,0.03);
    border-bottom: 1px solid var(--border);
  }
  .mt-dot {
    width: 12px; height: 12px; border-radius: 50%;
  }
  .mt-dot.red    { background: #ff5f57; }
  .mt-dot.yellow { background: #febc2e; }
  .mt-dot.green  { background: #28c840; }
  .mt-title-text {
    margin-left: 8px;
    font-size: 12px;
    color: var(--muted);
    letter-spacing: 1px;
  }

  .mt-body {
    padding: 32px;
  }

  /* ── Label / heading ── */
  .mt-label {
    font-family: var(--font-head);
    font-size: 22px;
    font-weight: 800;
    color: var(--text);
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .mt-label-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--accent);
    animation: pulse 2s ease infinite;
  }
  .mt-sub {
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 28px;
    line-height: 1.6;
    letter-spacing: 0.3px;
  }

  /* ── Endpoint info ── */
  .mt-endpoint {
    background: rgba(0,255,179,0.04);
    border: 1px solid rgba(0,255,179,0.12);
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .mt-method {
    font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
    background: var(--accent);
    color: var(--bg);
    padding: 3px 8px; border-radius: 4px;
    flex-shrink: 0;
  }
  .mt-url {
    font-size: 12px;
    color: var(--accent);
    word-break: break-all;
  }

  /* ── User ID row ── */
  .mt-user-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
    padding: 12px 16px;
    background: rgba(123,94,167,0.08);
    border: 1px solid rgba(123,94,167,0.2);
    border-radius: 10px;
    font-size: 12px;
    color: var(--muted);
  }
  .mt-user-id {
    color: #c4b0e8;
    word-break: break-all;
  }

  /* ── Fetch Button ── */
  .mt-btn {
    width: 100%;
    padding: 14px;
    background: transparent;
    border: 1.5px solid var(--accent);
    border-radius: 10px;
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 24px;
  }
  .mt-btn:hover:not(:disabled) {
    background: rgba(0,255,179,0.08);
    box-shadow: 0 0 20px rgba(0,255,179,0.2);
    transform: translateY(-1px);
  }
  .mt-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .mt-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(0,255,179,0.2);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  /* ── Response Box ── */
  .mt-response {
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--border);
    animation: fadeIn 0.3s ease both;
  }
  .mt-response-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: rgba(255,255,255,0.03);
    border-bottom: 1px solid var(--border);
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .mt-response-header.ok    { color: var(--accent); }
  .mt-response-header.error { color: var(--error);  }
  .mt-status-badge {
    display: flex; align-items: center; gap: 6px;
  }
  .mt-status-dot {
    width: 6px; height: 6px; border-radius: 50%;
  }
  .mt-status-dot.ok    { background: var(--accent); }
  .mt-status-dot.error { background: var(--error);  }

  .mt-response-body {
    padding: 20px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text);
    background: rgba(0,0,0,0.2);
    white-space: pre-wrap;
    word-break: break-word;
  }
  .mt-response-body.error { color: var(--error); }

  /* ── Empty state ── */
  .mt-empty {
    text-align: center;
    padding: 32px;
    color: var(--muted);
    font-size: 13px;
    border: 1px dashed var(--border);
    border-radius: 10px;
    line-height: 1.8;
  }
  .mt-empty-icon { font-size: 28px; margin-bottom: 8px; display: block; }
`;

export default function MessageTest() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const { token, tokenData } = useContext(AuthContext);
    const userId = tokenData?.sub ?? "N/A";

    const fetchMessage = async () => {
        setLoading(true);
        setData(null);
        setIsError(false);
        try {
            const res = await fetch("http://localhost:8080/api/messages/", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-USER-ID": userId,
                },
            });

            const text = await res.text();

            if (!res.ok) {
                setIsError(true);
                setData(`Error ${res.status}: ${text}`);
            } else {
                setData(text);
            }
        } catch (err) {
            setIsError(true);
            setData(`Network error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{css}</style>
            <div className="mt-page">
                <div className="mt-shell">
                    <div className="mt-terminal">

                        {/* ── Titlebar ── */}
                        <div className="mt-titlebar">
                            <div className="mt-dot red" />
                            <div className="mt-dot yellow" />
                            <div className="mt-dot green" />
                            <span className="mt-title-text">messaging-service / test</span>
                        </div>

                        <div className="mt-body">

                            {/* ── Heading ── */}
                            <div className="mt-label">
                                <span className="mt-label-dot" />
                                API Test Console
                            </div>
                            <p className="mt-sub">
                                Calls the messaging service through the gateway with your JWT token and X-USER-ID header.
                            </p>

                            {/* ── Endpoint ── */}
                            <div className="mt-endpoint">
                                <span className="mt-method">GET</span>
                                <span className="mt-url">http://localhost:8080/api/messages/</span>
                            </div>

                            {/* ── User ID ── */}
                            <div className="mt-user-row">
                                <span>X-USER-ID →</span>
                                <span className="mt-user-id">{userId}</span>
                            </div>

                            {/* ── Button ── */}
                            <button className="mt-btn" onClick={fetchMessage} disabled={loading}>
                                {loading
                                    ? <><span className="mt-spinner" /> Fetching…</>
                                    : "▶  RUN REQUEST"}
                            </button>

                            {/* ── Response ── */}
                            {data !== null ? (
                                <div className="mt-response">
                                    <div className={`mt-response-header ${isError ? "error" : "ok"}`}>
                                        <div className="mt-status-badge">
                                            <span className={`mt-status-dot ${isError ? "error" : "ok"}`} />
                                            <span>{isError ? "ERROR" : "200 OK"}</span>
                                        </div>
                                        <span>Response</span>
                                    </div>
                                    <div className={`mt-response-body ${isError ? "error" : ""}`}>
                                        {data}
                                    </div>
                                </div>
                            ) : !loading && (
                                <div className="mt-empty">
                                    <span className="mt-empty-icon">⌨️</span>
                                    Hit <strong>RUN REQUEST</strong> to ping the endpoint.<br />
                                    Response will appear here.
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}