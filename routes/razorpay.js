import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { createOrder, updateOrderStatus } from "../controllers/orderController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


// Initialize Razorpay with credentials from environment
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay = razorpayKeyId && razorpayKeySecret
    ? new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
    })
    : null;

if (!razorpay) {
    console.warn("⚠️ Razorpay not configured - add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env");
}

/**
 * POST /api/razorpay/create-order
 * Creates a Razorpay order securely
 * @body {number} amount - Amount in paise
 * @body {string} currency - Currency code
 * @body {string} receipt - Receipt ID
 * @body {object} notes - Additional metadata
 */
router.post("/create-order", verifyToken, async (req, res) => {
    try {
        if (!razorpay) {
            return res.status(503).json({ error: "Razorpay not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend .env" });
        }

        const { amount, currency = "INR", receipt, notes = {}, items } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        const razorpayOrder = await razorpay.orders.create({
            amount,
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            notes: {
                source: "feasto_app",
                // Safe notes only
            },
        });

        // ✅ FIX 3: Strict Item Normalization
        const orderItems = Array.isArray(items)
            ? items
            : [{
                name: typeof notes.items === "string" ? notes.items : "Food Item",
                price: amount / 100,
                quantity: 1
            }];

        // ✅ FIX 2: Safe Firestore Write (Don't crash payment if DB fails)
        try {
            await createOrder({
                id: razorpayOrder.id,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount / 100,
                currency: razorpayOrder.currency,
                status: "created",
                items: orderItems,
                userId: req.user.uid, // ✅ FIX 1: Guaranteed by verifyToken
                createdAt: new Date(),
            });
            console.log("✅ Razorpay Order Saved to Firestore:", razorpayOrder.id);
        } catch (dbErr) {
            console.error("⚠️ Firestore save failed:", dbErr.message);
            // Do NOT fail the request, return the payment order ID so user can pay
        }

        res.json({
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            receipt: razorpayOrder.receipt,
        });

    } catch (err) {
        console.error("Razorpay Order Creation Error:", err);
        res.status(500).json({ error: err.message || "Failed to create order" });
    }
});

/**
 * POST /api/razorpay/verify-payment
 * Verifies Razorpay payment signature for security
 */
router.post("/verify-payment", async (req, res) => {
    try {
        if (!razorpayKeySecret) {
            return res.status(503).json({ error: "Razorpay not configured" });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", razorpayKeySecret)
            .update(body)
            .digest("hex");

        const isValid = expectedSignature === razorpay_signature;

        if (isValid) {
            console.log("✅ Payment Verified:", razorpay_payment_id);
            // Update Firestore status
            try {
                await updateOrderStatus(razorpay_order_id, "paid");
            } catch (dbErr) {
                console.error("Failed to update status in DB:", dbErr);
            }

            res.json({
                verified: true,
                payment_id: razorpay_payment_id,
                order_id: razorpay_order_id,
            });
        } else {
            console.warn("❌ Payment Verification Failed:", razorpay_payment_id);
            res.status(400).json({
                verified: false,
                error: "Invalid payment signature",
            });
        }
    } catch (err) {
        console.error("Payment Verification Error:", err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/razorpay/order/:orderId
 * Fetch order details for status check
 */
router.get("/order/:orderId", async (req, res) => {
    try {
        if (!razorpay) {
            return res.status(503).json({ error: "Razorpay not configured" });
        }
        const order = await razorpay.orders.fetch(req.params.orderId);
        res.json({
            id: order.id,
            amount: order.amount / 100,
            currency: order.currency,
            status: order.status,
            created_at: order.created_at,
        });
    } catch (err) {
        console.error("Order Fetch Error:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
