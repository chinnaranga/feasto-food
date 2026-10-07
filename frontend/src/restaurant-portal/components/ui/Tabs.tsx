import React from 'react';

export interface TabOption {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex border-b border-[#141518]/15 gap-4 sm:gap-6 select-none bg-[#FAF8F5] px-2 pt-2">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`pb-3 text-xs font-mono uppercase tracking-wider transition-all duration-150 relative cursor-pointer ${
              active ? 'text-[#141518] font-bold' : 'text-[#52555F] hover:text-[#141518]'
            }`}
          >
            <span className="flex items-center gap-2">
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-mono font-bold ${
                    active
                      ? 'bg-[#141518] text-[#D7F04A]'
                      : 'bg-[#141518]/10 text-[#52555F]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </span>
            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#141518]" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
