import express from 'express';
import { getReorderItems, getRecommendations } from '../controllers/recommendations.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get reorder items (requires auth)
router.get('/reorder', protect, getReorderItems);

// Get AI recommendations (requires auth)
router.get('/suggested', protect, getRecommendations);

export default router;
