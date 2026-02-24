import React, { useState } from "react";
// import { motion } from "framer-motion"; // Removed, using LiquidButton
import { CreditCard, Loader2, ExternalLink } from "lucide-react";
import LiquidButton from "./liquid/LiquidButton";

/**
 * StripeCheckout Component
 * 
 * Calls backend API to create Stripe Checkout session,
 * then redirects user to Stripe-hosted checkout page.
 * 
 * SECURITY: Never exposes secret keys to frontend.
 * All Stripe operations happen on the backend.
 */

const API_URL = import.meta.env.VITE_API_URL || "https://feasto-backend-production.up.railway.app";

export default function StripeCheckout({
    amount,
    items = [],
    customerEmail,
    orderId,
    walletUsed = 0,
    onError,
    className = "",
    disabled = false,
}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleStripeCheckout = async () => {
        if (disabled || isLoading) return;

        // ✅ Validation: Minimum Amount
        if (amount < 50) {
            if (onError) onError("Order total must be at least ₹50 for online payment");
            return;
        }

        setIsLoading(true);

        try {
            const generatedOrderId = orderId || `ORD-${Date.now()}`;

            const response = await fetch(`${API_URL}/api/stripe/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount,
                    items,
                    customerEmail,
                    metadata: {
                        orderId: generatedOrderId,
                        walletUsed: walletUsed.toString(),
                        orderSource: "aerobite_web",
                        timestamp: new Date().toISOString(),
                    },
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create checkout session");
            }

            // Redirect to Stripe-hosted checkout page
            window.location.href = data.url;
        } catch (error) {
            console.error("Stripe checkout error:", error);
            if (onError) {
                onError(error.message);
            }
            setIsLoading(false);
        }
    };

    return (
        <LiquidButton
            onClick={handleStripeCheckout}
            disabled={disabled || isLoading}
            className={`w-full py-4 text-lg font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-orange-500/25 ${className}`}
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Redirecting...</span>
                </span>
            ) : (
                <span className="flex items-center justify-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Pay ₹{amount?.toFixed(2)} Securely</span>
                </span>
            )}
        </LiquidButton>
    );
}
