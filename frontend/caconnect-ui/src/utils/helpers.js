/**
 * helpers.js — Shared utility functions for CAConnect UI
 */

/** Format an ISO date string to a readable label */
export function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/** Build a one-line address string from an Address object */
export function formatAddress({ streetAddress, city, state, country } = {}) {
  return [streetAddress, city, state, country].filter(Boolean).join(', ');
}

/**
 * Map ExamStage enum → display-friendly label, color variable, and step number.
 */
const STAGE_META = {
  FOUNDATION:   { label: 'Foundation',   step: 1, color: 'var(--foundation)',   icon: '📘' },
  INTERMEDIATE: { label: 'Intermediate', step: 2, color: 'var(--intermediate)', icon: '📗' },
  FINAL:        { label: 'Final',        step: 3, color: 'var(--final)',        icon: '📕' },
  QUALIFIED:    { label: 'Qualified CA', step: 4, color: 'var(--qualified)',    icon: '🎓' },
};

export function getStageMeta(stage) {
  return STAGE_META[stage] || { label: stage, step: 0, color: 'var(--slate)', icon: '📄' };
}

export const EXAM_STAGES = Object.entries(STAGE_META).map(([value, meta]) => ({
  value,
  ...meta,
}));

/** Simple email regex validator */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Phone: 10-digit Indian mobile (with optional +91 or 0 prefix) */
export function isValidPhone(phone) {
  return /^(\+91|0)?[6-9]\d{9}$/.test(phone.replace(/\s+/g, ''));
}

/** Clamp a number between min and max */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/** Generate initials from full name */
export function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

/** Compute approximate distance label from coordinates */
export function buildMapUrl(lat, lng) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}