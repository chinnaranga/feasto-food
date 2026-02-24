import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  variant = 'default',
  hover = true,
  className = '',
  ...props
}) => {
  const baseStyles = "rounded-2xl border transition-all duration-300";

  const variants = {
    default: "bg-[#18181b] border-white/5",
    glass: "bg-white/5 backdrop-blur-md border-white/10",
    elevated: "bg-[#18181b] border-white/5 shadow-lg",
    gradient: "bg-gradient-to-br from-[#18181b] to-[#1a1a1f] border-white/10"
  };

  const hoverStyles = hover ? "hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/10 hover:scale-[1.02]" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-white/5 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-6 border-t border-white/5 ${className}`}>
    {children}
  </div>
);

export default Card;
