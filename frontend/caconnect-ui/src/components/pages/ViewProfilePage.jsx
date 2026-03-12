import { useState, useEffect, useContext } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useNavigate } from "react-router-dom";

// ─── Google Fonts ─────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fontLink);

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0a1628;
    --navy2: #0f2040;
    --navy3: #162a50;
    --gold: #c9a84c;
    --gold2: #e8c97a;
    --gold3: #f5dfa0;
    --slate: #1e3a5f;
    --muted: #7a8fa6;
    --white: #ffffff;
    --card-bg: #0d1e38;
    --border: rgba(201,168,76,0.2);
    --font-head: 'Playfair Display', serif;
    --font-body: 'DM Sans', sans-serif;
    --green: #10b981;
    --red: #ef4444;
  }

  body { font-family: var(--font-body); background: var(--navy); color: var(--white); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes pulseRing {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.5); }
    50%       { box-shadow: 0 0 0 10px rgba(201,168,76,0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .fade-up { animation: fadeUp 0.6s ease both; }
  .d1 { animation-delay: 0.05s; }
  .d2 { animation-delay: 0.15s; }
  .d3 { animation-delay: 0.25s; }
  .d4 { animation-delay: 0.35s; }

  .gold-text {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold3) 50%, var(--gold) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  /* ── Page Shell ── */
  .profile-page {
    min-height: 100vh;
    background: radial-gradient(ellipse 80% 50% at 50% -10%, var(--slate) 0%, var(--navy) 65%);
    padding: 40px 24px 80px;
    animation: fadeIn 0.4s ease both;
  }

  .profile-container {
    max-width: 900px;
    margin: 0 auto;
  }

  /* ── Top Nav Bar ── */
  .profile-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
    animation: slideRight 0.5s ease both;
  }

  /* ── Back Button ── */
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 50px;
    padding: 10px 20px 10px 14px;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 600;
    color: rgba(255,255,255,0.75);
    transition: all 0.22s ease;
    text-decoration: none;
  }
  .back-btn:hover {
    background: rgba(201,168,76,0.1);
    border-color: var(--gold);
    color: var(--gold);
    transform: translateX(-3px);
    box-shadow: 0 4px 20px rgba(201,168,76,0.15);
  }
  .back-btn:active { transform: translateX(-1px); }

  .back-btn-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    font-size: 14px;
    flex-shrink: 0;
    transition: background 0.2s;
  }
  .back-btn:hover .back-btn-arrow {
    background: rgba(201,168,76,0.2);
  }

  .back-btn-label { letter-spacing: 0.2px; }

  /* ── Breadcrumb ── */
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--muted);
    font-weight: 500;
  }
  .breadcrumb-sep { opacity: 0.4; }
  .breadcrumb-current { color: var(--gold); font-weight: 600; }

  /* ── Hero Card ── */
  .hero-card {
    background: linear-gradient(135deg, var(--slate) 0%, var(--navy3) 100%);
    border: 1px solid var(--border);
    border-radius: 28px;
    padding: 48px 48px 40px;
    position: relative;
    overflow: hidden;
    margin-bottom: 24px;
  }
  .hero-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 80% at 90% 0%, rgba(201,168,76,0.13) 0%, transparent 60%);
    pointer-events: none;
  }
  .hero-card-inner {
    display: flex;
    align-items: flex-start;
    gap: 36px;
    position: relative;
  }

  /* ── Avatar ── */
  .profile-avatar-wrap { flex-shrink: 0; position: relative; }
  .profile-avatar {
    width: 96px; height: 96px; border-radius: 50%;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%);
    color: var(--navy); font-family: var(--font-head);
    font-size: 36px; font-weight: 900;
    display: flex; align-items: center; justify-content: center;
    animation: pulseRing 3s infinite;
    border: 3px solid rgba(201,168,76,0.4);
  }
  .avatar-ring {
    position: absolute; inset: -6px; border-radius: 50%;
    border: 1.5px dashed rgba(201,168,76,0.35);
    animation: spin 18s linear infinite;
  }

  /* ── Hero Info ── */
  .hero-info { flex: 1; min-width: 0; }
  .hero-name {
    font-family: var(--font-head); font-size: 2.2rem;
    font-weight: 900; color: var(--white); line-height: 1.1; margin-bottom: 8px;
  }
  .hero-email { font-size: 14px; color: var(--muted); margin-bottom: 16px; }
  .hero-badges { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }

  .badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 700; padding: 5px 14px;
    border-radius: 50px; letter-spacing: 0.5px;
  }
  .badge-gold   { background: rgba(201,168,76,0.15); color: var(--gold);   border: 1px solid rgba(201,168,76,0.3); }
  .badge-green  { background: rgba(16,185,129,0.12); color: var(--green);  border: 1px solid rgba(16,185,129,0.25); }
  .badge-blue   { background: rgba(78,168,222,0.12); color: #4ea8de;       border: 1px solid rgba(78,168,222,0.25); }
  .badge-purple { background: rgba(167,139,250,0.12); color: #a78bfa;      border: 1px solid rgba(167,139,250,0.25); }

  .hero-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .btn-gold {
    display: inline-flex; align-items: center; gap: 7px;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: var(--navy); font-family: var(--font-body); font-weight: 700;
    font-size: 13px; padding: 10px 22px; border: none; border-radius: 50px;
    cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(201,168,76,0.3);
  }
  .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,168,76,0.45); }
  .btn-outline {
    display: inline-flex; align-items: center; gap: 7px;
    background: transparent; color: rgba(255,255,255,0.75); font-family: var(--font-body);
    font-weight: 600; font-size: 13px; padding: 10px 22px;
    border: 1.5px solid rgba(255,255,255,0.2); border-radius: 50px;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-outline:hover { border-color: var(--gold); color: var(--gold); }

  /* ── Stat Strip ── */
  .stat-strip {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1px; background: var(--border);
    border-radius: 16px; overflow: hidden; margin-top: 32px;
  }
  .stat-strip-item {
    background: rgba(10,22,40,0.8); padding: 20px 24px;
    text-align: center; backdrop-filter: blur(10px);
  }
  .stat-strip-num {
    font-family: var(--font-head); font-size: 1.8rem;
    font-weight: 900; margin-bottom: 4px;
  }
  .stat-strip-label {
    font-size: 12px; color: var(--muted); font-weight: 500;
    text-transform: uppercase; letter-spacing: 1px;
  }

  /* ── Info Grid ── */
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  .info-card {
    background: rgba(13,30,56,0.75); border: 1px solid var(--border);
    border-radius: 20px; padding: 28px 32px;
    backdrop-filter: blur(10px); transition: all 0.3s;
  }
  .info-card:hover {
    border-color: rgba(201,168,76,0.45);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.35);
  }
  .info-card.full { grid-column: 1 / -1; }

  .card-label {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 2px; color: var(--gold); margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }
  .card-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .field-row {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .field-row:last-child { border-bottom: none; padding-bottom: 0; }
  .field-key { font-size: 13px; color: var(--muted); font-weight: 500; flex-shrink: 0; margin-right: 16px; }
  .field-val { font-size: 14px; color: var(--white); font-weight: 600; text-align: right; }

  /* ── Exam Stage Progress ── */
  .stage-track { display: flex; align-items: center; margin-top: 8px; }
  .stage-node {
    display: flex; flex-direction: column; align-items: center;
    flex: 1; position: relative;
  }
  .stage-node:not(:last-child)::after {
    content: ''; position: absolute; top: 14px; left: 50%;
    width: 100%; height: 2px; background: rgba(255,255,255,0.1); z-index: 0;
  }
  .stage-node.done:not(:last-child)::after { background: var(--gold); }
  .stage-dot {
    width: 28px; height: 28px; border-radius: 50%;
    background: rgba(255,255,255,0.07); border: 2px solid rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; position: relative; z-index: 1; margin-bottom: 8px;
  }
  .stage-dot.done   { background: rgba(201,168,76,0.2); border-color: var(--gold); color: var(--gold); }
  .stage-dot.active { background: var(--gold); border-color: var(--gold2); color: var(--navy); animation: pulseRing 2s infinite; }
  .stage-name       { font-size: 11px; color: var(--muted); font-weight: 500; text-align: center; }
  .stage-name.active { color: var(--gold); font-weight: 700; }

  /* ── Location ── */
  .location-card {
    display: flex; align-items: center; gap: 14px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px; padding: 16px 20px; margin-top: 4px; transition: all 0.2s;
  }
  .location-card:hover { border-color: var(--gold); background: rgba(201,168,76,0.05); }
  .location-icon {
    width: 42px; height: 42px; border-radius: 12px;
    background: rgba(201,168,76,0.12); display: flex; align-items: center;
    justify-content: center; font-size: 20px; flex-shrink: 0;
  }
  .location-city { font-size: 15px; font-weight: 700; color: var(--white); }
  .location-detail { font-size: 13px; color: var(--muted); margin-top: 2px; }

  /* ── Contact ── */
  .contact-item {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .contact-item:last-child { border-bottom: none; }
  .contact-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .contact-label { font-size: 12px; color: var(--muted); }
  .contact-value { font-size: 14px; font-weight: 600; color: var(--white); }

  /* ── Loading / Error ── */
  .center-state {
    min-height: 60vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 16px; text-align: center;
  }
  .spinner {
    width: 48px; height: 48px;
    border: 3px solid rgba(201,168,76,0.2);
    border-top-color: var(--gold); border-radius: 50%;
    animation: spin 0.9s linear infinite;
  }
  .error-box {
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
    border-radius: 16px; padding: 28px 36px; max-width: 420px;
  }

  @media (max-width: 700px) {
    .hero-card { padding: 28px 24px; }
    .hero-card-inner { flex-direction: column; align-items: center; text-align: center; }
    .hero-badges, .hero-actions { justify-content: center; }
    .info-grid { grid-template-columns: 1fr; }
    .info-card.full { grid-column: 1; }
    .stat-strip { grid-template-columns: 1fr; }
    .hero-name { font-size: 1.7rem; }
    .breadcrumb { display: none; }
    .profile-topbar { margin-bottom: 28px; }
  }
`;

const STAGES      = ["FOUNDATION", "INTERMEDIATE", "ARTICLESHIP", "FINAL", "QUALIFIED"];
const STAGE_LABELS = { FOUNDATION: "Foundation", INTERMEDIATE: "Inter", ARTICLESHIP: "Articles", FINAL: "Final", QUALIFIED: "Qualified" };
const STAGE_ICONS  = { FOUNDATION: "📗", INTERMEDIATE: "📘", ARTICLESHIP: "💼", FINAL: "🏆", QUALIFIED: "⭐" };

function stageIndex(stage) { return STAGES.indexOf(stage); }
function getInitials(name = "") {
    return name.split(" ").slice(0, 2).map(n => n[0]?.toUpperCase()).join("") || "?";
}

export default function ViewProfilePage() {
    const { token, tokenData } = useContext(AuthContext);
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    const keyCloakId = tokenData?.sub;

    useEffect(() => {
        if (!keyCloakId || !token) return;
        setLoading(true);
        fetch(`http://localhost:8080/api/profiles/users/${keyCloakId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
                return res.json();
            })
            .then(data  => { setProfile(data);        setLoading(false); })
            .catch(err  => { setError(err.message);   setLoading(false); });
    }, [keyCloakId, token]);

    const initials       = getInitials(profile?.fullName);
    const currentStageIdx = stageIndex(profile?.examStage);
    const addr           = profile?.address;

    return (
        <>
            <style>{css}</style>
            <div className="profile-page">
                <div className="profile-container">

                    {/* ── Top Bar: Back button + Breadcrumb ── */}
                    <div className="profile-topbar">
                        <button className="back-btn" onClick={() => navigate(-1)}>
                            <span className="back-btn-arrow">←</span>
                            <span className="back-btn-label">Back</span>
                        </button>

                        <nav className="breadcrumb">
                            <span>Home</span>
                            <span className="breadcrumb-sep">›</span>
                            <span>Dashboard</span>
                            <span className="breadcrumb-sep">›</span>
                            <span className="breadcrumb-current">My Profile</span>
                        </nav>
                    </div>

                    {/* ── Loading ── */}
                    {loading && (
                        <div className="center-state">
                            <div className="spinner" />
                            <p style={{ color: "var(--muted)", fontSize: 14 }}>Fetching your profile…</p>
                        </div>
                    )}

                    {/* ── Error ── */}
                    {error && !loading && (
                        <div className="center-state">
                            <div className="error-box">
                                <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--white)", marginBottom: 8 }}>
                                    Could not load profile
                                </div>
                                <div style={{ fontSize: 13, color: "var(--muted)" }}>{error}</div>
                                <button
                                    className="back-btn"
                                    style={{ marginTop: 20 }}
                                    onClick={() => navigate(-1)}
                                >
                                    <span className="back-btn-arrow">←</span>
                                    <span className="back-btn-label">Go Back</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Profile ── */}
                    {profile && !loading && (
                        <>
                            {/* Hero Card */}
                            <div className="hero-card fade-up d1">
                                <div className="hero-card-inner">
                                    <div className="profile-avatar-wrap">
                                        <div className="profile-avatar">{initials}</div>
                                        <div className="avatar-ring" />
                                    </div>
                                    <div className="hero-info">
                                        <h1 className="hero-name">
                                            <span className="gold-text">{profile.fullName}</span>
                                        </h1>
                                        <p className="hero-email">{profile.email}</p>
                                        <div className="hero-badges">
                                            <span className="badge badge-gold">
                                                {STAGE_ICONS[profile.examStage]} {STAGE_LABELS[profile.examStage] || profile.examStage}
                                            </span>
                                            <span className="badge badge-green">✓ Verified</span>
                                            {addr?.city && <span className="badge badge-blue">📍 {addr.city}</span>}
                                            <span className="badge badge-purple">Age {profile.age}</span>
                                        </div>
                                        <div className="hero-actions">
                                            <button className="btn-gold">✉️ Message</button>
                                            <button className="btn-outline">🔗 Share Profile</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="stat-strip">
                                    {[
                                        { num: profile.age,                                           label: "Years Old",   color: "var(--gold)" },
                                        { num: STAGE_LABELS[profile.examStage] || profile.examStage,  label: "Exam Stage",  color: "#63e6be"     },
                                        { num: addr?.country || "—",                                  label: "Country",     color: "#4ea8de"     },
                                    ].map((s, i) => (
                                        <div key={i} className="stat-strip-item">
                                            <div className="stat-strip-num" style={{ color: s.color }}>{s.num}</div>
                                            <div className="stat-strip-label">{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="info-grid">

                                {/* CA Journey */}
                                <div className="info-card full fade-up d2">
                                    <div className="card-label">🎯 CA Journey Progress</div>
                                    <div className="stage-track">
                                        {STAGES.map((s, i) => {
                                            const done   = i < currentStageIdx;
                                            const active = i === currentStageIdx;
                                            return (
                                                <div key={s} className={`stage-node ${done ? "done" : ""}`}>
                                                    <div className={`stage-dot ${done ? "done" : active ? "active" : ""}`}>
                                                        {done ? "✓" : STAGE_ICONS[s]}
                                                    </div>
                                                    <span className={`stage-name ${active ? "active" : ""}`}>
                                                        {STAGE_LABELS[s]}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="info-card fade-up d3">
                                    <div className="card-label">📞 Contact</div>
                                    <div className="contact-item">
                                        <div className="contact-icon" style={{ background: "rgba(201,168,76,0.1)" }}>✉️</div>
                                        <div>
                                            <div className="contact-label">Email</div>
                                            <div className="contact-value">{profile.email}</div>
                                        </div>
                                    </div>
                                    <div className="contact-item">
                                        <div className="contact-icon" style={{ background: "rgba(99,230,190,0.1)" }}>📱</div>
                                        <div>
                                            <div className="contact-label">Phone</div>
                                            <div className="contact-value">{profile.phoneNumber}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="info-card fade-up d3">
                                    <div className="card-label">📍 Location</div>
                                    {addr ? (
                                        <div className="location-card">
                                            <div className="location-icon">🏙️</div>
                                            <div>
                                                <div className="location-city">{addr.city || "—"}</div>
                                                <div className="location-detail">
                                                    {[addr.state, addr.country].filter(Boolean).join(", ")}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p style={{ color: "var(--muted)", fontSize: 14 }}>No address on file.</p>
                                    )}
                                    {addr?.streetAddress && (
                                        <div className="field-row" style={{ marginTop: 12 }}>
                                            <span className="field-key">Street</span>
                                            <span className="field-val">{addr.streetAddress}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Personal Details */}
                                <div className="info-card full fade-up d4">
                                    <div className="card-label">👤 Personal Details</div>
                                    {[
                                        { key: "Full Name",   val: profile.fullName },
                                        { key: "Age",         val: `${profile.age} years` },
                                        { key: "Exam Stage",  val: STAGE_LABELS[profile.examStage] || profile.examStage },
                                        { key: "Keycloak ID", val: profile.keyCloakId || "—" },
                                    ].map(({ key, val }) => (
                                        <div key={key} className="field-row">
                                            <span className="field-key">{key}</span>
                                            <span className="field-val">{val}</span>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </>
                    )}

                </div>
            </div>
        </>
    );
}
