import React from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function Maintenance({ message }) {
    return (
        <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-white p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-md w-full bg-[#18181b] p-8 rounded-3xl border border-white/10 shadow-2xl"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center">
                        <Shield className="text-orange-400" size={40} />
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    Maintenance Mode
                </h1>

                <p className="text-gray-400 text-lg leading-relaxed">
                    {message || "We’re currently improving the platform. We’ll be back shortly. Thanks for your patience."}
                </p>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-gray-500 font-mono">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span>System Status: Upgrade in Progress</span>
                </div>

                {/* Visual Glow */}
                <div className="absolute inset-0 bg-orange-500/5 blur-[100px] pointer-events-none rounded-3xl" />
            </motion.div>
        </div>
    );
}
