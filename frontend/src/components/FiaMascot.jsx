import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AeroBiteAI } from "../ai/aerobitePersonality";

export default function FiaMascot({ state = "greeting", mood = "happy" }) {
    // Determine message based on state
    let message = "";
    if (state === "greeting") message = AeroBiteAI.messages.greeting("Friend");
    else if (state === "offline") message = AeroBiteAI.messages.offline;
    else if (state === "empty") message = AeroBiteAI.messages.empty;
    else if (state === "paymentFail") message = AeroBiteAI.messages.paymentFail;
    else if (state === "paymentSuccess") message = AeroBiteAI.messages.paymentSuccess;
    else message = state; // Allow custom strings

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-50 pointer-events-none"
        >
            <div className="flex items-center gap-3 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 px-4 py-3 shadow-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-500/20 flex items-center justify-center shadow-inner ring-1 ring-white/5">
                    <img
                        src={`/mascot/${mood}.svg`}
                        onError={(e) => { e.target.style.display = 'none'; }}
                        alt=""
                        className="w-8 h-8 absolute opacity-80"
                    />
                    <Sparkles className="text-emerald-400 relative z-10" size={18} />
                </div>
                <p className="text-sm text-gray-200 max-w-[220px] font-medium tracking-wide">
                    {message}
                </p>
            </div>
        </motion.div>
    );
}
