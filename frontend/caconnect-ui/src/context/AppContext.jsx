/**
 * AppContext.jsx
 * ─────────────────────────────────────────────────────────────────
 * Global state management via React Context.
 * Manages: active userId, toast notifications, cached profiles.
 */

import { createContext, useContext, useReducer, useCallback } from 'react';

// ── Initial state ─────────────────────────────────────────────────
const initialState = {
  userId: localStorage.getItem('userId') || '',
  profileCache: {},   // userId → UserProfile
  toasts: [],
};

// ── Actions ───────────────────────────────────────────────────────
const SET_USER_ID    = 'SET_USER_ID';
const CACHE_PROFILE  = 'CACHE_PROFILE';
const ADD_TOAST      = 'ADD_TOAST';
const REMOVE_TOAST   = 'REMOVE_TOAST';

function reducer(state, action) {
  switch (action.type) {
    case SET_USER_ID:
      return { ...state, userId: action.payload };
    case CACHE_PROFILE:
      return {
        ...state,
        profileCache: { ...state.profileCache, [action.payload.userId]: action.payload },
      };
    case ADD_TOAST:
      return { ...state, toasts: [...state.toasts, action.payload] };
    case REMOVE_TOAST:
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  /** Persist userId to localStorage whenever it changes */
  const setUserId = useCallback((id) => {
    localStorage.setItem('caconnect_userId', id);
    dispatch({ type: SET_USER_ID, payload: id });
  }, []);

  /** Cache a fetched profile */
  const cacheProfile = useCallback((profile) => {
    dispatch({ type: CACHE_PROFILE, payload: profile });
  }, []);

  /** Show a toast notification */
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    dispatch({ type: ADD_TOAST, payload: { id, message, type } });
    setTimeout(() => dispatch({ type: REMOVE_TOAST, payload: id }), 4500);
  }, []);

  /** Manually dismiss a toast */
  const dismissToast = useCallback((id) => {
    dispatch({ type: REMOVE_TOAST, payload: id });
  }, []);

  return (
    <AppContext.Provider value={{ state, setUserId, cacheProfile, showToast, dismissToast }}>
      {children}
    </AppContext.Provider>
  );
}

/** Hook to consume the app context */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within <AppProvider>');
  return ctx;
}