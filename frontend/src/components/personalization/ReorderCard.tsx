import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';
import { Order } from '@/store/userStore';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { useNavigate } from 'react-router-dom';

interface ReorderCardProps {
  order: Order;
  reason: string;
  onDismiss?: () => void;
}

export const ReorderCard: React.FC<ReorderCardProps> = ({ order, reason, onDismiss }) => {
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const handleReorder = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Add all items to cart
    order.items.forEach((item) => {
      addItem(item);
    });

    addToast({
      message: `Readded ${order.items.length} items from ${order.restaurantName} to cart!`,
      type: 'success',
    });
    navigate('/cart');
  };

  const itemNames = order.items.map((i) => `${i.quantity}x ${i.item.name}`).join(', ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-brand-orange/[0.03] to-white border border-brand-orange/15 rounded-2xl text-left hover:border-brand-orange/30 shadow-xs transition-main w-full"
    >
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2.5 right-2.5 p-1 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition-main cursor-pointer"
          aria-label="Dismiss reorder shortcut"
        >
          <X size={12} />
        </button>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1 pr-6">
          <span className="text-xl select-none" role="img" aria-label={order.restaurantName}>
            🍴
          </span>
          <h4 className="text-xs font-bold text-text-primary truncate">
            Repeat last order from {order.restaurantName}
          </h4>
          <span className="text-[9px] font-bold text-brand-orange bg-brand-orange/5 border border-brand-orange/15 px-1.5 py-0.5 rounded uppercase tracking-wider">
            Quick Buy
          </span>
        </div>
        
        <p className="text-[10px] text-text-muted truncate mb-2">
          {itemNames || 'Customized items meal'}
        </p>

        {reason && (
          <p className="text-[10px] font-bold text-brand-orange flex items-center gap-1.5">
            ⚡ <span>{reason}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 pr-2 shrink-0">
        <span className="text-xs font-extrabold text-text-primary mr-1">
          ₹{order.total}
        </span>
        <button
          onClick={handleReorder}
          className="flex items-center gap-1.5 px-3 py-2 bg-brand-orange text-white hover:bg-brand-orange-dark rounded-xl text-[10px] font-extrabold transition-main shadow-xs cursor-pointer uppercase tracking-wider"
        >
          <RotateCcw size={11} strokeWidth={3} />
          <span>Reorder</span>
        </button>
      </div>
    </motion.div>
  );
};
