import React from "react";

const LiquidBackground = ({ children, className = "" }) => {
    return (
        <div className={`relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden ${className}`}>
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[#0B0F14]">
                {/* Primary Orange Glow (Top Left) */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF6B00]/10 blur-[120px] animate-pulse-slow" />

                {/* Secondary Red/Orange Glow (Bottom Right) */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF3D00]/10 blur-[120px] animate-pulse-slow delay-1000" />

                {/* Subtle Grain Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default LiquidBackground;
