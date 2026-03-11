/**
 * AuthGuard.jsx
 * ─────────────────────────────────────────────────────────────────
 * Authentication guard component that protects routes.
 * Redirects unauthenticated users to login and handles role-based access.
 */

import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useSelector } from 'react-redux';
import { PageLoader } from './ui/Loader';

const AuthGuard = ({ children, requireAuth = true, allowedRoles = [] }) => {
  const { token, tokenData, logIn } = useContext(AuthContext);
  const { userId } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated
      const hasToken = Boolean(token);
      const hasTokenData = Boolean(tokenData);
      const hasUserId = Boolean(userId);

      setIsAuthenticated(hasToken && hasTokenData && hasUserId);
      setIsLoading(false);

      // If authentication is required but user is not authenticated
      if (requireAuth && !hasToken) {
        // Store the attempted location for redirect after login
        sessionStorage.setItem('redirectAfterLogin', location.pathname);
        logIn();
        return;
      }

      // If user is authenticated but no userId in Redux, wait a bit
      if (hasToken && hasTokenData && !hasUserId) {
        const timeout = setTimeout(() => {
          // Check again after a short delay
          const updatedUserId = localStorage.getItem('userId');
          if (!updatedUserId) {
            console.warn('User authenticated but no userId found in Redux or localStorage');
            // You might want to handle this case differently
          }
          setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timeout);
      }
    };

    checkAuth();
  }, [token, tokenData, userId, requireAuth, logIn, location.pathname]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #1e3a5f 100%)'
      }}>
        <PageLoader message="Verifying authentication..." />
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #1e3a5f 100%)',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#c9a84c' }}>🔐</div>
        <h2 style={{ 
          fontFamily: 'Playfair Display, serif', 
          fontSize: '2rem', 
          color: '#ffffff', 
          marginBottom: '1rem' 
        }}>
          Authentication Required
        </h2>
        <p style={{ color: '#7a8fa6', marginBottom: '2rem', maxWidth: '400px' }}>
          Please log in to access this page. You'll be redirected to the login page.
        </p>
        <button
          onClick={() => logIn()}
          style={{
            background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
            border: 'none',
            borderRadius: '50px',
            padding: '14px 32px',
            color: '#0a1628',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Log In Now
        </button>
      </div>
    );
  }

  // Role-based access control (if implemented in future)
  if (allowedRoles.length > 0 && tokenData?.roles) {
    const userRoles = Array.isArray(tokenData.roles) ? tokenData.roles : [tokenData.roles];
    const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #1e3a5f 100%)',
          flexDirection: 'column',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#f77f00' }}>⚠️</div>
          <h2 style={{ 
            fontFamily: 'Playfair Display, serif', 
            fontSize: '2rem', 
            color: '#ffffff', 
            marginBottom: '1rem' 
          }}>
            Access Denied
          </h2>
          <p style={{ color: '#7a8fa6', marginBottom: '2rem', maxWidth: '400px' }}>
            You don't have the required permissions to access this page.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50px',
              padding: '14px 32px',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Go Home
          </button>
        </div>
      );
    }
  }

  // If all checks pass, render the children
  return children;
};

export default AuthGuard;
