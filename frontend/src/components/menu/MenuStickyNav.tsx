import React, { useRef, useEffect } from 'react';
import type { MenuCategory } from '@/data/restaurants';

interface MenuStickyNavProps {
  categories: MenuCategory[];
  activeCategoryId: string;
  onSelect: (id: string) => void;
}

export const MenuStickyNav: React.FC<MenuStickyNavProps> = ({
  categories,
  activeCategoryId,
  onSelect,
}) => {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeCategoryId]);

  return (
    <div className="sticky top-16 z-30 bg-[#08090D]/90 backdrop-blur-xl border-b border-[#1F2232]">
      <div className="flex items-center gap-1.5 overflow-x-auto px-4 sm:px-6 py-3 no-scrollbar max-w-7xl mx-auto">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              ref={isActive ? activeRef : undefined}
              onClick={() => onSelect(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap
                ${isActive
                  ? 'bg-[#6D5EF5] text-white border-[#6D5EF5] shadow-md shadow-[#6D5EF5]/20'
                  : 'bg-[#101218] text-[#A7ACB8] border-[#1F2232] hover:border-[#25293A] hover:text-[#F4F5F7]'
                }`}
            >
              {cat.emoji && <span className="mr-1.5">{cat.emoji}</span>}
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MenuStickyNav;
