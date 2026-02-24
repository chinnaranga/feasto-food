import React from "react";
import { motion } from "framer-motion";

export default function LiquidToggle({ checked, onChange, label }) {
    return (
        <div className="flex items-center justify-between cursor-pointer group" onClick={() => onChange(!checked)}>
            <span className="text-gray-300 font-medium group-hover:text-white transition-colors">
                {label}
            </span>
            <div
                className={`flex items-center rounded-full p-1 transition-colors duration-300 ${checked ? "bg-orange-500 shadow-[0_0_15px_rgba(255,107,0,0.4)]" : "bg-white/10"
                    }`}
            >
                <motion.div
                    layout
                    className="bg-white w-6 h-6 rounded-full shadow-md"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    animate={{ x: checked ? 24 : 0 }}
                />
            </div>
        </div>
    );
}
