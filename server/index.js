import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 FORCE load .env from server folder
dotenv.config({ path: path.join(__dirname, ".env") });
console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists =", !!process.env.EMAIL_PASS);

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import User from "./models/user.js";
import userRoutes from "./routes/users.js";
import articleRoutes from "./routes/articles.js";
import authRoutes from "./routes/auth.js";
import testNewsRoutes from "./routes/news.js";

console.log("🔥 THIS index.js FILE IS RUNNING 🔥");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/articles", articleRoutes);
app.use("/auth", authRoutes);
app.use("/news", testNewsRoutes);


app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.get("/test-user", async (req, res) => {
  console.log("🔥 /test-user ROUTE HIT 🔥");

  try {
    const email = "test@kunal.com";

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        password: "test123",
        interests: ["technology", "ai"],
        keywords: ["MongoDB", "OpenAI"]
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

import "./cron/fetchArticles.cron.js";
import "./cron/dailyDigest.cron.js";


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

