import express from 'express';
import { getReorderItems, getRecommendations } from '../controllers/recommendations.controller.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Get reorder items (requires auth)
router.get('/reorder', authenticateToken, getReorderItems);

// Get AI recommendations (requires auth)
router.get('/suggested', authenticateToken, getRecommendations);

export default router;
