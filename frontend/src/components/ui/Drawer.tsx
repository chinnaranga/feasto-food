import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  showHeader?: boolean;
  className?: string;
  overlayClassName?: string;
  zIndexClass?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  showHeader = true,
  className = '',
  overlayClassName = '',
  zIndexClass = 'z-[400]',
}) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const slideVariants = {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
      classes: 'left-0 top-0 bottom-0 h-full w-full max-w-sm border-r',
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      classes: 'right-0 top-0 bottom-0 h-full w-full max-w-sm border-l',
    },
    top: {
      initial: { y: '-100%' },
      animate: { y: 0 },
      exit: { y: '-100%' },
      classes: 'top-0 left-0 right-0 w-full max-h-[80vh] border-b',
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
      classes: 'bottom-0 left-0 right-0 w-full max-h-[80vh] border-t',
    },
  };

  const selected = slideVariants[position];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 flex ${zIndexClass}`}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm cursor-pointer z-0 ${overlayClassName}`}
          />

          {/* Drawer content */}
          <motion.div
            initial={selected.initial}
            animate={selected.animate}
            exit={selected.exit}
            transition={{ type: 'tween', duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bg-white border-border-main shadow-modal flex flex-col z-10 ${selected.classes} ${className}`}
          >
            {/* Header (optional) */}
            {showHeader && (
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-border-main shrink-0">
                {title ? (
                  <h3 className="text-base font-semibold text-text-primary font-heading tracking-tight">{title}</h3>
                ) : (
                  <div />
                )}
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  className="p-1.5 text-text-muted hover:text-text-primary rounded-full hover:bg-neutral-100 transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 px-6 py-5 overflow-y-auto text-left">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
