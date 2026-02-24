import { motion } from "framer-motion";

export default function AnimatedCard({ children, className = "", onClick }) {
    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className={`rounded-xl bg-zinc-900 shadow-lg ${className}`}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
}
