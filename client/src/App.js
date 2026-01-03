import { useState } from "react";

const TOPICS = ["AI", "Technology", "Finance", "Sports"];

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

      const res = await fetch(`http://localhost:5000/news/${email}`);
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

      const res = await fetch("http://localhost:5000/users/onboard", {
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
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>📰 Personalized News Digest</h1>

        {!isNewUser && (
          <>
            <input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            <button onClick={fetchDigest} style={styles.button}>
              {loading ? "Loading..." : "Get My Digest"}
            </button>
          </>
        )}

        {isNewUser && (
          <>
            <h3 style={{ marginBottom: 12 }}>
              Welcome! What topics interest you?
            </h3>

            <div style={styles.tags}>
              {TOPICS.map((topic) => (
                <span
                  key={topic}
                  onClick={() =>
                    setSelectedTopics((prev) =>
                      prev.includes(topic)
                        ? prev.filter((t) => t !== topic)
                        : [...prev, topic]
                    )
                  }
                  style={{
                    ...styles.tag,
                    background: selectedTopics.includes(topic)
                      ? "#38bdf8"
                      : "#020617",
                    color: selectedTopics.includes(topic) ? "#000" : "#fff",
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>

            <button onClick={saveInterests} style={styles.button}>
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </>
        )}

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.feed}>
          {articles.map((a, i) => (
            <div key={i} style={styles.article}>
              <h4>{a.title}</h4>
              <p>{a.summary || a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ================= STYLES =================
const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #0f172a, #020617)",
    display: "flex",
    justifyContent: "center",
    paddingTop: 80,
    color: "#fff",
  },
  container: {
    width: "100%",
    maxWidth: 640,
    padding: 30,
    background: "rgba(2,6,23,0.92)",
    borderRadius: 18,
    boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
  },
  title: {
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#020617",
    color: "#fff",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    background: "#38bdf8",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: 15,
  },
  tags: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 20,
  },
  tag: {
    padding: "8px 16px",
    borderRadius: 20,
    border: "1px solid #334155",
    cursor: "pointer",
  },
  feed: {
    marginTop: 20,
  },
  article: {
    padding: 15,
    borderBottom: "1px solid #334155",
  },
  error: {
    color: "#f87171",
    marginTop: 10,
    textAlign: "center",
  },
};
