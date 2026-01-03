import React, { useState } from "react";

export default function Onboarding({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);

    const res = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        interests: interests.split(",").map(i => i.trim()),
        keywords: keywords.split(",").map(k => k.trim()),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) onSuccess(data);
    else alert(data.error);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📰 Personalized News Digest</h1>

      <input
        style={styles.input}
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        style={styles.input}
        placeholder="Interests (ai, backend, startup)"
        value={interests}
        onChange={e => setInterests(e.target.value)}
      />

      <input
        style={styles.input}
        placeholder="Keywords (mongodb, express)"
        value={keywords}
        onChange={e => setKeywords(e.target.value)}
      />

      <button style={styles.button} onClick={submit}>
        {loading ? "Creating..." : "Get My Digest"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 420,
    margin: "120px auto",
    padding: 30,
    background: "#020617",
    borderRadius: 12,
    color: "white",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  title: { textAlign: "center" },
  input: {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#020617",
    color: "white",
  },
  button: {
    padding: 12,
    borderRadius: 8,
    background: "#38bdf8",
    color: "#020617",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
