import React from "react";
import { motion } from "framer-motion";

const LiquidButton = ({
    children,
    variant = "primary",
    className = "",
    onClick,
    ...props
}) => {
    const baseStyles = "relative px-6 py-3 rounded-[16px] font-medium transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group";

    const variants = {
        primary: "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-[0_0_20px_rgba(255,107,0,0.4)] hover:shadow-[0_0_30px_rgba(255,107,0,0.6)] border border-white/10 font-display tracking-wide",
        secondary: "bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white hover:border-white/20 font-medium",
        danger: "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 font-medium",
        ghost: "text-gray-400 hover:text-white hover:bg-white/5 font-medium"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
            onClick={onClick}
            {...props}
        >
            {/* Interactive Shine Effect for Primary */}
            {variant === "primary" && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            )}

            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
        </motion.button>
    );
};

export default LiquidButton;
