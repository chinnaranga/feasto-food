import React from 'react';
import { motion } from 'framer-motion';

export const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    className = ''
}) => {
    const baseStyles = "inline-flex items-center justify-center font-bold rounded-full transition-all";

    const variants = {
        default: "bg-white/10 text-white",
        primary: "bg-green-500/20 text-green-400",
        success: "bg-green-500/20 text-green-400",
        warning: "bg-orange-500/20 text-orange-400",
        danger: "bg-red-500/20 text-red-400",
        info: "bg-blue-500/20 text-blue-400"
    };

    const sizes = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base"
    };

    return (
        <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    );
};

export const Pill = ({
    children,
    active = false,
    onClick,
    className = ''
}) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
        px-4 py-2 rounded-full text-sm font-bold 
        transition-all duration-200
        ${active
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }
        ${className}
      `}
        >
            {children}
        </motion.button>
    );
};

export default Badge;
