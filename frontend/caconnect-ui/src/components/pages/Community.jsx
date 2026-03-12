/**
 * Community.jsx — CA Connect Community Hub
 * Self-contained. Back button via useNavigate.
 */

import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap';
if (!document.head.querySelector('[href*="Playfair"]')) document.head.appendChild(fontLink);

// ─── Toast ────────────────────────────────────────────────────────────────────
function useToast() {
    const [toasts, setToasts] = useState([]);
    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
    }, []);
    return { toasts, showToast };
}
function ToastContainer({ toasts }) {
    const palette = { success: '#63e6be', error: '#f87171', info: '#c9a84c', warning: '#f77f00' };
    return (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
            {toasts.map(t => (
                <div key={t.id} style={{ background: '#0d1e38', border: `1px solid ${palette[t.type] || palette.info}`, borderRadius: 14, padding: '13px 22px', color: '#fff', fontSize: 14, fontWeight: 500, boxShadow: '0 8px 32px rgba(0,0,0,0.45)', animation: 'fadeUp 0.3s ease both', maxWidth: 340, fontFamily: "'DM Sans',sans-serif" }}>
                    {t.message}
                </div>
            ))}
        </div>
    );
}

// ─── Back Button ─────────────────────────────────────────────────────────────
function BackButton() {
    const navigate = useNavigate();
    return (
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <span className="back-arrow">←</span>
            <span>Back</span>
        </button>
    );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ initials, color = '#c9a84c', size = 40 }) {
    return (
        <div style={{ width: size, height: size, borderRadius: '50%', background: `linear-gradient(135deg,${color}33,${color}66)`, border: `2px solid ${color}55`, color, fontFamily: "'DM Sans',sans-serif", fontSize: size * 0.35, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {initials}
        </div>
    );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CURRENT_USER = { name: 'You', initials: 'YO', color: '#c9a84c' };

const INITIAL_POSTS = [
    { id: 1, type: 'discussion', author: { name: 'CA Priya Sharma', initials: 'PS', color: '#c9a84c', role: 'CA Final — AIR 12', verified: true }, time: '2 min ago', pinned: true, title: 'Key changes in IND AS 116 (Leases) — May 2025 attempt', body: 'Hey everyone! Just compiled all the amendments to IND AS 116 relevant for the upcoming attempt. The new practical expedient for short-term leases and the disclosure requirements have been tweaked significantly. Sharing my notes below — hope it helps!', tags: ['IND AS', 'CA Final', 'May 2025'], likes: 142, comments: 38, saves: 67, liked: false, saved: false, attachment: { type: 'note', label: 'IND AS 116 — Amendment Notes.pdf', size: '2.4 MB' }, poll: null },
    { id: 2, type: 'poll', author: { name: 'CA Connect Team', initials: 'CC', color: '#4ea8de', role: 'Official Account', verified: true }, time: '1 hr ago', pinned: false, title: 'Which subject do you find hardest in CA Final Group 2?', body: '', tags: ['Poll', 'CA Final'], likes: 89, comments: 24, saves: 0, liked: false, saved: false, attachment: null, poll: { voted: false, selected: null, options: [{ id: 'a', label: 'Strategic Financial Management (SFM)', votes: 412 }, { id: 'b', label: 'Direct Tax Laws & International Taxation', votes: 287 }, { id: 'c', label: 'Indirect Tax Laws (GST + Customs)', votes: 198 }, { id: 'd', label: 'Strategic Cost Management (SCMPE)', votes: 156 }] } },
    { id: 3, type: 'announcement', author: { name: 'ICAI Updates', initials: 'IC', color: '#f77f00', role: 'Official News', verified: true }, time: '3 hrs ago', pinned: false, title: '🔔 ICAI May 2025 Exam Form Dates Released', body: 'The Institute has announced the exam application window for May 2025 attempt. Foundation, Intermediate, and Final students can fill forms from 5th Feb to 25th Feb 2025. Late fee applicable after 25th Feb.', tags: ['ICAI', 'Announcement', 'Exam Schedule'], likes: 534, comments: 112, saves: 289, liked: false, saved: false, attachment: null, poll: null },
    { id: 4, type: 'discussion', author: { name: 'Arjun Mehta', initials: 'AM', color: '#63e6be', role: 'CA Intermediate Student', verified: false }, time: '5 hrs ago', pinned: false, title: 'Mock test scores — how are you all tracking?', body: 'Gave my 4th full mock for Intermediate Group 1 today. Got 68% overall but still struggling with AS questions. Would love to form a study group for the last 3 weeks of prep! 📚', tags: ['CA Inter', 'Mock Tests', 'Study Group'], likes: 47, comments: 61, saves: 12, liked: false, saved: false, attachment: null, poll: null },
    { id: 5, type: 'discussion', author: { name: 'CA Rohit Agarwal', initials: 'RA', color: '#a78bfa', role: 'Tax Consultant', verified: true }, time: '8 hrs ago', pinned: false, title: 'Union Budget 2025 — Direct Tax changes simplified', body: 'Wrote a breakdown of all the Direct Tax changes from the Union Budget. The new slab rates, Section 87A rebate limit, and the revised 80C deduction cap are the three most exam-relevant changes.', tags: ['Budget 2025', 'Direct Tax', 'Article'], likes: 231, comments: 44, saves: 178, liked: false, saved: false, attachment: { type: 'article', label: 'Budget 2025 Direct Tax Simplified', size: 'Read on CA Connect' }, poll: null },
];

const TRENDING_TOPICS = [
    { tag: 'May2025Exam', posts: '3.2K posts' }, { tag: 'INDASAmendments', posts: '1.8K posts' },
    { tag: 'GST2025', posts: '1.4K posts' }, { tag: 'ArticleshipHunt', posts: '980 posts' },
    { tag: 'CAFinalSFM', posts: '870 posts' }, { tag: 'Budget2025', posts: '760 posts' },
    { tag: 'CAAIRRankers', posts: '540 posts' },
];

const GROUPS = [
    { id: 1, name: 'CA Final — May 2025 Batch', members: 4820, icon: '🎯', color: '#c9a84c' },
    { id: 2, name: 'GST Discussion Forum', members: 3110, icon: '🧾', color: '#63e6be' },
    { id: 3, name: 'Articleship Seekers 2025', members: 2760, icon: '💼', color: '#f77f00' },
    { id: 4, name: 'CA Intermediate — Nov 2025', members: 5430, icon: '📚', color: '#4ea8de' },
    { id: 5, name: 'IND AS Study Circle', members: 1890, icon: '📊', color: '#a78bfa' },
];

const LEADERBOARD = [
    { rank: 1, name: 'CA Divya Gupta', initials: 'DG', color: '#c9a84c', points: 9840, badge: '🥇' },
    { rank: 2, name: 'CA Rajiv Khanna', initials: 'RK', color: '#7a8fa6', points: 8720, badge: '🥈' },
    { rank: 3, name: 'Priya Sharma', initials: 'PS', color: '#c9a84c', points: 7510, badge: '🥉' },
    { rank: 4, name: 'Arjun Mehta', initials: 'AM', color: '#63e6be', points: 6230, badge: '' },
    { rank: 5, name: 'CA Neha Gupta', initials: 'NG', color: '#f472b6', points: 5980, badge: '' },
];

const POST_CATEGORIES = ['All', 'Discussions', 'Announcements', 'Polls', 'Resources', 'Jobs'];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --navy:#0a1628;--navy2:#0f2040;--slate:#1e3a5f;--card:#0d1e38;
    --border:rgba(201,168,76,0.18);--gold:#c9a84c;--gold2:#e8c97a;
    --muted:#7a8fa6;--white:#ffffff;--green:#63e6be;--blue:#4ea8de;
    --purple:#a78bfa;--orange:#f77f00;--pink:#f472b6;
    --font-h:'Playfair Display',serif;--font-b:'DM Sans',sans-serif;
  }
  html{scroll-behavior:smooth}
  body{font-family:var(--font-b);background:var(--navy);color:var(--white)}
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-track{background:var(--navy2)}
  ::-webkit-scrollbar-thumb{background:var(--gold);border-radius:4px}

  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
  @keyframes scaleIn{from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}}
  @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
  @keyframes pulseGold{0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0.4)}50%{box-shadow:0 0 0 10px rgba(201,168,76,0)}}
  @keyframes popIn{0%{transform:scale(1)}40%{transform:scale(1.3)}100%{transform:scale(1)}}

  /* ── Back Button ── */
  .back-btn{
    display:inline-flex;align-items:center;gap:9px;
    background:rgba(13,30,56,0.9);border:1px solid rgba(201,168,76,0.28);
    border-radius:50px;padding:10px 20px 10px 14px;
    color:var(--muted);font-family:var(--font-b);font-size:14px;font-weight:600;
    cursor:pointer;transition:all 0.25s ease;backdrop-filter:blur(12px);
    letter-spacing:0.2px;
  }
  .back-btn:hover{background:rgba(201,168,76,0.12);border-color:var(--gold);color:var(--gold);transform:translateX(-3px)}
  .back-arrow{font-size:18px;transition:transform 0.25s ease;display:inline-block}
  .back-btn:hover .back-arrow{transform:translateX(-4px)}

  .page-topbar{max-width:1280px;margin:0 auto;padding:0 28px 28px;animation:fadeUp 0.5s ease both}

  .community-wrap{min-height:100vh;background:radial-gradient(ellipse 120% 60% at 50% -10%,#1e3a5f 0%,#0a1628 55%);padding:100px 0 60px}

  .community-hero{max-width:1280px;margin:0 auto 40px;padding:0 28px;text-align:center;animation:fadeUp 0.7s ease both}
  .community-hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(201,168,76,0.12);border:1px solid var(--border);padding:5px 16px;border-radius:50px;margin-bottom:20px;font-size:12px;font-weight:700;color:var(--gold2);letter-spacing:1px;text-transform:uppercase}
  .pulse-dot{width:7px;height:7px;border-radius:50%;background:var(--green);animation:pulseGold 2s infinite}
  .community-hero h1{font-family:var(--font-h);font-size:clamp(2rem,4vw,3.2rem);font-weight:900;color:var(--white);margin-bottom:12px;line-height:1.1}
  .gold-text{background:linear-gradient(135deg,var(--gold),var(--gold2),var(--gold));background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
  .community-hero p{color:var(--muted);font-size:1.05rem;max-width:520px;margin:0 auto;line-height:1.7}

  .stats-bar{max-width:1280px;margin:0 auto 36px;padding:0 28px;display:flex;gap:20px;flex-wrap:wrap;justify-content:center;animation:fadeUp 0.7s 0.1s ease both}
  .stat-pill{display:flex;align-items:center;gap:10px;background:rgba(13,30,56,0.8);border:1px solid var(--border);border-radius:50px;padding:10px 22px;font-size:13px;font-weight:600;color:var(--white);backdrop-filter:blur(10px)}
  .stat-pill-num{color:var(--gold);font-family:var(--font-h);font-size:15px}

  .category-tabs{max-width:1280px;margin:0 auto 28px;padding:0 28px;display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;animation:fadeUp 0.7s 0.15s ease both}
  .category-tabs::-webkit-scrollbar{display:none}
  .cat-tab{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:50px;padding:9px 22px;color:var(--muted);font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all 0.2s;font-family:var(--font-b)}
  .cat-tab:hover{border-color:var(--gold);color:var(--gold)}
  .cat-tab.active{background:linear-gradient(135deg,var(--gold),var(--gold2));border-color:transparent;color:var(--navy);font-weight:700}

  .community-layout{max-width:1280px;margin:0 auto;padding:0 28px;display:grid;grid-template-columns:1fr 340px;gap:28px;align-items:start}

  .create-post-box{background:rgba(13,30,56,0.85);border:1px solid var(--border);border-radius:20px;padding:20px 24px;margin-bottom:20px;backdrop-filter:blur(10px);display:flex;align-items:center;gap:14px;animation:fadeUp 0.6s 0.2s ease both}
  .create-post-input{flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:50px;padding:11px 20px;color:var(--muted);font-family:var(--font-b);font-size:14px;cursor:pointer;transition:all 0.2s}
  .create-post-input:hover{border-color:var(--gold);color:var(--white)}
  .post-type-btn{display:flex;align-items:center;gap:6px;background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:50px;padding:8px 14px;color:var(--muted);font-family:var(--font-b);font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;white-space:nowrap}
  .post-type-btn:hover{border-color:var(--gold);color:var(--gold)}

  .post-card{background:rgba(13,30,56,0.85);border:1px solid var(--border);border-radius:22px;padding:28px;margin-bottom:18px;backdrop-filter:blur(10px);transition:all 0.3s;position:relative;animation:fadeUp 0.6s ease both}
  .post-card:hover{border-color:rgba(201,168,76,0.4);box-shadow:0 16px 40px rgba(0,0,0,0.3)}
  .post-card.pinned{border-color:rgba(201,168,76,0.4);background:rgba(201,168,76,0.04)}
  .pin-badge{position:absolute;top:20px;right:22px;background:rgba(201,168,76,0.15);border:1px solid rgba(201,168,76,0.3);border-radius:50px;padding:3px 10px;font-size:11px;font-weight:700;color:var(--gold);text-transform:uppercase}

  .post-header{display:flex;align-items:center;gap:14px;margin-bottom:18px}
  .post-author-info{flex:1}
  .post-author-name{font-size:15px;font-weight:700;color:var(--white);display:flex;align-items:center;gap:6px}
  .verified-icon{color:var(--gold);font-size:13px}
  .post-author-role{font-size:12px;color:var(--muted);margin-top:2px}
  .post-time{font-size:12px;color:var(--muted)}

  .post-type-label{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:3px 10px;border-radius:50px;margin-bottom:10px}
  .type-discussion{color:#4ea8de;background:rgba(78,168,222,0.12);border:1px solid rgba(78,168,222,0.2)}
  .type-poll{color:#a78bfa;background:rgba(167,139,250,0.12);border:1px solid rgba(167,139,250,0.2)}
  .type-announcement{color:#f77f00;background:rgba(247,127,0,0.12);border:1px solid rgba(247,127,0,0.2)}
  .type-resource{color:#63e6be;background:rgba(99,230,190,0.12);border:1px solid rgba(99,230,190,0.2)}

  .post-title{font-family:var(--font-h);font-size:1.15rem;font-weight:700;color:var(--white);margin-bottom:10px;line-height:1.35;cursor:pointer}
  .post-title:hover{color:var(--gold2)}
  .post-body{font-size:14px;color:rgba(255,255,255,0.75);line-height:1.75;margin-bottom:18px}

  .post-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px}
  .post-tag{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:50px;padding:4px 12px;font-size:12px;color:var(--muted);transition:all 0.2s;cursor:pointer}
  .post-tag:hover{border-color:var(--gold);color:var(--gold)}

  .post-attachment{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:12px 16px;margin-bottom:18px;cursor:pointer;transition:all 0.2s}
  .post-attachment:hover{border-color:var(--gold);background:rgba(201,168,76,0.06)}
  .attach-label{font-size:13px;font-weight:600;color:var(--white)}
  .attach-size{font-size:11px;color:var(--muted);margin-top:2px}

  .poll-wrap{margin-bottom:18px}
  .poll-option{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px 16px;margin-bottom:10px;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden}
  .poll-option:hover:not(.voted){border-color:rgba(167,139,250,0.4);background:rgba(167,139,250,0.06)}
  .poll-option.selected{border-color:#a78bfa;background:rgba(167,139,250,0.12)}
  .poll-option.voted{cursor:default}
  .poll-bar{position:absolute;left:0;top:0;bottom:0;background:rgba(167,139,250,0.1);border-radius:12px;transition:width 0.5s ease;z-index:0}
  .poll-label{font-size:14px;color:var(--white);font-weight:500;position:relative;z-index:1;flex:1}
  .poll-pct{font-size:13px;font-weight:700;color:#a78bfa;position:relative;z-index:1}
  .poll-vote-count{font-size:12px;color:var(--muted);margin-top:6px;text-align:right}

  .post-footer{display:flex;align-items:center;gap:6px;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;flex-wrap:wrap}
  .action-btn{display:flex;align-items:center;gap:6px;background:transparent;border:none;cursor:pointer;color:var(--muted);font-family:var(--font-b);font-size:13px;font-weight:600;padding:8px 14px;border-radius:50px;transition:all 0.2s}
  .action-btn:hover{background:rgba(255,255,255,0.06);color:var(--white)}
  .action-btn.liked{color:#f472b6}
  .action-btn.saved{color:var(--gold)}
  .action-icon{font-size:16px;transition:transform 0.2s}
  .action-btn:hover .action-icon{transform:scale(1.2)}
  .action-btn.liked .action-icon{animation:popIn 0.3s ease}
  .spacer{flex:1}
  .share-btn{display:flex;align-items:center;gap:6px;background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:50px;padding:7px 16px;color:var(--muted);font-family:var(--font-b);font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s}
  .share-btn:hover{border-color:var(--gold);color:var(--gold)}

  .sidebar{display:flex;flex-direction:column;gap:20px;position:sticky;top:100px}
  .sidebar-card{background:rgba(13,30,56,0.85);border:1px solid var(--border);border-radius:20px;padding:24px;backdrop-filter:blur(10px);animation:slideIn 0.6s ease both}
  .sidebar-title{font-family:var(--font-h);font-size:1.05rem;font-weight:700;color:var(--white);margin-bottom:18px;display:flex;align-items:center;gap:8px}

  .trending-item{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);cursor:pointer;transition:all 0.2s}
  .trending-item:last-child{border-bottom:none;padding-bottom:0}
  .trending-item:hover .trending-tag{color:var(--gold)}
  .trending-tag{font-size:14px;font-weight:600;color:var(--white);transition:color 0.2s}
  .trending-tag::before{content:'#';color:var(--gold);margin-right:2px}
  .trending-count{font-size:11px;color:var(--muted)}

  .group-item{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.05)}
  .group-item:last-child{border-bottom:none;padding-bottom:0}
  .group-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
  .group-info{flex:1}
  .group-name{font-size:13px;font-weight:600;color:var(--white);margin-bottom:3px}
  .group-members{font-size:11px;color:var(--muted)}
  .join-btn{background:transparent;border:1px solid rgba(255,255,255,0.15);border-radius:50px;padding:5px 14px;color:var(--muted);font-family:var(--font-b);font-size:11px;font-weight:700;cursor:pointer;transition:all 0.2s;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap}
  .join-btn:hover{border-color:var(--gold);color:var(--gold)}
  .join-btn.joined{border-color:var(--green);color:var(--green)}

  .lb-item{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05)}
  .lb-item:last-child{border-bottom:none;padding-bottom:0}
  .lb-rank{font-size:16px;width:24px;text-align:center;flex-shrink:0}
  .lb-info{flex:1}
  .lb-name{font-size:13px;font-weight:600;color:var(--white)}
  .lb-points{font-size:11px;color:var(--gold);font-weight:700}

  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px}
  .modal-box{background:#0d1e38;border:1px solid var(--border);border-radius:24px;padding:36px;width:100%;max-width:620px;animation:scaleIn 0.3s ease both;max-height:90vh;overflow-y:auto}
  .modal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px}
  .modal-title{font-family:var(--font-h);font-size:1.4rem;font-weight:900;color:var(--white)}
  .modal-close{background:rgba(255,255,255,0.07);border:none;width:36px;height:36px;border-radius:50%;color:var(--muted);font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s}
  .modal-close:hover{background:rgba(255,255,255,0.12);color:var(--white)}
  .modal-type-row{display:flex;gap:10px;margin-bottom:22px;flex-wrap:wrap}
  .modal-type-btn{display:flex;align-items:center;gap:7px;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.1);border-radius:50px;padding:9px 18px;color:var(--muted);font-family:var(--font-b);font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s}
  .modal-type-btn.selected{border-color:var(--gold);color:var(--gold);background:rgba(201,168,76,0.1)}
  .modal-field{margin-bottom:18px}
  .modal-label{font-size:12px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;display:block}
  .modal-input,.modal-textarea{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:13px 16px;color:var(--white);font-family:var(--font-b);font-size:14px;transition:all 0.2s;resize:none}
  .modal-input:focus,.modal-textarea:focus{outline:none;border-color:var(--gold);background:rgba(255,255,255,0.07)}
  .modal-textarea{min-height:120px;line-height:1.6}
  .modal-input::placeholder,.modal-textarea::placeholder{color:var(--muted)}
  .modal-footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}
  .btn-cancel{background:transparent;border:1px solid rgba(255,255,255,0.15);border-radius:12px;padding:12px 24px;color:var(--muted);font-family:var(--font-b);font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s}
  .btn-cancel:hover{border-color:var(--white);color:var(--white)}
  .btn-post{background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;border-radius:12px;padding:12px 28px;color:var(--navy);font-family:var(--font-b);font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 16px rgba(201,168,76,0.3)}
  .btn-post:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(201,168,76,0.45)}
  .btn-post:disabled{opacity:0.5;cursor:not-allowed;transform:none}

  .load-more-btn{width:100%;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:16px;padding:16px;color:var(--muted);font-family:var(--font-b);font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s;margin-bottom:20px}
  .load-more-btn:hover{border-color:var(--gold);color:var(--gold);background:rgba(201,168,76,0.06)}

  .online-banner{display:flex;align-items:center;gap:14px;background:rgba(13,30,56,0.7);border:1px solid var(--border);border-radius:16px;padding:14px 20px;margin-bottom:20px;font-size:13px;color:var(--muted);animation:fadeUp 0.6s 0.25s ease both}
  .online-avatars{display:flex}
  .online-avatar{width:30px;height:30px;border-radius:50%;border:2px solid var(--navy2);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;margin-left:-8px;flex-shrink:0}
  .online-avatar:first-child{margin-left:0}
  .online-count{font-weight:700;color:var(--white)}
  .online-dot{width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0}

  @media(max-width:1024px){.community-layout{grid-template-columns:1fr}.sidebar{position:static}}
  @media(max-width:600px){.community-wrap{padding:80px 0 40px}.community-layout,.page-topbar{padding:0 16px}.post-card{padding:20px}.stats-bar{gap:10px}.stat-pill{padding:8px 14px;font-size:12px}.modal-box{padding:24px}.community-hero,.category-tabs{padding:0 16px}}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const totalPollVotes = poll => poll.options.reduce((s, o) => s + o.votes, 0);
const pct = (v, t) => t === 0 ? 0 : Math.round((v / t) * 100);

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, onLike, onSave, onVote, showToast }) {
    const typeConfig = {
        discussion: { label: '💬 Discussion', cls: 'type-discussion' },
        poll: { label: '📊 Poll', cls: 'type-poll' },
        announcement: { label: '📣 Announcement', cls: 'type-announcement' },
        resource: { label: '📎 Resource', cls: 'type-resource' },
    };
    const tc = typeConfig[post.type] || typeConfig.discussion;
    return (
        <div className={`post-card${post.pinned ? ' pinned' : ''}`} style={{ animationDelay: `${post.id * 0.05}s` }}>
            {post.pinned && <div className="pin-badge">📌 Pinned</div>}
            <div className="post-header">
                <Avatar initials={post.author.initials} color={post.author.color} size={46} />
                <div className="post-author-info">
                    <div className="post-author-name">{post.author.name}{post.author.verified && <span className="verified-icon">✓</span>}</div>
                    <div className="post-author-role">{post.author.role}</div>
                </div>
                <div className="post-time">{post.time}</div>
            </div>
            <div className={`post-type-label ${tc.cls}`}>{tc.label}</div>
            <div className="post-title">{post.title}</div>
            {post.body && <div className="post-body">{post.body}</div>}
            {post.poll && (
                <div className="poll-wrap">
                    {(() => {
                        const total = totalPollVotes(post.poll);
                        return post.poll.options.map(opt => {
                            const p = pct(opt.votes + (post.poll.selected === opt.id ? 1 : 0), total + (post.poll.voted ? 0 : (post.poll.selected ? 1 : 0)));
                            return (
                                <div key={opt.id} className={`poll-option${post.poll.voted ? ' voted' : ''}${post.poll.selected === opt.id ? ' selected' : ''}`} onClick={() => !post.poll.voted && onVote(post.id, opt.id)}>
                                    {post.poll.voted && <div className="poll-bar" style={{ width: `${p}%` }} />}
                                    <span className="poll-label">{opt.label}</span>
                                    {post.poll.voted && <span className="poll-pct">{p}%</span>}
                                </div>
                            );
                        });
                    })()}
                    {post.poll.voted && <div className="poll-vote-count">{totalPollVotes(post.poll) + 1} votes · Poll closes in 3 days</div>}
                    {!post.poll.voted && post.poll.selected && (
                        <div style={{ textAlign: 'right', marginTop: 10 }}>
                            <button className="btn-post" style={{ padding: '9px 22px', fontSize: 13 }} onClick={() => onVote(post.id, post.poll.selected, true)}>Submit Vote →</button>
                        </div>
                    )}
                </div>
            )}
            {post.attachment && (
                <div className="post-attachment" onClick={() => showToast('Opening file…', 'info')}>
                    <span style={{ fontSize: 22 }}>{post.attachment.type === 'note' ? '📄' : '🔗'}</span>
                    <div><div className="attach-label">{post.attachment.label}</div><div className="attach-size">{post.attachment.size}</div></div>
                    <span style={{ marginLeft: 'auto', color: 'var(--gold)', fontSize: 18 }}>↗</span>
                </div>
            )}
            {post.tags.length > 0 && <div className="post-tags">{post.tags.map(tag => <span key={tag} className="post-tag">#{tag}</span>)}</div>}
            <div className="post-footer">
                <button className={`action-btn${post.liked ? ' liked' : ''}`} onClick={() => onLike(post.id)}><span className="action-icon">{post.liked ? '❤️' : '🤍'}</span>{post.likes + (post.liked ? 1 : 0)}</button>
                <button className="action-btn" onClick={() => showToast('Comments coming soon!', 'info')}><span className="action-icon">💬</span>{post.comments}</button>
                <button className={`action-btn${post.saved ? ' saved' : ''}`} onClick={() => onSave(post.id)}><span className="action-icon">{post.saved ? '🔖' : '📌'}</span>{post.saved ? 'Saved' : 'Save'}</button>
                <div className="spacer" />
                <button className="share-btn" onClick={() => { navigator.clipboard?.writeText(window.location.href); showToast('Link copied!', 'success'); }}>↗ Share</button>
            </div>
        </div>
    );
}

// ─── Create Post Modal ────────────────────────────────────────────────────────
function CreatePostModal({ onClose, onSubmit }) {
    const [type, setType] = useState('discussion');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [tags, setTags] = useState('');
    const types = [{ value: 'discussion', label: '💬 Discussion' }, { value: 'poll', label: '📊 Poll' }, { value: 'resource', label: '📎 Resource' }, { value: 'announcement', label: '📣 News' }];
    const handleSubmit = () => {
        if (!title.trim()) return;
        onSubmit({ type, title: title.trim(), body: body.trim(), tags: tags.split(',').map(t => t.trim()).filter(Boolean) });
        onClose();
    };
    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-box">
                <div className="modal-header"><div className="modal-title">Create a Post</div><button className="modal-close" onClick={onClose}>×</button></div>
                <div className="modal-type-row">{types.map(t => <button key={t.value} className={`modal-type-btn${type === t.value ? ' selected' : ''}`} onClick={() => setType(t.value)}>{t.label}</button>)}</div>
                <div className="modal-field"><label className="modal-label">Title *</label><input className="modal-input" placeholder="What's on your mind?" value={title} onChange={e => setTitle(e.target.value)} /></div>
                <div className="modal-field"><label className="modal-label">Details</label><textarea className="modal-textarea" placeholder="Share more context…" value={body} onChange={e => setBody(e.target.value)} /></div>
                <div className="modal-field"><label className="modal-label">Tags (comma separated)</label><input className="modal-input" placeholder="e.g. CA Final, GST, May 2025" value={tags} onChange={e => setTags(e.target.value)} /></div>
                <div className="modal-footer"><button className="btn-cancel" onClick={onClose}>Cancel</button><button className="btn-post" onClick={handleSubmit} disabled={!title.trim()}>Post →</button></div>
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Community() {
    const { toasts, showToast } = useToast();
    const [posts, setPosts] = useState(INITIAL_POSTS);
    const [activeCategory, setActiveCategory] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [joinedGroups, setJoinedGroups] = useState(new Set());

    const visiblePosts = posts.filter(p => {
        if (activeCategory === 'All') return true;
        if (activeCategory === 'Discussions') return p.type === 'discussion';
        if (activeCategory === 'Announcements') return p.type === 'announcement';
        if (activeCategory === 'Polls') return p.type === 'poll';
        if (activeCategory === 'Resources') return p.type === 'resource';
        return true;
    });

    const handleLike = id => setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked } : p));
    const handleSave = id => {
        const post = posts.find(p => p.id === id);
        setPosts(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
        showToast(post?.saved ? 'Removed from saved' : 'Post saved!', post?.saved ? 'info' : 'success');
    };
    const handleVote = (postId, optionId, submit = false) => {
        setPosts(prev => prev.map(p => {
            if (p.id !== postId || !p.poll) return p;
            if (submit) { const updated = p.poll.options.map(o => o.id === p.poll.selected ? { ...o, votes: o.votes + 1 } : o); showToast('Vote recorded!', 'success'); return { ...p, poll: { ...p.poll, voted: true, options: updated } }; }
            return { ...p, poll: { ...p.poll, selected: optionId } };
        }));
    };
    const handleNewPost = ({ type, title, body, tags }) => {
        setPosts(prev => [{ id: Date.now(), type, title, body, tags, pinned: false, author: { name: CURRENT_USER.name, initials: CURRENT_USER.initials, color: CURRENT_USER.color, role: 'CA Connect Member', verified: false }, time: 'just now', likes: 0, comments: 0, saves: 0, liked: false, saved: false, attachment: null, poll: null }, ...prev]);
        showToast('Post is live! 🎉', 'success');
    };
    const handleJoinGroup = (id, name) => {
        setJoinedGroups(prev => {
            const next = new Set(prev);
            if (next.has(id)) { next.delete(id); showToast(`Left ${name}`, 'info'); } else { next.add(id); showToast(`Joined ${name}! 🎉`, 'success'); }
            return next;
        });
    };

    return (
        <>
            <style>{css}</style>
            <ToastContainer toasts={toasts} />
            {showModal && <CreatePostModal onClose={() => setShowModal(false)} onSubmit={handleNewPost} />}

            <div className="community-wrap">
                {/* ── Back Button ── */}
                <div className="page-topbar"><BackButton /></div>

                <div className="community-hero">
                    <div className="community-hero-badge"><span className="pulse-dot" />12,480 members online now</div>
                    <h1>CA Connect <span className="gold-text">Community</span></h1>
                    <p>Discuss exams, share resources, celebrate victories, and grow together with 85,000+ CA students and professionals.</p>
                </div>

                <div className="stats-bar">
                    {[{ icon: '👥', label: 'Members', num: '85K+' }, { icon: '💬', label: 'Posts Today', num: '1,240' }, { icon: '🏘️', label: 'Active Groups', num: '340' }, { icon: '🎓', label: 'Mentors Online', num: '98' }, { icon: '📌', label: 'Resources Shared', num: '15K+' }].map((s, i) => (
                        <div key={i} className="stat-pill"><span>{s.icon}</span><span className="stat-pill-num">{s.num}</span><span style={{ color: 'var(--muted)', fontSize: 12 }}>{s.label}</span></div>
                    ))}
                </div>

                <div className="category-tabs">
                    {POST_CATEGORIES.map(cat => <button key={cat} className={`cat-tab${activeCategory === cat ? ' active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>)}
                </div>

                <div className="community-layout">
                    <div>
                        <div className="online-banner">
                            <span className="online-dot" />
                            <div className="online-avatars">
                                {[{ i: 'PS', c: '#c9a84c' }, { i: 'AM', c: '#63e6be' }, { i: 'NG', c: '#f472b6' }, { i: 'RK', c: '#4ea8de' }, { i: '+', c: '#a78bfa' }].map((a, idx) => (
                                    <div key={idx} className="online-avatar" style={{ background: `${a.c}33`, color: a.c, border: '2px solid #0d1e38' }}>{a.i}</div>
                                ))}
                            </div>
                            <span><span className="online-count">12,480 members</span> are active right now</span>
                        </div>
                        <div className="create-post-box">
                            <Avatar initials={CURRENT_USER.initials} color={CURRENT_USER.color} size={42} />
                            <div className="create-post-input" onClick={() => setShowModal(true)}>Share something with the community…</div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                            {[['💬', 'Discussion'], ['📊', 'Poll'], ['📎', 'Resource'], ['📣', 'News']].map(([icon, label]) => (
                                <button key={label} className="post-type-btn" onClick={() => setShowModal(true)}>{icon} {label}</button>
                            ))}
                        </div>
                        {visiblePosts.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🗂️</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--white)', marginBottom: 8 }}>No posts here yet</div>
                                <div>Be the first to post in this category!</div>
                            </div>
                        ) : visiblePosts.map(post => <PostCard key={post.id} post={post} onLike={handleLike} onSave={handleSave} onVote={handleVote} showToast={showToast} />)}
                        {visiblePosts.length > 0 && <button className="load-more-btn" onClick={() => showToast('Loading more…', 'info')}>Load more posts ↓</button>}
                    </div>

                    <div className="sidebar">
                        <div className="sidebar-card">
                            <div className="sidebar-title">🔥 Trending Topics</div>
                            {TRENDING_TOPICS.map((t, i) => (
                                <div key={i} className="trending-item" onClick={() => showToast(`Browsing #${t.tag}`, 'info')}>
                                    <span className="trending-tag">{t.tag}</span><span className="trending-count">{t.posts}</span>
                                </div>
                            ))}
                        </div>
                        <div className="sidebar-card">
                            <div className="sidebar-title">🏘️ Popular Groups</div>
                            {GROUPS.map(g => (
                                <div key={g.id} className="group-item">
                                    <div className="group-icon" style={{ background: `${g.color}18` }}>{g.icon}</div>
                                    <div className="group-info"><div className="group-name">{g.name}</div><div className="group-members">{g.members.toLocaleString()} members</div></div>
                                    <button className={`join-btn${joinedGroups.has(g.id) ? ' joined' : ''}`} onClick={() => handleJoinGroup(g.id, g.name)}>{joinedGroups.has(g.id) ? '✓ Joined' : '+ Join'}</button>
                                </div>
                            ))}
                        </div>
                        <div className="sidebar-card">
                            <div className="sidebar-title">🏆 Top Contributors</div>
                            {LEADERBOARD.map(l => (
                                <div key={l.rank} className="lb-item">
                                    <div className="lb-rank">{l.badge || `#${l.rank}`}</div>
                                    <Avatar initials={l.initials} color={l.color} size={34} />
                                    <div className="lb-info"><div className="lb-name">{l.name}</div><div className="lb-points">{l.points.toLocaleString()} pts</div></div>
                                </div>
                            ))}
                        </div>
                        <div style={{ background: 'linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.05))', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 20, padding: 24, textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 10 }}>🎓</div>
                            <div style={{ fontFamily: 'var(--font-h)', fontSize: '1rem', fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>Find a Mentor</div>
                            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>1-on-1 guidance from verified CAs. Personalised roadmaps for every stage.</div>
                            <Link to="/mentorship" style={{ display: 'block', background: 'linear-gradient(135deg,var(--gold),var(--gold2))', borderRadius: 12, padding: '11px 0', color: 'var(--navy)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Browse Mentors →</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}