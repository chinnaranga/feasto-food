import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';

export const FloatingCartObject: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { items, getTotal, getItemCount } = useCartStore();

  const totalCount = getItemCount();
  const grandTotal = getTotal();

  // Suppress on checkout, cart, or auth pages where user is already focusing on checkout
  if (
    items.length === 0 ||
    location.pathname.startsWith('/checkout') ||
    location.pathname === '/cart' ||
    location.pathname.startsWith('/auth')
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[400] select-none">
      {/* Expanded Ticket View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="mb-3 w-80 bg-[#141518] text-[#F3F0E8] border border-black/20 rounded-2xl p-5 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 hairline-b mb-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8D98]">
                  YOUR ORDER
                </span>
                <h4 className="font-heading font-bold text-sm text-[#F3F0E8]">
                  {items[0]?.restaurantName || 'Feasto Kitchen'}
                </h4>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center font-mono text-xs hover:bg-white hover:text-black transition-colors"
              >
                ×
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto flex flex-col gap-2.5 mb-4 pr-1">
              {items.map((item) => (
                <div key={item.cartItemId} className="flex items-start justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-[#D7F04A] font-bold">
                      {item.quantity}×
                    </span>
                    <span className="font-sans text-[#F3F0E8] line-clamp-1">
                      {item.item.name}
                    </span>
                  </div>
                  <span className="font-mono text-[#F3F0E8] shrink-0">
                    ₹{item.totalPrice}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 hairline-t mb-4 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8A8D98]">Total</span>
              <span className="font-mono text-base font-bold text-[#D7F04A]">₹{grandTotal}</span>
            </div>

            <div className="flex gap-2">
              <Link
                to="/cart"
                onClick={() => setIsExpanded(false)}
                className="flex-1 py-2.5 text-center text-xs font-heading font-bold text-[#F3F0E8] border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
              >
                View Bag
              </Link>
              <Link
                to="/checkout"
                onClick={() => setIsExpanded(false)}
                className="flex-1 py-2.5 text-center text-xs font-heading font-bold bg-[#D7F04A] text-[#141518] rounded-xl hover:bg-white transition-colors"
              >
                Checkout →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Trigger */}
      <motion.button
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-3 bg-[#141518] text-[#F3F0E8] px-5 py-3 rounded-full border border-black shadow-2xl hover:border-[#D7F04A] transition-all group focus:outline-none"
      >
        <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-[#D7F04A] text-[#141518] font-bold">
          {totalCount} {totalCount === 1 ? 'ITEM' : 'ITEMS'}
        </span>
        <span className="font-heading text-xs font-bold tracking-tight text-[#F3F0E8]">
          ₹{grandTotal}
        </span>
        <span className="text-[11px] font-mono text-[#D7F04A] group-hover:translate-x-0.5 transition-transform">
          {isExpanded ? 'CLOSE ↑' : 'ORDER →'}
        </span>
      </motion.button>
    </div>
  );
};
