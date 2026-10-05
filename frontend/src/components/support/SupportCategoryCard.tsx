import React from 'react';
import * as Icons from 'lucide-react';
import { useSupportStore } from '@/store/supportStore';

export interface SupportCategory {
  id: string;
  name: string;
  description: string;
  iconName: keyof typeof Icons;
}

interface SupportCategoryCardProps {
  category: SupportCategory;
}

export const SupportCategoryCard: React.FC<SupportCategoryCardProps> = ({ category }) => {
  const { selectedCategory, setSelectedCategory } = useSupportStore();
  const IconComponent = Icons[category.iconName] as React.ComponentType<{ size: number; className?: string }>;
  const isSelected = selectedCategory === category.name;

  return (
    <button
      onClick={() => setSelectedCategory(isSelected ? null : category.name)}
      className={`flex flex-col items-start text-left p-6 bg-primary-bg rounded-2xl border transition-all duration-300 w-full cursor-pointer group shadow-soft
        ${
          isSelected
            ? 'border-brand-orange ring-2 ring-brand-orange/10'
            : 'border-border-main hover:border-brand-orange/30 hover:shadow-medium'
        }`}
    >
      <div
        className={`p-3 rounded-xl mb-4 transition-main
          ${
            isSelected
              ? 'bg-brand-orange text-white'
              : 'bg-secondary-bg text-text-secondary group-hover:bg-brand-orange/5 group-hover:text-brand-orange'
          }`}
      >
        {IconComponent && <IconComponent size={20} />}
      </div>
      <h3 className="font-bold text-sm text-text-primary mb-1 tracking-tight">{category.name}</h3>
      <p className="text-xs text-text-secondary leading-relaxed">{category.description}</p>
    </button>
  );
};
