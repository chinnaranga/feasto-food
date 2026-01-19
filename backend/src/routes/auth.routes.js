import express from "express";
import { signup, login, firebaseToJWT } from "../controllers/auth.controller.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

//Apply strict rate limiting to all auth routes
router.use(authLimiter);

// Firebase to JWT token exchange
router.post("/exchange", firebaseToJWT);

router.post("/signup", signup);
router.post("/login", login);

export default router;
