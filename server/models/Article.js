import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    content: String,
    summary: String,

    url: { type: String, required: true, unique: true },
    source: String,
    publishedAt: Date,

    keywords: [String],

    // 🧠 AI fields
    aiSummary: String,
    aiTopics: [String],
    
  },
  { timestamps: true }
);

export default mongoose.model("Article", articleSchema);
