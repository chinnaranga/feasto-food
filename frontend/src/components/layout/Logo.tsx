import React from 'react';
import { Link } from 'react-router-dom';

export interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ className = '', onClick }) => {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="Feasto Home"
      className={`inline-flex items-center gap-2.5 select-none group cursor-pointer ${className}`}
    >
      {/* Feasto Architectural Monogram */}
      <span className="w-8 h-8 bg-[#141518] text-[#F3F0E8] group-hover:bg-[#1B3BFF] transition-colors flex items-center justify-center font-mono font-black text-sm tracking-tighter">
        F
      </span>

      {/* Brand Wordmark & Living Marker */}
      <div className="flex items-baseline gap-1.5">
        <span className="font-heading font-black text-xl tracking-tight text-[#141518] leading-none uppercase">
          FEASTO
        </span>
        <span className="font-mono text-xs text-[#1B3BFF] font-bold">○</span>
      </div>
    </Link>
  );
};

export default Logo;
