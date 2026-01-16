import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { createOrder, updateOrderStatus } from "../controllers/orderController.js";
import { verifyToken, verifyTokenOptional } from "../middleware/authMiddleware.js";
import { firestore } from "../server.js";

const router = express.Router();

if (!firestore) {
    console.error("❌ Firestore not initialized in Razorpay route");
    // We don't throw error here to allow module load, but we should handle it in request
}

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
router.post("/create-order", verifyTokenOptional, async (req, res) => {
    try {
        if (!razorpay) {
            return res.status(503).json({
                error: "Razorpay not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend .env"
            });
        }

        const { amount, currency = "INR", receipt, notes = {}, items } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        // Create Razorpay order
        const options = {
            amount: amount, // Already in paise from frontend
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            notes: {
                ...notes,
                source: "feasto_app",
                created_at: new Date().toISOString(),
            },
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Resolve items: Body > Notes JSON > Empty Array
        let orderItems = [];
        if (items && Array.isArray(items)) {
            orderItems = items;
        } else if (notes.items) {
            try {
                // If it's already an object/array, use it. If string, parse it.
                orderItems = typeof notes.items === 'string' ? JSON.parse(notes.items) : notes.items;
            } catch (e) {
                console.warn("Failed to parse notes.items:", notes.items);
                // Fallback: Create a single item object from the string
                orderItems = [{ name: String(notes.items), price: amount / 100, quantity: 1 }];
            }
        }

        // Save to Firestore
        // We use the same ID if possible, or link them
        await createOrder({
            id: razorpayOrder.id, // Use Razorpay ID as doc ID or field? Let's use it as ID for simplicity in lookup
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount / 100,
            currency: razorpayOrder.currency,
            status: "created", // Initial status
            items: orderItems,
            userId: notes.userId || "guest",
            createdAt: new Date(),
        });

        console.log("✅ Razorpay Order Created & Saved:", razorpayOrder.id);

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
 * 
 * @body {string} razorpay_order_id
 * @body {string} razorpay_payment_id
 * @body {string} razorpay_signature
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

        // Create signature verification string
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        // Generate expected signature
        const expectedSignature = crypto
            .createHmac("sha256", razorpayKeySecret)
            .update(body)
            .digest("hex");

        // Compare signatures
        const isValid = expectedSignature === razorpay_signature;

        if (isValid) {
            console.log("✅ Payment Verified:", razorpay_payment_id);

            // Update Firestore status
            await updateOrderStatus(razorpay_order_id, "paid");

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
