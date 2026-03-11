/**
 * Dashboard.jsx
 * ─────────────────────────────────────────────────────────────────
 * Main dashboard for logged-in users showing:
 * - Study progress overview
 * - Recent activities
 * - Quick access to resources
 * - Upcoming events/deadlines
 * - Performance analytics
 */

import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useSelector } from 'react-redux';
import { useApp } from '../context/AppContext';
import { getProfile, getUserStudyAnalytics, getStudyMaterials } from '../api';
import { useApi } from '../hooks/useApi';
import { PageLoader } from '../components/ui/Loader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// CSS Styles
const css = `
  .dashboard {
    max-width: 1400px;
    margin: 0 auto;
    padding: 120px 24px 40px;
    min-height: 100vh;
    background: linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #1e3a5f 100%);
  }

  .dashboard-header {
    margin-bottom: 48px;
    text-align: left;
  }

  .dashboard-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 12px;
    line-height: 1.1;
  }

  .dashboard-subtitle {
    font-size: 1.1rem;
    color: #7a8fa6;
    margin-bottom: 24px;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
    margin-bottom: 48px;
  }

  .stat-card {
    background: rgba(13, 30, 56, 0.8);
    border: 1px solid rgba(201, 168, 76, 0.2);
    border-radius: 20px;
    padding: 32px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    border-color: rgba(201, 168, 76, 0.5);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin-bottom: 20px;
  }

  .stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 8px;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.9rem;
    color: #7a8fa6;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
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
    margin-bottom: 24px;
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
    background: linear-gradient(90deg, #c9a84c, #e8c97a);
    border-radius: 4px;
    transition: width 0.6s ease;
  }

  .quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  .action-btn {
    background: rgba(13, 30, 56, 0.8);
    border: 1px solid rgba(201, 168, 76, 0.2);
    border-radius: 16px;
    padding: 24px;
    text-align: center;
    text-decoration: none;
    color: #ffffff;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .action-btn:hover {
    transform: translateY(-4px);
    border-color: #c9a84c;
    box-shadow: 0 12px 24px rgba(201, 168, 76, 0.2);
  }

  .action-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background: linear-gradient(135deg, #c9a84c, #e8c97a);
    color: #0a1628;
  }

  .action-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: #ffffff;
  }

  .action-desc {
    font-size: 0.8rem;
    color: #7a8fa6;
    line-height: 1.4;
  }

  .recent-activity {
    background: rgba(13, 30, 56, 0.8);
    border: 1px solid rgba(201, 168, 76, 0.2);
    border-radius: 20px;
    padding: 32px;
    backdrop-filter: blur(10px);
  }

  .activity-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .activity-item:last-child {
    border-bottom: none;
  }

  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .activity-content {
    flex: 1;
  }

  .activity-title {
    font-size: 0.95rem;
    color: #ffffff;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .activity-time {
    font-size: 0.8rem;
    color: #7a8fa6;
  }

  .gold-accent {
    color: #c9a84c;
  }

  .welcome-banner {
    background: linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(232, 201, 122, 0.1));
    border: 1px solid rgba(201, 168, 76, 0.3);
    border-radius: 20px;
    padding: 32px;
    margin-bottom: 32px;
    text-align: center;
    backdrop-filter: blur(10px);
  }

  .welcome-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 12px;
  }

  .welcome-subtitle {
    font-size: 1rem;
    color: #e8c97a;
    margin-bottom: 24px;
  }

  @media (max-width: 768px) {
    .dashboard {
      padding: 100px 16px 32px;
    }

    .dashboard-grid {
      grid-template-columns: 1fr;
    }

    .quick-actions {
      grid-template-columns: 1fr;
    }
  }
`;

