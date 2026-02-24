import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Leaf, Plus, ArrowRight, Zap } from 'lucide-react';
import useCart from '../context/CartContext';
import { mockFoodData } from '../data/mockData';
import toast from 'react-hot-toast';

export default function CartOptimizer() {
    const { cartItems, addToCart } = useCart();

    const calculations = useMemo(() => {
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const toFreeDelivery = Math.max(0, 500 - subtotal);
        return { subtotal, toFreeDelivery };
    }, [cartItems]);

    const suggestions = useMemo(() => {
        // 1. Delivery Filler: Find items cheaper than or close to the remaining amount for free delivery
        // 2. Health Swap: If user has 'Burger' or 'Pizza', suggest 'Salad'
        // 3. Pairing: If 'Biryani', suggest 'Raita' or 'Coke'

        // Simple mock logic for MVP:
        let smartSuggestions = [];

        // Delivery Nudge Logic
        if (calculations.toFreeDelivery > 0 && calculations.toFreeDelivery < 200) {
            const fillers = mockFoodData.filter(f => f.price <= 200 && f.category !== 'Main Course').slice(0, 1);
            if (fillers.length) smartSuggestions.push({ ...fillers[0], type: 'filler', reason: `Add for FREE Delivery` });
        }

        // Health Logic (Mock)
        const hasUnhealthy = cartItems.some(i => i.name.toLowerCase().includes('burger') || i.name.toLowerCase().includes('pizza'));
        if (hasUnhealthy) {
            const healthy = mockFoodData.find(f => f.name.toLowerCase().includes('salad') || f.name.toLowerCase().includes('smoothie'));
            if (healthy) smartSuggestions.push({ ...healthy, type: 'health', reason: 'Lighter & fresher choice' });
        }

        // Cross-sell Logic
        const hasMain = cartItems.some(i => i.price > 250);
        if (hasMain) {
            const drink = mockFoodData.find(f => f.category === 'Drinks') || mockFoodData[0]; // Fallback
            if (drink && !cartItems.find(i => i.id === drink.id)) {
                smartSuggestions.push({ ...drink, type: 'pairing', reason: 'Perfect with your meal' });
            }
        }

        return smartSuggestions.slice(0, 2); // Show max 2
    }, [cartItems, calculations.toFreeDelivery]);

    if (suggestions.length === 0 && calculations.toFreeDelivery === 0) return null;

    return (
        <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-2xl p-5 mb-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>

            <div className="flex items-center gap-2 mb-4 relative z-10">
                <Zap className="text-yellow-400 fill-yellow-400 animate-pulse" size={18} />
                <h3 className="font-bold text-white">Smart Savings & Swaps</h3>
            </div>

            <div className="space-y-3 relative z-10">
                {/* Free Delivery Bar */}
                {calculations.toFreeDelivery > 0 ? (
                    <div className="bg-gray-800/80 rounded-xl p-3 border border-white/5">
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-gray-300">Add <span className="text-white font-bold">₹{calculations.toFreeDelivery.toFixed(0)}</span> for Free Delivery</span>
                            <Truck size={14} className="text-green-400" />
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-green-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${(calculations.subtotal / 500) * 100}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 flex items-center gap-3 text-green-400 text-sm font-medium">
                        <Truck size={16} />
                        <span>You've unlocked FREE Delivery! 🎉</span>
                    </div>
                )}

                {/* Dynamic Suggestions */}
                <AnimatePresence>
                    {suggestions.map((item, idx) => (
                        <motion.div
                            key={`${item.id}-${idx}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-medium text-white">{item.name}</h4>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-medium">{item.reason}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <span className="text-orange-400 font-bold">₹{item.price}</span>
                                        {item.type === 'health' && <span className="flex items-center gap-0.5 text-green-400"><Leaf size={10} /> Healthy Pick</span>}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    addToCart(item, 1);
                                    toast.success(`Added ${item.name}`);
                                }}
                                className="p-2 bg-white/10 hover:bg-orange-500 hover:text-white rounded-lg text-gray-400 transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
