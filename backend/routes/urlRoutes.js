import express from 'express';
import { 
  createShortUrl, 
  getUrlStats, 
  getAllUrls 
} from '../controllers/urlController.js';

const router = express.Router();

router.post('/shorturls', createShortUrl);
router.get('/shorturls/:shortcode', getUrlStats);
router.get('/urls/stats', getAllUrls); 

export default router;