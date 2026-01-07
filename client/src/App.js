import { useState } from "react";
import { Newspaper, Mail, ArrowRight, CheckCircle2, Sparkles, TrendingUp, Zap } from "lucide-react";
import "./App.css";

const TOPICS = ["AI", "Technology", "Finance", "Sports", "MongoDB"];

export default function App() {
  const [email, setEmail] = useState("");
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH DIGEST =================
  const fetchDigest = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setArticles([]);

      const res = await fetch(`${process.env.REACT_APP_API_URL}/news/${email}`);
      const data = await res.json();

      if (res.status === 404 || data.isNewUser) {
        setIsNewUser(true);
        return;
      }

      setArticles(data.articles || []);
    } catch (err) {
      setError("Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  // ================= SAVE INTERESTS =================
  const saveInterests = async () => {
    if (!email) {
      setError("Email missing. Please refresh.");
      return;
    }

    if (selectedTopics.length === 0) {
      setError("Please select at least one topic");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/onboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          keywords: selectedTopics,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Onboarding failed");
      }

      setIsNewUser(false);
      fetchDigest();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="app-container">
      {/* Subtle grid background */}
      <div className="grid-background"></div>
      
      {/* Ambient glow */}
      <div className="ambient-glow"></div>

      <div className="app-content">
        {/* Header */}
        <header className="app-header">
          <div className="header-container">
            <div className="header-content">
              <div className="logo-section">
                <div className="logo-glow-wrapper">
                  <div className="logo-glow"></div>
                  <div className="logo-icon">
                    <Newspaper className="icon" />
                  </div>
                </div>
                <span className="app-title">NewsFlow</span>
              </div>
              <div className="live-indicator">
                <div className="live-dot-wrapper">
                  <div className="live-dot"></div>
                  <div className="live-ping"></div>
                </div>
                <span className="live-text">Live</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          {!isNewUser ? (
            // Login View
            <div className="login-view">
              <div className="login-header">
                <div className="ai-badge">
                  <Zap className="badge-icon" />
                  <span>AI-Powered Curation</span>
                </div>
                <h1 className="main-title">
                  Your personalized<br />news digest
                </h1>
                <p className="main-subtitle">
                  Stay ahead with intelligent news curation tailored to your interests
                </p>
              </div>

              <div className="form-container">
                <div className="input-group">
                  <div className="input-glow"></div>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && fetchDigest()}
                      className="email-input"
                    />
                  </div>
                </div>

                <button
                  onClick={fetchDigest}
                  disabled={loading}
                  className={`primary-button ${loading ? 'loading' : ''}`}
                >
                  <div className="button-hover-bg"></div>
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      <span className="button-text">Loading your digest...</span>
                    </>
                  ) : (
                    <>
                      <span className="button-text">Continue</span>
                      <ArrowRight className="button-arrow" />
                    </>
                  )}
                </button>

                {error && (
                  <div className="error-message">
                    <p>{error}</p>
                  </div>
                )}
              </div>

              <div className="stats-section">
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-value">AI</div>
                    <div className="stat-label">Powered</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">5+</div>
                    <div className="stat-label">Topics</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">Daily</div>
                    <div className="stat-label">Updates</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Onboarding View
            <div className="onboarding-view">
              <div className="onboarding-header">
                <div className="onboarding-icon-wrapper">
                  <div className="icon-glow-pulse"></div>
                  <div className="onboarding-icon">
                    <Sparkles className="sparkles-icon" />
                  </div>
                </div>
                <h1 className="main-title">
                  Choose your<br />interests
                </h1>
                <p className="main-subtitle">
                  Select the topics that matter to you and we'll curate your personalized news feed
                </p>
              </div>

              <div className="topics-grid">
                {TOPICS.map((topic) => {
                  const isSelected = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      onClick={() =>
                        setSelectedTopics((prev) =>
                          prev.includes(topic)
                            ? prev.filter((t) => t !== topic)
                            : [...prev, topic]
                        )
                      }
                      className={`topic-card ${isSelected ? 'selected' : ''}`}
                    >
                      {isSelected && (
                        <div className="check-badge-wrapper">
                          <div className="check-badge-glow"></div>
                          <div className="check-badge">
                            <CheckCircle2 className="check-icon" />
                          </div>
                        </div>
                      )}
                      <div className="topic-name">{topic}</div>
                    </button>
                  );
                })}
              </div>

              {selectedTopics.length > 0 && (
                <div className="selection-badge-wrapper">
                  <div className="selection-badge">
                    <CheckCircle2 className="badge-icon" />
                    <span>{selectedTopics.length} topic{selectedTopics.length > 1 ? 's' : ''} selected</span>
                  </div>
                </div>
              )}

              <div className="onboarding-actions">
                <button
                  onClick={saveInterests}
                  disabled={loading || selectedTopics.length === 0}
                  className={`primary-button ${loading ? 'loading' : ''}`}
                >
                  <div className="button-hover-bg"></div>
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      <span className="button-text">Saving preferences...</span>
                    </>
                  ) : (
                    <>
                      <span className="button-text">Continue</span>
                      <ArrowRight className="button-arrow" />
                    </>
                  )}
                </button>

                {error && (
                  <div className="error-message">
                    <p>{error}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Articles Feed */}
          {articles.length > 0 && (
            <div className="articles-section">
              <div className="articles-header">
                <div className="articles-title-wrapper">
                  <div className="trending-icon-wrapper">
                    <TrendingUp className="trending-icon" />
                  </div>
                  <h2 className="articles-title">Your Digest</h2>
                </div>
                <span className="articles-count">
                  {articles.length} articles
                </span>
              </div>

              <div className="articles-grid">
                {articles.map((article, i) => (
                  <article key={i} className="article-card">
                    <div className="article-glow"></div>
                    <div className="article-content">
                      <h3 className="article-title">{article.title}</h3>
                      <p className="article-description">
                        {article.summary || article.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-container">
            <div className="footer-content">
              <p className="footer-text">
                Intelligently curated for you
              </p>
              <div className="footer-status">
                <div className="status-dot"></div>
                <span className="status-text">Always Up to Date</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}