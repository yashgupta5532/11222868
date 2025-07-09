import axios from "axios";
import { logAction } from "./logger";

const API_BASE_URL = "http://localhost:8000"; // Your backend URL

export const createShortUrl = async (urlData) => {
  try {
    logAction("Creating short URL", urlData);
    const response = await axios.post(`${API_BASE_URL}/shorturls`, urlData);
    return response.data;
  } catch (error) {
    logAction(
      "Error creating short URL",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getUrlStats = async (shortcode) => {
  try {
    logAction("Fetching URL stats", { shortcode });
    const response = await axios.get(`${API_BASE_URL}/shorturls/${shortcode}`);
    return response.data;
  } catch (error) {
    logAction(
      "Error fetching URL stats",
      error.response?.data || error.message
    );
    throw error;
  }
};
