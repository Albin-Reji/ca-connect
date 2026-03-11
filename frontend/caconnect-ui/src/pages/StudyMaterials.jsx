/**
 * StudyMaterials.jsx
 * ─────────────────────────────────────────────────────────────────
 * Study materials browser with:
 * - Category filtering
 * - Search functionality
 * - Material cards with download tracking
 * - Favorites system
 * - Rating system
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudyMaterials, recordDownload } from '../api';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// CSS Styles
const css = `
  .study-materials {
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

  .filter-select option, .filter-input option {
    background: #0a1628;
    color: #ffffff;
  }

  .filter-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  .materials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
    margin-bottom: 48px;
  }

  .material-card {
    background: rgba(13, 30, 56, 0.8);
    border: 1px solid rgba(201, 168, 76, 0.2);
    border-radius: 20px;
    padding: 24px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .material-card:hover {
    transform: translateY(-4px);
    border-color: rgba(201, 168, 76, 0.5);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .material-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .material-category {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(201, 168, 76, 0.15);
    border: 1px solid rgba(201, 168, 76, 0.3);
    padding: 6px 12px;
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #e8c97a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .material-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.85rem;
    color: #c9a84c;
  }

  .material-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 12px;
    line-height: 1.3;
  }

  .material-description {
    font-size: 0.9rem;
    color: #7a8fa6;
    line-height: 1.6;
    margin-bottom: 20px;
    flex: 1;
  }

  .material-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 0.8rem;
    color: #7a8fa6;
  }

  .material-author {
    font-weight: 500;
  }

  .material-downloads {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .material-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }

  .material-tag {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 4px 10px;
    border-radius: 50px;
    font-size: 0.75rem;
    color: #7a8fa6;
    transition: all 0.2s ease;
  }

  .material-tag:hover {
    border-color: rgba(201, 168, 76, 0.3);
    color: #c9a84c;
  }

  .material-actions {
    display: flex;
    gap: 12px;
  }

  .download-btn {
    flex: 1;
    background: linear-gradient(135deg, #c9a84c, #e8c97a);
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

  .download-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(201, 168, 76, 0.4);
  }

  .favorite-btn {
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

  .favorite-btn:hover {
    border-color: #c9a84c;
    color: #c9a84c;
  }

  .favorite-btn.active {
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

  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 80px;
    color: #c9a84c;
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    .study-materials {
      padding: 100px 16px 32px;
    }

    .materials-grid {
      grid-template-columns: 1fr;
    }

    .filters-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'Foundation', label: 'Foundation' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Final', label: 'Final' },
  { value: 'Practice', label: 'Practice' },
  { value: 'GST', label: 'GST' },
  { value: 'Career', label: 'Career' }
];

const TYPES = [
  { value: '', label: 'All Types' },
  { value: 'notes', label: 'Notes' },
  { value: 'masterclass', label: 'Masterclass' },
  { value: 'mock-test', label: 'Mock Test' },
  { value: 'updates', label: 'Updates' },
  { value: 'guide', label: 'Guide' }
];

export default function StudyMaterials() {
  const { showToast } = useApp();
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    search: ''
  });
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    loadMaterials();
    loadFavorites();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [materials, filters]);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const data = await getStudyMaterials();
      setMaterials(data);
    } catch (error) {
      showToast('Failed to load study materials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('favoriteMaterials');
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  };

  const applyFilters = () => {
    let filtered = [...materials];

    if (filters.category) {
      filtered = filtered.filter(m => 
        m.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.type) {
      filtered = filtered.filter(m => 
        m.type.toLowerCase() === filters.type.toLowerCase()
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(searchLower) ||
        m.description.toLowerCase().includes(searchLower) ||
        m.author.toLowerCase().includes(searchLower) ||
        m.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    setFilteredMaterials(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      type: '',
      search: ''
    });
  };

  const handleDownload = async (material) => {
    try {
      await recordDownload(material.id);
      showToast(`Downloaded: ${material.title}`, 'success');
      
      // Update the download count in local state
      setMaterials(prev => prev.map(m => 
        m.id === material.id 
          ? { ...m, downloadCount: m.downloadCount + 1 }
          : m
      ));
    } catch (error) {
      showToast('Failed to download material', 'error');
    }
  };

  const toggleFavorite = (materialId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(materialId)) {
      newFavorites.delete(materialId);
      showToast('Removed from favorites', 'info');
    } else {
      newFavorites.add(materialId);
      showToast('Added to favorites', 'success');
    }
    setFavorites(newFavorites);
    localStorage.setItem('favoriteMaterials', JSON.stringify([...newFavorites]));
  };

  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div className="study-materials">
          <div className="loading-spinner">
            📚 Loading study materials...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="study-materials">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Study Materials</h1>
          <p className="page-subtitle">
            Access comprehensive CA study resources curated by qualified professionals
          </p>
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
              <label className="filter-label">Type</label>
              <select
                className="filter-select"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                {TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Search</label>
              <input
                type="text"
                className="filter-input"
                placeholder="Search materials..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-actions">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Materials Grid */}
        {filteredMaterials.length > 0 ? (
          <div className="materials-grid">
            {filteredMaterials.map((material) => (
              <div key={material.id} className="material-card">
                <div className="material-header">
                  <span className="material-category">
                    {material.category}
                  </span>
                  <div className="material-rating">
                    ⭐ {material.rating}
                  </div>
                </div>

                <h3 className="material-title">
                  {material.title}
                </h3>

                <p className="material-description">
                  {material.description}
                </p>

                <div className="material-meta">
                  <span className="material-author">
                    By {material.author}
                  </span>
                  <span className="material-downloads">
                    📥 {material.downloadCount.toLocaleString()}
                  </span>
                </div>

                <div className="material-tags">
                  {material.tags.map((tag, index) => (
                    <span key={index} className="material-tag">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="material-actions">
                  <button
                    className="download-btn"
                    onClick={() => handleDownload(material)}
                  >
                    📥 Download
                  </button>
                  <button
                    className={`favorite-btn ${favorites.has(material.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(material.id)}
                  >
                    {favorites.has(material.id) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">📚</div>
            <h3 className="no-results-title">No materials found</h3>
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
