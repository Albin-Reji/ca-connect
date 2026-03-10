/**
 * Badge.jsx — Exam stage badge with color coding
 */
import { getStageMeta } from '../../utils/helpers';

export default function StageBadge({ stage, large = false }) {
  const meta = getStageMeta(stage);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: `${meta.color}1A`,
      color: meta.color,
      border: `1.5px solid ${meta.color}40`,
      borderRadius: large ? 'var(--radius-md)' : 'var(--radius-sm)',
      padding: large ? '6px 14px' : '3px 10px',
      fontSize: large ? '0.9rem' : '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}>
      <span>{meta.icon}</span>
      {meta.label}
    </span>
  );
}