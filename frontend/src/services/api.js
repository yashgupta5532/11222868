import axios from "axios";
import { logAction } from "./logger";

const API_BASE_URL = "http://localhost:8000"; 

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

export const getAllUrls = async () => {
  const response = await axios.get(`${API_BASE_URL}/urls/stats`);
  return response.data;
};

export const getUrlStats = async (shortcode) => {
  const response = await axios.get(`${API_BASE_URL}/shorturls/${shortcode}`);
  return response.data;
};
