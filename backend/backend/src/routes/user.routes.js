import express from "express";
import { toggleFavorite, getFavorites } from "../controllers/user.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/favorites/:restaurantId", protect, toggleFavorite);
router.get("/favorites", protect, getFavorites);

export default router;
