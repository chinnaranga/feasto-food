import { db } from "../config/firebase.js";
import { Cashfree, CFEnvironment } from "cashfree-pg";

// Initialize Cashfree
const clientId = process.env.CASHFREE_CLIENT_ID || "";
const clientSecret = process.env.CASHFREE_CLIENT_SECRET || "";
const environment = process.env.NODE_ENV === "production" ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;

const cashfree = new Cashfree(environment, clientId, clientSecret);

// @desc    Create a payment intent/order via Cashfree REST API
// @route   POST /api/cashfree/create-order
// @access  Private
export const createOrder = async (req, res) => {
    try {
        // Explicitly check for API keys to prevent opaque 500 errors if Railway is not configured
        if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) {
            console.error("❌ CRITICAL: Cashfree API keys are missing in environment variables.");
            return res.status(500).json({
                error: "Payment Gateway Not Configured",
                message: "Please add CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET to Railway variables."
            });
        }

        const { amount, currency = "INR" } = req.body;

        // Ensure values exist
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        const order_id = `cf_order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        const requestData = {
            order_amount: Math.round(amount * 100) / 100, // Two decimals
            order_currency: currency,
            order_id: order_id,
            customer_details: {
                customer_id: req.user.uid || "guest_user",
                customer_phone: req.user.phone_number || "9999999999",
                customer_name: req.user.name || "AeroBite Customer",
                customer_email: req.user.email || "customer@aerobite.food"
            },
            order_meta: {
                return_url: `${process.env.CLIENT_URL || "https://feasto.food"}/payments?order_id={order_id}`
            }
        };

        cashfree.PGCreateOrder(requestData).then(async (response) => {
            const responseData = response.data;

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
        }).catch((error) => {
            console.error("Cashfree order creation error:", error.response?.data || error.message);
            res.status(500).json({ error: "Failed to create Cashfree order", details: error.response?.data?.message || "Internal Error" });
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
        // Explicitly check for API keys
        if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) {
            return res.status(500).json({
                error: "Payment Gateway Not Configured",
                message: "Please add CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET to Railway variables."
            });
        }

        const { order_id } = req.body;

        if (!order_id) {
            return res.status(400).json({ error: "Order ID is missing" });
        }

        cashfree.PGOrderFetchPayments(order_id).then(async (response) => {
            const payments = response.data;
            let orderStatus;

            if (payments.filter(transaction => transaction.payment_status === "SUCCESS").length > 0) {
                orderStatus = "SUCCESS";
            } else if (payments.filter(transaction => transaction.payment_status === "PENDING").length > 0) {
                orderStatus = "PENDING";
            } else {
                orderStatus = "FAILURE";
            }

            if (orderStatus === "SUCCESS") {
                const successPayment = payments.find(p => p.payment_status === "SUCCESS");

                // Update the DB record to indicate success
                await db.collection("payment_intents").doc(order_id).update({
                    status: "paid",
                    cf_payment_id: successPayment.cf_payment_id,
                    paidAt: new Date()
                });

                return res.json({ verified: true, payment_id: successPayment.cf_payment_id });
            }

            // Failed or pending
            res.json({ verified: false, status: orderStatus });

        }).catch((error) => {
            console.error("Cashfree Verification Error:", error.response?.data || error.message);
            res.status(500).json({ error: "Verification check failed", details: error.response?.data?.message });
        });

    } catch (error) {
        console.error("Cashfree Verification Error:", error);
        res.status(500).json({ error: "Server failed to verify payment" });
    }
};
