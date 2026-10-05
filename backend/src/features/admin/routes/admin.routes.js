import express from "express";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { getAllOrders, getSystemStats, getAllRiders, updateOrderStatus, getAllDevices, getSuspiciousLogins, getPlatformSettings, updatePlatformSettings } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/orders", requireAdmin, getAllOrders);
router.get("/stats", requireAdmin, getSystemStats);
router.get("/riders", requireAdmin, getAllRiders);
router.patch("/orders/:id/status", requireAdmin, updateOrderStatus);

// Platform Settings
router.get("/settings/platform", requireAdmin, getPlatformSettings);
router.patch("/settings/platform", requireAdmin, updatePlatformSettings);

// Device Security Monitoring
router.get("/devices", requireAdmin, getAllDevices);
router.get("/suspicious-logins", requireAdmin, getSuspiciousLogins);

export default router;
