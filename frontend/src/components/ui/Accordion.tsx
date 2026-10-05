import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleIndex = (index: number) => {
    setOpenIndexes((prev) => {
      if (allowMultiple) {
        return prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index];
      } else {
        return prev.includes(index) ? [] : [index];
      }
    });
  };

  return (
    <div className={`flex flex-col border border-border-main rounded-2xl overflow-hidden bg-primary-bg ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndexes.includes(idx);
        const isLast = idx === items.length - 1;

        return (
          <div key={idx} className={`${!isLast ? 'border-b border-border-main' : ''}`}>
            <button
              onClick={() => toggleIndex(idx)}
              className="w-full flex items-center justify-between px-6 py-4.5 hover:bg-surface-bg/50 transition-main text-left cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                {item.icon && <span className="text-text-secondary">{item.icon}</span>}
                <span className="text-sm font-bold text-text-primary">{item.title}</span>
              </div>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-text-muted shrink-0"
              >
                <ChevronDown size={18} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <div className="px-6 pb-5 text-sm text-text-secondary leading-relaxed text-left">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
