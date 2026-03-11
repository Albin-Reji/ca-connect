/**
 * Layout.jsx
 * ─────────────────────────────────────────────────────────────────
 * Main layout component that provides consistent page structure:
 * - Navigation header
 * - Main content area
 * - Footer
 * - Responsive design
 * - Loading states
 */

import { useState, useEffect } from 'react';
import Navigation from './Navigation';

// CSS Styles
const css = `
  .layout {
    min-height: 100vh;
    background: linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #1e3a5f 100%);
    position: relative;
    overflow-x: hidden;
  }

  .layout-content {
    padding-top: 80px; /* Account for fixed navigation */
    min-height: calc(100vh - 80px);
    position: relative;
  }

  .layout-footer {
    background: #060e1c;
    padding: 60px 24px 32px;
    margin-top: auto;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 60px;
  }

  .footer-brand {
    max-width: 280px;
  }

  .footer-logo {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .footer-logo-icon {
    background: linear-gradient(135deg, #c9a84c, #e8c97a);
    border-radius: 8px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #0a1628;
    font-weight: 900;
  }

  .footer-description {
    font-size: 14px;
    color: #7a8fa6;
    line-height: 1.7;
    margin-bottom: 24px;
  }

  .footer-social-links {
    display: flex;
    gap: 12px;
  }

  .footer-social-link {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    color: #7a8fa6;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
  }

  .footer-social-link:hover {
    border-color: #c9a84c;
    color: #c9a84c;
    background: rgba(201, 168, 76, 0.1);
  }

  .footer-column h5 {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #c9a84c;
    margin-bottom: 20px;
  }

  .footer-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 11px;
    padding: 0;
    margin: 0;
  }

  .footer-links a {
    font-size: 14px;
    color: #7a8fa6;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .footer-links a:hover {
    color: #ffffff;
  }

  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    padding-top: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .footer-copyright {
    font-size: 13px;
    color: #7a8fa6;
  }

  .footer-badges {
    display: flex;
    gap: 10px;
  }

  .footer-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 50px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #7a8fa6;
  }

  .layout-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #1e3a5f 100%);
  }

  .layout-loading-spinner {
    text-align: center;
  }

  .loading-icon {
    width: 60px;
    height: 60px;
    border: 3px solid rgba(201, 168, 76, 0.2);
    border-top: 3px solid #c9a84c;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  .loading-text {
    color: #c9a84c;
    font-size: 18px;
    font-weight: 600;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 900px) {
    .layout-content {
      padding-top: 70px;
    }

    .footer-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 600px) {
    .layout-content {
      padding-top: 60px;
    }

    .footer-grid {
      grid-template-columns: 1fr;
      gap: 30px;
    }

    .footer-brand {
      max-width: 100%;
    }

    .footer-bottom {
      flex-direction: column;
      text-align: center;
    }
  }
`;

const Layout = ({ children, showFooter = true, loading = false, loadingText = 'Loading...' }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div className="layout-loading">
          <div className="layout-loading-spinner">
            <div className="loading-icon"></div>
            <div className="loading-text">{loadingText}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="layout">
        <Navigation />
        
        <main className="layout-content">
          {children}
        </main>

        {showFooter && (
          <footer className="layout-footer">
            <div className="footer-container">
              <div className="footer-grid">
                {/* Brand Column */}
                <div className="footer-brand">
                  <div className="footer-logo">
                    <div className="footer-logo-icon">CA</div>
                    Connect
                  </div>
                  <p className="footer-description">
                    India's premier platform for CA students and professionals. 
                    Connect, learn, and grow with the largest CA community.
                  </p>
                  <div className="footer-social-links">
                    <a href="#" className="footer-social-link" aria-label="LinkedIn">
                      in
                    </a>
                    <a href="#" className="footer-social-link" aria-label="Twitter">
                      𝕏
                    </a>
                    <a href="#" className="footer-social-link" aria-label="Facebook">
                      f
                    </a>
                    <a href="#" className="footer-social-link" aria-label="Instagram">
                      📷
                    </a>
                  </div>
                </div>

                {/* Platform Column */}
                <div className="footer-column">
                  <h5>Platform</h5>
                  <ul className="footer-links">
                    <li><a href="/study-materials">Study Materials</a></li>
                    <li><a href="/mock-tests">Mock Tests</a></li>
                    <li><a href="/mentorship">Mentorship</a></li>
                    <li><a href="/jobs">Career Opportunities</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                  </ul>
                </div>

                {/* Resources Column */}
                <div className="footer-column">
                  <h5>Resources</h5>
                  <ul className="footer-links">
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Success Stories</a></li>
                    <li><a href="#">Study Guides</a></li>
                    <li><a href="#">Exam Tips</a></li>
                    <li><a href="#">FAQ</a></li>
                  </ul>
                </div>

                {/* Company Column */}
                <div className="footer-column">
                  <h5>Company</h5>
                  <ul className="footer-links">
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Contact</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Service</a></li>
                    <li><a href="#">Support</a></li>
                  </ul>
                </div>
              </div>

              <div className="footer-bottom">
                <div className="footer-copyright">
                  © 2024 CAConnect. All rights reserved. Built with ❤️ for the CA community.
                </div>
                <div className="footer-badges">
                  <span className="footer-badge">ICAI Approved</span>
                  <span className="footer-badge">Secure Platform</span>
                  <span className="footer-badge">24/7 Support</span>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </>
  );
};

export default Layout;
