import express from "express";
import { updateLocation } from "../controllers/rider.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.patch("/location", protect, updateLocation);

export default router;
