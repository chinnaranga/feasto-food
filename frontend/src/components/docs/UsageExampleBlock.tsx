import React from 'react';
import { Info, AlertTriangle } from 'lucide-react';

interface UsageExampleBlockProps {
  title: string;
  description: string;
  type?: 'info' | 'warning';
}

export const UsageExampleBlock: React.FC<UsageExampleBlockProps> = ({
  title,
  description,
  type = 'info',
}) => {
  const configs = {
    info: {
      border: 'border-brand-orange/20 bg-brand-orange/[0.01]',
      icon: <Info size={16} className="text-brand-orange" />,
    },
    warning: {
      border: 'border-amber-500/20 bg-amber-500/[0.01]',
      icon: <AlertTriangle size={16} className="text-amber-500 animate-pulse" />,
    },
  };

  const current = configs[type] || configs.info;

  return (
    <div className={`border rounded-2xl p-5 flex gap-3 text-left my-5 ${current.border}`}>
      <div className="shrink-0 mt-0.5">{current.icon}</div>
      <div>
        <h4 className="text-xs font-bold text-text-primary mb-1">{title}</h4>
        <p className="text-[11px] text-text-secondary leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
export default UsageExampleBlock;
