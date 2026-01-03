// import express from "express";
// import User from "../models/user.js";
// import { fetchNews } from "../services/newsService.js";
// import Article from "../models/Article.js";
// import { sendDigestEmail } from "../services/emailService.js";



// const router = express.Router();

// /**
//  * GET /news/:email
//  * Fetch personalized news for a user
//  */
// router.get("/:email", async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.params.email });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const articles = await fetchNews(user.keywords);

//     res.json({
//       user: user.email,
//       count: articles.length,
//       articles,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// //POST
// router.post("/send-test-digest", async (req, res) => {
//   try {
//     const user = await User.findOne();
//     if (!user) return res.status(404).json({ error: "No user found" });

//     const articles = await Article.find().limit(5);

//     let html = `<h2>Your News Digest</h2>`;
//     articles.forEach(a => {
//       html += `<p><b>${a.title}</b><br/>${a.summary || a.description}</p><hr/>`;
//     });

//     await sendDigestEmail(
//       user.email,
//       "📰 Your Daily News Digest",
//       html
//     );

//     res.json({ message: "Test digest email sent!" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;


// import express from "express";
// import User from "../models/user.js";
// import Article from "../models/Article.js";
// import { fetchNews } from "../services/newsService.js";

// const router = express.Router();

// /**
//  * GET /news/:email
//  * Fetch or generate personalized news digest
//  */
// router.get("/:email", async (req, res) => {
//   try {
//     const { email } = req.params;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found. Please sign up first."
//       });
//     }

//     // 🔍 Check if articles already exist
//     let articles = await Article.find({ userId: user._id }).limit(10);

//     // 🆕 If new user OR no articles → fetch & save
//     if (articles.length === 0) {
//       const fetched = await fetchNews(user.keywords);

//       articles = await Article.insertMany(
//         fetched.map(a => ({
//           title: a.title,
//           description: a.description,
//           summary: a.summary,
//           url: a.url,
//           source: a.source?.name,
//           userId: user._id,
//         }))
//       );
//     }

//     res.json({
//       user: user.email,
//       count: articles.length,
//       articles,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to generate digest" });
//   }
// });

// export default router;




import express from "express";
import User from "../models/user.js";
import { fetchNews } from "../services/newsService.js";
import Article from "../models/Article.js";
import { sendDigestEmail } from "../services/emailService.js";

const router = express.Router();

/**
 * GET /news/:email
 * Fetch personalized news for a user
 */
// router.get("/:email", async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.params.email });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const articles = await fetchNews(user.keywords || []);

//     res.json({
//       user: user.email,
//       count: articles.length,
//       articles,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// FINALl VERSION 
// router.get("/:email", async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.params.email });

//     // 👇 NEW USER CASE
//     if (!user) {
//       return res.json({
//         isNewUser: true,
//       });
//     }

//     // 👇 EXISTING USER
//     const articles = await fetchNews(user.keywords || []);

//     res.json({
//       isNewUser: false,
//       user: user.email,
//       articles,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
router.get("/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });

  if (!user) {
    return res.json({ isNewUser: true });
  }

  if (!user.keywords || user.keywords.length === 0) {
    return res.json({ isNewUser: true });
  }

  const articles = await fetchNews(user.keywords);

  res.json({
    isNewUser: false,
    articles,
  });
});




/**
 * POST /news/send-test-digest
 */
router.post("/send-test-digest", async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) return res.status(404).json({ error: "No user found" });

    const articles = await Article.find().limit(5);

    let html = `<h2>Your News Digest</h2>`;
    articles.forEach(a => {
      html += `<p><b>${a.title}</b><br/>${a.summary || a.description}</p><hr/>`;
    });

    await sendDigestEmail(
      user.email,
      "📰 Your Daily News Digest",
      html
    );

    res.json({ message: "Test digest email sent!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
