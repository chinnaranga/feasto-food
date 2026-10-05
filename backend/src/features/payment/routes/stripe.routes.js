import express from "express";
import Stripe from "stripe";
import { verifyStripeWebhook } from "../middlewares/webhooks.js";

const router = express.Router();

// Initialize Stripe with secret key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_startup_compatibility');

// Webhook endpoint (for future Stripe webhook events)
// router.post("/webhook", express.raw({ type: 'application/json' }), verifyStripeWebhook, async (req, res) => {
//   const event = req.stripeEvent;
//   // Handle webhook event
//   res.json({ received: true });
// });

// @route   POST /api/stripe/create-checkout-session
// @desc    Create a new Stripe Checkout Session
// @access  Public (Protected by client-side logic + backend validation)
router.post("/create-checkout-session", async (req, res) => {
    try {
        const { amount, items, customerEmail, metadata } = req.body;

        if (!amount || amount < 50) {
            return res.status(400).json({ error: "Amount must be at least ₹50" });
        }

        // Create line items for Stripe
        // If items are passed, map them. Otherwise use a generic item.
        const line_items = items.length > 0 ? items.map(item => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                    // images: item.image ? [item.image] : [],
                },
                unit_amount: Math.round(item.price * 100), // Stripe expects paisa
            },
            quantity: item.quantity || 1,
        })) : [{
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Food Order",
                },
                unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
        }];

        // Ensure the total matches the requested amount roughly (ignoring delivery for now or adding it)
        // For simplicity, we can also just use a single line item for the Total if we suspect mismatch
        // But mapping items is better for receipt.

        // Add delivery/tax if needed as separate line item or assume included.
        // Let's use the detailed items. 

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/payments?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/payments?canceled=true`,
            customer_email: customerEmail,
            metadata: metadata || {},
        });

        res.json({ url: session.url, id: session.id });

    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
