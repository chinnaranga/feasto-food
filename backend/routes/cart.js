import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getCart, addToCart } from "../controllers/cartController.js";

const router = express.Router();

// 🔐 Protect all cart routes
router.use(authenticateToken);

// GET USER CART
router.get("/", getCart);

// ADD ITEM TO CART
router.post("/add", addToCart);

export default router;
