import express from "express";
import {
  createShortUrl,
  redirectToOriginalUrl,
  getUrlStats,
} from "../controllers/urlController.js";
const router = express.Router();

router.post("/shorturls", createShortUrl);
router.get("/shorturls/:shortcode", getUrlStats);
router.get("/:shortcode", redirectToOriginalUrl);

export default router;
