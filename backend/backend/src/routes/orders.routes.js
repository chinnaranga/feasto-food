import express from "express";
import { createOrder, getMyOrders, getOrderById } from "../controllers/orders.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateOrderInput, validateUserId } from "../middlewares/validation.js";

const router = express.Router();

// Validate user ID and order input before creating order
router.post("/", protect, validateUserId, validateOrderInput, createOrder);
router.get("/myorders", protect, validateUserId, getMyOrders);
router.get("/:id", protect, getOrderById);

export default router;
