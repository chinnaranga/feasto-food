import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTaste } from "../context/TasteContext";
import { rankFood } from "../utils/recommendationEngine";
import { getTimeContext } from "../utils/timeContext";

export default function AIRecommendations({ items }) {
    const { profile } = useTaste();
    const ranked = rankFood(items, profile, getTimeContext()).slice(0, 3);

    if (ranked.length === 0) return null;

    return (
        <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-emerald-400" size={18} />
                <h3 className="font-semibold text-white">
                    Recommended for you
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ranked.map(item => (
                    <motion.div
                        key={item.id}
                        whileHover={{ y: -4 }}
                        className="rounded-2xl bg-gray-800/50 border border-white/10 p-4"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-white mb-1">{item.name}</h4>
                            <span className="text-sm font-semibold text-emerald-400">
                                ₹{item.price}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">
                            {item.reasons[0] || "AeroBite curated selection"}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
