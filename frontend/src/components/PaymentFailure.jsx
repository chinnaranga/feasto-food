import { motion } from "framer-motion";
import {
    WifiOff,
    XCircle,
    RefreshCw,
    CreditCard,
    AlertTriangle,
} from "lucide-react";

/**
 * PaymentFailure - Premium error screen with smart retry
 * 
 * Handles multiple failure types:
 * - network: No internet
 * - user_cancelled: User closed payment window
 * - insufficient_funds: Card declined
 * - gateway: Bank/gateway error
 */

const errorConfig = {
    network: {
        icon: WifiOff,
        title: "No internet connection",
        desc: "Please check your network and try again.",
        cta: "Retry payment",
        color: "text-orange-400",
        bg: "bg-orange-500/10",
    },
    user_cancelled: {
        icon: XCircle,
        title: "Payment cancelled",
        desc: "You closed the payment window.",
        cta: "Try again",
        color: "text-gray-400",
        bg: "bg-gray-500/10",
    },
    insufficient_funds: {
        icon: CreditCard,
        title: "Insufficient funds",
        desc: "Choose another payment method or try a different card.",
        cta: "Change payment method",
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
    },
    gateway: {
        icon: AlertTriangle,
        title: "Payment failed",
        desc: "Something went wrong at the bank. Please try again.",
        cta: "Retry",
        color: "text-red-400",
        bg: "bg-red-500/10",
    },
    unknown: {
        icon: XCircle,
        title: "Something went wrong",
        desc: "We couldn't process your payment. Please try again.",
        cta: "Retry payment",
        color: "text-red-400",
        bg: "bg-red-500/10",
    },
};

export default function PaymentFailure({ error, onRetry, onChangeMethod }) {
    const config = errorConfig[error?.reason] || errorConfig.unknown;
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-[#0f0f12] flex items-center justify-center px-6 text-white"
        >
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: [0, -8, 8, -4, 4, 0] }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-3xl p-8 text-center shadow-2xl"
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={`w-20 h-20 mx-auto mb-6 rounded-full ${config.bg} flex items-center justify-center`}
                >
                    <Icon className={`w-10 h-10 ${config.color}`} />
                </motion.div>

                {/* Title & Description */}
                <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
                <p className="text-gray-400 mb-8">{config.desc}</p>

                {/* Actions */}
                <div className="space-y-3">
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={onRetry}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 font-bold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg"
                    >
                        <RefreshCw className="w-5 h-5" />
                        {config.cta}
                    </motion.button>

                    {error?.reason !== "network" && (
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={onChangeMethod}
                            className="w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-medium"
                        >
                            Use different payment method
                        </motion.button>
                    )}
                </div>

                {/* Trust message */}
                <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-xs text-gray-500">
                        ✓ Your order is saved — nothing was charged
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        ✓ Cart items are preserved
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
