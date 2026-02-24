import { motion } from "framer-motion";
import { Check, Clock, Package, Truck, Home } from "lucide-react";

/**
 * Status Flow:
 * Placed -> Preparing -> Ready -> Out for delivery -> Delivered
 */
const STATUS_STEPS = [
    { key: "Placed", label: "Order Placed", icon: Clock },
    { key: "Preparing", label: "Preparing", icon: Package },
    { key: "Ready", label: "Ready", icon: Check },
    { key: "Out for delivery", label: "On the Way", icon: Truck },
    { key: "Delivered", label: "Delivered", icon: Home },
];

export default function StatusTimeline({ currentStatus }) {
    // Determine active index based on status key from backend (case-insensitive check handled by parent or logic here)
    const normalizedStatus = currentStatus === "created" ? "Placed" : currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1); // Basic normalization

    // Handle "Out for delivery" special case or other mappings if needed
    const statusKeyMap = {
        "Pending": 0,
        "Placed": 0,
        "Preparing": 1,
        "Ready": 2,
        "Out for delivery": 3,
        "Delivered": 4,
        "Cancelled": -1
    };

    const activeIndex = statusKeyMap[normalizedStatus] ?? 0;
    const isCancelled = normalizedStatus === "Cancelled";

    if (isCancelled) {
        return (
            <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center text-red-500 font-bold">
                🚫 Order Cancelled
            </div>
        );
    }

    return (
        <div className="w-full py-6">
            <div className="relative flex items-center justify-between">
                {/* Background Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full -z-10" />

                {/* Progress Line */}
                <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-orange-500 rounded-full -z-10"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(activeIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />

                {STATUS_STEPS.map((step, index) => {
                    const isActive = index <= activeIndex;
                    const isCurrent = index === activeIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.key} className="relative flex flex-col items-center group">
                            {/* Step Circle */}
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isCurrent ? 1.2 : 1,
                                    backgroundColor: isActive ? "#f97316" : "#27272a", // orange-500 vs zinc-800
                                    borderColor: isActive ? "#f97316" : "#3f3f46", // orange-500 vs zinc-700
                                }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-300 shadow-lg ${isCurrent ? 'shadow-orange-500/40' : ''}`}
                            >
                                <Icon size={18} className={isActive ? "text-white" : "text-gray-500"} />
                            </motion.div>

                            {/* Label */}
                            <div className="absolute top-14 w-32 text-center">
                                <p className={`text-xs font-medium transition-colors duration-300 ${isActive ? "text-white" : "text-gray-500"}`}>
                                    {step.label}
                                </p>
                                {isCurrent && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-[10px] text-orange-400 block mt-0.5 font-bold"
                                    >
                                        Current Step
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
