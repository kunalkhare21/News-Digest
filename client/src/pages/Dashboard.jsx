import React, { useEffect, useState } from "react";
import ArticleCard from "../components/ArticleCard";

export default function Dashboard({ user }) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/articles/user/${user.email}`)
      .then(res => res.json())
      .then(data => setArticles(data.articles || []));
  }, [user.email]);

  return (
    <div style={{ padding: 30, color: "white" }}>
      <h2>Welcome, {user.email}</h2>

      <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
        {articles.map(a => (
          <ArticleCard key={a._id} article={a} />
        ))}
      </div>
    </div>
  );
}