export default function Dashboard() {
  const { tokenData } = useContext(AuthContext);
  const { state, showToast } = useApp();
  const navigate = useNavigate();
  
  const userId = localStorage.getItem('userId');
  const displayName = tokenData?.name || tokenData?.preferred_username || 'User';

  // API calls
  const { data: profile, loading: profileLoading } = useApi(getProfile);
  const { data: analytics, loading: analyticsLoading } = useApi(getUserStudyAnalytics);
  const { data: recentMaterials, loading: materialsLoading } = useApi(() => getStudyMaterials());

  useEffect(() => {
    if (userId) {
      profile?.userId !== userId && getProfile(userId).catch(() => {});
      analytics?.userId !== userId && getUserStudyAnalytics(userId).catch(() => {});
    }
  }, [userId]);

  if (profileLoading || analyticsLoading) {
    return <PageLoader message="Loading your dashboard..." />;
  }

  const stats = [
    {
      icon: '📚',
      color: '#c9a84c',
      bg: 'rgba(201, 168, 76, 0.15)',
      value: analytics?.totalDownloads || 0,
      label: 'Resources Downloaded'
    },
    {
      icon: '🎯',
      color: '#63e6be',
      bg: 'rgba(99, 230, 190, 0.15)',
      value: analytics?.completedMockTests || 0,
      label: 'Mock Tests Completed'
    },
    {
      icon: '📈',
      color: '#a78bfa',
      bg: 'rgba(167, 139, 250, 0.15)',
      value: `${analytics?.averageScore || 0}%`,
      label: 'Average Score'
    },
    {
      icon: '🔥',
      color: '#f77f00',
      bg: 'rgba(247, 127, 0, 0.15)',
      value: analytics?.studyStreak || 0,
      label: 'Day Study Streak'
    }
  ];

  const quickActions = [
    {
      icon: '📖',
      title: 'Study Materials',
      desc: 'Browse notes & resources',
      href: '/study-materials'
    },
    {
      icon: '📝',
      title: 'Mock Tests',
      desc: 'Practice with mock exams',
      href: '/mock-tests'
    },
    {
      icon: '👥',
      title: 'Find Peers',
      desc: 'Connect with nearby CAs',
      href: `/profile/${userId}/peers`
    },
    {
      icon: '🎓',
      title: 'My Profile',
      desc: 'View & edit profile',
      href: `/profile/${userId}`
    }
  ];

  const recentActivities = [
    {
      icon: '📚',
      color: '#c9a84c',
      bg: 'rgba(201, 168, 76, 0.15)',
      title: 'Downloaded "Principles of Accounting Notes"',
      time: '2 hours ago'
    },
    {
      icon: '📝',
      color: '#63e6be',
      bg: 'rgba(99, 230, 190, 0.15)',
      title: 'Completed Foundation Mock Test #1',
      time: '1 day ago'
    },
    {
      icon: '👥',
      color: '#a78bfa',
      bg: 'rgba(167, 139, 250, 0.15)',
      title: 'Connected with 3 nearby peers',
      time: '2 days ago'
    },
    {
      icon: '🎯',
      color: '#f77f00',
      bg: 'rgba(247, 127, 0, 0.15)',
      title: 'Achieved 78% in GST Practice Test',
      time: '3 days ago'
    }
  ];

  return (
    <>
      <style>{css}</style>
      <div className="dashboard">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <h1 className="welcome-title">
            Welcome back, <span className="gold-accent">{displayName}!</span>
          </h1>
          <p className="welcome-subtitle">
            Ready to continue your CA journey? You're doing great!
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button onClick={() => navigate('/study-materials')}>
              📚 Browse Resources
            </Button>
            <Button variant="outline" onClick={() => navigate('/mock-tests')}>
              📝 Take Mock Test
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div 
                className="stat-icon"
                style={{ background: stat.bg, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <h2 className="section-title">
            📊 Your Study Progress
          </h2>
          
          <div className="progress-item">
            <div className="progress-header">
              <span className="progress-label">Overall Completion</span>
              <span className="progress-value">{analytics?.rankPercentile || 0}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${analytics?.rankPercentile || 0}%` }}
              />
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-header">
              <span className="progress-label">Mock Test Performance</span>
              <span className="progress-value">{analytics?.averageScore || 0}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${analytics?.averageScore || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href} className="action-btn">
              <div className="action-icon">{action.icon}</div>
              <div className="action-title">{action.title}</div>
              <div className="action-desc">{action.desc}</div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2 className="section-title">
            🕐 Recent Activity
          </h2>
          {recentActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div 
                className="activity-icon"
                style={{ background: activity.bg, color: activity.color }}
              >
                {activity.icon}
              </div>
              <div className="activity-content">
                <div className="activity-title">{activity.title}</div>
                <div className="activity-time">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
