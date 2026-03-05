import express from "express";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { getAllOrders, getSystemStats, getAllRiders, updateOrderStatus } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/orders", requireAdmin, getAllOrders);
router.get("/stats", requireAdmin, getSystemStats);
router.get("/riders", requireAdmin, getAllRiders);
router.patch("/orders/:id/status", requireAdmin, updateOrderStatus);

export default router;
