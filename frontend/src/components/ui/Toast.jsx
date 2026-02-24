import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    warning: <AlertCircle className="w-5 h-5 text-orange-400" />
};

const Toast = ({ id, message, type = 'info', onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            layout
            className="pointer-events-auto min-w-[320px] max-w-sm bg-[#18181b] border border-white/10 shadow-xl rounded-xl p-4 flex items-start gap-4 backdrop-blur-md"
        >
            <div className="mt-0.5 shrink-0">
                {icons[type] || icons.info}
            </div>

            <div className="flex-1 pt-0.5">
                <p className="text-sm font-medium text-white leading-5">
                    {message}
                </p>
            </div>

            <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default Toast;
