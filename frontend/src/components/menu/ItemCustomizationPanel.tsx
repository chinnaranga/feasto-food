import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, MessageSquare } from 'lucide-react';
import { useMenuStore } from '@/store/menuStore';
import { useCartStore } from '@/store/cartStore';
import { useTrackEvent } from '@/hooks/analytics/useTrackEvent';
import type { CartItem } from '@/store/cartStore';
import { QuantitySelector } from './QuantitySelector';
import { DietaryBadge } from '@/components/discovery/DietaryBadge';
import { NutritionTag } from '@/components/discovery/NutritionTag';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/store/toastStore';
import { MOCK_RESTAURANTS } from '@/data/restaurants';

const SPICE_LEVELS = [
  { id: 'mild', label: '😌 Mild', desc: 'No heat' },
  { id: 'medium', label: '🌶 Medium', desc: 'Subtle warmth' },
  { id: 'hot', label: '🔥 Hot', desc: 'Noticeably spicy' },
  { id: 'extra-hot', label: '💀 Extra Hot', desc: 'Bring the fire' },
];

export const ItemCustomizationPanel: React.FC = () => {
  const trackEvent = useTrackEvent();
  const {
    customizingItem,
    closeCustomization,
    setQuantity,
    toggleAddon,
    setSpiceLevel,
    setSpecialInstructions,
  } = useMenuStore();
  const { addToast } = useToastStore();

  const { addItem } = useCartStore();

  if (!customizingItem) return null;
  const { item, restaurantId, quantity, selectedAddons, spiceLevel, specialInstructions, totalPrice } = customizingItem;

  const handleAddToCart = () => {
    const restaurant = MOCK_RESTAURANTS.find((r) => r.id === restaurantId);
    const unitPrice = item.price + selectedAddons.reduce((s, a) => s + a.addon.price, 0);
    const cartItem: CartItem = {
      cartItemId: `${restaurantId}-${item.id}-${Date.now()}`,
      restaurantId,
      restaurantName: restaurant?.name ?? restaurantId,
      item,
      quantity,
      selectedAddons: selectedAddons.map((sa) => ({
        groupId: sa.groupId,
        groupName: sa.groupName,
        addonId: sa.addon.id,
        addonName: sa.addon.name,
        addonPrice: sa.addon.price,
      })),
      spiceLevel,
      specialInstructions,
      unitPrice,
      totalPrice,
    };
    addItem(cartItem);
    trackEvent('add_to_cart', {
      itemId: item.id,
      itemName: item.name,
      price: unitPrice,
      restaurantId,
      quantity,
      addons: selectedAddons.map((sa) => sa.addon.name),
    });
    addToast({ message: `${item.name} added to cart!`, type: 'success' });
    closeCustomization();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCustomization}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-[#101218] border border-[#1F2232] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col text-[#F4F5F7]"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 p-6 border-b border-[#1F2232] sticky top-0 bg-[#101218]/95 backdrop-blur-md z-10">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {item.isPopular && <span className="text-[10px] font-extrabold text-[#4FD1E8] bg-[#171923] border border-[#25293A] px-2 py-0.5 rounded-lg uppercase tracking-wide">Popular</span>}
                {item.isFeatured && <span className="text-[10px] font-extrabold text-[#A78BFA] bg-[#171923] border border-[#25293A] px-2 py-0.5 rounded-lg uppercase tracking-wide">Featured</span>}
              </div>
              <h2 className="text-lg font-black text-[#F4F5F7] tracking-tight">{item.name}</h2>
              <p className="text-sm text-[#A7ACB8] mt-0.5">{item.description}</p>
            </div>
            <button
              onClick={closeCustomization}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#171923] hover:bg-[#1F2232] border border-[#25293A] text-[#A7ACB8] hover:text-[#F4F5F7] transition-all cursor-pointer shrink-0"
              aria-label="Close customization"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex-1 p-6 flex flex-col gap-6">
            {/* Tags & Nutrition */}
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => <DietaryBadge key={tag} tag={tag} />)}
              {item.nutrition && <NutritionTag nutrition={item.nutrition} compact />}
            </div>

            {/* Full Nutrition if available */}
            {item.nutrition && (
              <div>
                <p className="text-[10px] font-extrabold text-[#6F7480] uppercase tracking-widest mb-2">Nutrition</p>
                <NutritionTag nutrition={item.nutrition} />
              </div>
            )}

            {/* Spice Level (only if item has spiceLevel) */}
            {item.spiceLevel !== undefined && (
              <div>
                <p className="text-[10px] font-extrabold text-[#6F7480] uppercase tracking-widest mb-3">Spice Level</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SPICE_LEVELS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSpiceLevel(s.id)}
                      className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer
                        ${spiceLevel === s.id
                          ? 'bg-[#6D5EF5] text-white border-[#6D5EF5] shadow-md shadow-[#6D5EF5]/20'
                          : 'bg-[#141720] text-[#A7ACB8] border-[#1F2232] hover:border-[#6D5EF5]/40 hover:text-[#F4F5F7]'
                        }`}
                    >
                      <span className="text-base">{s.label.split(' ')[0]}</span>
                      <span className="truncate">{s.label.split(' ').slice(1).join(' ')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add-on Groups */}
            {item.addonGroups?.filter(g => g.id !== 'spice').map((group) => {
              const groupSelected = selectedAddons.filter((sa) => sa.groupId === group.id);
              return (
                <div key={group.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-[10px] font-extrabold text-[#6F7480] uppercase tracking-widest">{group.name}</p>
                    {group.required && <span className="text-[9px] font-bold text-[#4FD1E8] bg-[#171923] border border-[#25293A] px-1.5 py-0.5 rounded uppercase tracking-wide">Required</span>}
                    {group.maxSelections > 1 && <span className="text-[9px] text-[#6F7480] font-medium">Up to {group.maxSelections}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    {group.options.map((opt) => {
                      const isSelected = groupSelected.some((sa) => sa.addon.id === opt.id);
                      return (
                        <button
                          key={opt.id}
                          onClick={() => toggleAddon(group.id, group.name, opt, group.maxSelections)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer
                            ${isSelected
                              ? 'bg-[#171923] border-[#6D5EF5]/60 text-[#F4F5F7] shadow-xs'
                              : 'bg-[#141720] border-[#1F2232] hover:border-[#25293A] text-[#A7ACB8]'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                              ${isSelected ? 'bg-[#6D5EF5] border-[#6D5EF5]' : 'border-[#25293A]'}`}>
                              {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </span>
                            <span className="font-semibold">{opt.name}</span>
                          </div>
                          {opt.price > 0 && (
                            <span className="font-bold text-[#F4F5F7]">+₹{opt.price}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Special Instructions */}
            <div>
              <p className="text-[10px] font-extrabold text-[#6F7480] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <MessageSquare size={10} className="text-[#4FD1E8]" /> Notes to Chef
              </p>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any allergies, preferences, or special requests…"
                maxLength={300}
                rows={3}
                className="w-full px-4 py-3 bg-[#0B0D14] border border-[#25293A] focus:border-[#6D5EF5] focus:ring-1 focus:ring-[#6D5EF5] rounded-xl text-sm text-[#F4F5F7] placeholder-[#6F7480] resize-none transition-all focus:outline-none"
              />
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 bg-[#101218]/95 backdrop-blur-md border-t border-[#1F2232] p-5 flex items-center justify-between gap-4">
            <QuantitySelector value={quantity} onChange={setQuantity} size="lg" />
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 justify-center rounded-xl py-3 font-bold shadow-md shadow-[#6D5EF5]/20 text-sm flex items-center gap-2 bg-[#6D5EF5] hover:bg-[#5B4BE8] text-white transition-colors"
            >
              <ShoppingCart size={15} />
              <span>Add to Cart — ₹{totalPrice}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ItemCustomizationPanel;
