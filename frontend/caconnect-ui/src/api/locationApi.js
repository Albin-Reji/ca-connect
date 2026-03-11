/**
 * locationApi.js
 * ─────────────────────────────────────────────────────────────────
 * Axios-based API client for the CAConnect Location Service.
 *
 * Base URL: http://localhost:8082  (configurable via VITE_LOCATION_API_URL)
 * API Prefix: /api/locations
 *
 * Endpoints mapped:
 *  POST   /api/locations                     → saveLocation(request)
 *  GET    /api/locations/user/{userId}       → getLocationByUserId(userId)
 *  PUT    /api/locations/user/{userId}       → updateLocation(userId, request)
 *  DELETE /api/locations/user/{userId}       → deleteLocation(userId)
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_LOCATION_API_URL || 'http://localhost:8082';
const LOCATION_PREFIX = '/api/locations';

// ── Axios instance ────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: `${BASE_URL}${LOCATION_PREFIX}`,
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
 * Save or update a user's location.
 *
 * @param {Object} locationData
 * @param {string} locationData.userId        - User ID
 * @param {number} locationData.latitude       - Latitude coordinate
 * @param {number} locationData.longitude      - Longitude coordinate
 * @param {string} locationData.address        - Full address
 * @param {string} locationData.city           - City name
 * @param {string} locationData.state          - State name
 * @param {string} locationData.country        - Country name
 * @param {string} locationData.pincode       - Postal code
 * @returns {Promise<Object>} Saved location data
 */
export const saveLocation = async (locationData) => {
  const response = await apiClient.post('/', locationData);
  return response.data;
};

/**
 * Get location information for a specific user.
 *
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Location data
 */
export const getLocationByUserId = async (userId) => {
  const response = await apiClient.get(`/users/${userId}/location`);
  return response.data;
};

/**
 * Update location information for a specific user.
 *
 * @param {string} userId - User ID
 * @param {Object} locationData - Updated location data
 * @returns {Promise<Object>} Updated location data
 */
export const updateLocation = async (userId, locationData) => {
  const response = await apiClient.put(`/users/${userId}/location`, locationData);
  return response.data;
};

/**
 * Delete location information for a specific user.
 *
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const deleteLocation = async (userId) => {
  await apiClient.delete(`/users/${userId}/location`);
};

export default apiClient;
