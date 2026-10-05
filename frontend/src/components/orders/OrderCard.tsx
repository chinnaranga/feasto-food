import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, RefreshCw, ChevronRight } from 'lucide-react';
import type { Order } from '@/store/userStore';
import { useCartStore } from '@/store/cartStore';
import { OrderStatusBadge } from './OrderStatusBadge';
import { useToastStore } from '@/store/toastStore';
import { useTrackEvent } from '@/hooks/analytics/useTrackEvent';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const trackEvent = useTrackEvent();
  const { addToast } = useToastStore();
  const { addItem } = useCartStore();

  const handleReorder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    order.items.forEach((item) => {
      // Re-create items with a fresh timestamp key
      addItem({
        ...item,
        cartItemId: `${item.restaurantId}-${item.item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      });
      trackEvent('add_to_cart', {
        itemId: item.item.id,
        itemName: item.item.name,
        price: item.unitPrice,
        restaurantId: item.restaurantId,
        quantity: item.quantity,
        addons: item.selectedAddons.map((sa) => sa.addonName),
      });
    });
    trackEvent('hero_cta_click', { ctaLabel: 'Reorder Items', section: 'order_card' });
    addToast({ message: 'Items added back to your cart! 🛒', type: 'success' });
  };

  const active = order.status !== 'delivered' && order.status !== 'cancelled';
  const displayItemsText = order.items
    .map((i) => `${i.quantity}× ${i.item.name}`)
    .join(', ');

  const dateStr = new Date(order.placedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-primary-bg border border-border-main hover:border-[#cbd5e1] rounded-2xl p-5 shadow-soft hover:shadow-medium transition-main">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="text-left">
          <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider">
            {order.restaurantName}
          </span>
          <p className="text-[11px] text-text-muted mt-0.5">{dateStr}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="text-left py-3 border-t border-b border-border-main/50 mb-4">
        <p className="text-xs text-text-primary font-bold truncate">
          {displayItemsText || 'Reorder details preview'}
        </p>
        <div className="flex justify-between items-center mt-2 text-xs">
          <span className="text-text-muted">Total Paid</span>
          <span className="font-black text-text-primary font-heading">₹{order.total}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-between">
        {active ? (
          <Link
            to={`/orders/${order.id}/track`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-orange hover:bg-[#c94804] text-white text-xs font-bold rounded-xl transition-main"
          >
            <Clock size={12} />
            <span>Track Order</span>
          </Link>
        ) : (
          <button
            onClick={handleReorder}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-secondary-bg hover:bg-surface-bg border border-border-main text-text-primary text-xs font-bold rounded-xl transition-main cursor-pointer"
          >
            <RefreshCw size={12} className="text-brand-orange" />
            <span>Reorder Items</span>
          </button>
        )}

        <Link
          to={`/orders/${order.id}`}
          className="px-3 py-2 bg-secondary-bg hover:bg-surface-bg border border-border-main text-text-muted hover:text-text-primary rounded-xl transition-main flex items-center justify-center"
          aria-label="View Order details"
        >
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
};
