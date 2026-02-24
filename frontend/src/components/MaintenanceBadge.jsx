import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useMaintenance } from "../hooks/useMaintenance";

export default function MaintenanceBadge() {
    const { active } = useMaintenance();

    if (!active) return null;

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-3 right-3 z-50 bg-yellow-500/90 text-black px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg font-medium"
        >
            <AlertTriangle size={16} />
            Maintenance
        </motion.div>
    );
}
