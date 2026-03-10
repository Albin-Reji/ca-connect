/**
 * Home.jsx — CAConnect landing page & profile lookup
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import { getStageMeta, EXAM_STAGES } from '../utils/helpers';

function StageStep({ stage, isActive }) {
  const meta = getStageMeta(stage.value);
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      flex: 1, minWidth: 120,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: isActive ? meta.color : `${meta.color}22`,
        border: `2.5px solid ${meta.color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem', transition: 'all var(--transition)',
        boxShadow: isActive ? `0 4px 16px ${meta.color}44` : 'none',
      }}>
        {meta.icon}
      </div>
      <span style={{
        fontSize: '0.75rem', fontWeight: isActive ? 700 : 500,
        color: isActive ? meta.color : 'var(--slate)',
        textAlign: 'center', letterSpacing: '0.02em',
      }}>
        {meta.label}
      </span>
    </div>
  );
}

export default function Home() {
  const { state, showToast } = useApp();
  const navigate = useNavigate();
  const [lookupId, setLookupId] = useState('');
  const [hoveredStage, setHoveredStage] = useState(null);

  const handleLookup = () => {
    const id = lookupId.trim() || state.userId;
    if (!id) {
      showToast('Please enter a User ID to look up.', 'warning');
      return;
    }
    navigate(`/profile/${id}`);
  };

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(160deg, var(--navy) 0%, var(--navy-soft) 60%, #1a4a7a 100%)',
        padding: 'clamp(60px, 10vw, 120px) 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', right: '-5%', top: '-10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: '-8%', bottom: '-20%',
          width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
          <p className="fade-up" style={{
            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em',
            color: 'var(--amber)', textTransform: 'uppercase', marginBottom: 20,
          }}>
            ✦ Chartered Accountant Network
          </p>

          <h1 className="fade-up" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
            color: '#fff', lineHeight: 1.1, marginBottom: 24,
            animationDelay: '0.08s',
          }}>
            Connect With CA Candidates<br />
            <em style={{ color: 'var(--amber-lt)', fontStyle: 'italic' }}>Near You</em>
          </h1>

          <p className="fade-up" style={{
            color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.7,
            maxWidth: 520, marginBottom: 40, animationDelay: '0.16s',
          }}>
            CAConnect finds fellow CA exam candidates at the same stage as you — 
            Foundation, Intermediate, or Final — right in your neighbourhood.
          </p>

          <div className="fade-up" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', animationDelay: '0.24s' }}>
            <Link to="/create-profile">
              <Button variant="primary" size="lg">
                Create Your Profile
              </Button>
            </Link>
            {state.userId && (
              <Link to={`/profile/${state.userId}/peers`}>
                <Button size="lg" style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  Find Nearby Peers →
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Exam Stage Journey ──────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '56px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.8rem',
            color: 'var(--navy)', textAlign: 'center', marginBottom: 8,
          }}>
            The CA Journey
          </h2>
          <p style={{ color: 'var(--slate)', textAlign: 'center', marginBottom: 40, fontSize: '0.9rem' }}>
            We match you with peers at exactly your stage
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {EXAM_STAGES.map((stage, i) => (
              <div key={stage.value} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div
                  style={{ flex: 1 }}
                  onMouseEnter={() => setHoveredStage(stage.value)}
                  onMouseLeave={() => setHoveredStage(null)}
                >
                  <StageStep stage={stage} isActive={hoveredStage === stage.value} />
                </div>
                {i < EXAM_STAGES.length - 1 && (
                  <div style={{
                    height: 2, flexShrink: 0,
                    width: 'clamp(20px, 4vw, 48px)',
                    background: 'linear-gradient(90deg, rgba(100,116,139,0.3), rgba(100,116,139,0.1))',
                    borderRadius: 1,
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Profile Lookup ──────────────────────────────────────── */}
      <section style={{ padding: '56px 24px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--navy)', marginBottom: 10 }}>
            Look Up a Profile
          </h2>
          <p style={{ color: 'var(--slate)', marginBottom: 28, fontSize: '0.9rem' }}>
            Enter any user ID to view their profile
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder={state.userId || 'Enter User ID…'}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              style={{
                flex: 1, padding: '12px 16px',
                border: '1.5px solid rgba(100,116,139,0.25)',
                borderRadius: 'var(--radius-sm)', fontSize: '0.9rem',
                color: 'var(--navy)', background: '#fff', outline: 'none',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--amber)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(100,116,139,0.25)'; }}
            />
            <Button variant="primary" onClick={handleLookup}>Search</Button>
          </div>
          {state.userId && (
            <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--slate-lt)' }}>
              Your saved ID:{' '}
              <button
                onClick={() => navigate(`/profile/${state.userId}`)}
                style={{ color: 'var(--amber)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}
              >
                {state.userId}
              </button>
            </p>
          )}
        </div>
      </section>

      {/* ── Feature highlights ──────────────────────────────────── */}
      <section style={{ padding: '56px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              {
                icon: '🌍', title: 'Geocoded Locations',
                desc: 'Addresses are automatically converted to precise lat/lng coordinates via OpenCage.',
              },
              {
                icon: '🎯', title: 'Stage-Specific Matching',
                desc: 'Only connects you with candidates at the same exam level — Foundation, Intermediate, Final, or Qualified.',
              },
              {
                icon: '⚡', title: 'Reactive Backend',
                desc: 'Built on Spring WebFlux for non-blocking, high-performance real-time data flows.',
              },
              {
                icon: '🔒', title: 'Secure by Design',
                desc: 'Microservice architecture with Eureka service discovery and isolated data stores.',
              },
            ].map((f) => (
              <div key={f.title} className="fade-up" style={{
                padding: '28px 24px',
                border: '1px solid rgba(12,27,51,0.08)',
                borderRadius: 'var(--radius-lg)',
                transition: 'all var(--transition)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(12,27,51,0.08)';
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--navy)', marginBottom: 8 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA strip ───────────────────────────────────────────── */}
      <section style={{
        background: 'var(--navy)',
        padding: '48px 24px', textAlign: 'center',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          Ready to connect?
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: 24 }}>
          Join thousands of CA aspirants networking today
        </h2>
        <Link to="/create-profile">
          <Button variant="primary" size="lg">Get Started — It's Free</Button>
        </Link>
      </section>
    </div>
  );
}