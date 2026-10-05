import express from "express";
import {
    getProfile,
    toggleStatus,
    updateLocation,
    getAvailableOrders,
    acceptOrder,
    completeOrder,
    updateOrderStatus,
    getEarnings
} from "../controllers/rider.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public Routes (None currently)

// Protected Routes (Rider)
router.get("/profile", protect, getProfile);
router.patch("/status", protect, toggleStatus);
router.patch("/location", protect, updateLocation);
router.get("/orders/available", protect, getAvailableOrders);
router.post("/orders/:id/accept", protect, acceptOrder);
router.post("/orders/:id/complete", protect, completeOrder);
router.patch("/orders/:id/status", protect, updateOrderStatus);
router.get("/earnings", protect, getEarnings);

export default router;
