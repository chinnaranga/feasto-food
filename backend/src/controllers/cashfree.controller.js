import { db } from "../config/firebase.js";

// @desc    Create a payment intent/order via Cashfree REST API
// @route   POST /api/cashfree/create-order
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { amount, currency = "INR" } = req.body;

        // Ensure values exist
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        const order_id = `cf_order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // Define payload according to Cashfree PG API (latest v3 - 2023-08-01)
        const requestData = {
            order_amount: Math.round(amount * 100) / 100, // Two decimals
            order_currency: currency,
            order_id: order_id,
            customer_details: {
                customer_id: req.user.uid || "guest_user", // req.user from authorize middleware
                customer_phone: req.user.phone_number || "9999999999",
                customer_name: req.user.name || "AeroBite Customer",
                customer_email: req.user.email || "customer@aerobite.food"
            },
            order_meta: {
                return_url: `${process.env.CLIENT_URL || "https://feasto.food"}/payments?order_id={order_id}`
            }
        };

        const response = await fetch("https://sandbox.cashfree.com/pg/orders", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "x-client-id": process.env.CASHFREE_CLIENT_ID || "test_123456",
                "x-client-secret": process.env.CASHFREE_CLIENT_SECRET || "test_secret",
                "x-api-version": "2023-08-01"
            },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error("Cashfree order creation error:", responseData);
            return res.status(response.status).json({ error: "Failed to create Cashfree order", details: responseData });
        }

        // Save order intent in Firebase Firestore
        await db.collection("payment_intents").doc(order_id).set({
            userId: req.user.uid,
            amount: requestData.order_amount,
            status: "created",
            provider: "cashfree",
            cf_session_id: responseData.payment_session_id,
            createdAt: new Date()
        });

        res.json({
            id: order_id,
            payment_session_id: responseData.payment_session_id
        });

    } catch (error) {
        console.error("Create Cashfree Order Error:", error);
        res.status(500).json({ error: "Server failed to initiate Cashfree payment" });
    }
};

// @desc    Verify payment via Cashfree API
// @route   POST /api/cashfree/verify-payment
// @access  Public or Private
export const verifyPayment = async (req, res) => {
    try {
        const { order_id } = req.body;

        if (!order_id) {
            return res.status(400).json({ error: "Order ID is missing" });
        }

        const response = await fetch(`https://sandbox.cashfree.com/pg/orders/${order_id}/payments`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "x-client-id": process.env.CASHFREE_CLIENT_ID || "test_123456",
                "x-client-secret": process.env.CASHFREE_CLIENT_SECRET || "test_secret",
                "x-api-version": "2023-08-01"
            }
        });

        const payments = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: "Verification check failed", details: payments });
        }

        // The array containing multiple payment attempts on this order
        const successPayment = Array.isArray(payments) && payments.find(p => p.payment_status === "SUCCESS");

        if (successPayment) {
            // Update the DB record to indicate success
            await db.collection("payment_intents").doc(order_id).update({
                status: "paid",
                cf_payment_id: successPayment.cf_payment_id,
                paidAt: new Date()
            });

            return res.json({ verified: true, payment_id: successPayment.cf_payment_id });
        }

        // Failed or pending
        res.json({ verified: false, status: payments?.[0]?.payment_status || "PENDING" });

    } catch (error) {
        console.error("Cashfree Verification Error:", error);
        res.status(500).json({ error: "Server failed to verify payment" });
    }
};
