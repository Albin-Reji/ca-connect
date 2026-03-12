import { useState, useEffect, useContext } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch, useSelector } from "react-redux";
import { setCredential, logout } from "./../store/authSlice";
import { Link } from "react-router-dom";
// ─── Google Fonts ─────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fontLink);

// ─── CSS ──────────────────────────────────────────────────────────────────────
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
    --cream: #fdf8ee;
    --muted: #7a8fa6;
    --white: #ffffff;
    --card-bg: #0d1e38;
    --border: rgba(201,168,76,0.2);
    --font-head: 'Playfair Display', serif;
    --font-body: 'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); background: var(--navy); color: var(--white); }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--navy); }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 4px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes pulseGold {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
    50%       { box-shadow: 0 0 0 14px rgba(201,168,76,0); }
  }
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .fade-up { animation: fadeUp 0.7s ease both; }
  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  .delay-3 { animation-delay: 0.3s; }
  .delay-4 { animation-delay: 0.4s; }
  .delay-5 { animation-delay: 0.5s; }

  .noise::after {
    content: '';
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 0;
  }

  .gold-text {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold3) 50%, var(--gold) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  .section-label {
    font-family: var(--font-body);
    font-size: 11px; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase;
    color: var(--gold);
  }
  .section-title {
    font-family: var(--font-head);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 900; line-height: 1.15; color: var(--white);
  }

  /* Buttons */
  .btn-gold {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%);
    color: var(--navy); font-family: var(--font-body);
    font-weight: 700; font-size: 15px; padding: 14px 32px;
    border: none; border-radius: 50px; cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(201,168,76,0.35);
  }
  .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,168,76,0.5); }

  .btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: var(--white); font-family: var(--font-body);
    font-weight: 600; font-size: 15px; padding: 13px 32px;
    border: 1.5px solid rgba(255,255,255,0.3); border-radius: 50px; cursor: pointer;
    transition: all 0.2s;
  }
  .btn-outline:hover { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.07); }

  .btn-sm-gold {
    display: inline-flex; align-items: center; gap: 6px;
    background: transparent; color: var(--gold); font-family: var(--font-body);
    font-weight: 700; font-size: 13px; padding: 8px 18px;
    border: 1.5px solid var(--gold); border-radius: 50px; cursor: pointer; transition: all 0.2s;
  }
  .btn-sm-gold:hover { background: var(--gold); color: var(--navy); }

  /* Navbar */
  .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; transition: all 0.3s; }
  .navbar.scrolled {
    background: rgba(10,22,40,0.95); backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border); box-shadow: 0 4px 40px rgba(0,0,0,0.4);
  }
  .nav-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; padding: 18px 40px; gap: 32px;
  }
  .nav-logo {
    font-family: var(--font-head); font-size: 26px; font-weight: 900;
    text-decoration: none; color: var(--white); margin-right: auto;
    display: flex; align-items: center; gap: 10px;
  }
  .nav-logo span.dot { color: var(--gold); }
  .nav-links { display: flex; align-items: center; gap: 28px; list-style: none; }
  .nav-links a { color: rgba(255,255,255,0.72); font-size: 14px; font-weight: 500; text-decoration: none; transition: color 0.2s; }
  .nav-links a:hover { color: var(--gold); }
  .nav-actions { display: flex; align-items: center; gap: 12px; }
  .nav-login {
    background: transparent; border: none; cursor: pointer;
    color: rgba(255,255,255,0.8); font-family: var(--font-body);
    font-size: 14px; font-weight: 600; padding: 8px 16px; border-radius: 50px; transition: color 0.2s;
  }
  .nav-login:hover { color: var(--gold); }
  .nav-register {
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    border: none; cursor: pointer; color: var(--navy); font-family: var(--font-body);
    font-size: 14px; font-weight: 700; padding: 9px 22px; border-radius: 50px; transition: all 0.2s;
    box-shadow: 0 2px 12px rgba(201,168,76,0.3);
  }
  .nav-register:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(201,168,76,0.45); }

  /* User avatar pill in navbar */
  .nav-user-pill {
    display: flex; align-items: center; gap: 10px;
    background: rgba(201,168,76,0.1); border: 1px solid var(--border);
    border-radius: 50px; padding: 6px 14px 6px 6px;
  }
  .nav-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: var(--navy); font-size: 13px; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
  }
  .nav-user-name { font-size: 13px; font-weight: 600; color: var(--white); }
  .nav-logout {
    background: transparent; border: 1px solid rgba(255,255,255,0.15);
    color: var(--muted); font-family: var(--font-body); font-size: 12px;
    font-weight: 600; padding: 6px 14px; border-radius: 50px; cursor: pointer; transition: all 0.2s;
  }
  .nav-logout:hover { border-color: #ef4444; color: #ef4444; background: rgba(239,68,68,0.08); }

  /* Hero */
  .hero {
    min-height: 100vh;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, var(--slate) 0%, var(--navy) 70%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 140px 24px 80px; position: relative; overflow: hidden;
  }
  .hero-orb { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; }
  .orb1 { width: 500px; height: 500px; top: -100px; left: -120px;
           background: radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%); }
  .orb2 { width: 400px; height: 400px; bottom: -80px; right: -80px;
           background: radial-gradient(circle, rgba(30,58,95,0.9) 0%, transparent 70%); }
  .orb3 { width: 300px; height: 300px; top: 30%; right: 10%;
           background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%); }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(201,168,76,0.12); border: 1px solid var(--border);
    padding: 6px 16px; border-radius: 50px; margin-bottom: 28px;
    font-size: 13px; font-weight: 600; color: var(--gold2); backdrop-filter: blur(10px);
  }
  .hero-badge-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--gold); animation: pulseGold 2s infinite;
  }
  .hero-title {
    font-family: var(--font-head);
    font-size: clamp(2.8rem, 7vw, 5.5rem);
    font-weight: 900; line-height: 1.08; color: var(--white);
    margin-bottom: 24px; max-width: 860px;
  }
  .hero-sub {
    font-size: clamp(1rem, 2vw, 1.2rem); color: var(--muted);
    max-width: 560px; line-height: 1.75; margin-bottom: 44px; font-weight: 400;
  }
  .hero-welcome {
    font-family: var(--font-head);
    font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 900;
    color: var(--white); margin-bottom: 16px;
  }
  .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-bottom: 72px; }
  .hero-stats {
    display: flex; gap: 48px; flex-wrap: wrap; justify-content: center;
    border-top: 1px solid rgba(255,255,255,0.08); padding-top: 48px;
    width: 100%; max-width: 700px;
  }
  .hero-stat { text-align: center; }
  .hero-stat-num { font-family: var(--font-head); font-size: 2.4rem; font-weight: 900; line-height: 1; margin-bottom: 6px; }
  .hero-stat-label { font-size: 13px; color: var(--muted); font-weight: 500; }

  /* Ticker */
  .ticker-wrap { background: linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%); overflow: hidden; padding: 14px 0; }
  .ticker-inner { display: flex; gap: 60px; width: max-content; animation: ticker 22s linear infinite; white-space: nowrap; }
  .ticker-item { display: flex; align-items: center; gap: 14px; font-size: 13px; font-weight: 700; color: var(--navy); text-transform: uppercase; letter-spacing: 1px; }

  /* Card */
  .card-glass {
    background: rgba(13,30,56,0.7); border: 1px solid var(--border);
    border-radius: 20px; backdrop-filter: blur(10px); transition: all 0.3s;
  }
  .card-glass:hover { border-color: rgba(201,168,76,0.5); transform: translateY(-6px); box-shadow: 0 24px 48px rgba(0,0,0,0.35); }

  .section { padding: 100px 24px; }
  .section-center { text-align: center; max-width: 600px; margin: 0 auto 64px; }
  .section-center p { color: var(--muted); margin-top: 16px; font-size: 17px; line-height: 1.7; }
  .container { max-width: 1200px; margin: 0 auto; }

  .feat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
  .feat-card { padding: 36px 32px; position: relative; overflow: hidden; }
  .feat-icon-wrap { width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 22px; }
  .feat-card h3 { font-family: var(--font-head); font-size: 1.3rem; font-weight: 700; color: var(--white); margin-bottom: 12px; }
  .feat-card p { color: var(--muted); font-size: 15px; line-height: 1.7; }
  .feat-glow { position: absolute; width: 120px; height: 120px; border-radius: 50%; filter: blur(50px); pointer-events: none; bottom: -30px; right: -20px; opacity: 0.5; }

  .why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .why-img { background: var(--card-bg); border-radius: 28px; border: 1px solid var(--border); min-height: 480px; padding: 40px; display: flex; flex-direction: column; gap: 20px; position: relative; overflow: hidden; }
  .why-img::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.12) 0%, transparent 60%); }
  .profile-mini { display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 14px; padding: 14px 18px; transition: all 0.3s; }
  .profile-mini:hover { border-color: var(--gold); background: rgba(201,168,76,0.07); }
  .profile-avatar { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; flex-shrink: 0; }
  .profile-info { flex: 1; }
  .profile-name { font-size: 14px; font-weight: 600; color: var(--white); }
  .profile-role { font-size: 12px; color: var(--muted); }
  .profile-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 50px; }

  .why-points { list-style: none; display: flex; flex-direction: column; gap: 20px; }
  .why-point { display: flex; align-items: flex-start; gap: 16px; }
  .why-check { width: 28px; height: 28px; border-radius: 50%; background: rgba(201,168,76,0.15); border: 1.5px solid var(--gold); display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; margin-top: 3px; color: var(--gold); }
  .why-point h4 { font-size: 16px; font-weight: 700; color: var(--white); margin-bottom: 4px; }
  .why-point p { font-size: 14px; color: var(--muted); line-height: 1.6; }

  .res-bg { background: var(--navy2); }
  .res-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
  .res-card { padding: 28px; cursor: pointer; display: flex; flex-direction: column; gap: 16px; }
  .res-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 50px; }
  .res-card h4 { font-size: 16px; font-weight: 700; color: var(--white); line-height: 1.4; }
  .res-card p { font-size: 14px; color: var(--muted); line-height: 1.6; flex: 1; }
  .res-footer { display: flex; align-items: center; justify-content: space-between; }
  .res-count { font-size: 12px; color: var(--muted); }
  .res-arrow { color: var(--gold); font-size: 18px; }

  .test-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
  .test-card { padding: 32px; display: flex; flex-direction: column; gap: 20px; }
  .test-stars { color: var(--gold); font-size: 16px; letter-spacing: 2px; }
  .test-quote { font-size: 15px; color: rgba(255,255,255,0.82); line-height: 1.75; font-style: italic; }
  .test-author { display: flex; align-items: center; gap: 14px; }
  .test-avatar { width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; flex-shrink: 0; }
  .test-name { font-size: 15px; font-weight: 700; color: var(--white); }
  .test-role { font-size: 13px; color: var(--muted); }

  .timeline { position: relative; padding-left: 32px; }
  .timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, var(--gold), transparent); }
  .tl-item { position: relative; padding-bottom: 40px; }
  .tl-item:last-child { padding-bottom: 0; }
  .tl-dot { position: absolute; left: -40px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: var(--navy); border: 2.5px solid var(--gold); box-shadow: 0 0 0 4px rgba(201,168,76,0.15); }
  .tl-dot.active { background: var(--gold); }
  .tl-level { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--gold); margin-bottom: 6px; }
  .tl-name { font-size: 17px; font-weight: 700; color: var(--white); margin-bottom: 8px; }
  .tl-desc { font-size: 14px; color: var(--muted); line-height: 1.6; }

  .cta-section { background: linear-gradient(135deg, var(--slate) 0%, var(--navy3) 100%); border: 1px solid var(--border); border-radius: 28px; padding: 80px 48px; text-align: center; position: relative; overflow: hidden; margin: 0 24px; }
  .cta-section::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 50% 0%, rgba(201,168,76,0.15) 0%, transparent 60%); pointer-events: none; }
  .cta-section h2 { font-family: var(--font-head); font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 900; color: var(--white); margin-bottom: 18px; position: relative; }

  .footer { background: #060e1c; padding: 80px 24px 32px; }
  .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 40px; }
  .footer-brand { max-width: 280px; }
  .footer-logo { font-family: var(--font-head); font-size: 24px; font-weight: 900; color: var(--white); margin-bottom: 14px; }
  .footer-desc { font-size: 14px; color: var(--muted); line-height: 1.7; margin-bottom: 24px; }
  .social-links { display: flex; gap: 12px; }
  .social-btn { width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 15px; color: var(--muted); cursor: pointer; transition: all 0.2s; text-decoration: none; }
  .social-btn:hover { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.1); }
  .footer-col h5 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--gold); margin-bottom: 20px; }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 11px; }
  .footer-links a { font-size: 14px; color: var(--muted); text-decoration: none; transition: color 0.2s; }
  .footer-links a:hover { color: var(--white); }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.07); margin-top: 60px; padding-top: 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .footer-copy { font-size: 13px; color: var(--muted); }
  .footer-badges { display: flex; gap: 10px; }
  .footer-badge { font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); color: var(--muted); }

  .chips-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
  .chip { display: flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 50px; font-size: 13px; font-weight: 500; color: var(--muted); transition: all 0.2s; }
  .chip:hover { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.07); }

  @media (max-width: 900px) {
    .nav-links { display: none; }
    .why-grid { grid-template-columns: 1fr; }
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .cta-section { margin: 0 12px; padding: 52px 28px; }
  }
  @media (max-width: 600px) {
    .nav-inner { padding: 14px 20px; }
    .footer-grid { grid-template-columns: 1fr; }
    .hero-stats { gap: 28px; }
    .why-img { min-height: auto; }
    .nav-user-name { display: none; }
  }
