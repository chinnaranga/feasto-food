import express from "express";
import { toggleFavorite, getFavorites, getDevices, removeDevice, trustDevice } from "../controllers/user.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/favorites/:restaurantId", protect, toggleFavorite);
router.get("/favorites", protect, getFavorites);

// Device Management
router.get("/devices", protect, getDevices);
router.delete("/devices/:deviceId", protect, removeDevice);
router.post("/devices/:deviceId/trust", protect, trustDevice);

export default router;
