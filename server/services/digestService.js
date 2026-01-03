import Article from "../models/Article.js";

export async function generateUserDigest(user) {
  const keywords = [
    ...(user.interests || []),
    ...(user.keywords || []),
  ];

  const articles = await Article.find({
    keywords: { $in: keywords },
  })
    .sort({ publishedAt: -1 })
    .limit(5);

  if (!articles.length) return null;

  return `
    <h2>📰 Your Daily News Digest</h2>
    ${articles
      .map(
        (a) => `
        <div>
          <h4>${a.title}</h4>
          <p>${a.description || ""}</p>
          <a href="${a.url}">Read more</a>
          <hr/>
        </div>
      `
      )
      .join("")}
  `;
}
