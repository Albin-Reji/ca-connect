/**
 * Toast.jsx — Animated toast notification stack
 * Renders toasts from AppContext into a fixed overlay.
 */

import { useApp } from '../../context/AppContext';

const ICONS = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
const BG    = {
  success: 'linear-gradient(135deg,#065f46,#047857)',
  error:   'linear-gradient(135deg,#7f1d1d,#b91c1c)',
  info:    'linear-gradient(135deg,#1e3a5f,#1E3A5F)',
  warning: 'linear-gradient(135deg,#78350f,#b45309)',
};

function ToastItem({ toast, onDismiss }) {
  return (
    <div
      onClick={() => onDismiss(toast.id)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        background: BG[toast.type] || BG.info,
        color: '#fff', borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        boxShadow: 'var(--shadow-lg)',
        cursor: 'pointer', minWidth: 280, maxWidth: 380,
        animation: 'fadeUp 0.3s ease both',
        fontSize: '0.875rem', lineHeight: 1.5,
        backdropFilter: 'blur(8px)',
      }}
    >
      <span style={{
        width: 22, height: 22, flexShrink: 0,
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.7rem', fontWeight: 700,
      }}>
        {ICONS[toast.type]}
      </span>
      <span style={{ flex: 1 }}>{toast.message}</span>
    </div>
  );
}

export default function ToastStack() {
  const { state, dismissToast } = useApp();

  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10,
      pointerEvents: 'none',
    }}>
      {state.toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: 'all' }}>
          <ToastItem toast={t} onDismiss={dismissToast} />
        </div>
      ))}
    </div>
  );
}