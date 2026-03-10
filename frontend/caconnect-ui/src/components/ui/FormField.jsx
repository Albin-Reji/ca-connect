/**
 * FormField.jsx — Input, Select, and form field wrapper components
 */

/** Wrapper with label + error display */
export function Field({ label, error, required, children, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{
          fontSize: '0.8rem', fontWeight: 600,
          color: 'var(--navy)', letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          {label}
          {required && <span style={{ color: 'var(--amber)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--slate-lt)' }}>{hint}</span>
      )}
      {error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: '0.65rem' }}>●</span> {error}
        </span>
      )}
    </div>
  );
}

const baseInputStyle = {
  width: '100%',
  padding: '11px 14px',
  fontSize: '0.9rem',
  background: '#fff',
  border: '1.5px solid rgba(100,116,139,0.25)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--navy)',
  outline: 'none',
  transition: 'border-color var(--transition), box-shadow var(--transition)',
  lineHeight: 1.5,
};

/** Text / number / email / tel input */
export function Input({ error, ...props }) {
  return (
    <input
      {...props}
      style={{
        ...baseInputStyle,
        borderColor: error ? 'var(--red)' : 'rgba(100,116,139,0.25)',
      }}
      onFocus={(e) => {
        e.target.style.borderColor = error ? 'var(--red)' : 'var(--amber)';
        e.target.style.boxShadow = `0 0 0 3px ${error ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)'}`;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = error ? 'var(--red)' : 'rgba(100,116,139,0.25)';
        e.target.style.boxShadow = 'none';
      }}
    />
  );
}

/** Select dropdown */
export function Select({ options = [], error, placeholder, ...props }) {
  return (
    <select
      {...props}
      style={{
        ...baseInputStyle,
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748B' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 14px center',
        paddingRight: 36,
        cursor: 'pointer',
        borderColor: error ? 'var(--red)' : 'rgba(100,116,139,0.25)',
      }}
      onFocus={(e) => {
        e.target.style.borderColor = error ? 'var(--red)' : 'var(--amber)';
        e.target.style.boxShadow = `0 0 0 3px ${error ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)'}`;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = error ? 'var(--red)' : 'rgba(100,116,139,0.25)';
        e.target.style.boxShadow = 'none';
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}