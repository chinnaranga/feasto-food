import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { db } from "../config/firebase.js"; // Needed if we want to log to DB, though user code didn't use it explicitly but logging is good. User snippet didn't import db. I will follow user snippet EXACTLY for safety, adding missing imports if logic requires.
// User snippet used console.error.

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * CREATE ORDER
 */
router.post("/create-order", async (req, res) => {
    try {
        const { amount, currency = "INR", receipt, notes } = req.body;

        if (!amount) {
            return res.status(400).json({ error: "Amount required" });
        }

        // 🔥 IMPORTANT: amount MUST be in paise already (Frontend sends paise)
        const order = await razorpay.orders.create({
            amount, // DO NOT multiply again
            currency,
            receipt,
            notes,
        });

        res.json(order);
    } catch (err) {
        console.error("Razorpay create-order error:", err);
        res.status(500).json({ error: "Failed to create Razorpay order" });
    }
});

/**
 * VERIFY PAYMENT
 */
router.post("/verify-payment", async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        const verified = expectedSignature === razorpay_signature;

        res.json({ verified });
    } catch (err) {
        console.error("Razorpay verify error:", err);
        res.status(500).json({ verified: false });
    }
});

export default router;
