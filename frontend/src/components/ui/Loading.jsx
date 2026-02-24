import React from 'react';
import { motion } from 'framer-motion';

export const Skeleton = ({ className = '', variant = 'default' }) => {
    const variants = {
        default: 'h-4 bg-white/10',
        text: 'h-4 bg-white/10',
        title: 'h-8 bg-white/10',
        card: 'h-48 bg-white/10',
        avatar: 'h-12 w-12 rounded-full bg-white/10',
        image: 'aspect-video bg-white/10'
    };

    return (
        <div className={`rounded-lg animate-pulse ${variants[variant]} ${className}`} />
    );
};

export const SkeletonCard = () => (
    <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6 space-y-4">
        <Skeleton variant="image" />
        <Skeleton variant="title" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
        <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
        </div>
    </div>
);

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    };

    return (
        <div className={`${sizes[size]} border-white/20 border-t-green-500 rounded-full animate-spin ${className}`} />
    );
};

export const EmptyState = ({
    icon: Icon,
    title,
    description,
    action,
    className = ''
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col items-center justify-center text-center py-12 ${className}`}
    >
        {Icon && (
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-gray-400" />
            </div>
        )}
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        {description && <p className="text-gray-400 mb-6 max-w-md">{description}</p>}
        {action}
    </motion.div>
);

export default Skeleton;
