import express from "express";
import { addReview, getRestaurantReviews, deleteReview } from "../controllers/reviews.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/:restaurantId", getRestaurantReviews);
router.delete("/:reviewId", protect, deleteReview);

export default router;
