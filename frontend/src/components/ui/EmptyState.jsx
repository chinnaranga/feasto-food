import React from 'react';
import { motion } from 'framer-motion';
import LiquidButton from '../liquid/LiquidButton';

const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    action, // New prop for custom action node
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center p-8 text-center bg-[#18181b] border border-white/5 rounded-2xl ${className}`}>
            {Icon && (
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4"
                >
                    <Icon className="w-8 h-8 text-gray-400" />
                </motion.div>
            )}

            <h3 className="text-xl font-semibold text-white mb-2">
                {title}
            </h3>

            {description && (
                <p className="text-gray-400 max-w-sm mb-6">
                    {description}
                </p>
            )}

            {/* Support both custom action node OR default button */}
            {action ? (
                action
            ) : (
                actionLabel && onAction && (
                    <LiquidButton onClick={onAction} variant="primary">
                        {actionLabel}
                    </LiquidButton>
                )
            )}
        </div>
    );
};

export default EmptyState;
