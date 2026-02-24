import React from 'react';


// Simple class merger if not present
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export function GlassCard({ children, className, hoverEffect = false, ...props }) {
    return (
        <div
            className={classNames(
                "bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg transition-all duration-300",
                hoverEffect && "hover:bg-white/15 hover:border-white/30 hover:shadow-xl hover:-translate-y-1",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function GlassPanel({ children, className, ...props }) {
    return (
        <div
            className={classNames(
                "bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
