import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { PersonalizedMenuItem } from '@/types/personalization';
import { useCartStore } from '@/store/cartStore';
import { usePersonalizationStore } from '@/store/personalization/personalizationStore';
import { useToastStore } from '@/store/toastStore';
import { WhyRecommendedLabel } from './WhyRecommendedLabel';
import { PersonalizationBadge } from './PersonalizationBadge';

interface SmartPickCardProps {
  pick: PersonalizedMenuItem;
}

export const SmartPickCard: React.FC<SmartPickCardProps> = ({ pick }) => {
  const { addItem } = useCartStore();
  const { dismissRecommendation } = usePersonalizationStore();
  const { addToast } = useToastStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cartItemId = `${pick.item.id}-default-any`;
    const cartItem = {
      cartItemId,
      restaurantId: pick.restaurantId,
      restaurantName: pick.restaurantName,
      item: pick.item,
      quantity: 1,
      selectedAddons: [],
      spiceLevel: 'any',
      specialInstructions: '',
      unitPrice: pick.item.price,
      totalPrice: pick.item.price,
    };
    addItem(cartItem);
    addToast({
      message: `${pick.item.name} added to cart!`,
      type: 'success',
    });
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    dismissRecommendation(pick.item.id);
    addToast({
      message: 'Suggestion hidden. Feasto will adapt next time.',
      type: 'info',
    });
  };

  const bestReason = pick.reasons[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative flex flex-col justify-between p-4 bg-primary-bg border border-border-main hover:border-brand-orange/30 rounded-2xl shadow-xs hover:shadow-soft transition-main w-[240px] shrink-0 text-left"
    >
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2.5 right-2.5 p-1 bg-secondary-bg hover:bg-[#fee2e2] text-text-muted hover:text-red-600 rounded-lg transition-main cursor-pointer"
        aria-label="Dismiss recommendation"
      >
        <X size={12} />
      </button>

      <div>
        {/* Match and Confidence Badge */}
        <div className="flex items-center gap-2 mb-2">
          <PersonalizationBadge score={pick.score} />
          {pick.item.isPopular && (
            <span className="text-[9px] font-bold text-brand-orange bg-brand-orange/5 border border-brand-orange/15 px-1.5 py-0.5 rounded uppercase">
              Popular
            </span>
          )}
        </div>

        {/* Item emoji & info */}
        <div className="flex items-start gap-2.5 mb-2.5">
          <span className="text-3xl select-none" role="img" aria-label={pick.item.name}>
            {pick.item.emoji || '🍲'}
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-text-primary group-hover:text-brand-orange transition-main truncate pr-2">
              {pick.item.name}
            </h4>
            <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider truncate">
              {pick.restaurantName}
            </p>
          </div>
        </div>

        <p className="text-[10px] text-text-secondary line-clamp-2 leading-relaxed mb-3">
          {pick.item.description}
        </p>
      </div>

      <div>
        {/* Why recommended explanation label */}
        {bestReason && (
          <div className="mb-3">
            <WhyRecommendedLabel category={bestReason.category} text={bestReason.text} />
          </div>
        )}

        {/* Price and Add button */}
        <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-border-main/50">
          <span className="text-xs font-extrabold text-text-primary">
            ₹{pick.item.price}
          </span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange text-white hover:bg-brand-orange-dark rounded-xl text-[10px] font-extrabold transition-main shadow-xs cursor-pointer uppercase"
          >
            <Plus size={11} strokeWidth={3} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
