import React from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'line' | 'pill';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'line',
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-1 overflow-x-auto scrollbar-none select-none border-b border-border-main p-1 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-main cursor-pointer focus-ring rounded-lg
              ${
                variant === 'line'
                  ? 'text-text-secondary hover:text-text-primary'
                  : isActive
                    ? 'text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-[#eef1f6]/50'
              }`}
          >
            {/* Background pill animation */}
            {isActive && variant === 'pill' && (
              <motion.div
                layoutId="active-pill-tab"
                className="absolute inset-0 bg-brand-orange rounded-lg z-0"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            {/* Slider line animation */}
            {isActive && variant === 'line' && (
              <motion.div
                layoutId="active-line-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && <span className="w-4 h-4 flex items-center justify-center">{tab.icon}</span>}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
