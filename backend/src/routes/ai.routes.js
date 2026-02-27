import express from "express";
import { chatWithAI } from "../controllers/ai.controller.js";
import { requireAuth } from "../middleware/auth.js"; // Optional: if you want it protected

const router = express.Router();

router.post("/chat", chatWithAI);

export default router;
