import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function FloatingInput({
    id,
    label,
    value,
    onChange,
    type = "text",
    icon: Icon,
    placeholder = " ", // Space needed for :placeholder-shown trick
    className = "",
    error,
    autoComplete
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputType = type === "password" && showPassword ? "text" : type;

    return (
        <div className={`relative group ${className}`}>
            {/* Input Container */}
            <div className={`
                relative flex items-center bg-black/40 border rounded-xl transition-all duration-300
                ${error ? "border-red-500/50 focus-within:border-red-500" : "border-white/10 focus-within:border-orange-500"}
                ${isFocused ? "shadow-lg shadow-orange-500/10" : ""}
            `}>
                {/* Optional Icon */}
                {Icon && (
                    <div className="pl-4 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                        <Icon size={18} />
                    </div>
                )}

                {/* Input Field */}
                <input
                    id={id}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoComplete={autoComplete}
                    className={`
                        w-full bg-transparent border-none outline-none text-white text-base px-4 pt-5 pb-2 
                        placeholder-transparent autofill:bg-transparent
                    `}
                    placeholder={placeholder}
                />

                {/* Floating Label */}
                <label
                    htmlFor={id}
                    className={`
                        absolute left-0 transition-all duration-200 pointer-events-none
                        ${Icon ? "left-10" : "left-4"}
                        ${(isFocused || value)
                            ? "top-1.5 text-xs text-orange-500 font-semibold uppercase tracking-wider"
                            : "top-3.5 text-gray-500 text-sm"}
                    `}
                >
                    {label}
                </label>

                {/* Password Toggle */}
                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="pr-4 text-gray-400 hover:text-white transition-colors focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="absolute -bottom-5 left-1 text-xs text-red-400 animate-slideDown">
                    {error}
                </p>
            )}
        </div>
    );
}
