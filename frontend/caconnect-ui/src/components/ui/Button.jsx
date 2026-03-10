/**
 * Button.jsx — Reusable button with variant, size, and loading state support.
 */

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',   // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md',           // 'sm' | 'md' | 'lg'
  loading = false,
  disabled = false,
  fullWidth = false,
  style: extraStyle = {},
}) {
  const variants = {
    primary: {
      background: 'var(--amber)',
      color: 'var(--navy)',
      border: 'none',
      boxShadow: '0 2px 8px rgba(245,158,11,0.35)',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--navy)',
      border: '1.5px solid var(--navy)',
      boxShadow: 'none',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--slate)',
      border: '1.5px solid rgba(100,116,139,0.3)',
      boxShadow: 'none',
    },
    danger: {
      background: 'var(--red)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 2px 8px rgba(239,68,68,0.3)',
    },
    navy: {
      background: 'var(--navy)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 2px 8px rgba(12,27,51,0.3)',
    },
  };

  const sizes = {
    sm: { padding: '7px 14px', fontSize: '0.8rem',  borderRadius: 'var(--radius-sm)' },
    md: { padding: '11px 22px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)' },
    lg: { padding: '14px 30px', fontSize: '1rem',    borderRadius: 'var(--radius-md)' },
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontWeight: 600, letterSpacing: '0.02em',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.55 : 1,
        transition: 'all var(--transition)',
        width: fullWidth ? '100%' : undefined,
        ...variants[variant],
        ...sizes[size],
        ...extraStyle,
      }}
      onMouseOver={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.filter = 'brightness(1.08)';
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.filter = '';
      }}
    >
      {loading ? (
        <span style={{
          width: 14, height: 14, border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%', animation: 'spin 0.7s linear infinite',
          display: 'inline-block',
        }} />
      ) : null}
      {children}
    </button>
  );
}