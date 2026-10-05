import express from "express";
import { authorize } from "../middlewares/authorize.js";
import { verifyRazorpayWebhook } from "../middlewares/webhooks.js";
import { createSubscription, verifySubscription, cancelSubscription, handleRazorpayWebhook } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-subscription", authorize, createSubscription);
router.post("/verify-subscription", authorize, verifySubscription);
router.post("/cancel-subscription", authorize, cancelSubscription);

// Webhook Route (Public but verified)
router.post("/webhook", verifyRazorpayWebhook, handleRazorpayWebhook);

export default router;
