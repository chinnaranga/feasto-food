import express from "express";
import { updateLocation } from "../controllers/rider.controller.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.patch("/location", requireAuth, updateLocation);

export default router;
