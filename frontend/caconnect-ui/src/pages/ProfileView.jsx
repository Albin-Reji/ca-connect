/**
 * ProfileView.jsx
 * ─────────────────────────────────────────────────────────────────
 * Displays a user's complete profile.
 * Route: /profile/:userId
 * API:   GET /api/profiles/users/:userId
 */

import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProfile } from '../api/profileApi';
import { useApp } from '../context/AppContext';
import { useApi } from '../hooks/useApi';
import ProfileCard from '../components/ui/ProfileCard';
import Button from '../components/ui/Button';
import { PageLoader } from '../components/ui/Loader';

export default function ProfileView() {
  const { userId } = useParams();
  const { state, cacheProfile, showToast } = useApp();
  const navigate = useNavigate();
  const { data: profile, loading, error, execute } = useApi(getProfile);

  useEffect(() => {
    // Use cache if available
    const cached = state.profileCache[userId];
    if (cached) return;
    execute(userId).catch(() => {
      showToast('Failed to load profile. The user may not exist yet.', 'error');
    });
  }, [userId]);

  const displayProfile = state.profileCache[userId] || profile;

  useEffect(() => {
    if (profile) cacheProfile(profile);
  }, [profile]);

  if (loading) return <PageLoader message="Loading profile…" />;

  if (error && !displayProfile) {
    return (
      <div style={{ maxWidth: 560, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: 12 }}>
          Profile Not Found
        </h2>
        <p style={{ color: 'var(--slate)', marginBottom: 28, lineHeight: 1.7 }}>
          No profile found for user ID <code style={{
            background: 'rgba(12,27,51,0.06)', padding: '2px 8px',
            borderRadius: 4, fontSize: '0.85em',
          }}>{userId}</code>.
          <br />Make sure this user has created a profile first.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button variant="ghost" onClick={() => navigate(-1)}>← Go Back</Button>
          <Link to="/create-profile">
            <Button variant="primary">Create Profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!displayProfile) return null;

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px' }} className="fade-up">
      {/* Breadcrumb + actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--slate)', marginBottom: 4 }}>
            <Link to="/" style={{ color: 'var(--amber)' }}>Home</Link> › Profile
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--navy)' }}>
            {displayProfile.fullName}
          </h1>
        </div>
        <Link to={`/profile/${userId}/peers`}>
          <Button variant="navy" size="sm">
            🧭 Find Nearby Peers
          </Button>
        </Link>
      </div>

      <ProfileCard profile={displayProfile} />

      {/* Quick-lookup another profile */}
      <div style={{
        marginTop: 28,
        background: '#fff', borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)', padding: '20px 24px',
        display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate)', flexShrink: 0 }}>Look up another user:</p>
        <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 240 }}>
          <input
            id="quick-lookup"
            type="text"
            placeholder="Enter User ID…"
            style={{
              flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-sm)',
              border: '1.5px solid rgba(100,116,139,0.25)',
              fontSize: '0.85rem', color: 'var(--navy)', outline: 'none',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                navigate(`/profile/${e.target.value.trim()}`);
              }
            }}
          />
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              const val = document.getElementById('quick-lookup').value.trim();
              if (val) navigate(`/profile/${val}`);
            }}
          >Go</Button>
        </div>
      </div>
    </div>
  );
}