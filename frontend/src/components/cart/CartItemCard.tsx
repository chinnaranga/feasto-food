import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CartItem } from '@/store/cartStore';
import { useCartStore } from '@/store/cartStore';
import { QuantitySelector } from '@/components/menu/QuantitySelector';
import { useTrackEvent } from '@/hooks/analytics/useTrackEvent';

interface CartItemCardProps {
  cartItem: CartItem;
  index?: number;
}

const SPICE_ICONS: Record<string, string> = {
  mild: '😌',
  medium: '🌶',
  hot: '🔥',
  'extra-hot': '💀',
};

export const CartItemCard: React.FC<CartItemCardProps> = ({ cartItem, index = 0 }) => {
  const trackEvent = useTrackEvent();
  const { updateQuantity, removeItem } = useCartStore();

  const addonsText = cartItem.selectedAddons.length > 0
    ? cartItem.selectedAddons.map((a) => a.addonName).join(', ')
    : null;

  const spiceText = cartItem.spiceLevel && cartItem.spiceLevel !== 'mild'
    ? `${SPICE_ICONS[cartItem.spiceLevel] ?? ''} ${cartItem.spiceLevel}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
      layout
      className="group flex items-start justify-between gap-4 p-4 bg-primary-bg hover:bg-secondary-bg/40 border border-border-main rounded-2xl transition-main"
    >
      {/* Emoji + Info */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-secondary-bg border border-border-main flex items-center justify-center text-2xl shrink-0 select-none">
          {cartItem.item.emoji ?? '🍽️'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <h4 className="text-sm font-bold text-text-primary leading-snug truncate">{cartItem.item.name}</h4>
            <span className="text-sm font-black text-text-primary font-heading shrink-0">₹{cartItem.totalPrice}</span>
          </div>

          <p className="text-xs text-text-muted mb-2">
            ₹{cartItem.unitPrice} each
          </p>

          {/* Customizations */}
          <div className="flex flex-col gap-0.5 mb-3">
            {addonsText && (
              <span className="text-[10px] text-text-secondary font-medium truncate">
                + {addonsText}
              </span>
            )}
            {spiceText && (
              <span className="text-[10px] text-text-secondary font-medium">{spiceText}</span>
            )}
            {cartItem.specialInstructions && (
              <span className="text-[10px] text-text-muted italic truncate">
                "{cartItem.specialInstructions}"
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-3">
            <QuantitySelector
              value={cartItem.quantity}
              onChange={(qty) => {
                updateQuantity(cartItem.cartItemId, qty);
                trackEvent('add_to_cart', {
                  itemId: cartItem.item.id,
                  itemName: cartItem.item.name,
                  price: cartItem.unitPrice,
                  restaurantId: cartItem.restaurantId,
                  quantity: qty,
                  addons: cartItem.selectedAddons.map((sa) => sa.addonName),
                });
              }}
              size="sm"
            />
            <button
              onClick={() => {
                removeItem(cartItem.cartItemId);
                trackEvent('add_to_cart', {
                  itemId: cartItem.item.id,
                  itemName: cartItem.item.name,
                  price: cartItem.unitPrice,
                  restaurantId: cartItem.restaurantId,
                  quantity: 0,
                  addons: cartItem.selectedAddons.map((sa) => sa.addonName),
                });
              }}
              className="flex items-center gap-1 text-[10px] font-bold text-text-muted hover:text-red-500 transition-main cursor-pointer"
              aria-label="Remove item"
            >
              <Trash2 size={12} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Restaurant group header ─────────────────────────────────────────────────
interface CartRestaurantGroupProps {
  restaurantId: string;
  restaurantName: string;
}

export const CartRestaurantGroup: React.FC<CartRestaurantGroupProps> = ({
  restaurantId,
  restaurantName,
}) => (
  <div className="flex items-center justify-between gap-3 mb-3">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-brand-orange" />
      <span className="text-xs font-extrabold text-text-primary uppercase tracking-wide">
        {restaurantName}
      </span>
    </div>
    <Link
      to={`/restaurants/${restaurantId}`}
      className="flex items-center gap-1 text-[10px] font-bold text-brand-orange hover:text-[#c94804] transition-main"
    >
      <span>View Menu</span>
      <ChevronRight size={10} />
    </Link>
  </div>
);
