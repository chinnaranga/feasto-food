import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, ShoppingCart, RefreshCw, ArrowLeft } from "lucide-react";

import LiquidBackground from "../components/liquid/LiquidBackground";
import LiquidCard from "../components/liquid/LiquidCard";
import LiquidButton from "../components/liquid/LiquidButton";

/**
 * PaymentCancel Page
 * 
 * Displayed when user cancels or abandons Stripe Checkout.
 * Provides options to retry or go back to cart.
 */
export default function PaymentCancel() {
    const navigate = useNavigate();

    return (
        <LiquidBackground className="flex items-center justify-center px-6 text-white">
            <LiquidCard className="w-full max-w-md text-center p-8 border-white/10 shadow-2xl">
                {/* Cancel Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30"
                >
                    <XCircle className="w-12 h-12 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold mb-2"
                >
                    Payment Cancelled
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-400 mb-8"
                >
                    No worries! Your cart items are still saved.
                </motion.p>

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-8"
                >
                    <p className="text-sm text-gray-400">
                        Your payment was not processed and no charges were made.
                        You can try again or choose a different payment method.
                    </p>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                >
                    <LiquidButton
                        onClick={() => navigate("/checkout")}
                        className="w-full py-4 text-lg bg-gradient-to-r from-orange-500 to-orange-600 font-bold flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Try Again
                    </LiquidButton>

                    <LiquidButton
                        variant="ghost"
                        onClick={() => navigate("/cart")}
                        className="w-full py-4 border border-white/10 font-semibold flex items-center justify-center gap-2 hover:bg-white/5 transition"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Back to Cart
                    </LiquidButton>

                    <LiquidButton
                        variant="ghost"
                        onClick={() => navigate("/")}
                        className="w-full py-3 text-gray-400 hover:text-white transition flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Continue Shopping
                    </LiquidButton>
                </motion.div>
            </LiquidCard>
        </LiquidBackground>
    );
}
