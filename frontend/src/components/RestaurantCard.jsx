import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Clock, Heart, Shield, TrendingUp, Lock } from "lucide-react";
import LiquidButton from "./liquid/LiquidButton";
import LiquidCard from "./liquid/LiquidCard";
import { useAuth } from "../context/AuthContext";
import { calculatePrice } from "../utils/pricing";
import toast from "react-hot-toast";

/* -------------------- MOTION -------------------- */
const cardMotion = {
    rest: { y: 0 },
    hover: { y: -8 },
};

const imageMotion = {
    rest: { scale: 1 },
    hover: { scale: 1.06 },
};

/* -------------------- COMPONENT -------------------- */
export const RestaurantCard = ({
    restaurant,
    highlight,
    onAddToCart,
    onToggleFavorite,
    isFavorite,
}) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Auth-aware pricing calculation
    const pricing = calculatePrice({
        basePrice: restaurant.itemPrice || 0,
        discount: restaurant.discount || 0,
        isAuthenticated: !!currentUser,
    });

    const handleAddToCart = () => {
        if (!currentUser) {
            toast.error("Please sign in to order");
            navigate("/login");
            return;
        }
        onAddToCart(restaurant);
    };

    return (
        <motion.div
            variants={cardMotion}
            initial="rest"
            animate="rest"
            whileHover="hover"
            className="h-full"
        >
            <LiquidCard
                hoverEffect={true}
                className={`
          flex flex-col h-full p-0 overflow-hidden group relative
          ${highlight ? "ring-2 ring-orange-500/50" : ""}
          transition-all duration-300
        `}
            >
                {/* IMAGE */}
                <div className="relative h-56 overflow-hidden">
                    <motion.img
                        variants={imageMotion}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="h-full w-full object-cover"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-black/30 to-transparent" />

                    {/* BADGES */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {/* Auth-aware discount badge */}
                        {restaurant.discount && (
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold shadow-md ${currentUser
                                    ? "bg-gradient-to-r from-orange-600 to-red-600 text-white"
                                    : "bg-gray-700/80 text-gray-300 backdrop-blur"
                                    }`}
                            >
                                {currentUser ? (
                                    `${restaurant.discount}% OFF`
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <Lock size={10} />
                                        {restaurant.discount}% OFF
                                    </span>
                                )}
                            </span>
                        )}

                        {restaurant.isNew && (
                            <span className="rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
                                NEW
                            </span>
                        )}

                        {restaurant.trending && (
                            <span className="flex items-center gap-1 rounded-full bg-orange-500/90 px-3 py-1 text-xs font-semibold text-white shadow-md">
                                <TrendingUp size={12} />
                                Trending
                            </span>
                        )}
                    </div>

                    {/* FAVORITE */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(restaurant.id);
                        }}
                        className="
              absolute top-4 right-4
              rounded-full border border-white/10
              bg-black/50 p-2.5 backdrop-blur-md
              transition-all
              hover:bg-white hover:text-red-500 hover:scale-110
            "
                    >
                        <Heart
                            size={18}
                            className={isFavorite ? "text-red-500" : "text-white"}
                            fill={isFavorite ? "currentColor" : "none"}
                        />
                    </button>
                </div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col flex-grow">
                    {/* TITLE + MATCH SCORE */}
                    <div className="mb-3">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-2 py-1">
                                <span className="text-sm font-bold text-orange-400">
                                    Aero Match: {Math.floor(Math.random() * (98 - 85) + 85)}%
                                </span>
                            </div>
                            <span className="text-xs text-gray-500 gap-1 flex items-center">
                                <Clock size={12} />
                                {restaurant.time}
                            </span>
                        </div>

                        {/* AI REASONING BADGE */}
                        <div className="mb-3 inline-block rounded-md bg-white/5 px-2 py-1 text-xs text-gray-400 italic border border-white/5">
                            {Math.random() > 0.5 ? "Matches your dinner mood 🌙" : "Perfect for quick delivery tonight ⚡"}
                        </div>

                        <h3 className="flex items-center gap-2 text-lg font-bold text-white transition-colors group-hover:text-orange-400 font-display">
                            {restaurant.name}
                            {restaurant.verified && (
                                <Shield
                                    size={14}
                                    className="text-cyan-400 fill-cyan-400/20"
                                />
                            )}
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                            {restaurant.cuisine} • {restaurant.price}
                        </p>
                    </div>

                    {/* SPECIALTIES */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {restaurant.specialties.slice(0, 3).map((tag, i) => (
                            <span
                                key={i}
                                className="rounded-md border border-white/5 bg-white/5 px-2 py-1 text-xs text-gray-400"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* FOOTER */}
                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                        {/* Auth-aware pricing */}
                        <div>
                            <span className="block text-xs text-gray-400">
                                Starting at
                            </span>
                            <span className="text-lg font-bold text-white">
                                ₹{pricing.finalPrice.toFixed(0)}
                            </span>

                            {/* Guest: Show locked discount */}
                            {!currentUser && restaurant.discount > 0 && (
                                <div
                                    onClick={() => navigate("/login")}
                                    className="mt-1 flex items-center gap-1 text-xs text-orange-400 cursor-pointer hover:underline"
                                >
                                    <Lock size={10} />
                                    Login to unlock {restaurant.discount}% OFF
                                </div>
                            )}

                            {/* Logged in: Show savings */}
                            {currentUser && pricing.discountApplied > 0 && (
                                <div className="mt-1 text-xs text-green-400">
                                    You save ₹{pricing.discountApplied.toFixed(0)} 🎉
                                </div>
                            )}
                        </div>

                        {currentUser ? (
                            <LiquidButton
                                variant="primary"
                                className="px-5 text-sm py-2"
                                onClick={handleAddToCart}
                            >
                                Add to cart
                            </LiquidButton>
                        ) : (
                            <LiquidButton
                                variant="secondary"
                                className="px-5 text-sm py-2"
                                onClick={() => navigate("/login")}
                            >
                                Sign in
                            </LiquidButton>
                        )}
                    </div>
                </div>
            </LiquidCard>
        </motion.div>
    );
};
