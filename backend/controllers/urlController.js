import Url from "../models/Url.js";
import { nanoid } from "nanoid";

const createShortUrl = async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  // Validate URL exists
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // First check if the original URL already exists
    const existingUrl = await Url.findOne({ originalUrl: url });

    if (existingUrl) {
      return res.status(200).json({
        message: "URL already exists",
        shortLink: `${process.env.BASE_URL}/${existingUrl.shortCode}`,
        expiry: existingUrl.expiry.toISOString(),
      });
    }

    // Calculate expiry date
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + validity);

    let urlCode = shortcode;

    // Generate shortcode if not provided
    if (!urlCode) {
      urlCode = nanoid(8);
    } else {
      // Check if custom shortcode already exists
      const existingShortcode = await Url.findOne({ shortCode: urlCode });
      if (existingShortcode) {
        return res.status(409).json({ error: "Shortcode already in use" });
      }
    }

    // Create new URL document
    const newUrl = new Url({
      originalUrl: url,
      shortCode: urlCode,
      expiry: expiry,
    });

    await newUrl.save();

    // Prepare response
    const response = {
      shortLink: `${process.env.BASE_URL}/${urlCode}`,
      expiry: expiry.toISOString(),
      message: "URL shortened successfully",
    };

    res.status(201).json(response);
  } catch (err) {
    console.error("Error creating short URL:", err);
    res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
const redirectToOriginalUrl = async (req, res) => {
  const { shortcode } = req.params;

  try {
    const url = await Url.findOne({ shortCode: shortcode });

    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    if (new Date() > url.expiry) {
      return res.status(410).json({ error: "Short URL has expired" });
    }

    // Record click
    url.clicks.push({
      source: req.headers.referer || "direct",
      location: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    });
    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getUrlStats = async (req, res) => {
  const { shortcode } = req.params;

  try {
    const url = await Url.findOne({ shortCode: shortcode });

    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    const response = {
      shortLink: `${process.env.BASE_URL}/${url.shortCode}`,
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      expiry: url.expiry,
      totalClicks: url.clicks.length,
      clicks: url.clicks.map((click) => ({
        timestamp: click.timestamp,
        source: click.source,
        location: click.location,
      })),
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export { createShortUrl, redirectToOriginalUrl, getUrlStats };
