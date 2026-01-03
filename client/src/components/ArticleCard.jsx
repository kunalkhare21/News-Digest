export default function ArticleCard({ article }) {
  return (
    <div style={styles.card}>
      <h3>{article.title}</h3>
      <p>{article.summary || article.description}</p>
      <a href={article.url} target="_blank" rel="noreferrer">
        Read full article →
      </a>
    </div>
  );
}

const styles = {
  card: {
    padding: 20,
    borderRadius: 12,
    background: "#020617",
    border: "1px solid #1e293b",
  },
};
