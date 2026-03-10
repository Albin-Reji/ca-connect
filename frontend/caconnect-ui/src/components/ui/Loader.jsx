/**
 * Loader.jsx — Full-page and inline loading states
 */

/** Centered full-section spinner */
export function PageLoader({ message = 'Loading…' }) {
  return (
    <div style={{
      minHeight: '40vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 16, animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        width: 44, height: 44,
        border: '3px solid rgba(12,27,51,0.1)',
        borderTopColor: 'var(--amber)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--slate)', fontSize: '0.875rem', letterSpacing: '0.03em' }}>
        {message}
      </p>
    </div>
  );
}

/** Small inline spinner */
export function InlineLoader({ size = 18 }) {
  return (
    <span style={{
      display: 'inline-block',
      width: size, height: size,
      border: '2px solid rgba(12,27,51,0.15)',
      borderTopColor: 'var(--amber)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  );
}

/** Skeleton shimmer block */
export function Skeleton({ width = '100%', height = 18, radius = 6, style: extra = {} }) {
  return (
    <div style={{
      width, height,
      background: 'linear-gradient(90deg, #e8e8e4 25%, #f0f0ec 50%, #e8e8e4 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      borderRadius: radius,
      ...extra,
    }} />
  );
}