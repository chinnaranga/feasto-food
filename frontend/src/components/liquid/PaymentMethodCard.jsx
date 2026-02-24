import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function PaymentMethodCard({
    selected,
    onClick,
    icon: Icon,
    title,
    subtitle,
}) {
    return (
        <motion.div
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden ${selected
                ? "bg-orange-500/10 border-orange-500/50 shadow-[0_0_20px_rgba(255,107,0,0.1)]"
                : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
        >
            {selected && (
                <motion.div
                    layoutId="selected-glow"
                    className="absolute inset-0 bg-orange-500/5 z-0"
                />
            )}

            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${selected ? "bg-orange-500/20 text-orange-400" : "bg-white/10 text-gray-400"
                            }`}
                    >
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3
                            className={`font-semibold text-lg transition-colors font-display ${selected ? "text-white" : "text-gray-300"
                                }`}
                        >
                            {title}
                        </h3>
                        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                    </div>
                </div>

                <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-white/20"
                        }`}
                >
                    {selected && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center justify-center"
                        >
                            <CheckCircle2 size={14} />
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
