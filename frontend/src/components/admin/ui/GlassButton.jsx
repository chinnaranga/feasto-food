import React from 'react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export function GlassButton({ children, className, variant = 'default', ...props }) {
    const variants = {
        default: "bg-white/10 border-white/20 hover:bg-white/20 text-white",
        primary: "bg-orange-500/80 border-orange-400 hover:bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]",
        ghost: "bg-transparent border-transparent hover:bg-white/10 text-slate-300 hover:text-white",
        danger: "bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-500"
    };

    return (
        <button
            className={classNames(
                "backdrop-blur-md border px-5 py-2.5 rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant] || variants.default,
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
