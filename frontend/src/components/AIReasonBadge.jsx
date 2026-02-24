import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function AIReasonBadge({ text }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 border border-orange-500/30 px-3 py-1 text-xs text-orange-300 backdrop-blur"
        >
            <Sparkles size={12} />
            {text}
        </motion.div>
    );
}
