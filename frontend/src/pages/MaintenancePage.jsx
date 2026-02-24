import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useMaintenance } from "../hooks/useMaintenance";
import FiaMascot from "../components/FiaMascot";
import {
    Clock, Mail, ChefHat,
    Twitter, Instagram, Facebook, Lock, ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";

// Liquid Components
import LiquidContainer from "../components/liquid/LiquidContainer";
import LiquidCard from "../components/liquid/LiquidCard";
import LiquidButton from "../components/liquid/LiquidButton";
import LiquidInput from "../components/liquid/LiquidInput";

export default function MaintenancePage() {
    const { message, endTime } = useMaintenance();
    const [timeLeft, setTimeLeft] = useState("");
    const [email, setEmail] = useState("");
    const [notified, setNotified] = useState(false);

    useEffect(() => {
        if (!endTime) return;

        const updateTimer = () => {
            const now = new Date();
            const diff = new Date(endTime) - now;

            if (diff <= 0) {
                setTimeLeft(null);
                return;
            }

            const h = Math.floor((diff / (1000 * 60 * 60)));
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);

            setTimeLeft(`${h}h ${m}m ${s}s`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [endTime]);

    const handleNotify = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email");

        try {
            // Save to Firestore
            await addDoc(collection(db, "maintenance_requests"), {
                email,
                timestamp: new Date(),
                userAgent: navigator.userAgent
            });

            setNotified(true);
            toast.success("We'll let you know when we're back!");
        } catch (error) {
            console.error("Error saving notification:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <LiquidContainer>
            <div className="relative min-h-screen flex items-center justify-center p-6">

                {/* Content Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 w-full max-w-lg"
                >
                    <LiquidCard className="p-8 md:p-10 text-center">

                        {/* Icon */}
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 liquid-glass-high">
                            <ChefHat className="w-10 h-10 text-white" />
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            We're refining the recipe
                        </h1>

                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            {message || "AeroBite is undergoing scheduled maintenance to serve you better. We'll be back shortly!"}
                        </p>

                        {/* Timer */}
                        {timeLeft && (
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-8 backdrop-blur-md">
                                <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide font-semibold">Estimated Return</p>
                                <div className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-mono font-bold text-green-400 text-glow">
                                    <Clock className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
                                    {timeLeft}
                                </div>
                            </div>
                        )}

                        {/* Notify Form */}
                        {!notified ? (
                            <form onSubmit={handleNotify} className="space-y-4">
                                <LiquidInput
                                    placeholder="Enter your email for updates"
                                    icon={Mail}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <LiquidButton
                                    type="submit"
                                    className="w-full"
                                >
                                    Notify Me When Back
                                </LiquidButton>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-green-400 flex items-center justify-center gap-3"
                            >
                                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold">You're on the list! ✅</p>
                                    <p className="text-sm opacity-80">We'll email you as soon as we're live.</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Footer Links */}
                        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex gap-4">
                                <a href="#" className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"><Twitter size={20} /></a>
                                <a href="#" className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"><Instagram size={20} /></a>
                                <a href="#" className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"><Facebook size={20} /></a>
                            </div>

                            <a href="/login" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-400 transition-colors px-3 py-1.5 hover:bg-white/5 rounded-lg">
                                <Lock size={14} />
                                <span>Admin Access</span>
                            </a>
                        </div>
                    </LiquidCard>

                    {/* Test Mode Badge */}
                    {import.meta.env.VITE_FORCE_MAINTENANCE === "true" && (
                        <div className="mt-4 text-center">
                            <span className="inline-block px-3 py-1 text-xs font-mono rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 backdrop-blur-md">
                                ⚠ TEST MODE ACTIVE
                            </span>
                        </div>
                    )}
                </motion.div>

                {/* Fixed position for Mascot to prevent overlap issues in small screens, or keep layout organic */}
                <div className="absolute bottom-4 right-4 z-0 pointer-events-none opacity-50">
                    <FiaMascot state="Improving the experience..." mood="happy" />
                </div>
            </div>
        </LiquidContainer>
    );
}
