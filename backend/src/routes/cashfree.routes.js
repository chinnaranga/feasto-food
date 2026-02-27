import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createOrder, verifyPayment } from "../controllers/cashfree.controller.js";

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify-payment", verifyPayment);

export default router;
