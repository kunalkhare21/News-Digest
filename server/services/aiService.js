import OpenAI from "openai";

export async function summarizeArticle(content) {
  if (!content) return "No content available";

  // 🔁 FALLBACK when OpenAI quota exceeded
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Summarize in 3 bullet points" },
        { role: "user", content },
      ],
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.warn("⚠️ OpenAI unavailable, using fallback");

    return `
• Article discusses recent developments in the topic  
• Key impacts on technology and users are highlighted  
• Further updates expected as situation evolves
`;
  }
}
