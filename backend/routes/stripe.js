import express from "express";
import Stripe from "stripe";
import { createOrder, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

// Initialize Stripe with secret key from environment (if available)
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey && stripeKey !== "sk_test_YOUR_STRIPE_SECRET_KEY"
    ? new Stripe(stripeKey)
    : null;

if (!stripe) {
    console.warn("⚠️ Stripe not configured - add STRIPE_SECRET_KEY to .env");
}

// Domain for redirect URLs (frontend URL)
const FRONTEND_URL = process.env.CLIENT_URL || "http://localhost:5173";

/**
 * POST /api/stripe/create-checkout-session
 * Creates a Stripe Checkout session for food order payments
 * 
 * @body {number} amount - Amount in smallest currency unit (paise for INR)
 * @body {string} customerEmail - Customer's email address
 * @body {object[]} items - Cart items for display
 * @body {object} metadata - Additional order metadata
 */
router.post("/create-checkout-session", async (req, res) => {
    try {
        if (!stripe) {
            return res.status(503).json({
                error: "Stripe not configured. Add STRIPE_SECRET_KEY to backend .env"
            });
        }

        const { amount, customerEmail, items = [], metadata = {} } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        // ✅ Stripe Minimum Amount Check (~$0.50 USD)
        if (amount < 50) {
            return res.status(400).json({
                error: "Minimum order amount for online payment is ₹50"
            });
        }

        // Build line items for Stripe Checkout display
        const lineItems = items.length > 0
            ? items.map(item => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name,
                        description: item.description || `Quantity: ${item.quantity} `,
                        ...(item.image && { images: [item.image] }),
                    },
                    unit_amount: Math.round(item.price * 100), // Convert to paise
                },
                quantity: item.quantity,
            }))
            : [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Feasto Food Order",
                            description: "Your delicious order from Feasto",
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ];

        // Create Stripe Checkout Session with UPI + Card support
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card", "link"], // UPI requires enabling in Stripe Dashboard
            customer_email: customerEmail,
            line_items: lineItems,
            metadata: {
                ...metadata,
                orderId: metadata.orderId || `ORD - ${Date.now()} `,
                source: "feasto_app",
                userId: metadata.userId || "guest"
            },
            success_url: `${FRONTEND_URL} /payment/success ? session_id = { CHECKOUT_SESSION_ID }`,
            cancel_url: `${FRONTEND_URL}/payments?canceled=true`,
        });

        // Save initial order to Firestore using Session ID as ID
        await createOrder({
            id: session.id,
            stripeSessionId: session.id,
            amount: amount,
            currency: "inr",
            status: "created",
            items: items,
            userId: metadata.userId || "guest",
            createdAt: new Date(),
        });

        res.json({ url: session.url, sessionId: session.id });
    } catch (err) {
        console.error("Stripe Checkout Error:", err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /api/stripe/webhook
 * Handles Stripe webhook events for payment confirmation
 * 
 * IMPORTANT: This endpoint needs raw body parsing, which is configured in server.js
 */
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Verify webhook signature for security
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        console.log("✅ Payment completed:", session.id);
        console.log("   Customer:", session.customer_email);
        console.log("   Amount:", session.amount_total / 100, session.currency.toUpperCase());

        // Update database here
        try {
            await updateOrderStatus(session.id, "paid");
            console.log(`Order ${session.id} marked as paid`);
        } catch (err) {
            console.error("Failed to update order status:", err);
        }
    }

    res.json({ received: true });
});

/**
 * GET /api/stripe/session/:sessionId
 * Retrieve session details (for success page verification)
 */
router.get("/session/:sessionId", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

        res.json({
            id: session.id,
            status: session.payment_status,
            customerEmail: session.customer_email,
            amountTotal: session.amount_total / 100,
            currency: session.currency,
        });
    } catch (err) {
        console.error("Session retrieval error:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
