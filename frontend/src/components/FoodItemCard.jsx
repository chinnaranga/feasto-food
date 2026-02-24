import React from "react";
import { motion } from "framer-motion";
import {
    Star,
    Clock,
    Flame,
    ShoppingBag
} from "lucide-react";
import LiquidCard from "./liquid/LiquidCard";
import LiquidButton from "./liquid/LiquidButton";
import { explainRecommendation } from "../ai/aiExplain";

export default function FoodItemCard({
    food,
    compact = false,
    featured = false,
    onClick,
    onAddToCart
}) {
    if (!food) return null;

    return (
        <LiquidCard
            className={`group relative h-full flex flex-col p-0 overflow-hidden hover:border-orange-500/40 transition-all ${featured ? "row-span-2 col-span-2" : ""}`}
            hoverEffect={true}
        >
            {/* Rank Badge */}
            {food.rank && (
                <div className="absolute top-4 left-4 z-20 bg-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    #{food.rank}
                </div>
            )}

            {/* Clickable Area */}
            <div onClick={onClick} className="cursor-pointer flex-1 flex flex-col">
                {/* Image */}
                <div className={`relative overflow-hidden ${featured ? "h-64" : "h-48"}`}>
                    <img
                        src={food.image}
                        alt={food.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-transparent opacity-80" />

                    {food.isSpicy && (
                        <div className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                            <Flame size={12} /> Spicy
                        </div>
                    )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                    {/* Title */}
                    <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold text-white line-clamp-1 ${featured ? "text-2xl" : "text-lg"}`}>
                            {food.name}
                        </h3>
                        <span className="flex items-center gap-1 text-sm bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-lg border border-yellow-500/20">
                            <Star size={14} className="fill-yellow-500" />
                            {food.rating}
                        </span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                        <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {food.time} min
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                        <span>{food.calories || "350 kcal"}</span>
                    </div>

                    {/* AI Reason Badge */}
                    {(() => {
                        const reasons = explainRecommendation(food);
                        if (reasons.length > 0) {
                            return (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {reasons.slice(0, 2).map((reason, i) => (
                                        <span
                                            key={i}
                                            className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/10"
                                        >
                                            {reason}
                                        </span>
                                    ))}
                                </div>
                            );
                        }
                        return <div className="flex-1" />; // Spacer if no tags
                    })()}

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-xl font-bold text-white">
                            <span className="text-green-500">$</span>{food.price}
                        </span>

                        <LiquidButton
                            variant="primary"
                            className="!py-2 !px-4 !rounded-xl !text-sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(food, 1, e);
                            }}
                        >
                            <ShoppingBag size={16} />
                            Add
                        </LiquidButton>
                    </div>
                </div>
            </div>
        </LiquidCard>
    );
}
