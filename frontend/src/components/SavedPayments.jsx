import { motion } from "framer-motion";
import { CreditCard, Smartphone, CheckCircle } from "lucide-react";

/**
 * SavedPayments - Premium tokenized payment methods UI
 * 
 * Security: Only stores gateway tokens, never raw card/UPI data
 * - id: Gateway token (pm_abc123)
 * - label: Display name (Google Pay, Visa)
 * - last4: Cards only (1234)
 */

export default function SavedPayments({
    methods = [],
    selected,
    onSelect,
}) {
    if (!methods.length) return null;

    return (
        <div className="space-y-3 mt-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">
                Saved payment methods
            </p>

            {methods.map(method => {
                const isActive = selected === method.id;

                return (
                    <motion.button
                        key={method.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onSelect(method)}
                        className={`w-full flex items-center justify-between rounded-xl p-4 border transition
              ${isActive
                                ? "border-emerald-500 bg-emerald-500/10"
                                : "border-white/10 bg-white/5 hover:bg-white/10"
                            }
            `}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center
                ${method.type === "upi" ? "bg-emerald-500/20" : "bg-blue-500/20"}
              `}>
                                {method.type === "upi" ? (
                                    <Smartphone className="w-5 h-5 text-emerald-400" />
                                ) : (
                                    <CreditCard className="w-5 h-5 text-blue-400" />
                                )}
                            </div>

                            <div className="text-left">
                                <p className="text-sm font-medium text-white">
                                    {method.type === "upi"
                                        ? `Pay with ${method.label}`
                                        : `${method.label} •••• ${method.last4}`}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {method.isDefault && (
                                        <span className="text-emerald-400 mr-2">Default</span>
                                    )}
                                    <span className="capitalize">{method.provider}</span>
                                </p>
                            </div>
                        </div>

                        {isActive && (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
