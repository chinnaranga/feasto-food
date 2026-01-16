import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getCart, addToCart } from "../controllers/cartController.js";

const router = express.Router();

// 🔐 Protect all cart routes
router.use(verifyToken);

// GET USER CART
router.get("/", getCart);

// ADD ITEM TO CART
router.post("/add", addToCart);

export default router;
