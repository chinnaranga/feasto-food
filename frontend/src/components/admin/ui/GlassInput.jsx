import React from 'react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export function GlassInput({ className, icon: Icon, error, ...props }) {
    return (
        <div className="w-full">
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-slate-400" />
                    </div>
                )}
                <input
                    className={classNames(
                        "w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all",
                        Icon && "pl-10",
                        error && "border-red-500/50 focus:ring-red-500/50",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="mt-1 text-xs text-red-400 font-medium ml-1">{error}</p>}
        </div>
    );
}
