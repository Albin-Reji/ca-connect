/**
 * NearbyUsers.jsx — Grid of nearby CA peers with map link
 */

import Card from '../ui/Card';
import { buildMapUrl } from '../../utils/helpers';

function PeerCard({ location, index }) {
  const mapUrl = buildMapUrl(location.latitude, location.longitude);
  return (
    <div className="fade-up" style={{ animationDelay: `${index * 0.07}s` }}>
      <Card hover style={{ padding: '22px 24px' }}>
        {/* Peer number badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: `hsl(${(index * 47) % 360}, 65%, 88%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem',
            color: `hsl(${(index * 47) % 360}, 55%, 30%)`,
          }}>
            {index + 1}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--navy)' }}>
              Peer #{index + 1}
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--slate-lt)' }}>
              User: {location.userId?.slice(0, 16)}…
            </p>
          </div>
        </div>

        {/* Coordinates */}
        <div style={{
          background: 'rgba(12,27,51,0.04)', borderRadius: 'var(--radius-sm)',
          padding: '10px 12px', marginBottom: 14,
          fontFamily: 'monospace', fontSize: '0.8rem',
        }}>
          <div style={{ color: 'var(--slate)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Lat</span>
            <span style={{ color: 'var(--navy)', fontWeight: 600 }}>
              {location.latitude?.toFixed(5)}°
            </span>
          </div>
          <div style={{ color: 'var(--slate)', display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span>Lng</span>
            <span style={{ color: 'var(--navy)', fontWeight: 600 }}>
              {location.longitude?.toFixed(5)}°
            </span>
          </div>
        </div>

        {/* Map link */}
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px',
            background: 'var(--navy)',
            color: '#fff', borderRadius: 'var(--radius-sm)',
            fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none',
            transition: 'all var(--transition)',
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--navy-soft)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'var(--navy)'}
        >
          📍 View on Map
        </a>
      </Card>
    </div>
  );
}

export default function NearbyUsers({ peers = [], examStage }) {
  if (!peers.length) {
    return (
      <div style={{
        textAlign: 'center', padding: '56px 24px',
        background: '#fff', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)', border: '1px dashed rgba(12,27,51,0.15)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: 8 }}>
          No Nearby Peers Found
        </h3>
        <p style={{ color: 'var(--slate)', fontSize: '0.9rem', maxWidth: 340, margin: '0 auto' }}>
          We couldn't find anyone near you at the same exam stage right now. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div>
      <p style={{ color: 'var(--slate)', marginBottom: 24, fontSize: '0.875rem' }}>
        Found <strong style={{ color: 'var(--navy)' }}>{peers.length}</strong> peer{peers.length !== 1 ? 's' : ''} near you
        {examStage ? ` studying ${examStage.toLowerCase()}` : ''}.
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 18,
      }}>
        {peers.map((peer, i) => (
          <PeerCard key={peer.locationId || i} location={peer} index={i} />
        ))}
      </div>
    </div>
  );
}