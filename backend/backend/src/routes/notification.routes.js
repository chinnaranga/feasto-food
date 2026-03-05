import express from "express";
import { getMyNotifications, markAsRead, markAllRead } from "../controllers/notification.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyNotifications);
router.patch("/read-all", markAllRead);
router.patch("/:id/read", markAsRead);

export default router;
