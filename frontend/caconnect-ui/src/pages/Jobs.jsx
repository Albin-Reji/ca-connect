/**
 * Jobs.jsx
 * ─────────────────────────────────────────────────────────────────
 * Job board and articleship opportunities with:
 * - Job listings by category
 * - Articleship openings
 * - Company profiles
 * - Application tracking
 * - Career resources
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';

// CSS Styles
const css = `
  .jobs {
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

  .tabs-section {
    display: flex;
    justify-content: center;
    margin-bottom: 32px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .tab-btn {
    background: transparent;
    border: none;
    padding: 16px 32px;
    color: #7a8fa6;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .tab-btn:hover {
    color: #ffffff;
  }

  .tab-btn.active {
    color: #c9a84c;
  }

  .tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: #c9a84c;
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

  .jobs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 24px;
    margin-bottom: 48px;
  }

  .job-card {
    background: rgba(13, 30, 56, 0.8);
    border: 1px solid rgba(201, 168, 76, 0.2);
    border-radius: 20px;
    padding: 28px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .job-card:hover {
    transform: translateY(-4px);
    border-color: rgba(201, 168, 76, 0.5);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .job-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .company-info {
    flex: 1;
  }

  .company-logo {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #4ea8de, #63e6be);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 700;
    color: #0a1628;
    margin-bottom: 12px;
  }

  .company-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 4px;
  }

  .job-title {
    font-size: 1rem;
    color: #c9a84c;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .job-location {
    font-size: 0.85rem;
    color: #7a8fa6;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .job-type {
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
  }

  .job-type.articleship {
    background: rgba(201, 168, 76, 0.15);
    border-color: rgba(201, 168, 76, 0.3);
    color: #c9a84c;
  }

  .job-type.full-time {
    background: rgba(247, 127, 0, 0.15);
    border-color: rgba(247, 127, 0, 0.3);
    color: #f77f00;
  }

  .job-description {
    font-size: 0.9rem;
    color: #7a8fa6;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .job-requirements {
    margin-bottom: 20px;
  }

  .requirements-title {
    font-size: 0.85rem;
    color: #c9a84c;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
  }

  .requirements-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .requirement-tag {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 6px 12px;
    border-radius: 50px;
    font-size: 0.75rem;
    color: #7a8fa6;
  }

  .job-meta {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: #7a8fa6;
  }

  .meta-icon {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }

  .job-actions {
    display: flex;
    gap: 12px;
  }

  .apply-btn {
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

  .apply-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99, 230, 190, 0.4);
  }

  .save-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 12px;
    color: #7a8fa6;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .save-btn:hover {
    border-color: #c9a84c;
    color: #c9a84c;
  }

  .save-btn.saved {
    background: rgba(201, 168, 76, 0.15);
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

  @media (max-width: 768px) {
    .jobs {
      padding: 100px 16px 32px;
    }

    .jobs-grid {
      grid-template-columns: 1fr;
    }

    .filters-grid {
      grid-template-columns: 1fr;
    }

    .job-meta {
      grid-template-columns: 1fr;
    }

    .tabs-section {
      flex-wrap: wrap;
    }

    .tab-btn {
      padding: 12px 20px;
      font-size: 0.85rem;
    }
  }
`;

// Mock job data
const mockJobs = [
  {
    id: 'job1',
    company: 'Deloitte',
    initials: 'D',
    title: 'Articleship - Audit & Assurance',
    location: 'Mumbai, Maharashtra',
    type: 'articleship',
    description: 'Join our audit team for comprehensive articleship training. Work on diverse clients across industries.',
    requirements: ['CA Intermediate cleared', 'Strong accounting skills', 'Good communication'],
    duration: '3 Years',
    stipend: '₹8,000 - ₹12,000/month',
    posted: '2 days ago',
    applicants: 45
  },
  {
    id: 'job2',
    company: 'PwC India',
    initials: 'P',
    title: 'Tax Consultant',
    location: 'Delhi NCR',
    type: 'full-time',
    description: 'Looking for qualified CA for our tax consulting practice. Experience in direct and indirect tax preferred.',
    requirements: ['CA Qualified', '2+ years experience', 'GST knowledge'],
    experience: '2-5 years',
    salary: '₹8,00,000 - ₹12,00,000/year',
    posted: '1 week ago',
    applicants: 78
  },
  {
    id: 'job3',
    company: 'KPMG',
    initials: 'K',
    title: 'Articleship - Taxation',
    location: 'Bangalore, Karnataka',
    type: 'articleship',
    description: 'Excellent opportunity to learn tax compliance and advisory services. Mentorship by senior tax professionals.',
    requirements: ['CA Intermediate Group 1 cleared', 'Interest in taxation', 'Analytical mindset'],
    duration: '3 Years',
    stipend: '₹10,000 - ₹15,000/month',
    posted: '3 days ago',
    applicants: 32
  },
  {
    id: 'job4',
    company: 'EY India',
    initials: 'E',
    title: 'Financial Analyst',
    location: 'Hyderabad, Telangana',
    type: 'full-time',
    description: 'Join our financial advisory team. Work on M&A due diligence, valuations, and financial modeling.',
    requirements: ['CA Qualified', 'MBA preferred', 'Strong Excel skills'],
    experience: '1-3 years',
    salary: '₹6,00,000 - ₹9,00,000/year',
    posted: '5 days ago',
    applicants: 56
  },
  {
    id: 'job5',
    company: 'BDO India',
    initials: 'B',
    title: 'Articleship - GST & Indirect Tax',
    location: 'Pune, Maharashtra',
    type: 'articleship',
    description: 'Specialized articleship in GST compliance and advisory. Hands-on experience with real client cases.',
    requirements: ['CA Intermediate', 'GST knowledge', 'Computer proficiency'],
    duration: '3 Years',
    stipend: '₹7,000 - ₹10,000/month',
    posted: '1 week ago',
    applicants: 28
  },
  {
    id: 'job6',
    company: 'Grant Thornton',
    initials: 'G',
    title: 'Audit Associate',
    location: 'Chennai, Tamil Nadu',
    type: 'full-time',
    description: 'Growing audit practice looking for fresh CAs. Excellent learning environment and growth opportunities.',
    requirements: ['CA Qualified', 'Freshers welcome', 'Willing to travel'],
    experience: '0-1 years',
    salary: '₹5,00,000 - ₹7,00,000/year',
    posted: '4 days ago',
    applicants: 89
  }
];

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'articleship', label: 'Articleship' },
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'internship', label: 'Internship' }
];

const LOCATIONS = [
  { value: '', label: 'All Locations' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Delhi NCR', label: 'Delhi NCR' },
  { value: 'Bangalore', label: 'Bangalore' },
  { value: 'Hyderabad', label: 'Hyderabad' },
  { value: 'Chennai', label: 'Chennai' },
  { value: 'Pune', label: 'Pune' }
];

export default function Jobs() {
  const { showToast } = useApp();
  const [jobs, setJobs] = useState(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const [activeTab, setActiveTab] = useState('all');
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    search: ''
  });

  useEffect(() => {
    applyFilters();
  }, [jobs, filters, activeTab]);

  const applyFilters = () => {
    let filtered = [...jobs];

    // Apply tab filter
    if (activeTab === 'articleship') {
      filtered = filtered.filter(job => job.type === 'articleship');
    } else if (activeTab === 'jobs') {
      filtered = filtered.filter(job => job.type === 'full-time');
    }

    // Apply other filters
    if (filters.category) {
      filtered = filtered.filter(job => job.type === filters.category);
    }

    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(job => 
        job.company.toLowerCase().includes(searchLower) ||
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.requirements.some(req => req.toLowerCase().includes(searchLower))
      );
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      search: ''
    });
  };

  const handleApplyJob = (job) => {
    showToast(`Application submitted for ${job.title} at ${job.company}`, 'success');
  };

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
      showToast('Job removed from saved list', 'info');
    } else {
      newSavedJobs.add(jobId);
      showToast('Job saved successfully', 'success');
    }
    setSavedJobs(newSavedJobs);
  };

  return (
    <>
      <style>{css}</style>
      <div className="jobs">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Career Opportunities</h1>
          <p className="page-subtitle">
            Find articleship openings and job placements from top CA firms and companies
          </p>
        </div>

        {/* Tabs */}
        <div className="tabs-section">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Opportunities
          </button>
          <button
            className={`tab-btn ${activeTab === 'articleship' ? 'active' : ''}`}
            onClick={() => setActiveTab('articleship')}
          >
            Articleship
          </button>
          <button
            className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            Jobs
          </button>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                className="filter-select"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Location</label>
              <select
                className="filter-select"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                {LOCATIONS.map(loc => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Search</label>
              <input
                type="text"
                className="filter-input"
                placeholder="Search jobs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <div className="company-info">
                    <div className="company-logo">{job.initials}</div>
                    <div className="company-name">{job.company}</div>
                    <div className="job-title">{job.title}</div>
                    <div className="job-location">
                      📍 {job.location}
                    </div>
                  </div>
                  <span className={`job-type ${job.type}`}>
                    {job.type === 'articleship' ? '📚 Articleship' : '💼 Job'}
                  </span>
                </div>

                <p className="job-description">{job.description}</p>

                <div className="job-requirements">
                  <div className="requirements-title">Requirements</div>
                  <div className="requirements-list">
                    {job.requirements.map((req, index) => (
                      <span key={index} className="requirement-tag">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="job-meta">
                  <div className="meta-item">
                    <div className="meta-icon">⏱️</div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>
                        {job.duration || job.experience}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#7a8fa6' }}>
                        {job.type === 'articleship' ? 'Duration' : 'Experience'}
                      </div>
                    </div>
                  </div>
                  <div className="meta-item">
                    <div className="meta-icon">💰</div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>
                        {job.stipend || job.salary}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#7a8fa6' }}>
                        {job.type === 'articleship' ? 'Stipend' : 'Salary'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="job-actions">
                  <button
                    className="apply-btn"
                    onClick={() => handleApplyJob(job)}
                  >
                    🚀 Apply Now
                  </button>
                  <button
                    className={`save-btn ${savedJobs.has(job.id) ? 'saved' : ''}`}
                    onClick={() => toggleSaveJob(job.id)}
                  >
                    {savedJobs.has(job.id) ? '🔖' : '📁'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">💼</div>
            <h3 className="no-results-title">No opportunities found</h3>
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
