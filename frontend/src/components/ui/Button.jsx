import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = "font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 font-display tracking-tight",
    secondary: "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 font-medium",
    outline: "bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-medium",
    ghost: "bg-transparent text-gray-300 hover:bg-white/10 hover:text-white font-medium",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 font-medium",
    glass: "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 font-medium"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: loading || disabled ? 1 : 1.02 }}
      whileTap={{ scale: loading || disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
        </>
      )}
    </motion.button>
  );
};

export default Button;
