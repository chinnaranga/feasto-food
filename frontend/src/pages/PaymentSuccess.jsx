import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react";
import { useOrders } from "../context/OrderContext";
import useCart from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";
import { clearPaymentIntent, getPaymentIntent } from "../utils/paymentIntent";
import { track } from "../analytics/track";
import toast from "react-hot-toast";

import LiquidBackground from "../components/liquid/LiquidBackground";
import LiquidCard from "../components/liquid/LiquidCard";
import LiquidButton from "../components/liquid/LiquidButton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

/**
 * PaymentSuccess Page
 * 
 * Displayed after successful Stripe Checkout.
 * Verifies the session with backend and creates the order.
 */
export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { addOrder } = useOrders();
    const { clearCart } = useCart();
    const { isPremium } = useAuth();
    const { creditWallet } = useWallet();

    const sessionId = searchParams.get("session_id");
    const [isVerifying, setIsVerifying] = useState(true);
    const [sessionData, setSessionData] = useState(null);

    useEffect(() => {
        const verifyAndCreateOrder = async () => {
            if (!sessionId) {
                toast.error("Invalid session");
                navigate("/cart");
                return;
            }

            try {
                // Verify session with backend
                const response = await fetch(`${API_URL}/api/stripe/session/${sessionId}`);
                const data = await response.json();

                if (!response.ok || data.status !== "paid") {
                    throw new Error("Payment not verified");
                }

                setSessionData(data);

                // Get payment intent data for order details
                const paymentIntent = getPaymentIntent();

                // Create order
                const order = {
                    id: sessionId,
                    items: paymentIntent?.items || [],
                    total: data.amountTotal,
                    status: "Paid",
                    date: new Date().toISOString(),
                    paymentMethod: "stripe",
                    stripeSessionId: sessionId,
                    deliveryOption: paymentIntent?.deliveryOption,
                };

                addOrder(order);
                clearCart();
                clearPaymentIntent();

                // 💰 Apply Premium Cashback
                if (isPremium) {
                    const cashbackAmount = Math.round(data.amountTotal * 0.05); // 5% cashback
                    creditWallet(cashbackAmount, "CASHBACK", `5% Premium Cashback for Order #${sessionId.slice(0, 8)}`);
                    toast.success(`You earned ₹${cashbackAmount} cashback! 💎`, { duration: 5000 });
                }

                toast.success("Payment successful! 🎉");
                track("payment_success", {
                    orderId: sessionId,
                    amount: data.amountTotal,
                    isPremium
                });
            } catch (error) {
                console.error("Verification error:", error);
                toast.error("Could not verify payment. Please contact support.");
            } finally {
                setIsVerifying(false);
            }
        };

        verifyAndCreateOrder();
    }, [sessionId, navigate, addOrder, clearCart, isPremium, creditWallet]);

    if (isVerifying) {
        return (
            <LiquidBackground className="flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">Verifying your payment...</p>
                </motion.div>
            </LiquidBackground>
        );
    }

    return (
        <LiquidBackground className="flex items-center justify-center px-6 text-white">
            <LiquidCard className="w-full max-w-md text-center p-8 border-white/10 shadow-2xl">
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                >
                    <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold mb-2"
                >
                    Payment Successful!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-400 mb-8"
                >
                    Thank you for your order. Your food is being prepared!
                </motion.p>

                {/* Order Details */}
                {sessionData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-8 text-left"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Package className="w-5 h-5 text-indigo-400" />
                            <span className="font-semibold">Order Details</span>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Order ID</span>
                                <span className="font-mono text-xs">{sessionId?.slice(0, 20)}...</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Amount Paid</span>
                                <span className="text-emerald-400 font-semibold">
                                    ₹{sessionData.amountTotal?.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Status</span>
                                <span className="text-emerald-400">Confirmed</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                >
                    <LiquidButton
                        onClick={() => navigate("/orders")}
                        className="w-full py-4 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 font-bold flex items-center justify-center gap-2"
                    >
                        View My Orders
                        <ArrowRight className="w-5 h-5" />
                    </LiquidButton>

                    <LiquidButton
                        variant="ghost"
                        onClick={() => navigate("/")}
                        className="w-full py-3 text-gray-400 hover:text-white transition"
                    >
                        Back to Home
                    </LiquidButton>
                </motion.div>
            </LiquidCard>
        </LiquidBackground>
    );
}
