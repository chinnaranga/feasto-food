import React from 'react';

const LiquidContainer = ({ children, className = "" }) => {
    return (
        <div className={`min-h-screen w-full bg-[#0B0F14] text-white relative overflow-x-hidden ${className}`}>
            {/* Background Aurora Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob" />
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-4000" />

                {/* Noise Texture Overlay for "Film Grain" feel purely via CSS if possible, else just clean glass */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full min-h-screen flex flex-col">
                {children}
            </div>
        </div>
    );
};

export default LiquidContainer;
