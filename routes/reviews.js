import express from "express";
import { addReview, getReviews } from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // or similar

const router = express.Router();

// Public read, authenticated write
router.get("/:targetId", getReviews);
router.post("/", verifyToken, addReview);

export default router;
