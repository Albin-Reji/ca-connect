/**
 * Mentorship.jsx
 * ─────────────────────────────────────────────────────────────────
 * Mentorship and networking platform with:
 * - Mentor directory
 * - Mentor profiles and expertise
 * - Session booking
 * - Mentorship requests
 * - Professional networking
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile } from '../api';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// CSS Styles
const css = `
  .mentorship {
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

  .filters-section {
    background: rgba(13, 30, 56, 0.8);
    border: 1px solid rgba(201, 168, 76, 0.2);
    border-radius: 20px;
    padding: 32px;
    margin-bottom: 32px;
    backdrop-filter: blur(10px);
  }

  .filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .filter-label {
    font-size: 0.9rem;
    color: #c9a84c;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .filter-select, .filter-input {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 12px 16px;
    color: #ffffff;
    font-size: 0.95rem;
    transition: all 0.3s ease;
  }

  .filter-select:focus, .filter-input:focus {
    outline: none;
    border-color: #c9a84c;
    background: rgba(255, 255, 255, 0.08);
  }

  .mentors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 24px;
    margin-bottom: 48px;
  }

  .mentor-card {
    background: rgba(13, 30, 56, 0.8);
    border: 1px solid rgba(201, 168, 76, 0.2);
    border-radius: 20px;
    padding: 28px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .mentor-card:hover {
    transform: translateY(-4px);
    border-color: rgba(201, 168, 76, 0.5);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .mentor-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }

  .mentor-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c9a84c, #e8c97a);
    color: #0a1628;
    font-size: 24px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .mentor-info {
    flex: 1;
  }

  .mentor-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 4px;
    line-height: 1.2;
  }

  .mentor-title {
    font-size: 0.9rem;
    color: #c9a84c;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .mentor-company {
    font-size: 0.85rem;
    color: #7a8fa6;
  }

  .mentor-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }

  .mentor-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(99, 230, 190, 0.15);
    border: 1px solid rgba(99, 230, 190, 0.3);
    padding: 4px 10px;
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #63e6be;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .mentor-badge.verified {
    background: rgba(201, 168, 76, 0.15);
    border-color: rgba(201, 168, 76, 0.3);
    color: #c9a84c;
  }

  .mentor-badge.top-rated {
    background: rgba(247, 127, 0, 0.15);
    border-color: rgba(247, 127, 0, 0.3);
    color: #f77f00;
  }

  .mentor-expertise {
    margin-bottom: 20px;
  }

  .expertise-title {
    font-size: 0.9rem;
    color: #c9a84c;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
  }

  .expertise-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .expertise-tag {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 6px 12px;
    border-radius: 50px;
    font-size: 0.75rem;
    color: #7a8fa6;
    transition: all 0.2s ease;
  }

  .expertise-tag:hover {
    border-color: rgba(201, 168, 76, 0.3);
    color: #c9a84c;
  }

  .mentor-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 20px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
  }

  .mentor-stat {
    text-align: center;
  }

  .mentor-stat-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 4px;
  }

  .mentor-stat-label {
    font-size: 0.7rem;
    color: #7a8fa6;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .mentor-bio {
    font-size: 0.9rem;
    color: #7a8fa6;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .mentor-actions {
    display: flex;
    gap: 12px;
  }

  .contact-btn {
    flex: 1;
    background: linear-gradient(135deg, #63e6be, #4ea8de);
    border: none;
    border-radius: 12px;
    padding: 12px 20px;
    color: #0a1628;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .contact-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99, 230, 190, 0.4);
  }

  .profile-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 12px 20px;
    color: #ffffff;
    font-weight: 500;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .profile-btn:hover {
    border-color: #c9a84c;
    color: #c9a84c;
  }

  .no-results {
    text-align: center;
    padding: 80px 24px;
    color: #7a8fa6;
  }

  .no-results-icon {
    font-size: 4rem;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .no-results-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 8px;
  }

  .no-results-text {
    font-size: 1rem;
    margin-bottom: 24px;
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
    .mentorship {
      padding: 100px 16px 32px;
    }

    .mentors-grid {
      grid-template-columns: 1fr;
    }

    .filters-grid {
      grid-template-columns: 1fr;
    }

    .mentor-stats {
      grid-template-columns: 1fr;
    }
  }
`;

// Mock mentor data
const mockMentors = [
  {
    id: 'mentor1',
    name: 'CA Rajiv Khanna',
    title: 'Senior Auditor',
    company: 'Deloitte India',
    initials: 'RK',
    badges: ['verified', 'top-rated'],
    expertise: ['Financial Reporting', 'Audit', 'IND AS', 'GST'],
    bio: '15+ years of experience in audit and financial reporting. Passionate about mentoring CA students and helping them crack their exams.',
    stats: { mentees: 127, sessions: 450, rating: 4.9 },
    available: true
  },
  {
    id: 'mentor2',
    name: 'CA Neha Gupta',
    title: 'Tax Consultant',
    company: 'PwC Mumbai',
    initials: 'NG',
    badges: ['verified'],
    expertise: ['Direct Tax', 'International Tax', 'Transfer Pricing', 'Tax Planning'],
    bio: 'Specialized in international taxation and transfer pricing. Helping students understand complex tax concepts with practical examples.',
    stats: { mentees: 89, sessions: 320, rating: 4.8 },
    available: true
  },
  {
    id: 'mentor3',
    name: 'CA Ananya Krishnan',
    title: 'CFO',
    company: 'Tech Startup',
    initials: 'AK',
    badges: ['top-rated'],
    expertise: ['Financial Management', 'Strategic Planning', 'CFO Role', 'Startup Finance'],
    bio: 'CFO at a fast-growing tech startup. Expert in financial strategy and helping CA students understand modern finance roles.',
    stats: { mentees: 156, sessions: 510, rating: 4.9 },
    available: false
  },
  {
    id: 'mentor4',
    name: 'CA Varun Malhotra',
    title: 'Partner',
    company: 'Khanna & Associates',
    initials: 'VM',
    badges: ['verified'],
    expertise: ['Corporate Law', 'Compliance', 'M&A', 'Company Law'],
    bio: 'Partner at a boutique CA firm. Expert in corporate law and M&A transactions. Practical approach to complex legal concepts.',
    stats: { mentees: 73, sessions: 280, rating: 4.7 },
    available: true
  },
  {
    id: 'mentor5',
    name: 'CA Divya Gupta',
    title: 'GST Expert',
    company: 'Independent Consultant',
    initials: 'DG',
    badges: ['verified', 'top-rated'],
    expertise: ['GST', 'Indirect Tax', 'Customs', 'Tax Technology'],
    bio: 'Full-time GST consultant helping businesses with compliance and CA students with exam preparation. Updated with latest amendments.',
    stats: { mentees: 201, sessions: 680, rating: 4.9 },
    available: true
  },
  {
    id: 'mentor6',
    name: 'CA Ravi Shetty',
    title: 'Investment Banker',
    company: 'Investment Bank',
    initials: 'RS',
    badges: [],
    expertise: ['Investment Banking', 'Valuation', 'Financial Modeling', 'Capital Markets'],
    bio: 'Investment banker with experience in M&A and capital markets. Helping CA students explore career opportunities beyond traditional roles.',
    stats: { mentees: 45, sessions: 180, rating: 4.6 },
    available: true
  }
];

const EXPERTISE_AREAS = [
  { value: '', label: 'All Expertise' },
  { value: 'Financial Reporting', label: 'Financial Reporting' },
  { value: 'Audit', label: 'Audit' },
  { value: 'Tax', label: 'Tax' },
  { value: 'GST', label: 'GST' },
  { value: 'Financial Management', label: 'Financial Management' },
  { value: 'Corporate Law', label: 'Corporate Law' },
  { value: 'Investment Banking', label: 'Investment Banking' }
];

export default function Mentorship() {
  const { showToast } = useApp();
  const [mentors, setMentors] = useState(mockMentors);
  const [filteredMentors, setFilteredMentors] = useState(mockMentors);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    expertise: '',
    search: '',
    availability: false
  });

  useEffect(() => {
    applyFilters();
  }, [mentors, filters]);

  const applyFilters = () => {
    let filtered = [...mentors];

    if (filters.expertise) {
      filtered = filtered.filter(mentor => 
        mentor.expertise.includes(filters.expertise)
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(mentor => 
        mentor.name.toLowerCase().includes(searchLower) ||
        mentor.title.toLowerCase().includes(searchLower) ||
        mentor.company.toLowerCase().includes(searchLower) ||
        mentor.expertise.some(exp => exp.toLowerCase().includes(searchLower))
      );
    }

    if (filters.availability) {
      filtered = filtered.filter(mentor => mentor.available);
    }

    setFilteredMentors(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      expertise: '',
      search: '',
      availability: false
    });
  };

  const handleContactMentor = (mentor) => {
    showToast(`Contact request sent to ${mentor.name}`, 'success');
    // In a real app, this would open a contact form or messaging interface
  };

  const handleViewProfile = (mentor) => {
    showToast(`Viewing profile of ${mentor.name}`, 'info');
    // In a real app, this would navigate to mentor's detailed profile
  };

  return (
    <>
      <style>{css}</style>
      <div className="mentorship">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Find Your Mentor</h1>
          <p className="page-subtitle">
            Connect with qualified CAs and industry experts for personalized guidance
          </p>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Expertise Area</label>
              <select
                className="filter-select"
                value={filters.expertise}
                onChange={(e) => handleFilterChange('expertise', e.target.value)}
              >
                {EXPERTISE_AREAS.map(area => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Search</label>
              <input
                type="text"
                className="filter-input"
                placeholder="Search mentors..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Availability</label>
              <select
                className="filter-select"
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value === 'true')}
              >
                <option value="false">All Mentors</option>
                <option value="true">Available Now</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Mentors Grid */}
        {filteredMentors.length > 0 ? (
          <div className="mentors-grid">
            {filteredMentors.map((mentor) => (
              <div key={mentor.id} className="mentor-card">
                <div className="mentor-header">
                  <div className="mentor-avatar">{mentor.initials}</div>
                  <div className="mentor-info">
                    <h3 className="mentor-name">{mentor.name}</h3>
                    <div className="mentor-title">{mentor.title}</div>
                    <div className="mentor-company">{mentor.company}</div>
                  </div>
                </div>

                <div className="mentor-badges">
                  {mentor.badges.includes('verified') && (
                    <span className="mentor-badge verified">
                      ✓ Verified CA
                    </span>
                  )}
                  {mentor.badges.includes('top-rated') && (
                    <span className="mentor-badge top-rated">
                      ⭐ Top Rated
                    </span>
                  )}
                  {mentor.available && (
                    <span className="mentor-badge">
                      🟢 Available
                    </span>
                  )}
                </div>

                <div className="mentor-expertise">
                  <div className="expertise-title">Expertise</div>
                  <div className="expertise-tags">
                    {mentor.expertise.map((skill, index) => (
                      <span key={index} className="expertise-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mentor-stats">
                  <div className="mentor-stat">
                    <div className="mentor-stat-value">{mentor.stats.mentees}</div>
                    <div className="mentor-stat-label">Mentees</div>
                  </div>
                  <div className="mentor-stat">
                    <div className="mentor-stat-value">{mentor.stats.sessions}</div>
                    <div className="mentor-stat-label">Sessions</div>
                  </div>
                  <div className="mentor-stat">
                    <div className="mentor-stat-value">{mentor.stats.rating}</div>
                    <div className="mentor-stat-label">Rating</div>
                  </div>
                </div>

                <p className="mentor-bio">{mentor.bio}</p>

                <div className="mentor-actions">
                  <button
                    className="contact-btn"
                    onClick={() => handleContactMentor(mentor)}
                    disabled={!mentor.available}
                  >
                    {mentor.available ? '💬 Contact Mentor' : '📋 Join Waitlist'}
                  </button>
                  <button
                    className="profile-btn"
                    onClick={() => handleViewProfile(mentor)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">👥</div>
            <h3 className="no-results-title">No mentors found</h3>
            <p className="no-results-text">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
