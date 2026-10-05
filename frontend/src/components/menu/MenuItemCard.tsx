import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock } from 'lucide-react';
import type { MenuItem } from '@/data/restaurants';
import { DietaryBadge } from '@/components/discovery/DietaryBadge';
import { NutritionTag } from '@/components/discovery/NutritionTag';
import { RecommendationBadge } from '@/components/discovery/NutritionTag';
import { useMenuStore } from '@/store/menuStore';
import { useTrackEvent } from '@/hooks/analytics/useTrackEvent';

interface MenuItemCardProps {
  item: MenuItem;
  restaurantId: string;
  index?: number;
}

const SPICE_ICONS: Record<string, string> = {
  mild: '😌',
  medium: '🌶',
  hot: '🔥',
  'extra-hot': '💀',
};

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, restaurantId, index = 0 }) => {
  const trackEvent = useTrackEvent();
  const { openCustomization } = useMenuStore();
  const isUnavailable = item.isAvailable === false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
      className={`group relative flex items-start justify-between gap-4 p-4 bg-[#101218] hover:bg-[#141720] border border-[#1F2232] hover:border-[#6D5EF5]/40 rounded-2xl transition-all ${isUnavailable ? 'opacity-50' : ''}`}
    >
      {/* Left: Info */}
      <div className="flex-1 min-w-0">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
          {item.isPopular && (
            <span className="text-[9px] font-extrabold text-[#4FD1E8] bg-[#171923] border border-[#25293A] px-1.5 py-0.5 rounded uppercase tracking-wide">
              🔥 Popular
            </span>
          )}
          {item.isFeatured && (
            <span className="text-[9px] font-extrabold text-[#A78BFA] bg-[#171923] border border-[#25293A] px-1.5 py-0.5 rounded uppercase tracking-wide">
              ⭐ Featured
            </span>
          )}
          {item.isRecommended && (
            <span className="text-[9px] font-extrabold text-[#2DD4BF] bg-[#171923] border border-[#25293A] px-1.5 py-0.5 rounded uppercase tracking-wide">
              👍 Recommended
            </span>
          )}
          {item.aiMatch !== undefined && <RecommendationBadge score={item.aiMatch} />}
        </div>

        {/* Name */}
        <h4 className="text-sm font-bold text-[#F4F5F7] group-hover:text-[#4FD1E8] transition-colors leading-snug mb-1">
          {item.emoji && <span className="mr-1.5">{item.emoji}</span>}
          {item.name}
        </h4>

        {/* Description */}
        <p className="text-xs text-[#A7ACB8] leading-relaxed mb-2 line-clamp-2">
          {item.description}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-2">
          {item.cookingTime && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#6F7480]">
              <Clock size={10} />
              {item.cookingTime} min
            </span>
          )}
          {item.spiceLevel && item.spiceLevel !== 'mild' && (
            <span className="text-[10px] font-semibold text-[#6F7480]">
              {SPICE_ICONS[item.spiceLevel]} {item.spiceLevel}
            </span>
          )}
          {item.nutrition && <NutritionTag nutrition={item.nutrition} compact />}
        </div>

        {/* Dietary tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <DietaryBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>

      {/* Right: Price + Add */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-base font-black text-[#F4F5F7]">₹{item.price}</span>
        {!isUnavailable ? (
          <button
            onClick={() => {
              openCustomization(item, restaurantId);
              trackEvent('menu_item_click', {
                itemId: item.id,
                itemName: item.name,
                price: item.price,
                restaurantId,
              });
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#6D5EF5] hover:bg-[#5B4BE8] text-white shadow-md shadow-[#6D5EF5]/25 transition-all cursor-pointer hover:scale-105"
            aria-label={`Customize and add ${item.name}`}
          >
            <Plus size={14} />
          </button>
        ) : (
          <span className="text-[10px] font-bold text-[#6F7480] bg-[#141720] border border-[#1F2232] px-2 py-1 rounded-lg">
            Unavailable
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default MenuItemCard;
