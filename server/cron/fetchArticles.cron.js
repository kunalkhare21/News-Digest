import cron from "node-cron";
import Article from "../models/Article.js";
import { fetchNews } from "../services/newsService.js";

const DEFAULT_KEYWORDS = [
  "technology",
  "ai",
  "startup",
  "backend",
  "mongodb",
  "express",
];

/**
 * ⏰ Runs every hour
 * Minute 0 of every hour
 */
// cron.schedule("0 * * * *", async () => 
cron.schedule("*/1 * * * *", async () =>{
  console.log("🕐 Running hourly news fetch...");

  try {
    const newsArticles = await fetchNews(DEFAULT_KEYWORDS);

    let savedCount = 0;

    for (const item of newsArticles) {
      if (!item.url || !item.title) continue;

      const exists = await Article.findOne({ url: item.url });
      if (exists) continue;

      await Article.create({
        title: item.title,
        description: item.description,
        content: item.content,
        url: item.url,
        source: item.source?.name,
        publishedAt: item.publishedAt,
        keywords: DEFAULT_KEYWORDS,
      });

      savedCount++;
    }

    console.log(
      `✅ Hourly fetch done | fetched=${newsArticles.length} saved=${savedCount}`
    );
  } catch (err) {
    console.error("❌ Hourly fetch failed:", err.message);
  }
});
