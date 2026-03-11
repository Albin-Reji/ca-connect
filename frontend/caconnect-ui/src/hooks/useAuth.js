/**
 * useAuth.js
 * ─────────────────────────────────────────────────────────────────
 * Custom hook for authentication management.
 * Provides authentication state and utility functions.
 */

import { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useSelector, useDispatch } from 'react-redux';
import { setCredential, logout } from '../store/authSlice';
import tokenManager from '../utils/tokenManager';

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  const dispatch = useDispatch();
  const { userId, token: reduxToken, user: reduxUser } = useSelector(state => state.auth);
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check if we have stored auth data
        const storedAuth = tokenManager.getAuthData();
        
        if (storedAuth && storedAuth.isValid) {
          // Sync stored data with Redux if not already present
          if (!reduxToken || !reduxUser) {
            dispatch(setCredential({
              token: storedAuth.token,
              user: storedAuth.user
            }));
          }
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthError(error.message);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [dispatch, reduxToken, reduxUser]);

  // Sync OAuth context with Redux and token manager
  useEffect(() => {
    if (authContext.token && authContext.tokenData) {
      // Update Redux store
      dispatch(setCredential({
        token: authContext.token,
        user: authContext.tokenData
      }));
      
      // Update token manager
      tokenManager.setAuthData(
        authContext.token,
        authContext.tokenData,
        authContext.refreshToken,
        authContext.expiresIn
      );
    }
  }, [authContext.token, authContext.tokenData, authContext.refreshToken, authContext.expiresIn, dispatch]);

  // Enhanced logout function
  const handleLogout = useCallback(() => {
    try {
      // Clear Redux state
      dispatch(logout());
      
      // Clear token manager
      tokenManager.clearAuthData();
      
      // Call OAuth logout if available
      if (authContext.logOut && typeof authContext.logOut === 'function') {
        authContext.logOut();
      }
    } catch (error) {
      console.error('Error during logout:', error);
      setAuthError(error.message);
    }
  }, [dispatch, authContext]);

  // Get user display name
  const getDisplayName = useCallback(() => {
    const user = reduxUser || authContext.tokenData;
    return tokenManager.getUserDisplayName(user);
  }, [reduxUser, authContext.tokenData]);

  // Get user initials
  const getInitials = useCallback(() => {
    const user = reduxUser || authContext.tokenData;
    return tokenManager.getUserInitials(user);
  }, [reduxUser, authContext.tokenData]);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return Boolean(
      authContext.token && 
      authContext.tokenData && 
      (userId || tokenManager.getUserId())
    );
  }, [authContext.token, authContext.tokenData, userId]);

  // Get current user ID
  const getCurrentUserId = useCallback(() => {
    return userId || tokenManager.getUserId();
  }, [userId]);

  // Refresh authentication state
  const refreshAuth = useCallback(() => {
    const storedAuth = tokenManager.getAuthData();
    if (storedAuth && storedAuth.isValid) {
      dispatch(setCredential({
        token: storedAuth.token,
        user: storedAuth.user
      }));
    }
  }, [dispatch]);

  return {
    // Authentication state
    isAuthenticated: isAuthenticated(),
    isInitialized,
    authError,
    
    // User information
    user: reduxUser || authContext.tokenData,
    userId: getCurrentUserId(),
    displayName: getDisplayName(),
    initials: getInitials(),
    
    // OAuth context values
    token: authContext.token,
    tokenData: authContext.tokenData,
    idToken: authContext.idToken,
    refreshToken: authContext.refreshToken,
    expiresIn: authContext.expiresIn,
    
    // Authentication actions
    logIn: authContext.logIn,
    logOut: handleLogout,
    refreshAuth,
    
    // Utility functions
    clearAuthError: () => setAuthError(null),
    
    // Token manager access (for advanced usage)
    tokenManager
  };
};

export default useAuth;
