import React from "react";
import { motion } from "framer-motion";

const LiquidCard = ({ children, className = "", ...props }) => {
    return (
        <div
            className={`
        relative overflow-hidden
        bg-white/[0.08] 
        backdrop-blur-[20px] 
        border border-white/[0.15] 
        rounded-[24px] 
        shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
        hover:border-white/25 transition-all duration-300
        ${className}
      `}
            {...props}
        >
            {/* Soft Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />

            {children}
        </div>
    );
};

export default LiquidCard;
