import axios from "axios";

const API_KEY = "crals9pr01qhk4bqotb0crals9pr01qhk4bqotbg";
const BASE_URL = "https://finnhub.io/api/v1";

export const fetchNews = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/news?category=general&token=${API_KEY}`
    );
    console.log("fetched news", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};
