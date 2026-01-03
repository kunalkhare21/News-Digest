import express from "express";
import Article from "../models/Article.js";
import User from "../models/user.js";
import { fetchNews } from "../services/newsService.js";
import { summarizeArticle } from "../services/aiService.js";


const router = express.Router();

/**
 * POST /articles
 * Save a news article manually
 */
router.post("/", async (req, res) => {
  try {
    const { title, url, keywords } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: "Title and URL are required" });
    }

    if (keywords && !Array.isArray(keywords)) {
      return res.status(400).json({ error: "Keywords must be an array" });
    }

    const existing = await Article.findOne({ url });
    if (existing) {
      return res.status(409).json({ error: "Article already exists" });
    }

    const article = await Article.create({
      ...req.body,
      keywords: (keywords || []).map(k => k.toLowerCase()),
    });

    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /articles
 * Fetch all articles (paginated)
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const articles = await Article.find()
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      limit,
      count: articles.length,
      articles,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /articles/user/:email
 * Fetch personalized articles
 */
router.get("/user/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const keywords = [
      ...(user.interests || []),
      ...(user.keywords || []),
    ].map(k => k.toLowerCase());

    const articles = await Article.find({
      keywords: { $in: keywords },
    });

    const scoredArticles = articles
      .map(article => {
        const matched = (article.keywords || []).filter(k =>
          keywords.includes(k)
        );

        return {
          ...article.toObject(),
          score: matched.length,
          matchedKeywords: matched,
        };
      })
      .filter(a => a.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      })
      .slice(0, 20); // 🔥 limit feed size

    res.json({
      user: user.email,
      matchedKeywords: keywords,
      count: scoredArticles.length,
      articles: scoredArticles,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /articles/fetch
 * Fetch news from API and save to DB
 */
router.post("/fetch", async (req, res) => {
  try {
    let { keywords } = req.body;

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ error: "Keywords array required" });
    }

    keywords = keywords.map(k => k.toLowerCase());

    const newsArticles = await fetchNews(keywords);
    let savedCount = 0;

    for (const item of newsArticles) {
      if (!item.url || !item.title) continue;

      const exists = await Article.findOne({ url: item.url });
      if (exists) continue;
      const aiSummary = await summarizeArticle({
        title: item.title,
        content: item.content || item.description,
    });

      await Article.create({
        title: item.title,
        description: item.description,
        content: item.content,
        summary,
        url: item.url,
        source: item.source?.name,
        publishedAt: item.publishedAt,
        keywords,
        aiSummary, // ✅ stored
      });

      savedCount++;
    }

    res.json({
      fetched: newsArticles.length,
      saved: savedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /articles/:id/summarize
 * Generate AI summary for an article
 */
router.post("/:id/summarize", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const content = article.content || article.description;

    const summary = await summarizeArticle(content);

    article.summary = summary;
    await article.save();

    res.json({
      id: article._id,
      summary,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
