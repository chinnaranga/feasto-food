import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useToastStore, ToastItem } from '@/store/toastStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-6 right-6 z-[5000] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastCardProps {
  toast: ToastItem;
  onClose: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onClose }) => {
  const { id, type, message, duration = 4000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-[#16a34a]" size={20} />,
    error: <AlertCircle className="text-[#dc2626]" size={20} />,
    info: <Info className="text-[#2563eb]" size={20} />,
    warning: <AlertCircle className="text-[#f59e0b]" size={20} />,
  };

  const bgColors = {
    success: 'bg-[#f0fdf4] border-[#dcfce7] dark:bg-[#16a34a]/10 dark:border-[#16a34a]/20',
    error: 'bg-[#fef2f2] border-[#fee2e2] dark:bg-[#dc2626]/10 dark:border-[#dc2626]/20',
    info: 'bg-[#eff6ff] border-[#dbeafe] dark:bg-[#2563eb]/10 dark:border-[#2563eb]/20',
    warning: 'bg-[#fffbeb] border-[#fef3c7] dark:bg-[#f59e0b]/10 dark:border-[#f59e0b]/20',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-floating backdrop-blur-md ${bgColors[type]}`}
    >
      <div className="shrink-0 pt-0.5">{icons[type]}</div>
      <div className="flex-1 text-sm font-semibold text-text-primary text-left">
        {message}
      </div>
      <button
        onClick={() => onClose(id)}
        className="shrink-0 p-0.5 text-text-muted hover:text-text-primary rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-main cursor-pointer"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast);
  return {
    success: (message: string, duration?: number) => addToast({ type: 'success', message, duration }),
    error: (message: string, duration?: number) => addToast({ type: 'error', message, duration }),
    info: (message: string, duration?: number) => addToast({ type: 'info', message, duration }),
    warning: (message: string, duration?: number) => addToast({ type: 'warning', message, duration }),
  };
};
