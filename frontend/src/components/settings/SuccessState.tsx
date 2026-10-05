import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SuccessStateProps {
  title: string;
  message: string;
  onClose?: () => void;
  closeLabel?: string;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  title,
  message,
  onClose,
  closeLabel = 'Dismiss',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-6 text-center flex flex-col items-center justify-center bg-primary-bg rounded-2xl border border-border-main shadow-medium"
    >
      <div className="w-12 h-12 bg-success-main/10 text-success-main rounded-full flex items-center justify-center mb-4">
        <CheckCircle size={24} />
      </div>
      <h3 className="font-extrabold text-sm text-text-primary mb-1 font-heading tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-text-secondary leading-relaxed max-w-xs mb-5">
        {message}
      </p>
      {onClose && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="rounded-xl text-xs font-bold px-5 border border-border-main"
        >
          {closeLabel}
        </Button>
      )}
    </motion.div>
  );
};
