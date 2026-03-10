/**
 * ProfileCard.jsx — Displays a user's full profile information.
 */

import Card from '../ui/Card';
import StageBadge from '../ui/Badge';
import { formatAddress, formatDate, getInitials } from '../../utils/helpers';

const InfoRow = ({ label, value }) => (
  <div style={{
    display: 'flex', gap: 12, alignItems: 'baseline',
    padding: '10px 0',
    borderBottom: '1px dashed rgba(12,27,51,0.08)',
  }}>
    <span style={{
      fontSize: '0.72rem', fontWeight: 600, color: 'var(--slate)',
      textTransform: 'uppercase', letterSpacing: '0.06em',
      minWidth: 110, flexShrink: 0,
    }}>{label}</span>
    <span style={{ fontSize: '0.9rem', color: 'var(--navy)', fontWeight: 400 }}>{value || '—'}</span>
  </div>
);

export default function ProfileCard({ profile }) {
  const initials = getInitials(profile.fullName);
  const address  = formatAddress(profile.address || {});

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header strip */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-soft) 100%)',
        padding: '32px 28px 24px',
        position: 'relative',
      }}>
        {/* Decorative circle */}
        <div style={{
          position: 'absolute', right: -30, top: -30,
          width: 140, height: 140,
          background: 'rgba(245,158,11,0.08)',
          borderRadius: '50%',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative' }}>
          {/* Avatar */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--amber), #F97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700,
            color: '#fff', flexShrink: 0,
            boxShadow: '0 4px 16px rgba(245,158,11,0.4)',
            border: '3px solid rgba(255,255,255,0.15)',
          }}>
            {initials}
          </div>

          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700,
              color: '#fff', margin: 0, lineHeight: 1.2,
            }}>
              {profile.fullName}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', marginTop: 4 }}>
              ID: {profile.userId}
            </p>
            <div style={{ marginTop: 10 }}>
              <StageBadge stage={profile.examStage} large />
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: '24px 28px' }}>
        <InfoRow label="Age"         value={`${profile.age} years`} />
        <InfoRow label="Email"       value={profile.email} />
        <InfoRow label="Phone"       value={profile.phoneNumber} />
        <InfoRow label="Address"     value={address} />
        <InfoRow label="Location ID" value={profile.locationId} />
        <InfoRow label="Profile ID"  value={profile.profileId} />
        <InfoRow label="Created"     value={formatDate(profile.createdAt)} />
        <InfoRow label="Updated"     value={formatDate(profile.updatedAt)} />
      </div>
    </Card>
  );
}