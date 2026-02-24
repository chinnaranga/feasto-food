import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Gift } from "lucide-react";
import { Button } from "./ui/Button";
import confetti from "canvas-confetti";

export default function SurpriseModal({ isOpen, onClose, food, onAddToCart }) {
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setRevealed(false);
            // Simulate "thinking" delay
            const timer = setTimeout(() => {
                setRevealed(true);
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#f97316', '#eab308', '#ffffff']
                });
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative bg-[#1a1a1e] rounded-3xl p-1 w-full max-w-sm overflow-hidden border border-orange-500/30 shadow-2xl"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/70 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="bg-[#1a1a1e] rounded-[20px] overflow-hidden p-6 text-center min-h-[400px] flex flex-col items-center justify-center relative">

                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-purple-500/10 pointer-events-none" />

                        {!revealed ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                className="w-24 h-24 border-4 border-orange-500 border-t-transparent rounded-full mb-6"
                            />
                        ) : (
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            >
                                <img
                                    src={food.image}
                                    alt={food.name}
                                    className="w-48 h-48 rounded-full object-cover border-4 border-orange-500 shadow-xl mb-6 mx-auto"
                                />
                            </motion.div>
                        )}

                        <h2 className="text-2xl font-bold text-white mb-2 relative z-10">
                            {revealed ? food.name : "Consulting the AI Chef..."}
                        </h2>

                        <p className="text-gray-400 mb-6 text-sm relative z-10 px-4">
                            {revealed
                                ? "Based on your unique taste profile and the time of day, we think you'll love this!"
                                : "Analyzing your past orders, flavor preferences, and current trends..."}
                        </p>

                        {revealed && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="w-full relative z-10"
                            >
                                <Button
                                    variant="primary"
                                    className="w-full py-4 text-lg shadow-lg shadow-orange-500/20"
                                    onClick={() => {
                                        onAddToCart(food);
                                        onClose();
                                    }}
                                >
                                    Order Now • ₹{food.price}
                                </Button>
                            </motion.div>
                        )}

                        {/* Decor Icon */}
                        {!revealed && (
                            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500/20 w-32 h-32 animate-pulse" />
                        )}

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
