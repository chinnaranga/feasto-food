import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const LiquidInput = ({
    icon: Icon,
    label,
    className = "",
    error,
    type = "text",
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && <label className="text-sm font-medium text-gray-400 ml-1">{label}</label>}

            <div className={`relative group transition-all duration-300 ${error ? 'animate-shake' : ''}`}>
                {Icon && (
                    <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${error ? 'text-red-400 text-opacity-80' : 'text-gray-500 group-focus-within:text-orange-400'}`} />
                )}

                <input
                    type={inputType}
                    {...props}
                    className={`w-full bg-white/5 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-orange-500/50'} 
                rounded-2xl py-3.5 ${Icon ? 'pl-11' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'} text-white placeholder-gray-500 outline-none 
                focus:bg-white/10 focus:shadow-[0_0_15px_rgba(255,107,0,0.1)] transition-all duration-300
                backdrop-blur-sm ${className}`}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>

            {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
        </div>
    );
};

export default LiquidInput;
