/**
 * tokenManager.js
 * ─────────────────────────────────────────────────────────────────
 * Utility for managing authentication tokens and user session.
 * Handles token storage, validation, refresh, and cleanup.
 */

class TokenManager {
  constructor() {
    this.TOKEN_KEY = 'auth_token';
    this.USER_KEY = 'auth_user';
    this.REFRESH_TOKEN_KEY = 'refresh_token';
    this.EXPIRY_KEY = 'token_expiry';
  }

  /**
   * Store authentication data securely
   */
  setAuthData(token, user, refreshToken = null, expiresIn = null) {
    try {
      // Store token
      localStorage.setItem(this.TOKEN_KEY, token);
      
      // Store user data
      if (user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }
      
      // Store refresh token if available
      if (refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      }
      
      // Store expiry time if available
      if (expiresIn) {
        const expiryTime = Date.now() + (expiresIn * 1000);
        localStorage.setItem(this.EXPIRY_KEY, expiryTime.toString());
      }
      
      // Set userId for easy access
      if (user?.userId || user?.sub || user?.preferred_username) {
        const userId = user.userId || user.sub || user.preferred_username;
        localStorage.setItem('userId', userId);
      }
      
      return true;
    } catch (error) {
      console.error('Error storing auth data:', error);
      return false;
    }
  }

  /**
   * Get stored authentication data
   */
  getAuthData() {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const userStr = localStorage.getItem(this.USER_KEY);
      const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      const expiryStr = localStorage.getItem(this.EXPIRY_KEY);
      
      if (!token || !userStr) {
        return null;
      }
      
      const user = JSON.parse(userStr);
      const expiry = expiryStr ? parseInt(expiryStr) : null;
      
      return {
        token,
        user,
        refreshToken,
        expiry,
        isValid: this.isTokenValid(expiry)
      };
    } catch (error) {
      console.error('Error retrieving auth data:', error);
      return null;
    }
  }

  /**
   * Check if token is still valid
   */
  isTokenValid(expiry = null) {
    if (!expiry) {
      // If no expiry time, assume token is valid
      return true;
    }
    
    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
    return now < (expiry - bufferTime);
  }

  /**
   * Check if token is expired or about to expire
   */
  isTokenExpired(expiry = null) {
    if (!expiry) {
      return false;
    }
    
    const now = Date.now();
    return now >= expiry;
  }

  /**
   * Clear all authentication data
   */
  clearAuthData() {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.EXPIRY_KEY);
      localStorage.removeItem('userId');
      
      // Also clear any session storage
      sessionStorage.clear();
      
      return true;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  }

  /**
   * Get current user ID
   */
  getUserId() {
    return localStorage.getItem('userId');
  }

  /**
   * Get current user data
   */
  getCurrentUser() {
    const authData = this.getAuthData();
    return authData?.user || null;
  }

  /**
   * Get current token
   */
  getCurrentToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = this.getCurrentToken();
    const authData = this.getAuthData();
    
    return Boolean(token && authData && authData.isValid);
  }

  /**
   * Setup automatic token refresh monitoring
   */
  setupTokenRefresh(callback) {
    const checkToken = () => {
      const authData = this.getAuthData();
      
      if (!authData || !authData.expiry) {
        return;
      }
      
      // If token is about to expire (within 5 minutes), trigger refresh
      if (this.isTokenExpired(authData.expiry - (5 * 60 * 1000))) {
        if (callback && typeof callback === 'function') {
          callback();
        }
      }
    };

    // Check every minute
    const intervalId = setInterval(checkToken, 60000);
    
    // Return cleanup function
    return () => clearInterval(intervalId);
  }

  /**
   * Parse JWT token (for basic info extraction)
   */
  parseJWT(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  /**
   * Get user display name from various possible fields
   */
  getUserDisplayName(user) {
    if (!user) return '';
    
    return (
      user.name ||
      user.fullName ||
      user.given_name ||
      user.preferred_username ||
      user.email?.split('@')[0] ||
      'User'
    );
  }

  /**
   * Get user initials for avatar
   */
  getUserInitials(user) {
    const name = this.getUserDisplayName(user);
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0]?.toUpperCase())
      .join('');
  }

  /**
   * Validate token format (basic JWT validation)
   */
  validateTokenFormat(token) {
    if (!token || typeof token !== 'string') {
      return false;
    }
    
    const parts = token.split('.');
    return parts.length === 3;
  }
}

// Create singleton instance
const tokenManager = new TokenManager();

export default tokenManager;
