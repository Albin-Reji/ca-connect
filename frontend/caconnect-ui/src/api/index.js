/**
 * index.js
 * ─────────────────────────────────────────────────────────────────
 * Central API exports for CAConnect frontend.
 * 
 * This file exports all API functions from different service modules
 * to provide a single import point for the entire application.
 */

// Profile Service API
export {
  createProfile,
  getProfile,
  getNearestPeers
} from './profileApi';

// User Service API
export {
  registerUser,
  getUserById,
  validateUserByKeyCloakId,
  isUserExistByUserId
} from './userApi';

// Location Service API
export {
  saveLocation,
  getLocationByUserId,
  updateLocation,
  deleteLocation
} from './locationApi';

// Study Service API (Mock)
export {
  getStudyMaterials,
  getMockTests,
  getStudyMaterialById,
  recordDownload,
  getUserStudyAnalytics
} from './studyApi';

// Re-export the axios instances for direct use if needed
export { default as profileApi } from './profileApi';
export { default as userApi } from './userApi';
export { default as locationApi } from './locationApi';
export { default as studyApi } from './studyApi';
