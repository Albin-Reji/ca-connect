/**
 * MockTests.jsx
 * ─────────────────────────────────────────────────────────────────
 * Mock test platform with:
 * - Test browser and filtering
 * - Test taking interface
 * - Performance analytics
 * - Progress tracking
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMockTests, getUserStudyAnalytics } from '../api';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';

// CSS Styles
const css = `
  .mock-tests {
    max-width: 1400px;
    margin: 0 auto;
    padding: 120px 24px 40px;
    min-height: 100vh;
    background: linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #1e3a5f 100%);
  }

  .page-header {
    text-align: center;
    margin-bottom: 48px;
  }

  .page-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 16px;
    line-height: 1.1;
  }

  .page-subtitle {
    font-size: 1.1rem;
    color: #7a8fa6;
    margin-bottom: 32px;
    line-height: 1.6;
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }

  .stat-card {
    background: rgba(13, 30, 56, 0.8);
    border: 1px solid rgba(201, 168, 76, 0.2);
    border-radius: 16px;
    padding: 24px;
    backdrop-filter: blur(10px);
    text-align: center;
  }

  .stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 900;
    color: #c9a84c;
    margin-bottom: 8px;
  }

  .stat-label {
    font-size: 0.9rem;
    color: #7a8fa6;
    font-weight: 500;
  }

  .tests-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 24px;
    margin-bottom: 48px;
  }

  .test-card {
    background: rgba(13, 30, 56, 0.8);
    border: 1px solid rgba(201, 168, 76, 0.2);
    border-radius: 20px;
    padding: 28px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .test-card:hover {
    transform: translateY(-4px);
    border-color: rgba(201, 168, 76, 0.5);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .test-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(99, 230, 190, 0.15);
    border: 1px solid rgba(99, 230, 190, 0.3);
    padding: 6px 12px;
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #63e6be;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
  }

  .test-badge.hard {
    background: rgba(244, 114, 182, 0.15);
    border-color: rgba(244, 114, 182, 0.3);
    color: #f472b6;
  }

  .test-badge.medium {
    background: rgba(247, 127, 0, 0.15);
    border-color: rgba(247, 127, 0, 0.3);
    color: #f77f00;
  }

  .test-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 12px;
    line-height: 1.3;
  }

  .test-description {
    font-size: 0.9rem;
    color: #7a8fa6;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .test-meta {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: #7a8fa6;
  }

  .meta-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .test-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
  }

  .test-stat {
    text-align: center;
  }

  .test-stat-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 4px;
  }

  .test-stat-label {
    font-size: 0.75rem;
    color: #7a8fa6;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .test-actions {
    display: flex;
    gap: 12px;
  }

  .start-btn {
    flex: 1;
    background: linear-gradient(135deg, #63e6be, #4ea8de);
    border: none;
    border-radius: 12px;
    padding: 14px 20px;
    color: #0a1628;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .start-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99, 230, 190, 0.4);
  }

  .preview-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 14px 20px;
    color: #ffffff;
    font-weight: 500;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .preview-btn:hover {
    border-color: #c9a84c;
    color: #c9a84c;
  }

  .progress-section {
    background: rgba(13, 30, 56, 0.8);
    border: 1px solid rgba(201, 168, 76, 0.2);
    border-radius: 20px;
    padding: 32px;
    margin-bottom: 32px;
    backdrop-filter: blur(10px);
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .progress-item {
    margin-bottom: 20px;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .progress-label {
    font-size: 0.95rem;
    color: #ffffff;
    font-weight: 500;
  }

  .progress-value {
    font-size: 0.9rem;
    color: #c9a84c;
    font-weight: 600;
  }

  .progress-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #63e6be, #4ea8de);
    border-radius: 4px;
    transition: width 0.6s ease;
  }

  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 80px;
    color: #c9a84c;
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    .mock-tests {
      padding: 100px 16px 32px;
    }

    .tests-grid {
      grid-template-columns: 1fr;
    }

    .test-meta {
      grid-template-columns: 1fr;
    }

    .stats-row {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;

export default function MockTests() {
  const { showToast } = useApp();
  const [tests, setTests] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  const userId = localStorage.getItem('userId');
  const categories = ['Foundation', 'Intermediate', 'Final', 'Practice'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [testsData, analyticsData] = await Promise.all([
        getMockTests(),
        userId ? getUserStudyAnalytics(userId) : Promise.resolve(null)
      ]);
      
      setTests(testsData);
      setAnalytics(analyticsData);
    } catch (error) {
      showToast('Failed to load mock tests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = selectedCategory
    ? tests.filter(test => test.category === selectedCategory)
    : tests;

  const handleStartTest = (test) => {
    showToast(`Starting: ${test.title}`, 'success');
    // In a real app, this would navigate to the test taking interface
    // navigate(`/test/${test.id}`);
  };

  const handlePreviewTest = (test) => {
    showToast(`Preview: ${test.title}`, 'info');
    // In a real app, this would show test preview
  };

  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div className="mock-tests">
          <div className="loading-spinner">
            📝 Loading mock tests...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="mock-tests">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Mock Tests</h1>
          <p className="page-subtitle">
            Practice with exam-style mock tests designed by qualified CAs
          </p>
        </div>

        {/* Stats Overview */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{analytics?.completedMockTests || 0}</div>
            <div className="stat-label">Tests Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{analytics?.averageScore || 0}%</div>
            <div className="stat-label">Average Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{tests.length}</div>
            <div className="stat-label">Available Tests</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {analytics?.rankPercentile || 0}%
            </div>
            <div className="stat-label">Rank Percentile</div>
          </div>
        </div>

        {/* Progress Section */}
        {analytics && (
          <div className="progress-section">
            <h2 className="section-title">
              📊 Your Performance Overview
            </h2>
            
            <div className="progress-item">
              <div className="progress-header">
                <span className="progress-label">Mock Test Completion</span>
                <span className="progress-value">
                  {Math.round((analytics.completedMockTests / tests.length) * 100)}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(analytics.completedMockTests / tests.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-header">
                <span className="progress-label">Score Performance</span>
                <span className="progress-value">{analytics.averageScore}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${analytics.averageScore}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button
              variant={selectedCategory === '' ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory('')}
            >
              All Tests
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline'}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Tests Grid */}
        <div className="tests-grid">
          {filteredTests.map((test) => (
            <div key={test.id} className="test-card">
              <span className={`test-badge ${test.difficulty.toLowerCase()}`}>
                {test.difficulty}
              </span>

              <h3 className="test-title">
                {test.title}
              </h3>

              <p className="test-description">
                {test.description}
              </p>

              <div className="test-meta">
                <div className="meta-item">
                  <div className="meta-icon">⏱️</div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>
                      {test.duration} min
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7a8fa6' }}>
                      Duration
                    </div>
                  </div>
                </div>
                <div className="meta-item">
                  <div className="meta-icon">📝</div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>
                      {test.questions}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7a8fa6' }}>
                      Questions
                    </div>
                  </div>
                </div>
              </div>

              <div className="test-stats">
                <div className="test-stat">
                  <div className="test-stat-value">{test.attempts}</div>
                  <div className="test-stat-label">Attempts</div>
                </div>
                <div className="test-stat">
                  <div className="test-stat-value">{test.averageScore}%</div>
                  <div className="test-stat-label">Avg Score</div>
                </div>
                <div className="test-stat">
                  <div className="test-stat-value">{test.category}</div>
                  <div className="test-stat-label">Category</div>
                </div>
              </div>

              <div className="test-actions">
                <button
                  className="start-btn"
                  onClick={() => handleStartTest(test)}
                >
                  🚀 Start Test
                </button>
                <button
                  className="preview-btn"
                  onClick={() => handlePreviewTest(test)}
                >
                  👁️ Preview
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#7a8fa6' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📝</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>
              No tests found
            </h3>
            <p style={{ fontSize: '1rem', marginBottom: 24 }}>
              Try selecting a different category
            </p>
            <Button onClick={() => setSelectedCategory('')}>
              Show All Tests
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
