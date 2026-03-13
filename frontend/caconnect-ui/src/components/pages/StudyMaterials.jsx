import { useState, useEffect } from "react";

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "Foundation", label: "Foundation" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Final", label: "Final" },
  { value: "Practice", label: "Practice" },
  { value: "GST", label: "GST" },
  { value: "Career", label: "Career" },
];

const TYPES = [
  { value: "", label: "All Types" },
  { value: "notes", label: "Notes" },
  { value: "masterclass", label: "Masterclass" },
  { value: "mock-test", label: "Mock Test" },
  { value: "updates", label: "Updates" },
  { value: "guide", label: "Guide" },
];

const MOCK_MATERIALS = [
  {
    id: 1,
    title: "CA Foundation Accounting Masterclass",
    description: "Complete accounting notes covering all chapters with solved examples, practice questions, and revision shortcuts.",
    category: "Foundation",
    type: "masterclass",
    author: "CA Rajesh Sharma",
    rating: 4.8,
    downloadCount: 12430,
    tags: ["accounting", "foundation", "basics"],
  },
  {
    id: 2,
    title: "GST Comprehensive Guide 2024",
    description: "Updated GST guide with all amendments, practical case studies, and MCQs for exam preparation.",
    category: "GST",
    type: "guide",
    author: "CA Priya Mehta",
    rating: 4.9,
    downloadCount: 9870,
    tags: ["GST", "tax", "amendments"],
  },
  {
    id: 3,
    title: "CA Final SFM Quick Notes",
    description: "Concise strategic financial management notes with formulas, shortcuts, and past paper analysis.",
    category: "Final",
    type: "notes",
    author: "CA Vikram Joshi",
    rating: 4.7,
    downloadCount: 7650,
    tags: ["SFM", "final", "finance"],
  },
  {
    id: 4,
    title: "Intermediate Mock Test Series",
    description: "100+ mock tests covering all subjects with detailed solutions and performance analytics.",
    category: "Intermediate",
    type: "mock-test",
    author: "CA Ananya Kapoor",
    rating: 4.6,
    downloadCount: 15200,
    tags: ["mock", "practice", "intermediate"],
  },
  {
    id: 5,
    title: "Career Roadmap for CA Students",
    description: "Comprehensive guide on articleship, specialisations, job opportunities and career planning after CA.",
    category: "Career",
    type: "guide",
    author: "CA Suresh Nair",
    rating: 4.5,
    downloadCount: 5430,
    tags: ["career", "articleship", "planning"],
  },
  {
    id: 6,
    title: "Practice Papers – IPCC All Subjects",
    description: "Curated practice papers with model answers, examiner tips, and time management strategies.",
    category: "Practice",
    type: "mock-test",
    author: "CA Deepak Srivastava",
    rating: 4.8,
    downloadCount: 11100,
    tags: ["IPCC", "practice", "papers"],
  },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sm-root {
    min-height: 100vh;
    background: #0c0f1a;
    font-family: 'DM Sans', sans-serif;
    color: #e8e4dc;
    padding: 48px 24px 72px;
    position: relative;
    overflow-x: hidden;
  }

  .sm-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 50% at 20% 10%, rgba(201,168,76,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(30,80,120,0.12) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .sm-inner {
    max-width: 1280px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  /* ── Back Button ── */
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    background: rgba(13,30,56,0.9);
    border: 1px solid rgba(201,168,76,0.28);
    border-radius: 50px;
    padding: 10px 20px 10px 14px;
    color: #7a8fa6;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    backdrop-filter: blur(12px);
    margin-bottom: 36px;
    letter-spacing: 0.2px;
  }
  .back-btn:hover {
    background: rgba(201,168,76,0.12);
    border-color: #c9a84c;
    color: #c9a84c;
    transform: translateX(-3px);
  }
  .back-arrow {
    font-size: 18px;
    transition: transform 0.25s ease;
    display: inline-block;
  }
  .back-btn:hover .back-arrow {
    transform: translateX(-4px);
  }

  /* HEADER */
  .sm-header {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;
    gap: 32px;
    margin-bottom: 56px;
    padding-bottom: 40px;
    border-bottom: 1px solid rgba(201,168,76,0.15);
  }
  .sm-eyebrow {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #c9a84c;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .sm-eyebrow::before {
    content: '';
    display: block;
    width: 28px;
    height: 1px;
    background: #c9a84c;
  }
  .sm-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.8rem, 5vw, 4.2rem);
    font-weight: 700;
    color: #ffffff;
    line-height: 1.05;
    letter-spacing: -0.5px;
  }
  .sm-title span {
    color: #c9a84c;
    font-style: italic;
  }
  .sm-subtitle {
    margin-top: 16px;
    font-size: 1rem;
    color: #7a8899;
    line-height: 1.7;
    max-width: 480px;
  }
  .sm-count-badge {
    background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.25);
    border-radius: 14px;
    padding: 20px 28px;
    text-align: center;
    white-space: nowrap;
  }
  .sm-count-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3rem;
    font-weight: 700;
    color: #c9a84c;
    line-height: 1;
    display: block;
  }
  .sm-count-label {
    font-size: 0.75rem;
    color: #7a8899;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-top: 6px;
    display: block;
  }

  /* TOAST */
  .sm-toast {
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .sm-toast-item {
    background: #161c2d;
    border: 1px solid rgba(201,168,76,0.3);
    border-radius: 12px;
    padding: 14px 20px;
    font-size: 0.875rem;
    color: #e8e4dc;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: toastIn 0.3s ease;
    min-width: 240px;
  }
  .sm-toast-item.success { border-color: rgba(100,200,120,0.4); }
  .sm-toast-item.error   { border-color: rgba(220,80,80,0.4); }
  .sm-toast-item.info    { border-color: rgba(80,150,220,0.4); }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* FILTERS */
  .sm-filters {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 28px 32px;
    margin-bottom: 40px;
    display: grid;
    grid-template-columns: 1fr 1fr 2fr auto;
    gap: 20px;
    align-items: end;
  }
  .sm-fg { display: flex; flex-direction: column; gap: 8px; }
  .sm-fl {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #c9a84c;
  }
  .sm-select, .sm-input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 11px 16px;
    color: #e8e4dc;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    transition: border-color 0.2s, background 0.2s;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
  }
  .sm-select:focus, .sm-input:focus {
    outline: none;
    border-color: rgba(201,168,76,0.5);
    background: rgba(255,255,255,0.07);
  }
  .sm-select option { background: #0c0f1a; }
  .sm-clear-btn {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    padding: 11px 20px;
    color: #7a8899;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .sm-clear-btn:hover { border-color: #c9a84c; color: #c9a84c; }

  /* GRID */
  .sm-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 24px;
  }

  /* CARD */
  .sm-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    position: relative;
    overflow: hidden;
  }
  .sm-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0), transparent);
    transition: background 0.3s;
  }
  .sm-card:hover {
    transform: translateY(-5px);
    border-color: rgba(201,168,76,0.25);
    box-shadow: 0 24px 48px rgba(0,0,0,0.35);
  }
  .sm-card:hover::after {
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent);
  }

  .sm-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .sm-cat {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #c9a84c;
    background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.2);
    padding: 5px 12px;
    border-radius: 50px;
  }
  .sm-rating {
    font-size: 0.82rem;
    color: #c9a84c;
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 500;
  }

  .sm-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.35rem;
    font-weight: 700;
    color: #ffffff;
    line-height: 1.25;
  }

  .sm-card-desc {
    font-size: 0.875rem;
    color: #7a8899;
    line-height: 1.7;
    flex: 1;
  }

  .sm-card-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
    color: #5a6878;
  }
  .sm-card-author { font-weight: 500; color: #9aaabb; }
  .sm-card-dl { display: flex; align-items: center; gap: 5px; }

  .sm-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }
  .sm-tag {
    font-size: 0.72rem;
    color: #5a6878;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    padding: 3px 10px;
    border-radius: 50px;
    transition: color 0.2s, border-color 0.2s;
    cursor: default;
  }
  .sm-tag:hover { color: #c9a84c; border-color: rgba(201,168,76,0.3); }

  .sm-card-actions {
    display: flex;
    gap: 10px;
    margin-top: 4px;
  }
  .sm-dl-btn {
    flex: 1;
    background: linear-gradient(135deg, #b8922e, #e0bc60);
    border: none;
    border-radius: 11px;
    padding: 12px 18px;
    color: #0c0f1a;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .sm-dl-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(201,168,76,0.35);
  }
  .sm-dl-btn:active { transform: translateY(0); opacity: 0.9; }

  .sm-fav-btn {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 11px;
    padding: 12px 14px;
    color: #5a6878;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1rem;
    line-height: 1;
  }
  .sm-fav-btn:hover { border-color: rgba(201,168,76,0.4); color: #c9a84c; }
  .sm-fav-btn.active {
    background: rgba(201,168,76,0.1);
    border-color: rgba(201,168,76,0.4);
    color: #c9a84c;
  }

  /* EMPTY */
  .sm-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 24px;
  }
  .sm-empty-icon { font-size: 3.5rem; margin-bottom: 20px; opacity: 0.4; }
  .sm-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem;
    color: #ffffff;
    margin-bottom: 10px;
  }
  .sm-empty-text { font-size: 0.95rem; color: #5a6878; margin-bottom: 24px; }
  .sm-empty-btn {
    background: transparent;
    border: 1px solid rgba(201,168,76,0.4);
    border-radius: 10px;
    padding: 11px 28px;
    color: #c9a84c;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .sm-empty-btn:hover { background: rgba(201,168,76,0.08); }

  /* LOADING */
  .sm-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
    gap: 14px;
    font-size: 1rem;
    color: #7a8899;
    letter-spacing: 1px;
  }
  .sm-spinner {
    width: 24px; height: 24px;
    border: 2px solid rgba(201,168,76,0.2);
    border-top-color: #c9a84c;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .sm-filters { grid-template-columns: 1fr 1fr; }
    .sm-clear-btn { grid-column: 1 / -1; justify-self: start; }
  }
  @media (max-width: 600px) {
    .sm-header { grid-template-columns: 1fr; }
    .sm-count-badge { display: none; }
    .sm-filters { grid-template-columns: 1fr; padding: 20px; }
    .sm-grid { grid-template-columns: 1fr; }
  }
`;

let toastIdCounter = 0;

// ── Back Button (standalone, no router dependency) ────────────────────────────
function BackButton() {
  return (
    <button
      className="back-btn"
      onClick={() => window.history.back()}
      aria-label="Go back"
    >
      <span className="back-arrow">←</span>
      <span>Back</span>
    </button>
  );
}

export default function StudyMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "", type: "", search: "" });
  const [favorites, setFavorites] = useState(new Set());
  const [toasts, setToasts] = useState([]);

  // ── helpers ──────────────────────────────────────────────────
  const showToast = (message, type = "info") => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const toastIcon = { success: "✓", error: "✕", info: "ℹ" };

  // ── data ─────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setMaterials(MOCK_MATERIALS);
      setLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("favoriteMaterials");
      if (saved) setFavorites(new Set(JSON.parse(saved)));
    } catch (_) { }
  }, []);

  // ── derived ───────────────────────────────────────────────────
  const filtered = materials.filter((m) => {
    const matchCat = !filters.category || m.category.toLowerCase() === filters.category.toLowerCase();
    const matchType = !filters.type || m.type.toLowerCase() === filters.type.toLowerCase();
    const q = filters.search.toLowerCase();
    const matchSearch =
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.author.toLowerCase().includes(q) ||
      m.tags.some((t) => t.toLowerCase().includes(q));
    return matchCat && matchType && matchSearch;
  });

  // ── actions ───────────────────────────────────────────────────
  const handleDownload = (material) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === material.id ? { ...m, downloadCount: m.downloadCount + 1 } : m))
    );
    showToast(`Downloaded: ${material.title}`, "success");
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast("Removed from favourites", "info");
      } else {
        next.add(id);
        showToast("Added to favourites", "success");
      }
      try {
        localStorage.setItem("favoriteMaterials", JSON.stringify([...next]));
      } catch (_) { }
      return next;
    });
  };

  const clearFilters = () => setFilters({ category: "", type: "", search: "" });

  // ── render ────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>

      {/* Toast notifications */}
      <div className="sm-toast">
        {toasts.map((t) => (
          <div key={t.id} className={`sm-toast-item ${t.type}`}>
            <span>{toastIcon[t.type] ?? "•"}</span>
            {t.message}
          </div>
        ))}
      </div>

      <div className="sm-root">
        <div className="sm-inner">

          {/* ── Back Button — lives ABOVE the header ── */}
          <BackButton />

          {/* Header */}
          <header className="sm-header">
            <div>
              <div className="sm-eyebrow">CA Study Hub</div>
              <h1 className="sm-title">Study <span>Materials</span></h1>
              <p className="sm-subtitle">
                Curated resources by qualified professionals — notes, guides, mock tests and more.
              </p>
            </div>
            <div className="sm-count-badge">
              <span className="sm-count-num">{materials.length}</span>
              <span className="sm-count-label">Resources</span>
            </div>
          </header>

          {loading ? (
            <div className="sm-loading">
              <div className="sm-spinner" />
              Loading materials…
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="sm-filters">
                <div className="sm-fg">
                  <label className="sm-fl">Category</label>
                  <select
                    className="sm-select"
                    value={filters.category}
                    onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="sm-fg">
                  <label className="sm-fl">Type</label>
                  <select
                    className="sm-select"
                    value={filters.type}
                    onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
                  >
                    {TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="sm-fg">
                  <label className="sm-fl">Search</label>
                  <input
                    type="text"
                    className="sm-input"
                    placeholder="Search by title, author or tag…"
                    value={filters.search}
                    onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                  />
                </div>

                <button className="sm-clear-btn" onClick={clearFilters}>
                  Clear
                </button>
              </div>

              {/* Grid */}
              <div className="sm-grid">
                {filtered.length === 0 ? (
                  <div className="sm-empty">
                    <div className="sm-empty-icon">📚</div>
                    <h3 className="sm-empty-title">No materials found</h3>
                    <p className="sm-empty-text">Try adjusting your filters or search terms.</p>
                    <button className="sm-empty-btn" onClick={clearFilters}>Clear Filters</button>
                  </div>
                ) : (
                  filtered.map((m) => (
                    <div key={m.id} className="sm-card">
                      <div className="sm-card-top">
                        <span className="sm-cat">{m.category}</span>
                        <span className="sm-rating">★ {m.rating}</span>
                      </div>

                      <h3 className="sm-card-title">{m.title}</h3>
                      <p className="sm-card-desc">{m.description}</p>

                      <div className="sm-card-meta">
                        <span className="sm-card-author">By {m.author}</span>
                        <span className="sm-card-dl">↓ {m.downloadCount.toLocaleString()}</span>
                      </div>

                      <div className="sm-tags">
                        {m.tags.map((tag, i) => (
                          <span key={i} className="sm-tag">#{tag}</span>
                        ))}
                      </div>

                      <div className="sm-card-actions">
                        <button className="sm-dl-btn" onClick={() => handleDownload(m)}>
                          ↓ Download
                        </button>
                        <button
                          className={`sm-fav-btn ${favorites.has(m.id) ? "active" : ""}`}
                          onClick={() => toggleFavorite(m.id)}
                          title="Toggle favourite"
                        >
                          {favorites.has(m.id) ? "♥" : "♡"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}