/**
 * NearbyPeers.jsx
 * ─────────────────────────────────────────────────────────────────
 * Fetches and displays nearest CA peers at the same exam stage.
 * Route: /profile/:userId/peers
 * API:   GET /api/profiles/users/:userId/nearest/:limit
 */

import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNearestPeers, getProfile } from '../api/profileApi';
import { useApp } from '../context/AppContext';
import { useApi } from  '../hooks/useApi';
import NearbyUsers from '../components/profile/NearbyUsers';
import Button from '../components/ui/Button';
import StageBadge from '../components/ui/Badge';
import { PageLoader } from '../components/ui/Loader';
import { Field, Select } from '../components/ui/FormField';

const LIMIT_OPTIONS = [3, 5, 10, 20].map((n) => ({ value: n, label: `${n} peers` }));

export default function NearbyPeers() {
  const { userId } = useParams();
  const { state, showToast } = useApp();

  const [limit, setLimit] = useState(5);
  const [peers, setPeers]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(state.profileCache[userId] || null);
  const [profileLoading, setProfileLoading] = useState(!profile);

  // Fetch profile if not cached
  useState(() => {
    if (!profile) {
      setProfileLoading(true);
      getProfile(userId)
        .then(setProfile)
        .catch(() => {})
        .finally(() => setProfileLoading(false));
    }
  });

  const fetchPeers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getNearestPeers(userId, limit);
      setPeers(result);
      if (!result.length) showToast('No nearby peers found at your stage.', 'info');
      else showToast(`Found ${result.length} peer${result.length !== 1 ? 's' : ''} near you!`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to fetch nearby peers.', 'error');
      setPeers([]);
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }} className="fade-up">
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--slate)', marginBottom: 4 }}>
          <Link to="/" style={{ color: 'var(--amber)' }}>Home</Link> ›{' '}
          <Link to={`/profile/${userId}`} style={{ color: 'var(--amber)' }}>Profile</Link> › Nearby Peers
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: 'var(--navy)' }}>
              Nearby Peers
            </h1>
            <p style={{ color: 'var(--slate)', marginTop: 6, fontSize: '0.9rem' }}>
              Discover CA candidates studying near you at the same stage.
            </p>
          </div>
          {profile && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <StageBadge stage={profile.examStage} large />
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-lt)' }}>{profile.fullName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={{
        background: '#fff', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)', padding: '24px 28px',
        marginBottom: 32,
        display: 'flex', alignItems: 'flex-end', gap: 18, flexWrap: 'wrap',
      }}>
        <div style={{ flex: '0 0 180px' }}>
          <Field label="How many peers?">
            <Select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              options={LIMIT_OPTIONS}
            />
          </Field>
        </div>
        <Button
          variant="primary"
          size="md"
          loading={loading}
          onClick={fetchPeers}
          style={{ height: 42, alignSelf: 'flex-end' }}
        >
          🧭 Find Peers
        </Button>
        {peers !== null && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPeers(null)}
            style={{ alignSelf: 'flex-end' }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* How it works — shown before first search */}
      {peers === null && !loading && (
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { icon: '📡', title: 'Location-Based', desc: 'We use your geocoded address to find candidates near you.' },
            { icon: '🎯', title: 'Stage-Matched', desc: 'Only peers at your exact CA exam stage are surfaced.' },
            { icon: '🗺️', title: 'Map-Ready', desc: 'Each result links directly to Google Maps for navigation.' },
          ].map((item) => (
            <div key={item.title} className="fade-up" style={{
              background: '#fff', borderRadius: 'var(--radius-md)',
              padding: '22px', border: '1px solid rgba(12,27,51,0.07)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{item.icon}</div>
              <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: 6 }}>{item.title}</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--slate)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {loading && <PageLoader message="Finding nearby peers…" />}
      {!loading && peers !== null && (
        <div className="fade-up">
          <NearbyUsers peers={peers} examStage={profile?.examStage} />
        </div>
      )}
    </div>
  );
}