import axios from "axios";

const NEWS_API_URL = "https://newsapi.org/v2/everything";

export const fetchNews = async (keywords) => {
  const query = keywords.join(" OR ");

  const response = await axios.get(NEWS_API_URL, {
    params: {
      q: query,
      language: "en",
      sortBy: "publishedAt",
      pageSize: 10,
      apiKey: process.env.NEWS_API_KEY,
    },
  });

  return response.data.articles;
};
