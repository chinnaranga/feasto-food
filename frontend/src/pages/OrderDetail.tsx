import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer, ShieldQuestion, RefreshCw } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { useUserStore } from '@/store/userStore';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { activeOrders, pastOrders } = useUserStore();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  const order = activeOrders.find((o) => o.id === id) || pastOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen bg-primary-bg flex flex-col items-center justify-center gap-4 text-center">
        <span className="text-5xl">📄</span>
        <h2 className="text-lg font-bold text-text-primary">Order not found</h2>
        <Link to="/orders" className="text-sm font-bold text-brand-orange hover:underline">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const handleReorder = () => {
    order.items.forEach((item) => {
      addItem({
        ...item,
        cartItemId: `${item.restaurantId}-${item.item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      });
    });
    addToast({ message: 'Items added back to your cart! 🛒', type: 'success' });
  };

  const handlePrint = () => {
    window.print();
  };

  const dateStr = new Date(order.placedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-primary-bg min-h-screen pb-20">
      {/* Header */}
      <div className="bg-secondary-bg border-b border-border-main py-6 print:hidden">
        <Container>
          <Link to="/orders" className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-text-primary mb-4 transition-main">
            <ArrowLeft size={14} /> Back to Orders
          </Link>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-black font-heading text-text-primary tracking-tight">
                Order Receipt
              </h1>
              <p className="text-xs text-text-secondary mt-0.5">{order.id} · Placed on {dateStr}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint} className="rounded-xl flex items-center gap-1 text-xs">
                <Printer size={12} />
                <span>Print</span>
              </Button>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 bg-secondary-bg/30 border border-border-main p-6 sm:p-8 rounded-3xl shadow-soft"
        >
          {/* Restaurant Header */}
          <div className="text-left">
            <span className="text-[10px] font-extrabold text-brand-orange uppercase tracking-widest">
              From Restaurant
            </span>
            <h2 className="text-lg font-black font-heading text-text-primary mt-1">
              {order.restaurantName}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">Delivered to: {order.address.label} ({order.address.fullAddress})</p>
          </div>

          {/* Item List */}
          <div className="border-t border-b border-border-main py-4 flex flex-col gap-4">
            <p className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest text-left">Items Ordered</p>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start gap-4 text-xs">
                <div className="text-left min-w-0">
                  <p className="font-bold text-text-primary">
                    {item.quantity}× {item.item.name}
                  </p>
                  {item.selectedAddons.length > 0 && (
                    <p className="text-[10px] text-text-secondary mt-0.5">
                      + {item.selectedAddons.map((a) => a.addonName).join(', ')}
                    </p>
                  )}
                  {item.spiceLevel && item.spiceLevel !== 'mild' && (
                    <p className="text-[10px] text-text-secondary mt-0.5">Spice: {item.spiceLevel}</p>
                  )}
                  {item.specialInstructions && (
                    <p className="text-[10px] text-text-muted italic mt-0.5">"{item.specialInstructions}"</p>
                  )}
                </div>
                <span className="font-bold text-text-primary shrink-0">₹{item.totalPrice}</span>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="flex flex-col gap-2.5 text-xs border-b border-border-main pb-4">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span className="font-bold text-text-primary">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Delivery Fee</span>
              <span className="font-bold text-text-primary">₹{order.deliveryFee}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>GST & Taxes</span>
              <span className="font-bold text-text-primary">₹{order.taxes}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discounts applied</span>
                <span>−₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-sm text-text-primary pt-2">
              <span>Grand Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>

          {/* Payment & Logistics details */}
          <div className="grid grid-cols-2 gap-4 text-xs border-b border-border-main pb-4 text-left">
            <div>
              <p className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest mb-1">Payment Method</p>
              <p className="font-bold text-text-primary uppercase">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest mb-1">Estimated Preparation</p>
              <p className="font-bold text-text-primary">ASAP Delivery</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 print:hidden">
            <Button variant="primary" onClick={handleReorder} className="flex-1 justify-center rounded-xl py-2.5 font-bold shadow-soft flex items-center gap-1.5 text-xs">
              <RefreshCw size={12} />
              <span>Reorder Entire Meal</span>
            </Button>
            <Link to="/profile" className="flex-1">
              <Button variant="outline" className="w-full justify-center rounded-xl py-2.5 font-bold text-xs flex items-center gap-1.5">
                <ShieldQuestion size={12} />
                <span>Contact Support</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};
