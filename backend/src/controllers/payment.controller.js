import Razorpay from "razorpay";
import crypto from "crypto";
import { db } from "../config/firebase.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a recurring subscription
// @route   POST /api/payment/create-subscription
// @access  Private
export const createSubscription = async (req, res) => {
    try {
        const { planId, totalCount = 12 } = req.body; // planId from frontend (or hardcoded for now)
        const userId = req.user.uid;

        if (!planId) {
            return res.status(400).json({ error: "Plan ID is required" });
        }

        // Create subscription in Razorpay
        // Note: You must have created a 'Plan' in Razorpay Dashboard and pass its ID here.
        // Or create one dynamically if needed (usually plans are static).
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            total_count: totalCount,
            quantity: 1,
            customer_notify: 1,
            notes: {
                userId: userId
            }
        });

        // Save subscription intent to Firestore
        await db.collection("subscriptions").doc(subscription.id).set({
            userId,
            subId: subscription.id,
            planId,
            status: subscription.status, // usually 'created'
            createdAt: new Date(),
            shortUrl: subscription.short_url,
            provider: 'razorpay'
        });

        res.json({
            id: subscription.id,
            ...subscription
        });

    } catch (error) {
        console.error("Create Subscription Error:", error);
        res.status(500).json({ error: "Failed to create subscription" });
    }
};

// @desc    Verify subscription payment
// @route   POST /api/payment/verify-subscription
// @access  Private
export const verifySubscription = async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_subscription_id,
            razorpay_signature
        } = req.body;

        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_payment_id + '|' + razorpay_subscription_id) // Razorpay format for subs
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ error: "Invalid signature" });
        }

        // Update Subscription in Firestore
        await db.collection("subscriptions").doc(razorpay_subscription_id).update({
            status: 'active',
            paymentId: razorpay_payment_id,
            activatedAt: new Date()
        });

        // Update User profile to Premium
        // Assuming we store 'isPremium' or similar on the user doc
        await db.collection("users").doc(req.user.uid).update({
            isPremium: true,
            subscriptionId: razorpay_subscription_id,
            premiumSince: new Date()
        });

        res.json({ success: true, message: "Subscription activated" });

    } catch (error) {
        console.error("Verify Subscription Error:", error);
        res.status(500).json({ error: "Verification failed" });
    }
};

// @desc    Cancel subscription
// @route   POST /api/payment/cancel-subscription
// @access  Private
export const cancelSubscription = async (req, res) => {
    try {
        const { subId } = req.body;

        // Cancel in Razorpay
        await razorpay.subscriptions.cancel(subId);

        // Update Firestore
        await db.collection("subscriptions").doc(subId).update({
            status: 'cancelled',
            cancelledAt: new Date()
        });

        // Update User
        await db.collection("users").doc(req.user.uid).update({
            isPremium: false
        });

        res.json({ success: true, message: "Subscription cancelled" });
    } catch (error) {
        console.error("Cancel Subscription Error:", error);
        res.status(500).json({ error: "Cancellation failed" });
    }
};

// @desc    Handle Razorpay Webhooks
// @route   POST /api/payment/webhook
// @access  Public (Verified by Signature Middleware)
export const handleRazorpayWebhook = async (req, res) => {
    try {
        const event = req.body;
        console.log("🔔 Razorpay Webhook:", event.event);

        const { contains, payload } = event;

        // Handle Subscription Events
        if (event.event === 'subscription.charged') {
            const payment = payload.payment.entity;
            const subscription = payload.subscription.entity;
            const subId = subscription.id;
            const userId = subscription.notes.userId;

            console.log(`💰 Subscription Charged: ${subId} for User: ${userId}`);

            // Update Subscription in DB
            await db.collection("subscriptions").doc(subId).update({
                status: 'active',
                lastPaymentId: payment.id,
                lastChargedAt: new Date(payment.created_at * 1000), // Razorpay sends unix timestamp
                totalCount: subscription.total_count,
                paidCount: subscription.paid_count,
                remainingCount: subscription.remaining_count,
            });

            // Extend User Premium Status (if needed, or logic relies on Sub status)
            // Assuming simplified model where "active" sub = premium
            if (userId) {
                await db.collection("users").doc(userId).update({
                    isPremium: true,
                    lastPaymentDate: new Date()
                });
            }
        }
        else if (event.event === 'subscription.cancelled' || event.event === 'subscription.completed') {
            const subscription = payload.subscription.entity;
            const subId = subscription.id;
            const userId = subscription.notes.userId;

            console.log(`🚫 Subscription Ended: ${subId} (${event.event})`);

            await db.collection("subscriptions").doc(subId).update({
                status: event.event === 'subscription.cancelled' ? 'cancelled' : 'completed',
                endedAt: new Date()
            });

            if (userId) {
                await db.collection("users").doc(userId).update({
                    isPremium: false
                });
            }
        }

        res.json({ status: "ok" });
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ error: "Webhook processing failed" });
    }
};
