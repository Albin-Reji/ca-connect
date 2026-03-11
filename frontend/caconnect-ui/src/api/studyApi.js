/**
 * studyApi.js
 * ─────────────────────────────────────────────────────────────────
 * Mock API client for CAConnect Study Resources and Materials.
 * This would connect to a future Study Service backend.
 *
 * Base URL: http://localhost:8084  (configurable via VITE_STUDY_API_URL)
 * API Prefix: /api/study
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_STUDY_API_URL || 'http://localhost:8084';
const STUDY_PREFIX = '/api/study';

// ── Axios instance ────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: `${BASE_URL}${STUDY_PREFIX}`,
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

// ── Mock Data Functions (until backend is ready) ─────────────────

const mockStudyMaterials = [
  {
    id: '1',
    title: 'Principles of Accounting – Complete Notes',
    description: 'Chapter-wise notes, diagrams, and solved examples covering the entire Foundation syllabus.',
    category: 'Foundation',
    type: 'notes',
    downloadCount: 2340,
    rating: 4.8,
    author: 'CA Rajiv Khanna',
    tags: ['accounting', 'foundation', 'notes'],
    createdAt: '2024-01-15',
    updatedAt: '2024-03-10',
    fileUrl: '/mock-files/foundation-accounting-notes.pdf',
    thumbnail: '/mock-images/accounting-thumb.jpg'
  },
  {
    id: '2',
    title: 'Advanced Accounting & Corporate Laws',
    description: 'Comprehensive coverage of Group 1 & 2 subjects with ICAI RTP alignment.',
    category: 'Intermediate',
    type: 'notes',
    downloadCount: 1870,
    rating: 4.9,
    author: 'CA Neha Gupta',
    tags: ['advanced-accounting', 'corporate-laws', 'intermediate'],
    createdAt: '2024-02-20',
    updatedAt: '2024-03-15',
    fileUrl: '/mock-files/intermediate-advanced-accounting.pdf',
    thumbnail: '/mock-images/advanced-accounting-thumb.jpg'
  },
  {
    id: '3',
    title: 'Financial Reporting (IND AS) Masterclass',
    description: 'In-depth IND AS notes with practical illustrations and recent exam trends.',
    category: 'Final',
    type: 'masterclass',
    downloadCount: 3110,
    rating: 4.7,
    author: 'CA Ananya Krishnan',
    tags: ['ind-as', 'financial-reporting', 'final'],
    createdAt: '2024-01-10',
    updatedAt: '2024-03-20',
    fileUrl: '/mock-files/final-ind-as-masterclass.pdf',
    thumbnail: '/mock-images/ind-as-thumb.jpg'
  },
  {
    id: '4',
    title: 'Mock Test Series – May 2025 Attempt',
    description: 'Full-length papers modelled on ICAI pattern with detailed solution discussions.',
    category: 'Practice',
    type: 'mock-test',
    downloadCount: 5670,
    rating: 4.9,
    author: 'CA Varun Malhotra',
    tags: ['mock-test', 'practice', 'may-2025'],
    createdAt: '2024-03-01',
    updatedAt: '2024-03-25',
    fileUrl: '/mock-files/mock-test-may-2025.pdf',
    thumbnail: '/mock-images/mock-test-thumb.jpg'
  },
  {
    id: '5',
    title: 'GST Amendments & Budget Updates 2024-25',
    description: 'All recent amendments, notifications, and circulars explained in simple language.',
    category: 'GST',
    type: 'updates',
    downloadCount: 4200,
    rating: 4.6,
    author: 'CA Divya Gupta',
    tags: ['gst', 'amendments', 'budget-updates'],
    createdAt: '2024-02-15',
    updatedAt: '2024-03-22',
    fileUrl: '/mock-files/gst-amendments-2024.pdf',
    thumbnail: '/mock-images/gst-thumb.jpg'
  },
  {
    id: '6',
    title: 'Articleship – How to Find the Best Firm',
    description: 'Insider guide to applying at Big 4s, mid-tier firms, and negotiating terms.',
    category: 'Career',
    type: 'guide',
    downloadCount: 2980,
    rating: 4.8,
    author: 'CA Ravi Shetty',
    tags: ['articleship', 'career', 'big4'],
    createdAt: '2024-01-25',
    updatedAt: '2024-03-18',
    fileUrl: '/mock-files/articleship-guide.pdf',
    thumbnail: '/mock-images/articleship-thumb.jpg'
  }
];

const mockMockTests = [
  {
    id: 'mt1',
    title: 'Foundation Mock Test #1',
    description: 'Full syllabus mock test with time limits and instant evaluation',
    category: 'Foundation',
    duration: 180, // minutes
    questions: 100,
    attempts: 1250,
    averageScore: 68,
    difficulty: 'Medium',
    createdAt: '2024-03-01'
  },
  {
    id: 'mt2',
    title: 'Intermediate Group 1 Mock Test',
    description: 'Group 1 subjects: Advanced Accounting, Corporate Laws, Taxation',
    category: 'Intermediate',
    duration: 240,
    questions: 120,
    attempts: 890,
    averageScore: 62,
    difficulty: 'Hard',
    createdAt: '2024-03-05'
  },
  {
    id: 'mt3',
    title: 'Final Financial Reporting Mock',
    description: 'Focused mock test on IND AS and Financial Reporting',
    category: 'Final',
    duration: 150,
    questions: 60,
    attempts: 450,
    averageScore: 58,
    difficulty: 'Hard',
    createdAt: '2024-03-10'
  }
];

// ── API Functions ─────────────────────────────────────────────────

/**
 * Get study materials by category or all materials.
 *
 * @param {string} category - Optional category filter (Foundation, Intermediate, Final, etc.)
 * @returns {Promise<Array>} Array of study materials
 */
export const getStudyMaterials = async (category = null) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (category) {
    return mockStudyMaterials.filter(material => 
      material.category.toLowerCase() === category.toLowerCase()
    );
  }
  return mockStudyMaterials;
};

/**
 * Get mock tests by category or all mock tests.
 *
 * @param {string} category - Optional category filter
 * @returns {Promise<Array>} Array of mock tests
 */
export const getMockTests = async (category = null) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (category) {
    return mockMockTests.filter(test => 
      test.category.toLowerCase() === category.toLowerCase()
    );
  }
  return mockMockTests;
};

/**
 * Get a specific study material by ID.
 *
 * @param {string} materialId - Material ID
 * @returns {Promise<Object>} Study material details
 */
export const getStudyMaterialById = async (materialId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const material = mockStudyMaterials.find(m => m.id === materialId);
  if (!material) {
    throw new Error('Study material not found');
  }
  return material;
};

/**
 * Record a download for a study material.
 *
 * @param {string} materialId - Material ID
 * @returns {Promise<Object>} Updated material data
 */
export const recordDownload = async (materialId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const material = mockStudyMaterials.find(m => m.id === materialId);
  if (!material) {
    throw new Error('Study material not found');
  }
  
  material.downloadCount += 1;
  return material;
};

/**
 * Get user's study progress and analytics.
 *
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User's study analytics
 */
export const getUserStudyAnalytics = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    userId,
    totalDownloads: 15,
    completedMockTests: 8,
    averageScore: 72,
    studyStreak: 12,
    weakTopics: ['SFM Derivatives', 'GST Amendments'],
    strongTopics: ['Accounting Standards', 'Direct Tax Basics'],
    lastActiveDate: '2024-03-25',
    rankPercentile: 78
  };
};

export default apiClient;
