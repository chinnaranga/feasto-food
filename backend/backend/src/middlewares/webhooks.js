import crypto from 'crypto';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Razorpay Webhook Signature Verification
 * Verifies HMAC SHA256 signature to prevent fake payment confirmations
 */
export const verifyRazorpayWebhook = (req, res, next) => {
    const signature = req.headers['x-razorpay-signature'];

    if (!signature) {
        console.warn('Razorpay webhook: Missing signature');
        return res.status(400).json({ error: 'Missing webhook signature' });
    }

    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
        console.error('RAZORPAY_WEBHOOK_SECRET not configured');
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    try {
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (signature !== expectedSignature) {
            console.warn('Razorpay webhook: Invalid signature');
            return res.status(400).json({ error: 'Invalid webhook signature' });
        }

        console.log('✅ Razorpay webhook signature verified');
        next();
    } catch (error) {
        console.error('Razorpay webhook verification error:', error);
        return res.status(500).json({ error: 'Webhook verification failed' });
    }
};

/**
 * Stripe Webhook Signature Verification
 * Uses Stripe SDK to verify webhook authenticity
 */
export const verifyStripeWebhook = (req, res, next) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
        console.warn('Stripe webhook: Missing signature');
        return res.status(400).json({ error: 'Missing webhook signature' });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.error('STRIPE_WEBHOOK_SECRET not configured');
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    try {
        // Stripe requires raw body for signature verification
        const event = stripe.webhooks.constructEvent(
            req.rawBody || req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        // Attach verified event to request
        req.stripeEvent = event;

        console.log('✅ Stripe webhook signature verified:', event.type);
        next();
    } catch (error) {
        console.error('Stripe webhook verification error:', error.message);
        return res.status(400).json({ error: 'Invalid webhook signature' });
    }
};
