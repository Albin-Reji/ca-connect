/**
 * userApi.js
 * ─────────────────────────────────────────────────────────────────
 * Axios-based API client for the CAConnect User Service.
 *
 * Base URL: http://localhost:8081  (configurable via VITE_USER_API_URL)
 * API Prefix: /api/users
 *
 * Endpoints mapped:
 *  POST   /api/users/register              → registerUser(request)
 *  GET    /api/users/{userId}              → getUserById(userId)
 *  GET    /api/users/validate/{keyCloakId} → validateUserByKeyCloakId(keyCloakId)
 *  GET    /api/users/userId/{userId}       → isUserExistByUserId(userId)
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_USER_API_URL || 'http://localhost:8081';
const USER_PREFIX = '/api/users';

// ── Axios instance ────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: `${BASE_URL}${USER_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// ── Request interceptor (attach auth token if present) ────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor (normalize errors) ──────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ── API Functions ─────────────────────────────────────────────────

/**
 * Register a new user in the system.
 *
 * @param {Object} userData
 * @param {string} userData.email       - Email address (unique)
 * @param {string} userData.password    - Password
 * @param {string} userData.name        - Full name
 * @param {string} userData.keyCloakId  - Keycloak user ID
 * @returns {Promise<Object>} User response data wrapped in ApiResponse
 */
export const registerUser = async (userData) => {
  const response = await apiClient.post('/register', userData);
  return response.data.data; // Extract data from ApiResponse wrapper
};

/**
 * Retrieve user information by user ID.
 *
 * @param {string} userId - The unique userId to look up
 * @returns {Promise<Object>} User details wrapped in ApiResponse
 */
export const getUserById = async (userId) => {
  const response = await apiClient.get(`/${userId}`);
  return response.data.data; // Extract data from ApiResponse wrapper
};

/**
 * Validate whether a user exists for the given Keycloak ID.
 *
 * @param {string} keyCloakId - Keycloak unique user identifier
 * @returns {Promise<boolean>} true if user exists, false otherwise
 */
export const validateUserByKeyCloakId = async (keyCloakId) => {
  const response = await apiClient.get(`/validate/${keyCloakId}`);
  return response.data;
};

/**
 * Check if a user exists by userId.
 *
 * @param {string} userId - User ID to check
 * @returns {Promise<boolean>} true if user exists, false otherwise
 */
export const isUserExistByUserId = async (userId) => {
  const response = await apiClient.get(`/userId/${userId}`);
  return response.data;
};

export default apiClient;
