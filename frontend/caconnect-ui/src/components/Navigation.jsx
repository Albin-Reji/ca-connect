/**
 * Navigation.jsx
 * ─────────────────────────────────────────────────────────────────
 * Responsive navigation component with:
 * - Mobile hamburger menu
 * - Desktop navigation
 * - User authentication state
 * - Active route highlighting
 * - Smooth scrolling
 */

import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useSelector } from 'react-redux';
import { useAuth } from '../hooks/useAuth';

// CSS Styles
const css = `
  .navigation {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transition: all 0.3s ease;
    background: transparent;
  }

  .navigation.scrolled {
    background: rgba(10, 22, 40, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(201, 168, 76, 0.2);
    box-shadow: 0 4px 40px rgba(0, 0, 0, 0.4);
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    padding: 18px 40px;
    gap: 32px;
  }

  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 900;
    text-decoration: none;
    color: #ffffff;
    margin-right: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: color 0.2s ease;
  }

  .nav-logo:hover {
    color: #c9a84c;
  }

  .nav-logo-icon {
    background: linear-gradient(135deg, #c9a84c, #e8c97a);
    border-radius: 10px;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #0a1628;
    font-weight: 900;
  }

  .nav-logo-dot {
    color: #c9a84c;
  }

  .nav-menu {
    display: flex;
    align-items: center;
    gap: 28px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-item {
    position: relative;
  }

  .nav-link {
    color: rgba(255, 255, 255, 0.72);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    padding: 8px 0;
    transition: color 0.2s ease;
    position: relative;
  }

  .nav-link:hover {
    color: #c9a84c;
  }

  .nav-link.active {
    color: #c9a84c;
  }

  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: #c9a84c;
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .nav-login-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.8);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 50px;
    transition: color 0.2s ease;
  }

  .nav-login-btn:hover {
    color: #c9a84c;
  }

  .nav-register-btn {
    background: linear-gradient(135deg, #c9a84c, #e8c97a);
    border: none;
    cursor: pointer;
    color: #0a1628;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    padding: 9px 22px;
    border-radius: 50px;
    transition: all 0.2s ease;
    box-shadow: 0 2px 12px rgba(201, 168, 76, 0.3);
  }

  .nav-register-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(201, 168, 76, 0.45);
  }

  .nav-user-pill {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(201, 168, 76, 0.1);
    border: 1px solid rgba(201, 168, 76, 0.2);
    border-radius: 50px;
    padding: 6px 14px 6px 6px;
  }

  .nav-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c9a84c, #e8c97a);
    color: #0a1628;
    font-size: 13px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-user-name {
    font-size: 13px;
    font-weight: 600;
    color: #ffffff;
  }

  .nav-logout-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #7a8fa6;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .nav-logout-btn:hover {
    border-color: #ef4444;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.08);
  }

  .mobile-menu-toggle {
    display: none;
    background: transparent;
    border: none;
    color: #ffffff;
    font-size: 24px;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .mobile-menu-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .mobile-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 80%;
    max-width: 400px;
    height: 100vh;
    background: rgba(10, 22, 40, 0.98);
    backdrop-filter: blur(20px);
    border-left: 1px solid rgba(201, 168, 76, 0.2);
    transition: right 0.3s ease;
    z-index: 1001;
    overflow-y: auto;
  }

  .mobile-menu.open {
    right: 0;
  }

  .mobile-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .mobile-menu-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: #ffffff;
  }

  .mobile-menu-close {
    background: transparent;
    border: none;
    color: #ffffff;
    font-size: 24px;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .mobile-menu-close:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .mobile-menu-nav {
    padding: 20px;
  }

  .mobile-menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .mobile-menu-item {
    margin-bottom: 16px;
  }

  .mobile-menu-link {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
    padding: 12px 16px;
    border-radius: 12px;
    transition: all 0.2s ease;
  }

  .mobile-menu-link:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #c9a84c;
  }

  .mobile-menu-link.active {
    background: rgba(201, 168, 76, 0.15);
    color: #c9a84c;
  }

  .mobile-menu-actions {
    padding: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .mobile-menu-user {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    margin-bottom: 16px;
  }

  .mobile-menu-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c9a84c, #e8c97a);
    color: #0a1628;
    font-size: 16px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-menu-user-info {
    flex: 1;
  }

  .mobile-menu-user-name {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 4px;
  }

  .mobile-menu-user-email {
    font-size: 12px;
    color: #7a8fa6;
  }

  .mobile-menu-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mobile-menu-btn {
    padding: 12px 20px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    text-decoration: none;
  }

  .mobile-menu-login {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }

  .mobile-menu-login:hover {
    border-color: #c9a84c;
    color: #c9a84c;
  }

  .mobile-menu-register {
    background: linear-gradient(135deg, #c9a84c, #e8c97a);
    border: none;
    color: #0a1628;
  }

  .mobile-menu-register:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(201, 168, 76, 0.45);
  }

  .mobile-menu-logout {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
  }

  .mobile-menu-logout:hover {
    background: rgba(239, 68, 68, 0.2);
  }

  .mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .mobile-overlay.open {
    opacity: 1;
    visibility: visible;
  }

  @media (max-width: 900px) {
    .nav-menu {
      display: none;
    }

    .mobile-menu-toggle {
      display: block;
    }

    .nav-container {
      padding: 14px 20px;
    }

    .nav-user-name {
      display: none;
    }
  }

  @media (max-width: 600px) {
    .nav-container {
      padding: 12px 16px;
    }

    .nav-logo {
      font-size: 22px;
    }

    .nav-logo-icon {
      width: 30px;
      height: 30px;
      font-size: 14px;
    }
  }
`;

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, displayName, initials, logOut } = useAuth();
  const { userId } = useSelector(state => state.auth);

  // Handle scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Navigation items
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard', protected: true },
    { label: 'Study Materials', href: '/study-materials', protected: true },
    { label: 'Mock Tests', href: '/mock-tests', protected: true },
    { label: 'Mentorship', href: '/mentorship', protected: true },
    { label: 'Jobs', href: '/jobs', protected: true },
    { label: 'Create Profile', href: '/create-profile', protected: true },
    ...(userId ? [
      { label: 'My Profile', href: `/profile/${userId}`, protected: true },
      { label: 'Nearby Peers', href: `/profile/${userId}/peers`, protected: true },
    ] : []),
  ];

  // Filter navigation items based on authentication
  const filteredNavItems = navItems.filter(item => 
    !item.protected || isAuthenticated
  );

  const handleLogout = () => {
    logOut();
    setMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <style>{css}</style>
      
      {/* Navigation Bar */}
      <nav className={`navigation ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">CA</div>
            Connect<span className="nav-logo-dot">.</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="nav-menu">
            {filteredNavItems.map((item) => (
              <li key={item.href} className="nav-item">
                <Link
                  to={item.href}
                  className={`nav-link ${location.pathname === item.href ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                <div className="nav-user-pill">
                  <div className="nav-avatar">{initials || 'U'}</div>
                  <span className="nav-user-name">Hi, {displayName}</span>
                </div>
                <button className="nav-logout-btn" onClick={handleLogout}>
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button className="nav-login-btn" onClick={() => navigate('/login')}>
                  Log In
                </button>
                <button className="nav-register-btn" onClick={() => navigate('/register')}>
                  Register Free
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={handleMobileMenuToggle}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="mobile-menu-title">Menu</div>
          <button 
            className="mobile-menu-close"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="mobile-menu-nav">
          <ul className="mobile-menu-list">
            {filteredNavItems.map((item) => (
              <li key={item.href} className="mobile-menu-item">
                <Link
                  to={item.href}
                  className={`mobile-menu-link ${location.pathname === item.href ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mobile-menu-actions">
          {isAuthenticated ? (
            <>
              <div className="mobile-menu-user">
                <div className="mobile-menu-avatar">{initials || 'U'}</div>
                <div className="mobile-menu-user-info">
                  <div className="mobile-menu-user-name">{displayName}</div>
                  <div className="mobile-menu-user-email">{user?.email}</div>
                </div>
              </div>
              <div className="mobile-menu-buttons">
                <button className="mobile-menu-btn mobile-menu-logout" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <div className="mobile-menu-buttons">
              <button className="mobile-menu-btn mobile-menu-login" onClick={() => { navigate('/login'); closeMobileMenu(); }}>
                Log In
              </button>
              <button className="mobile-menu-btn mobile-menu-register" onClick={() => { navigate('/register'); closeMobileMenu(); }}>
                Register Free
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
      />
    </>
  );
};

export default Navigation;
