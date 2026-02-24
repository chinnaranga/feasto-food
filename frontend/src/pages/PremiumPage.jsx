import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Crown, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PREMIUM_BENEFITS } from "../constants/premium";
import toast from "react-hot-toast";

export default function PremiumPage() {
    const { upgradeToPremium, isPremium } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        // Load plan ID from env or config. Ideally fetched from backend or constants.
        // For now, using a placeholder. USER MUST REPLACE THIS.
        // For now, using a placeholder. USER MUST REPLACE THIS.
        const PLAN_ID = "plan_Pky8gqFq8z8w1c"; // Replace with your actual Razorpay Plan ID

        try {
            // 1. Create Subscription
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-subscription`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${await useAuth().user.getIdToken()}`
                },
                body: JSON.stringify({
                    planId: PLAN_ID
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to create subscription");

            // 2. Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                subscription_id: data.id,
                name: "AeroBite Premium",
                description: "Monthly Subscription",
                handler: async function (response) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify-subscription`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${await useAuth().user.getIdToken()}`
                            },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_subscription_id: response.razorpay_subscription_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok) {
                            upgradeToPremium(); // Optimistic update
                            toast.success("Welcome to Premium! 🎉");
                            navigate("/dashboard");
                        } else {
                            toast.error("Verification failed. Please contact support.");
                        }
                    } catch (error) {
                        toast.error("Verification error");
                        console.error(error);
                    }
                },
                theme: {
                    color: "#F97316"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Subscription Error:", error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (isPremium) {
        return (
            <div className="min-h-screen bg-[#0f0f12] text-white pt-24 px-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                        <Crown size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">You are a Premium Member</h1>
                    <p className="text-gray-400 mb-6">Enjoy your exclusive benefits.</p>
                    <button onClick={() => navigate("/dashboard")} className="text-orange-400 hover:underline">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f12] text-white pt-24 px-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-lg mx-auto relative z-10">
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold mb-4"
                    >
                        <Crown size={16} /> AeroBite Premium
                    </motion.div>
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Upgrade your experience
                    </h1>
                    <p className="text-gray-400">
                        Get exclusive perks and save on every order.
                    </p>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-[#18181b] border border-orange-500/20 rounded-3xl p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            RECOMMENDED
                        </div>
                    </div>

                    <div className="mb-8">
                        <span className="text-5xl font-bold">₹99</span>
                        <span className="text-gray-400">/month</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                        {PREMIUM_BENEFITS.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckCircle className="text-orange-400 shrink-0 mt-0.5" size={18} />
                                <span className="text-gray-200">{benefit}</span>
                            </li>
                        ))}
                    </ul>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubscribe}
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 font-bold text-lg shadow-lg shadow-orange-500/20 disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Upgrade Now"}
                    </motion.button>

                    <p className="text-xs text-center text-gray-500 mt-4">
                        Cancel anytime. Terms apply.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
