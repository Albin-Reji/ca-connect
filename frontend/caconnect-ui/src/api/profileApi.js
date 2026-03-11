/**
 * profileApi.js
 * ─────────────────────────────────────────────────────────────────
 * Axios-based API client for the CAConnect Profile Service.
 *
 * Base URL: http://localhost:8083  (configurable via VITE_API_BASE_URL)
 * API Prefix: /api/profiles
 *
 * Endpoints mapped:
 *  POST   /api/profiles/                       → createProfile(request)
 *  GET    /api/profiles/users/:userId          → getProfile(userId)
 *  GET    /api/profiles/users/:userId/nearest/:limit → getNearestPeers(userId, limit)
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const PROFILE_PREFIX = import.meta.env.VITE_PROFILE_API || '/api/profiles';

// ── Axios instance ────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: `${BASE_URL}${PROFILE_PREFIX}`,
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
 * Create a new user profile.
 *
 * @param {Object} profileData
 * @param {string} profileData.userId      - Unique user identifier
 * @param {string} profileData.fullName    - Full display name
 * @param {number} profileData.age         - Age (integer)
 * @param {string} profileData.examStage   - FOUNDATION | INTERMEDIATE | FINAL | QUALIFIED
 * @param {Object} profileData.address     - { streetAddress, city, state, country }
 * @param {string} profileData.email       - Email address (unique)
 * @param {string} profileData.phoneNumber - Phone number (unique)
 * @returns {Promise<UserProfile>}
 */
export const createProfile = async (profileData) => {
  const response = await apiClient.post('/', profileData);
  return response.data;
};

/**
 * Retrieve a user profile by userId.
 *
 * @param {string} userId - The unique userId to look up
 * @returns {Promise<UserProfile>}
 */
export const getProfile = async (userId) => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

/**
 * Find the nearest CA peers at the same exam stage as the given user.
 *
 * @param {string}  userId - The requesting user's ID
 * @param {number}  limit  - Maximum number of nearby peers to return
 * @returns {Promise<Location[]>}
 */
export const getNearestPeers = async (userId, limit = 5) => {
  const response = await apiClient.get(`/users/${userId}/nearest/${limit}`);
  return response.data;
};

export default apiClient;