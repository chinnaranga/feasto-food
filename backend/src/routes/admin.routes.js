import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import { getAllOrders, getSystemStats } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/orders", protect, admin, getAllOrders);
router.get("/stats", protect, admin, getSystemStats);

export default router;
