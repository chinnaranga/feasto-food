import React from "react";
import { useOrderSocket } from "../hooks/useOrderSocket";
import { Clock, CheckCircle, Package, Truck, Home } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_STEPS = {
    placed: { icon: Clock, label: "Order Placed", step: 1 },
    created: { icon: Clock, label: "Order Placed", step: 1 },
    preparing: { icon: Package, label: "Preparing", step: 2 },
    ready: { icon: CheckCircle, label: "Ready", step: 3 },
    out_for_delivery: { icon: Truck, label: "Out for Delivery", step: 4 },
    delivered: { icon: Home, label: "Delivered", step: 5 },
};

export default function OrderTracking({ orderId, status = "PLACED" }) {
    // const liveStatus = useOrderSocket(orderId); // Disabled for now, using Firestore real-time from parent
    const normalizedStatus = (status || "placed").toLowerCase();
    const currentStepInfo = STATUS_STEPS[normalizedStatus] || STATUS_STEPS.placed;

    return (
        <div className="rounded-2xl bg-[#18181b] border border-white/5 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Live Tracking</h3>
                    <p className="text-sm text-gray-400">Order #{orderId}</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold animate-pulse">
                    ● Live
                </div>
            </div>

            <div className="relative flex justify-between items-center z-10">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10 rounded-full" />

                {/* Active Progress Bar */}
                <motion.div
                    className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-emerald-500 to-green-400 -z-10 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(currentStepInfo.step - 1) * 25}%` }}
                    transition={{ duration: 0.5 }}
                />

                {Object.entries(STATUS_STEPS).map(([key, info], index) => {
                    const isActive = index + 1 <= currentStepInfo.step;
                    const isCurrent = index + 1 === currentStepInfo.step;
                    const Icon = info.icon;

                    return (
                        <div key={key} className="flex flex-col items-center gap-2">
                            <motion.div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors ${isActive
                                    ? "bg-emerald-500 border-[#18181b] text-white shadow-lg shadow-emerald-500/20"
                                    : "bg-[#27272a] border-[#18181b] text-gray-500"
                                    }`}
                                animate={{ scale: isCurrent ? 1.2 : 1 }}
                            >
                                <Icon size={16} />
                            </motion.div>
                            <span className={`text-xs font-medium hidden md:block ${isActive ? "text-emerald-400" : "text-gray-500"}`}>
                                {info.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 text-center">
                <h4 className="text-xl font-bold text-white">{currentStepInfo.label}</h4>
                <p className="text-gray-400 text-sm mt-1">
                    {currentStatus === "DELIVERED"
                        ? "Enjoy your meal! 🍕"
                        : "We're updating your status in real-time."}
                </p>
            </div>
        </div>
    );
}
