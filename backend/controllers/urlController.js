import Url from "../models/Url.js";
import { nanoid } from "nanoid";

const createShortUrl = async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    // Check for existing URL (case insensitive)
    const existingUrl = await Url.findOne({
      originalUrl: { $regex: new RegExp(`^${url}$`, "i") },
    });

    if (existingUrl) {
      return res.status(200).json({
        message: "URL already shortened",
        shortLink: `${process.env.BASE_URL}/${existingUrl.shortCode}`,
        expiry: existingUrl.expiry.toISOString(),
        existing: true,
      });
    }

    // Calculate expiry date
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + validity);

    let urlCode = shortcode || nanoid(8);

    // Check if shortcode exists
    if (shortcode) {
      const codeExists = await Url.findOne({ shortCode: urlCode });
      if (codeExists) {
        return res.status(409).json({ error: "Shortcode already in use" });
      }
    }

    const newUrl = new Url({
      originalUrl: url,
      shortCode: urlCode,
      expiry: expiry,
    });

    await newUrl.save();

    res.status(201).json({
      shortLink: `${process.env.BASE_URL}/${urlCode}`,
      expiry: expiry.toISOString(),
      message: "URL shortened successfully",
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getUrlStats = async (req, res) => {
  try {
    const { shortcode } = req.params;

    const url = await Url.findOne({ shortCode: shortcode });
    if (!url) return res.status(404).json({ error: "URL not found" });

    const stats = {
      originalUrl: url.originalUrl,
      shortLink: `${process.env.BASE_URL}/${url.shortCode}`,
      createdAt: url.createdAt,
      expiry: url.expiry,
      totalClicks: url.clicks.length,
      clicks: url.clicks.map((click) => ({
        timestamp: click.timestamp,
        source: click.source || "direct",
        location: click.location || "unknown",
      })),
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get All URLs for Stats Page
const getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find({}).sort({ createdAt: -1 }).limit(100);

    const stats = urls.map((url) => ({
      originalUrl: url.originalUrl,
      shortLink: `${process.env.BASE_URL}/${url.shortCode}`,
      createdAt: url.createdAt,
      expiry: url.expiry,
      totalClicks: url.clicks.length,
    }));

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export { createShortUrl, getUrlStats, getAllUrls };