`;

// ─── Static Data ──────────────────────────────────────────────────────────────
const features = [
    { icon: "📚", color: "#c9a84c", bg: "rgba(201,168,76,0.12)", title: "CA Study Hub", desc: "Curated notes, past papers, ICAI study material, and expert-crafted mock tests for Foundation, Inter & Final." },
    { icon: "🤝", color: "#4ea8de", bg: "rgba(78,168,222,0.12)", title: "Mentorship Program", desc: "Get 1-on-1 guidance from qualified CAs and industry veterans. Personalised roadmaps for every stage." },
    { icon: "📰", color: "#63e6be", bg: "rgba(99,230,190,0.12)", title: "Articles & Insights", desc: "Daily articles on GST, Income Tax, Auditing, FEMA, IND AS, and emerging finance trends by top CA writers." },
    { icon: "💼", color: "#f77f00", bg: "rgba(247,127,0,0.12)", title: "Job & Articleship Board", desc: "Discover articleship openings and job placements from Big 4s, boutique firms, and corporates across India." },
    { icon: "🏆", color: "#a78bfa", bg: "rgba(167,139,250,0.12)", title: "Exam Prep Analytics", desc: "Track your mock test performance with percentile rankings, weak-topic identification and smart study plans." },
    { icon: "🌐", color: "#f472b6", bg: "rgba(244,114,182,0.12)", title: "Global CA Network", desc: "Connect with CPAs, ACCAs, CMAs, and ICAIs worldwide. Expand your professional footprint beyond borders." },
];

const resources = [
    { tag: "Foundation", tagColor: "#c9a84c", tagBg: "rgba(201,168,76,0.15)", icon: "🔖", title: "Principles of Accounting – Complete Notes", desc: "Chapter-wise notes, diagrams, and solved examples covering the entire Foundation syllabus.", count: "2,340 saved" },
    { tag: "Intermediate", tagColor: "#63e6be", tagBg: "rgba(99,230,190,0.12)", icon: "📊", title: "Advanced Accounting & Corporate Laws", desc: "Comprehensive coverage of Group 1 & 2 subjects with ICAI RTP alignment.", count: "1,870 saved" },
    { tag: "Final", tagColor: "#a78bfa", tagBg: "rgba(167,139,250,0.12)", icon: "⚖️", title: "Financial Reporting (IND AS) Masterclass", desc: "In-depth IND AS notes with practical illustrations and recent exam trends.", count: "3,110 saved" },
    { tag: "Practice", tagColor: "#f77f00", tagBg: "rgba(247,127,0,0.12)", icon: "🎯", title: "Mock Test Series – May 2025 Attempt", desc: "Full-length papers modelled on ICAI pattern with detailed solution discussions.", count: "5,670 saved" },
    { tag: "GST", tagColor: "#4ea8de", tagBg: "rgba(78,168,222,0.12)", icon: "🧾", title: "GST Amendments & Budget Updates 2024-25", desc: "All recent amendments, notifications, and circulars explained in simple language.", count: "4,200 saved" },
    { tag: "Career", tagColor: "#f472b6", tagBg: "rgba(244,114,182,0.12)", icon: "🚀", title: "Articleship – How to Find the Best Firm", desc: "Insider guide to applying at Big 4s, mid-tier firms, and negotiating terms.", count: "2,980 saved" },
];

const testimonials = [
    { stars: "★★★★★", quote: "CA Connect completely changed how I prepared for my Intermediate exams. The mentors here are real CAs who understand exactly what the ICAI expects.", name: "Priya Sharma", role: "CA Intermediate — AIR 12", color: "#c9a84c", initials: "PS" },
    { stars: "★★★★★", quote: "From articleship search to landing a role at Deloitte, CA Connect's network was invaluable. This platform truly bridges the gap between students and professionals.", name: "Arjun Mehta", role: "Chartered Accountant, Deloitte Mumbai", color: "#63e6be", initials: "AM" },
    { stars: "★★★★★", quote: "The mock test analytics helped me identify I was losing marks in SFM derivatives. Fixing that weakness improved my score by 18 marks in the actual exam!", name: "Sneha Iyer", role: "CA Final Student — Batch 2024", color: "#a78bfa", initials: "SI" },
    { stars: "★★★★★", quote: "As a CA running a practice, I use CA Connect to find talented CA students for internships and to share my knowledge with the next generation.", name: "CA Rajiv Khanna", role: "Partner, Khanna & Associates", color: "#4ea8de", initials: "RK" },
    { stars: "★★★★★", quote: "The articles on GST and Direct Tax are consistently high quality. It's now my go-to source for staying updated on regulatory changes.", name: "CA Neha Gupta", role: "Tax Consultant, Chennai", color: "#f472b6", initials: "NG" },
    { stars: "★★★★★", quote: "I cleared Foundation in my first attempt — largely because of the structured study material and the weekly mentor calls available on this platform.", name: "Rohan Verma", role: "CA Foundation — Cleared Nov 2024", color: "#f77f00", initials: "RV" },
];

const professionals = [
    { initials: "AK", color: "#c9a84c", name: "Ananya Krishnan", role: "Big 4 Auditor", badge: "Available", badgeColor: "#10b981", badgeBg: "rgba(16,185,129,0.15)" },
    { initials: "VM", color: "#4ea8de", name: "Varun Malhotra", role: "CA – Tax Expert", badge: "Mentor", badgeColor: "#c9a84c", badgeBg: "rgba(201,168,76,0.15)" },
    { initials: "DG", color: "#a78bfa", name: "Divya Gupta", role: "ICAI Ranker", badge: "Student", badgeColor: "#a78bfa", badgeBg: "rgba(167,139,250,0.15)" },
    { initials: "RS", color: "#63e6be", name: "Ravi Shetty", role: "CFO – NBFC", badge: "Pro", badgeColor: "#f77f00", badgeBg: "rgba(247,127,0,0.15)" },
];

const tickerItems = ["Foundation", "Intermediate", "Final", "Articleship", "GST Updates", "Tax Planning", "Audit Insights", "IND AS", "FEMA Compliance", "CA Jobs"];

const examStages = [
    { level: "Stage 01", name: "CA Foundation", desc: "Entry-level exam covering Principles of Accounting, Business Laws, Math & LR, and Business Economics.", active: true },
    { level: "Stage 02", name: "CA Intermediate", desc: "Two groups covering Advanced Accounting, Corporate Laws, Taxation, Auditing, and Financial Management." },
    { level: "Stage 03", name: "Articleship (3 Years)", desc: "Practical training under a practicing CA — the backbone of the CA curriculum with real-world exposure." },
    { level: "Stage 04", name: "CA Final", desc: "The pinnacle — Financial Reporting, Advanced Audit, Strategic Management, Direct & Indirect Tax Laws." },
];

// ─── Helper: get display name from tokenData ──────────────────────────────────
function getUserDisplayName(tokenData) {
    if (!tokenData) return "";
    // Common OIDC claims — adjust based on your provider's token structure
    return (
        tokenData.name ||
        tokenData.given_name ||
        tokenData.preferred_username ||
        tokenData.email?.split("@")[0] ||
        "User"
    );
}

function getUserInitials(tokenData) {
    const name = getUserDisplayName(tokenData);
    return name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join("");
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function HomePage() {
    const [scrolled, setScrolled] = useState(false);

    // ── Auth (OAuth2 PKCE + Redux) ──────────────────────────────────────────────
    // Destructure idToken from AuthContext (alongside token)
    const { token, tokenData, idToken, logIn, userId, logOut, error: authError } = useContext(AuthContext);
    const dispatch = useDispatch();

    // Sync OAuth token → Redux store whenever token/tokenData changes
    useEffect(() => {
        if (token && tokenData) {
            dispatch(setCredential({ token, user: tokenData }));
            // console.log("User Data: " + tokenData + " \n" + "token: " + token + " \n" + "userId: " +JSON.parse( localStorage.getItem("user")).name);

        }
    }, [token, tokenData, dispatch]);



    // ── Scroll detection ────────────────────────────────────────────────────────
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);


    // ── Derived auth values ─────────────────────────────────────────────────────
    const isLoggedIn = Boolean(token);
    const displayName = getUserDisplayName(tokenData);
    const initials = getUserInitials(tokenData);


    // ─── Inside HomePage component ────────────────────────────────────────────────

    const handleLogout = () => {
        // 1. Clear Redux auth state
        dispatch(logout());

        // 2. Wipe ALL storage so the OAuth library finds no tokens on reload
        sessionStorage.clear();
        localStorage.clear();

        // 3. End the Keycloak SSO session server-side, then return to homepage.
        //    We do NOT call logOut() from the library — that causes it to
        //    immediately re-initiate a new login flow after the redirect returns.
        if (idToken) {
            const logoutUrl = new URL(
                "http://localhost:8090/realms/ca-connect/protocol/openid-connect/logout"
            );
            logoutUrl.searchParams.set("client_id", "ca-connect");
            logoutUrl.searchParams.set("post_logout_redirect_uri", window.location.origin);
            logoutUrl.searchParams.set("id_token_hint", idToken);
            window.location.href = logoutUrl.toString();
        } else {
            // No idToken — just go home; cleared storage means the library
            // won't find any tokens and will render the guest view.
            window.location.href = window.location.origin;
        }
    };

    const handleRegister = () => {
        // Keycloak's dedicated registration endpoint
        const params = new URLSearchParams({
            client_id: "ca-connect",
            redirect_uri: window.location.origin,
            response_type: "code",
            scope: "openid profile email",
        });

        const registerUrl =
            `http://localhost:8090/realms/ca-connect/protocol/openid-connect/registrations?${params}`;

        window.location.href = registerUrl;
    };
    /*navigation links */
    const navLinks = [
        { name: "Study Resources", path: "/study-materials" },
        { name: "Community", path: "/community" },
        { name: "Mentorship", path: "/mentorship" },
        { name: "Create Profile", path: "/create-profile" },
        { name: "Exam Info", path: "/exam-info" }
    ];
    return (
        <>
            <style>{css}</style>

            {/* ── NAVBAR ── */}
            <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
                <div className="nav-inner">
                    <a className="nav-logo" href="#">
                        <span style={{ background: "linear-gradient(135deg,#c9a84c,#e8c97a)", borderRadius: "10px", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#0a1628", fontWeight: 900 }}>CA</span>
                        Connect<span className="dot">.</span>
                    </a>



                    <ul className="nav-links">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link to={link.path}>{link.name}</Link>
                            </li>
                        ))}
                    </ul>

                    <div className="nav-actions">
                        {isLoggedIn ? (
                            /* ── Logged-in state: avatar pill + logout ── */
                            <>
                                <div className="nav-user-pill">
                                    <div className="nav-avatar">{initials || "U"}</div>
                                    <span className="nav-user-name">Hi, {displayName}</span>
                                </div>
                                <button className="nav-logout" onClick={handleLogout}>
                                    Log Out
                                </button>
                            </>
                        ) : (
                            /* ── Logged-out state: login + register ── */
                            <>
                                <button className="nav-login" onClick={() => logIn()}>
                                    Log In
                                </button>
                                <button className="nav-register" onClick={handleRegister}>
                                    Register Free
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="hero noise">
                <div className="hero-orb orb1" />
                <div className="hero-orb orb2" />
                <div className="hero-orb orb3" />

                {isLoggedIn ? (
                    /* ── Personalised hero for logged-in users ── */
                    <>
                        <div className="hero-badge fade-up">
                            <span className="hero-badge-dot" />
                            Welcome back to CA Connect
                        </div>
                        <h1 className="hero-welcome fade-up delay-1">
                            Good to see you, <span className="gold-text">{displayName}!</span>
                        </h1>
                        <p className="hero-sub fade-up delay-2">
                            Pick up where you left off. Your study resources, mentor sessions, and community discussions are waiting for you.
                        </p>
                        <div className="hero-actions fade-up delay-3">
                            <button className="btn-gold">Go to Dashboard →</button>
                            <button className="btn-outline">Browse Resources</button>
                        </div>
                    </>
                ) : (
                    /* ── Public hero for guests ── */
                    <>
                        <div className="hero-badge fade-up">
                            <span className="hero-badge-dot" />
                            India's Premier CA Community Platform
                        </div>
                        <h1 className="hero-title fade-up delay-1">
                            Where <span className="gold-text">CA Aspirants</span><br />
                            Meet Qualified <span className="gold-text">Professionals</span>
                        </h1>
                        <p className="hero-sub fade-up delay-2">
                            Join 85,000+ students and CAs on the most trusted platform for study resources, mentorship, and career growth in Chartered Accountancy.
                        </p>
                        <div className="hero-actions fade-up delay-3">
                            <button className="btn-gold" onClick={() => logIn()}>
                                Start Your Journey →
                            </button>
                            <button className="btn-outline">▶ See How It Works</button>
                        </div>
                    </>
                )}

                <div className="hero-stats fade-up delay-4">
                    {[
                        { num: "85K+", label: "Active Members", color: "#c9a84c" },
                        { num: "1,200+", label: "Verified CA Mentors", color: "#63e6be" },
                        { num: "15K+", label: "Study Resources", color: "#4ea8de" },
                        { num: "92%", label: "Exam Pass Rate", color: "#a78bfa" },
                    ].map((s, i) => (
                        <div key={i} className="hero-stat">
                            <div className="hero-stat-num" style={{ color: s.color }}>{s.num}</div>
                            <div className="hero-stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="chips-row fade-up delay-5" style={{ justifyContent: "center" }}>
                    {["📊 IND AS Updates", "📋 ICAI Approved", "🎯 Smart Mock Tests", "🔐 Verified CAs Only", "📱 Mobile Friendly"].map((chip, i) => (
                        <div key={i} className="chip"><span>{chip}</span></div>
                    ))}
                </div>

                {/* Auth error banner */}
                {authError && (
                    <div style={{ marginTop: 20, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: "10px 20px", fontSize: 13, color: "#fca5a5" }}>
                        ⚠️ Authentication error: {authError}
                    </div>
                )}
            </section>

            {/* ── TICKER ── */}
            <div className="ticker-wrap">
                <div className="ticker-inner">
                    {[...tickerItems, ...tickerItems].map((item, i) => (
                        <span key={i} className="ticker-item">
                            {i % 2 === 0 ? "◆" : "●"}&nbsp;&nbsp;{item}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── FEATURES ── */}
            <section className="section">
                <div className="container">
                    <div className="section-center">
                        <div className="section-label">What We Offer</div>
                        <h2 className="section-title" style={{ marginTop: 12 }}>
                            Everything a CA needs,<br />in one place
                        </h2>
                        <p>From Foundation prep to Final exam to post-qualification career, CA Connect is your lifelong partner in the journey of Chartered Accountancy.</p>
                    </div>
                    <div className="feat-grid">
                        {features.map((f, i) => (
                            <div key={i} className={`card-glass feat-card fade-up delay-${(i % 3) + 1}`}>
                                <div className="feat-icon-wrap" style={{ background: f.bg }}>
                                    <span role="img">{f.icon}</span>
                                </div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                                <div className="feat-glow" style={{ background: f.color }} />
                                <div style={{ marginTop: 20 }}>
                                    <span className="btn-sm-gold">Explore →</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHY CA CONNECT ── */}
            <section className="section res-bg">
                <div className="container">
                    <div className="why-grid">
                        <div className="why-img">
                            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8, position: "relative" }}>
                                🟢 Active Community — Live Now
                            </div>
                            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 8, position: "relative" }}>Connect with verified CAs and top-ranked students</p>
                            {professionals.map((p, i) => (
                                <div key={i} className="profile-mini">
                                    <div className="profile-avatar" style={{ background: `${p.color}22`, color: p.color }}>{p.initials}</div>
                                    <div className="profile-info">
                                        <div className="profile-name">{p.name}</div>
                                        <div className="profile-role">{p.role}</div>
                                    </div>
                                    <span className="profile-badge" style={{ color: p.badgeColor, background: p.badgeBg }}>{p.badge}</span>
                                </div>
                            ))}
                            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                                {[["💬", "12K+ Daily Messages"], ["🧑‍🤝‍🧑", "340 Groups"], ["🎓", "98 Live Sessions/Month"]].map(([icon, text], i) => (
                                    <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 12px", fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
                                        <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>{text}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="section-label">Why CA Connect</div>
                            <h2 className="section-title" style={{ marginTop: 12, marginBottom: 32 }}>Built by CAs,<br />for CAs</h2>
                            <ul className="why-points">
                                {[
                                    { title: "ICAI Syllabus Aligned", desc: "All study material, mock tests, and discussions are precisely aligned to the latest ICAI curriculum and examination pattern." },
                                    { title: "Verified Professional Network", desc: "Every CA mentor is KYC-verified with ICAI registration. You're always learning from real, qualified professionals." },
                                    { title: "Real-time Regulatory Updates", desc: "GST amendments, CBDT circulars, SEBI notifications, and MCA updates land on your feed the same day they're released." },
                                    { title: "Personalised Learning Paths", desc: "Our smart algorithm creates a custom study schedule based on your exam date, performance data, and weak areas." },
                                    { title: "Articleship & Career Support", desc: "Dedicated team to help you find the right firm, prepare for interviews, and negotiate your terms." },
                                ].map((w, i) => (
                                    <li key={i} className="why-point">
                                        <div className="why-check">✓</div>
                                        <div><h4>{w.title}</h4><p>{w.desc}</p></div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STUDY RESOURCES ── */}
            <section className="section">
                <div className="container">
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 48 }}>
                        <div>
                            <div className="section-label">Study Resources</div>
                            <h2 className="section-title" style={{ marginTop: 10 }}>Top Picks This Week</h2>
                        </div>
                        <button className="btn-sm-gold">Browse All Resources →</button>
                    </div>
                    <div className="res-grid">
                        {resources.map((r, i) => (
                            <div key={i} className="card-glass res-card">
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <span className="res-tag" style={{ color: r.tagColor, background: r.tagBg }}>{r.tag}</span>
                                    <span style={{ fontSize: 22 }}>{r.icon}</span>
                                </div>
                                <h4>{r.title}</h4>
                                <p>{r.desc}</p>
                                <div className="res-footer">
                                    <span className="res-count">🔖 {r.count}</span>
                                    <span className="res-arrow">→</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CA JOURNEY ROADMAP ── */}
            <section className="section res-bg">
                <div className="container">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
                        <div>
                            <div className="section-label">CA Exam Journey</div>
                            <h2 className="section-title" style={{ marginTop: 12, marginBottom: 14 }}>Your Roadmap to<br />Becoming a CA</h2>
                            <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
                                The Chartered Accountancy course is one of India's most prestigious professional qualifications. CA Connect supports you at every stage.
                            </p>
                            <button className="btn-gold">Explore Resources by Stage →</button>
                            <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                {[
                                    { icon: "📅", label: "May & Nov", sub: "ICAI Exam Windows" },
                                    { icon: "⏱️", label: "3–5 Years", sub: "Average Completion" },
                                    { icon: "🏅", label: "Top 1%", sub: "Profession Prestige" },
                                    { icon: "🌍", label: "Global", sub: "Recognition by IFAC" },
                                ].map((s, i) => (
                                    <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px" }}>
                                        <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                                        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--white)" }}>{s.label}</div>
                                        <div style={{ fontSize: 13, color: "var(--muted)" }}>{s.sub}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="timeline">
                                {examStages.map((s, i) => (
                                    <div key={i} className="tl-item">
                                        <div className={`tl-dot${s.active ? " active" : ""}`} />
                                        <div className="tl-level">{s.level}</div>
                                        <div className="tl-name">{s.name}</div>
                                        <div className="tl-desc">{s.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="section">
                <div className="container">
                    <div className="section-center">
                        <div className="section-label">Community Voices</div>
                        <h2 className="section-title" style={{ marginTop: 12 }}>Trusted by students<br />& professionals alike</h2>
                    </div>
                    <div className="test-grid">
                        {testimonials.map((t, i) => (
                            <div key={i} className="card-glass test-card">
                                <div className="test-stars">{t.stars}</div>
                                <p className="test-quote">"{t.quote}"</p>
                                <div className="test-author">
                                    <div className="test-avatar" style={{ background: `${t.color}22`, color: t.color }}>{t.initials}</div>
                                    <div>
                                        <div className="test-name">{t.name}</div>
                                        <div className="test-role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── LATEST ARTICLES ── */}
            <section className="section res-bg">
                <div className="container">
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 44 }}>
                        <div>
                            <div className="section-label">Knowledge Base</div>
                            <h2 className="section-title" style={{ marginTop: 10 }}>Latest Articles</h2>
                        </div>
                        <button className="btn-sm-gold">View All Articles →</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                        {[
                            { cat: "GST", catColor: "#63e6be", catBg: "rgba(99,230,190,0.12)", title: "Union Budget 2025: All GST Amendments Explained", author: "CA Rohit Agarwal", date: "Mar 5, 2025", read: "8 min read" },
                            { cat: "Income Tax", catColor: "#c9a84c", catBg: "rgba(201,168,76,0.12)", title: "New Tax Regime vs Old Regime: A Complete Analysis for AY 2025-26", author: "CA Priti Joshi", date: "Feb 28, 2025", read: "12 min read" },
                            { cat: "Audit", catColor: "#4ea8de", catBg: "rgba(78,168,222,0.12)", title: "SA 701 – Key Audit Matters: Implementation Guide for Practitioners", author: "CA Suresh Nair", date: "Feb 20, 2025", read: "10 min read" },
                            { cat: "Exam Tips", catColor: "#a78bfa", catBg: "rgba(167,139,250,0.12)", title: "How CA Final Toppers Studied SFM: A Data-Driven Approach", author: "CA Connect Team", date: "Feb 14, 2025", read: "6 min read" },
                        ].map((a, i) => (
                            <div key={i} className="card-glass" style={{ padding: "28px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 14 }}>
                                <span style={{ display: "inline-flex", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, padding: "4px 12px", borderRadius: 50, color: a.catColor, background: a.catBg }}>{a.cat}</span>
                                <h4 style={{ fontSize: 16, fontWeight: 700, color: "var(--white)", lineHeight: 1.45 }}>{a.title}</h4>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                                    <div>
                                        <div style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600 }}>{a.author}</div>
                                        <div style={{ fontSize: 12, color: "var(--muted)" }}>{a.date} · {a.read}</div>
                                    </div>
                                    <span style={{ color: "var(--gold)", fontSize: 18 }}>→</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="section" style={{ paddingTop: 0, paddingBottom: 80 }}>
                <div className="cta-section">
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <div className="section-label" style={{ marginBottom: 16 }}>Join 85,000+ CAs & Students</div>
                        <h2>Ready to accelerate your<br /><span className="gold-text">CA journey?</span></h2>
                        <p style={{ color: "var(--muted)", fontSize: 17, margin: "16px auto 40px", maxWidth: 480 }}>
                            Sign up in 30 seconds — free forever for students. Access study resources, connect with mentors, and never miss an important update again.
                        </p>
                        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                            {isLoggedIn ? (
                                <button className="btn-gold">Go to Dashboard →</button>
                            ) : (
                                <button className="btn-gold" onClick={() => logIn()}>Create Free Account →</button>
                            )}
                            <button className="btn-outline">Explore as Guest</button>
                        </div>
                        <div style={{ display: "flex", gap: 28, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
                            {["✅ No credit card required", "✅ ICAI data never shared", "✅ Cancel anytime"].map((t, i) => (
                                <span key={i} style={{ fontSize: 13, color: "var(--muted)" }}>{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <div className="footer-logo">CA<span style={{ color: "var(--gold)" }}>Connect.</span></div>
                            <p className="footer-desc">India's most trusted platform connecting CA students, aspirants, and qualified professionals. Learn, network, and grow — together.</p>
                            <div className="social-links">
                                {["𝕏", "in", "f", "▶"].map((s, i) => <a key={i} href="#" className="social-btn">{s}</a>)}
                            </div>
                        </div>
                        {[
                            { title: "Platform", links: ["Study Resources", "Mock Tests", "Mentorship", "Job Board", "Discussion Forum", "CA Events"] },
                            { title: "Exam Support", links: ["CA Foundation", "CA Intermediate", "CA Final", "Articleship Guide", "Exam Calendar", "ICAI Notifications"] },
                            { title: "Company", links: ["About Us", "Blog", "Careers", "Press Kit", "Privacy Policy", "Terms of Service"] },
                        ].map((col, i) => (
                            <div key={i} className="footer-col">
                                <h5>{col.title}</h5>
                                <ul className="footer-links">
                                    {col.links.map((l, j) => <li key={j}><a href="#">{l}</a></li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="footer-bottom">
                        <p className="footer-copy">© 2025 CA Connect Pvt. Ltd. · Made with ♥ for the CA Community</p>
                        <div className="footer-badges">
                            <span className="footer-badge">🔒 Secure</span>
                            <span className="footer-badge">🇮🇳 Made in India</span>
                            <span className="footer-badge">✅ ICAI Community</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}