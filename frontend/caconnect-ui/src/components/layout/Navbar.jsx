/**
 * Navbar.jsx — Top navigation bar for CAConnect
 */

import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const NavLink = ({ to, children }) => {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + '/');
  return (
    <Link to={to} style={{
      fontWeight: active ? '600' : '400',
      color: active ? 'var(--amber)' : 'rgba(255,255,255,0.75)',
      fontSize: '0.875rem',
      letterSpacing: '0.02em',
      padding: '6px 14px',
      borderRadius: 'var(--radius-sm)',
      background: active ? 'rgba(245,158,11,0.12)' : 'transparent',
      transition: 'all var(--transition)',
      textDecoration: 'none',
    }}>
      {children}
    </Link>
  );
};

export default function Navbar() {
  const { state } = useApp();

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--navy)',
      boxShadow: '0 1px 0 rgba(255,255,255,0.06)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '0 24px',
        display: 'flex', alignItems: 'center',
        height: 64,
        gap: 8,
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 'auto' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--amber), #F97316)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#fff',
            boxShadow: '0 2px 8px rgba(245,158,11,0.4)',
          }}>CA</div>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '1.15rem', color: '#fff', letterSpacing: '-0.02em',
          }}>
            CA<span style={{ color: 'var(--amber)' }}>Connect</span>
          </span>
        </Link>

        {/* Nav links */}
        <NavLink to="/">Home</NavLink>
        <NavLink to="/create-profile">Create Profile</NavLink>
        {state.userId && (
          <>
            <NavLink to={`/profile/${state.userId}`}>My Profile</NavLink>
            <NavLink to={`/profile/${state.userId}/peers`}>Nearby Peers</NavLink>
          </>
        )}

        {/* User badge */}
        {state.userId ? (
          <div style={{
            marginLeft: 12,
            background: 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 12px',
            fontSize: '0.75rem', fontWeight: 500,
            color: 'var(--amber-lt)',
            letterSpacing: '0.03em',
          }}>
            ID: {state.userId.slice(0, 8)}…
          </div>
        ) : (
          <Link to="/create-profile" style={{
            marginLeft: 12,
            background: 'var(--amber)',
            color: 'var(--navy)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 18px',
            fontSize: '0.8rem', fontWeight: 600,
            letterSpacing: '0.02em',
            display: 'inline-block',
            transition: 'all var(--transition)',
          }}>
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
}