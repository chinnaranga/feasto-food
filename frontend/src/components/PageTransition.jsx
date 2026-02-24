import { motion } from "framer-motion";

export default function PageTransition({ children }) {
    return (
        <motion.div
            initial={false} // ❗ disables first-load animation
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
        >
            {children}
        </motion.div>
    );
}
