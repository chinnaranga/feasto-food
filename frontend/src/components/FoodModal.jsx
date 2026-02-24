import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, ChefHat, Star, Clock, Activity, ChevronRight, ShoppingBag, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import useCart from '../context/CartContext';
import { Button } from './ui/Button';
import { getChefDescription } from '../ai/chefsVoice';

export default function FoodModal({ food, isOpen, onClose }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    if (!isOpen || !food) return null;

    // 🧠 Chef's Voice Description
    const chefDesc = getChefDescription(food);

    // Mock AI Health Analysis
    const healthScore = food.nutrition?.calories < 500 ? 9.2 : 7.5;
    const healthColor = healthScore > 8 ? 'text-green-500' : 'text-yellow-500';
    const healthBg = healthScore > 8 ? 'bg-green-500/10' : 'bg-yellow-500/10';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="relative w-full max-w-4xl bg-[#18181b] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-md transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Left: Image & Visuals */}
                    <div className="w-full md:w-1/2 relative h-64 md:h-auto">
                        <img
                            src={food.image}
                            alt={food.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                            <div className="flex items-center gap-2 mb-2">
                                {food.isPopular && (
                                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <Flame size={12} /> Popular
                                    </span>
                                )}
                                <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-md">
                                    {food.cuisine}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-1">{food.name}</h2>
                            {food.chef && (
                                <div className="flex items-center gap-2 text-gray-300 text-sm">
                                    <ChefHat size={14} className="text-orange-400" />
                                    <span>By Chef {food.chef}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Details & AI Panel */}
                    <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">

                        {/* Stats Row */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                                <span className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-yellow-400" /> {food.rating}</span>
                                <span className="flex items-center gap-1"><Clock size={16} /> {food.prepTime} min</span>
                                <span className="flex items-center gap-1"><Flame size={16} /> {food.nutrition?.calories || 450} cal</span>
                            </div>
                            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                                ₹{food.price}
                            </span>
                        </div>

                        <p className="text-gray-300 leading-relaxed mb-6 italic border-l-2 border-orange-500 pl-4">
                            "{chefDesc}"
                        </p>

                        {/* AI Dietary Assistant Panel */}
                        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-lg ${healthBg}`}>
                                        <Activity size={16} className={healthColor} />
                                    </div>
                                    <span className="font-bold text-white text-sm">AI Health Insight</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="relative w-8 h-8 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                            <path className="text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                            <path className={healthColor} strokeDasharray={`${healthScore * 10}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                        </svg>
                                        <span className={`absolute text-[10px] font-bold ${healthColor}`}>{healthScore}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-start gap-2 text-xs text-gray-300">
                                    <span className="text-green-400 mt-0.5">✓</span>
                                    <span>High protein content helps with muscle recovery.</span>
                                </div>
                                {healthScore < 8 && (
                                    <div className="flex items-start gap-2 text-xs text-gray-300">
                                        <span className="text-yellow-400 mt-0.5">⚠️</span>
                                        <span>Slightly higher sodium. Consider pairing with a salad.</span>
                                    </div>
                                )}
                                <button className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1 mt-1">
                                    View full nutrition breakdown <ChevronRight size={12} />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-gray-800 rounded-xl p-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors font-bold text-lg"
                                    >
                                        -
                                    </button>
                                    <span className="w-10 text-center font-bold text-white">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors font-bold text-lg"
                                    >
                                        +
                                    </button>
                                </div>
                                <Button
                                    variant="primary"
                                    className="flex-1 py-6 text-lg rounded-xl shadow-lg shadow-orange-500/20"
                                    onClick={() => {
                                        addToCart(food, quantity);
                                        toast.success(`Added ${quantity} ${food.name} to cart`);
                                        onClose();
                                    }}
                                >
                                    <ShoppingBag className="mr-2" /> Add to Cart - ₹{food.price * quantity}
                                </Button>
                            </div>

                            <button className="w-full py-2 text-sm text-gray-500 hover:text-red-400 transition-colors flex items-center justify-center gap-2">
                                <Heart size={14} /> Add to Favorites
                            </button>
                        </div>

                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
