import { useState, useCallback, useContext, useEffect } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useNavigate } from "react-router-dom";

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
  body { font-family:var(--font-body); background:var(--navy); }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
  @keyframes fadeIn   { from{opacity:0;} to{opacity:1;} }
  @keyframes shimmer  { 0%{background-position:-400px 0;} 100%{background-position:400px 0;} }
  @keyframes spin     { to{transform:rotate(360deg);} }
  @keyframes pulseRing{ 0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0.45);}50%{box-shadow:0 0 0 8px rgba(201,168,76,0);} }
  @keyframes slideUp  { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }
  @keyframes skelPulse{ 0%,100%{opacity:0.45;} 50%{opacity:0.9;} }

  .page {
    min-height:100vh;
    background:radial-gradient(ellipse 80% 55% at 50% -5%, var(--slate) 0%, var(--navy) 68%);
    padding:44px 24px 80px; color:var(--white);
  }
  .container { max-width:960px; margin:0 auto; }

  .topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:44px; animation:fadeUp 0.5s ease both; }
  .back-btn {
    display:inline-flex; align-items:center; gap:10px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12);
    border-radius:50px; padding:10px 20px 10px 14px; cursor:pointer;
    font-family:var(--font-body); font-size:14px; font-weight:600;
    color:rgba(255,255,255,0.75); transition:all 0.22s ease;
  }
  .back-btn:hover { background:rgba(201,168,76,0.1); border-color:var(--gold); color:var(--gold); transform:translateX(-3px); }
  .back-arrow { width:26px; height:26px; border-radius:50%; background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; }
  .breadcrumb { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--muted); font-weight:500; }
  .bc-sep { opacity:0.4; }
  .bc-cur { color:var(--gold); font-weight:600; }

  .page-header { margin-bottom:36px; animation:fadeUp 0.55s ease both 0.05s; }
  .page-eyebrow { font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--gold); margin-bottom:10px; }
  .page-title { font-family:var(--font-head); font-size:clamp(1.9rem,4vw,2.8rem); font-weight:900; line-height:1.1; color:var(--white); }
  .page-title span {
    background:linear-gradient(135deg,var(--gold) 0%,var(--gold3) 50%,var(--gold) 100%);
    background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 3s linear infinite;
  }
  .page-sub { font-size:14px; color:var(--muted); margin-top:10px; line-height:1.65; max-width:520px; }

  .search-panel {
    background:rgba(13,30,56,0.85); border:1px solid var(--border); border-radius:22px;
    padding:30px 36px; backdrop-filter:blur(14px); box-shadow:0 20px 50px rgba(0,0,0,0.35);
    margin-bottom:36px; animation:fadeUp 0.6s ease both 0.1s;
  }
  .search-row { display:grid; grid-template-columns:1fr auto auto; gap:14px; align-items:flex-end; margin-bottom:20px; }
  .field { display:flex; flex-direction:column; gap:7px; }
  .field-label { font-size:12px; font-weight:600; color:rgba(255,255,255,0.6); letter-spacing:0.3px; }
  .field-hint { font-size:11px; color:var(--muted); margin-left:6px; font-weight:400; }
  .limit-input {
    background:rgba(255,255,255,0.05); border:1px solid var(--border-subtle); border-radius:10px;
    padding:11px 14px; font-size:14px; font-family:var(--font-body); color:var(--white); outline:none; width:100%;
    transition:border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .limit-input:focus { border-color:var(--gold); background:rgba(201,168,76,0.06); box-shadow:0 0 0 3px rgba(201,168,76,0.12); }
  .limit-input[type=number]::-webkit-inner-spin-button,
  .limit-input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; }
  .limit-input[type=number] { -moz-appearance:textfield; }

  /* Stage selector */
  .stage-selector-label { font-size:12px; font-weight:600; color:rgba(255,255,255,0.6); letter-spacing:0.3px; margin-bottom:10px; }
  .stage-pills { display:flex; flex-wrap:wrap; gap:8px; }
  .stage-pill {
    display:inline-flex; align-items:center; gap:6px;
    padding:7px 16px; border-radius:50px; cursor:pointer; font-size:12px; font-weight:700;
    font-family:var(--font-body); border:1.5px solid rgba(255,255,255,0.14);
    background:transparent; color:rgba(255,255,255,0.55); transition:all 0.2s;
  }
  .stage-pill:hover { border-color:var(--gold); color:var(--gold); }
  .stage-pill.active { background:linear-gradient(135deg,var(--gold),var(--gold2)); color:var(--navy); border-color:transparent; box-shadow:0 4px 14px rgba(201,168,76,0.35); }

  .btn-search {
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    background:linear-gradient(135deg,var(--gold) 0%,var(--gold2) 100%);
    color:var(--navy); font-family:var(--font-body); font-weight:700; font-size:14px;
    padding:12px 28px; border:none; border-radius:50px; cursor:pointer; white-space:nowrap;
    box-shadow:0 4px 18px rgba(201,168,76,0.35); transition:all 0.2s;
  }
  .btn-search:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 28px rgba(201,168,76,0.5); }
  .btn-search:disabled { opacity:0.55; cursor:not-allowed; }
  .btn-clear {
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
    background:transparent; color:rgba(255,255,255,0.55); font-family:var(--font-body);
    font-weight:600; font-size:14px; padding:12px 20px;
    border:1.5px solid rgba(255,255,255,0.14); border-radius:50px; cursor:pointer; white-space:nowrap; transition:all 0.2s;
  }
  .btn-clear:hover { border-color:var(--gold); color:var(--gold); }

  .stage-strip {
    display:flex; align-items:center; gap:12px; padding:12px 18px; border-radius:12px;
    background:rgba(201,168,76,0.08); border:1px solid rgba(201,168,76,0.2);
    font-size:13px; color:var(--gold2); font-weight:600; margin-top:16px;
  }
  .stage-dot { width:8px; height:8px; border-radius:50%; background:var(--gold); animation:pulseRing 2s infinite; flex-shrink:0; }

  .results-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:12px; }
  .results-count { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:var(--muted); }
  .results-count span { color:var(--gold); }

  .cards-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:20px; }

  .user-card {
    background:rgba(13,30,56,0.75); border:1px solid var(--border); border-radius:20px;
    padding:26px 28px; backdrop-filter:blur(10px); transition:all 0.28s ease;
    animation:slideUp 0.5s ease both; display:flex; flex-direction:column; gap:18px;
  }
  .user-card:hover { border-color:rgba(201,168,76,0.5); transform:translateY(-5px); box-shadow:0 22px 45px rgba(0,0,0,0.38); }

  .card-top { display:flex; align-items:center; gap:14px; }
  .card-avatar {
    width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center;
    font-family:var(--font-head); font-size:20px; font-weight:900;
    color:var(--navy); flex-shrink:0; position:relative; border:2px solid rgba(201,168,76,0.4);
  }
  .card-avatar-ring { position:absolute; inset:-5px; border-radius:50%; border:1px dashed rgba(201,168,76,0.3); }
  .rank-badge {
    position:absolute; top:-6px; right:-6px; width:22px; height:22px; border-radius:50%;
    background:var(--gold); color:var(--navy); font-size:10px; font-weight:900;
    display:flex; align-items:center; justify-content:center; border:2px solid var(--navy2); z-index:1;
  }
  .rank-badge.top { background:linear-gradient(135deg,#ffd700,#ffb300); }

  .card-name  { font-size:15px; font-weight:700; color:var(--white); line-height:1.2; margin-bottom:4px; }
  .card-email { font-size:12px; color:var(--muted); }

  .card-badges { display:flex; flex-wrap:wrap; gap:8px; }
  .badge { display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:700; padding:4px 12px; border-radius:50px; }
  .badge-gold   { background:rgba(201,168,76,0.13); color:var(--gold);  border:1px solid rgba(201,168,76,0.28); }
  .badge-blue   { background:rgba(78,168,222,0.1);  color:#4ea8de;      border:1px solid rgba(78,168,222,0.22); }
  .badge-purple { background:rgba(167,139,250,0.1); color:#a78bfa;      border:1px solid rgba(167,139,250,0.22); }
  .badge-orange { background:rgba(247,127,0,0.1);   color:#fb923c;      border:1px solid rgba(247,127,0,0.22); }

  .card-fields { display:flex; flex-direction:column; }
  .card-field { display:flex; justify-content:space-between; align-items:center; padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:13px; }
  .card-field:last-child { border-bottom:none; }
  .field-k { color:var(--muted); font-weight:500; flex-shrink:0; }
  .field-v { color:var(--white); font-weight:600; text-align:right; font-size:12px; letter-spacing:0.3px; }

  .card-footer { padding-top:14px; border-top:1px solid var(--border-subtle); display:flex; gap:8px; }
  .btn-card-gold {
    flex:1; display:inline-flex; align-items:center; justify-content:center; gap:6px;
    background:linear-gradient(135deg,var(--gold),var(--gold2)); color:var(--navy);
    font-family:var(--font-body); font-weight:700; font-size:12px;
    padding:9px 0; border:none; border-radius:50px; cursor:pointer; transition:all 0.2s;
  }
  .btn-card-gold:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(201,168,76,0.4); }
  .btn-card-outline {
    display:inline-flex; align-items:center; justify-content:center; gap:6px;
    background:transparent; color:rgba(255,255,255,0.6); font-family:var(--font-body);
    font-weight:600; font-size:12px; padding:9px 16px;
    border:1.5px solid rgba(255,255,255,0.14); border-radius:50px; cursor:pointer; transition:all 0.2s;
  }
  .btn-card-outline:hover { border-color:var(--gold); color:var(--gold); }

  .skel-card { background:rgba(13,30,56,0.75); border:1px solid var(--border); border-radius:20px; padding:26px 28px; animation:skelPulse 1.6s ease infinite; }
  .sk { background:rgba(255,255,255,0.07); border-radius:8px; }
  .sk-circle { width:52px; height:52px; border-radius:50%; background:rgba(255,255,255,0.07); flex-shrink:0; }

  .center-state { min-height:320px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; text-align:center; animation:fadeIn 0.4s ease both; }
  .state-icon  { font-size:48px; }
  .state-title { font-family:var(--font-head); font-size:1.3rem; font-weight:700; color:var(--white); }
  .state-sub   { font-size:14px; color:var(--muted); max-width:320px; line-height:1.6; }
  .mini-spin   { width:14px; height:14px; border:2px solid rgba(10,22,40,0.3); border-top-color:var(--navy); border-radius:50%; animation:spin 0.7s linear infinite; display:inline-block; }
  .error-box   { background:rgba(239,68,68,0.09); border:1px solid rgba(239,68,68,0.25); border-radius:16px; padding:24px 32px; max-width:420px; color:#fca5a5; font-size:14px; }

  .divider { height:1px; background:var(--border-subtle); margin:18px 0; }

  @media (max-width:600px) {
    .search-row { grid-template-columns:1fr; }
    .btn-search,.btn-clear { width:100%; }
    .breadcrumb { display:none; }
  }
`;

const STAGE_LABELS = { FOUNDATION: "Foundation", INTERMEDIATE: "Intermediate", ARTICLESHIP: "Articleship", FINAL: "Final", QUALIFIED: "Qualified" };
const STAGE_ICONS = { FOUNDATION: "📗", INTERMEDIATE: "📘", ARTICLESHIP: "💼", FINAL: "🏆", QUALIFIED: "⭐" };
const AVATAR_COLORS = ["#c9a84c", "#4ea8de", "#63e6be", "#a78bfa", "#f472b6", "#f77f00", "#34d399"];

// Stage pill options — "MY_STAGE" means use the logged-in user's own stage
const STAGE_OPTIONS = [
    { value: "MY_STAGE", label: "My Stage", icon: "🎯" },
    { value: "ALL", label: "All", icon: "🌐" },
    { value: "FOUNDATION", label: "Foundation", icon: "📗" },
    { value: "INTERMEDIATE", label: "Inter", icon: "📘" },
    { value: "ARTICLESHIP", label: "Articleship", icon: "💼" },
    { value: "FINAL", label: "Final", icon: "🏆" },
    { value: "QUALIFIED", label: "Qualified", icon: "⭐" },
];

function getInitials(name = "") {
    return name.split(" ").slice(0, 2).map(n => n[0]?.toUpperCase()).join("") || "?";
}
function avatarColor(id = "") {
    return AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];
}
function calcKm(lat1, lon1, lat2, lon2) {
    const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}
function formatAddress(profile) {
    if (!profile?.address) return null;
    const { city, state, country } = profile.address;
    return [city, state, country].filter(Boolean).join(", ") || null;
}

function SkeletonCard() {
    return (
        <div className="skel-card">
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <div className="sk-circle" />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div className="sk" style={{ height: 12, width: "65%" }} />
                    <div className="sk" style={{ height: 10, width: "45%" }} />
                </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                <div className="sk" style={{ height: 22, width: 80 }} />
                <div className="sk" style={{ height: 22, width: 70 }} />
            </div>
            {[100, 80, 90].map((w, i) => (
                <div key={i} className="sk" style={{ height: 11, width: `${w}%`, marginBottom: 10 }} />
            ))}
        </div>
    );
}

function UserCard({ location, profile, rank, myLat, myLon, animDelay, onMessageClick }) {
    const color = avatarColor(location.keyCloakId);
    const initials = getInitials(profile?.fullName);
    const dist = (myLat != null && myLon != null && location.latitude && location.longitude)
        ? calcKm(myLat, myLon, location.latitude, location.longitude)
        : null;
    const address = formatAddress(profile);

    return (
        <div className="user-card" style={{ animationDelay: `${animDelay}s` }}>
            <div className="card-top">
                <div className="card-avatar" style={{ background: `${color}22` }}>
                    <span style={{ color }}>{initials}</span>
                    <div className="card-avatar-ring" />
                    <div className={`rank-badge ${rank <= 3 ? "top" : ""}`}>#{rank}</div>
                </div>
                <div>
                    <div className="card-name">{profile?.fullName ?? "CA Member"}</div>
                    <div className="card-email">
                        {profile?.email ?? `${location.keyCloakId.slice(0, 20)}…`}
                    </div>
                </div>
            </div>

            <div className="card-badges">
                {profile?.examStage && (
                    <span className="badge badge-gold">
                        {STAGE_ICONS[profile.examStage]} {STAGE_LABELS[profile.examStage] || profile.examStage}
                    </span>
                )}
                {dist !== null && <span className="badge badge-blue">📍 {dist} km</span>}
                {profile?.age && <span className="badge badge-orange">Age {profile.age}</span>}
            </div>

            <div className="card-fields">
                {address && (
                    <div className="card-field">
                        <span className="field-k">📍 Address</span>
                        <span className="field-v" style={{ fontFamily: "var(--font-body)", maxWidth: "60%" }}>{address}</span>
                    </div>
                )}
                {profile?.phoneNumber && (
                    <div className="card-field">
                        <span className="field-k">📞 Phone</span>
                        <span className="field-v">{profile.phoneNumber}</span>
                    </div>
                )}
            </div>

            <div className="card-footer">
                <button
                    className="btn-card-gold"
                    onClick={() => onMessageClick(location.keyCloakId)}
                >
                    ✉️ Message
                </button>
                <button className="btn-card-outline">🔗 Profile</button>
            </div>
        </div>
    );
}

export default function NearestUsersPage() {
    const { token, tokenData } = useContext(AuthContext);
    const navigate = useNavigate();

    const [limit, setLimit] = useState(10);
    const [examStage, setExamStage] = useState("MY_STAGE");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [profiles, setProfiles] = useState({});
    const [myLoc, setMyLoc] = useState(null);
    const [error, setError] = useState(null);
    const [myProfile, setMyProfile] = useState(null);

    const keyCloakId = tokenData?.sub;

    const fetchProfile = useCallback(async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/api/profiles/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return null;
            return await res.json();
        } catch { return null; }
    }, [token]);

    const fetchMyLocation = useCallback(async () => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/locations/users/${keyCloakId}/location`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) return null;
            return await res.json();
        } catch { return null; }
    }, [keyCloakId, token]);

    // Load current user's profile on mount
    useEffect(() => {
        if (keyCloakId && token) fetchProfile(keyCloakId).then(setMyProfile);
    }, [keyCloakId, token, fetchProfile]);

    const handleSearch = async () => {
        if (!keyCloakId || !token) return;
        const n = Math.max(1, Math.min(50, Number(limit) || 10));

        setLoading(true); setError(null); setResults(null); setProfiles({});

        try {
            let url = `http://localhost:8080/api/profiles/users/${keyCloakId}/nearest/${n}`;
            if (examStage !== "MY_STAGE") {
                url += `?examStage=${examStage}`;
            }

            const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
            const locations = await res.json();

            const myLocation = await fetchMyLocation();
            setMyLoc(myLocation);
            setResults(locations);

            const entries = await Promise.all(
                locations.map(async (loc) => [loc.keyCloakId, await fetchProfile(loc.keyCloakId)])
            );
            setProfiles(Object.fromEntries(entries.filter(([, p]) => p !== null)));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMessageClick = (userId) => {
        navigate(`/chat/${userId}`);
    };

    const activeStageLabel = () => {
        if (examStage === "MY_STAGE") return myProfile?.examStage ? `${STAGE_ICONS[myProfile.examStage]} ${STAGE_LABELS[myProfile.examStage]}` : "your stage";
        if (examStage === "ALL") return "🌐 All Stages";
        return `${STAGE_ICONS[examStage] ?? ""} ${STAGE_LABELS[examStage] ?? examStage}`;
    };

    return (
        <>
            <style>{css}</style>
            <div className="page">
                <div className="container">

                    <div className="topbar">
                        <button className="back-btn" onClick={() => navigate(-1)}>
                            <span className="back-arrow">←</span>
                            <span>Back</span>
                        </button>
                        <nav className="breadcrumb">
                            <span>Home</span><span className="bc-sep">›</span>
                            <span>Dashboard</span><span className="bc-sep">›</span>
                            <span className="bc-cur">Nearby Members</span>
                        </nav>
                    </div>

                    <div className="page-header">
                        <div className="page-eyebrow">🌐 CA Connect</div>
                        <h1 className="page-title">Find <span>Nearby</span> CA Members</h1>
                        <p className="page-sub">Discover CA students sorted by proximity to your location.</p>
                    </div>

                    <div className="search-panel">
                        <div className="search-row">
                            <div className="field">
                                <label className="field-label">
                                    Number of Members
                                    <span className="field-hint">(1 – 50)</span>
                                </label>
                                <input
                                    className="limit-input"
                                    type="number" min={1} max={50}
                                    value={limit}
                                    onChange={e => setLimit(e.target.value)}
                                    placeholder="10"
                                />
                            </div>
                            <button className="btn-search" onClick={handleSearch} disabled={loading || !keyCloakId}>
                                {loading ? <><span className="mini-spin" /> Searching…</> : "🔍  Find Nearby"}
                            </button>
                            {results !== null && (
                                <button className="btn-clear" onClick={() => { setResults(null); setError(null); }}>
                                    ✕ Clear
                                </button>
                            )}
                        </div>

                        <div>
                            <div className="stage-selector-label">Filter by Exam Stage</div>
                            <div className="stage-pills">
                                {STAGE_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        className={`stage-pill ${examStage === opt.value ? "active" : ""}`}
                                        onClick={() => setExamStage(opt.value)}
                                    >
                                        {opt.icon} {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="stage-strip" style={{ marginTop: 16 }}>
                            <div className="stage-dot" />
                            Searching: <strong style={{ marginLeft: 4 }}>{activeStageLabel()}</strong>
                        </div>
                    </div>

                    {loading && (
                        <div className="cards-grid">
                            {Array.from({ length: Math.min(Number(limit) || 3, 6) }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    )}

                    {error && !loading && (
                        <div className="center-state">
                            <div className="error-box">
                                <div style={{ fontSize: 28, marginBottom: 10 }}>⚠️</div>
                                <div style={{ fontWeight: 700, color: "var(--white)", marginBottom: 8 }}>Search failed</div>
                                <div>{error}</div>
                            </div>
                        </div>
                    )}

                    {results !== null && results.length === 0 && !loading && (
                        <div className="center-state">
                            <div className="state-icon">🗺️</div>
                            <div className="state-title">No nearby members found</div>
                            <div className="state-sub">No members found for the selected stage. Try a different filter or higher limit.</div>
                        </div>
                    )}

                    {results !== null && results.length > 0 && !loading && (
                        <>
                            <div className="results-header">
                                <div className="results-count">
                                    Showing <span>{results.length}</span> nearby member{results.length !== 1 ? "s" : ""}
                                    {" · "}<span>{activeStageLabel()}</span>
                                </div>
                            </div>
                            <div className="cards-grid">
                                {results.map((loc, idx) => (
                                    <UserCard
                                        key={loc.keyCloakId}
                                        location={loc}
                                        profile={profiles[loc.keyCloakId] ?? null}
                                        rank={idx + 1}
                                        myLat={myLoc?.latitude}
                                        myLon={myLoc?.longitude}
                                        animDelay={idx * 0.06}
                                        onMessageClick={handleMessageClick}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {results === null && !loading && !error && (
                        <div className="center-state">
                            <div className="state-icon">🧭</div>
                            <div className="state-title">Ready to explore</div>
                            <div className="state-sub">
                                Pick a stage filter and press{" "}
                                <strong style={{ color: "var(--gold)" }}>Find Nearby</strong> to discover CA members near you.
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}