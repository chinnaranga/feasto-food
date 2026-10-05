import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import type { OrderStatus } from '@/store/userStore';
import { LiveRadarMapCanvas } from '@/components/orders/LiveRadarMapCanvas';

export const OrderTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { activeOrders, pastOrders, updateOrderStatus } = useUserStore();

  const rawOrder = activeOrders.find((o) => o.id === id) || pastOrders.find((o) => o.id === id);

  // Fallback demo order so live telemetry radar always displays gracefully
  const fallbackOrder = {
    id: id || 'DEMO-4821',
    restaurantName: 'Spice Route Kitchen',
    status: 'dispatched' as OrderStatus,
    eta: 18,
    total: 840,
    address: {
      id: 'addr-demo',
      label: 'Home',
      fullAddress: 'Flat 402, Skyline Towers, Sector 4',
      city: 'Hyderabad',
      pincode: '500081',
      isDefault: true,
    },
    items: [
      {
        cartItemId: 'item-1',
        restaurantId: 'rest-spice',
        restaurantName: 'Spice Route Kitchen',
        item: {
          id: 'm1',
          name: 'Dum Handi Biryani',
          price: 520,
          description: 'Slow-cooked aromatic basmati rice with spice blend',
          category: 'Mains',
          image: '',
          isVeg: false,
          rating: 4.8,
          votes: 210,
        },
        quantity: 1,
        selectedAddons: [],
        spiceLevel: 'Medium',
        specialInstructions: 'Extra spicy salan please',
        unitPrice: 520,
        totalPrice: 520,
      },
      {
        cartItemId: 'item-2',
        restaurantId: 'rest-spice',
        restaurantName: 'Spice Route Kitchen',
        item: {
          id: 'm2',
          name: 'Garlic Butter Naan (2 pcs)',
          price: 160,
          description: 'Fresh clay oven bread with roasted garlic butter',
          category: 'Breads',
          image: '',
          isVeg: true,
          rating: 4.9,
          votes: 340,
        },
        quantity: 2,
        selectedAddons: [],
        spiceLevel: 'Mild',
        specialInstructions: '',
        unitPrice: 160,
        totalPrice: 320,
      },
    ],
  };

  const order = rawOrder || fallbackOrder;

  // Simulated live progress
  useEffect(() => {
    if (!order || order.status === 'delivered' || order.status === 'cancelled') return;

    const sequence: OrderStatus[] = ['placed', 'confirmed', 'preparing', 'dispatched', 'delivered'];
    const currentIdx = sequence.indexOf(order.status);
    let simIdx = currentIdx;

    const interval = setInterval(() => {
      const next = simIdx + 1;
      if (next < sequence.length) {
        updateOrderStatus(order.id, sequence[next], Math.max(0, 30 - next * 7));
        simIdx = next;
      } else {
        clearInterval(interval);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [order, updateOrderStatus]);

  const stages = [
    { key: 'placed', label: 'Order Registered & Verified', desc: 'Financial transaction captured via Razorpay' },
    { key: 'preparing', label: 'Kitchen Firing Order', desc: `Preparing fresh in ${order.restaurantName}` },
    { key: 'dispatched', label: 'Courier In Transit', desc: 'Rider en route via Jubilee Hills Corridor' },
    { key: 'delivered', label: 'Delivered at Door', desc: 'Completed and handed over' },
  ];

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'confirmed':
      case 'preparing':
        return 1;
      case 'dispatched':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 2;
    }
  };

  const currentStageIndex = getStageIndex(order.status);

  return (
    <div className="w-full bg-[#F3F0E8] text-[#141518] selection:bg-[#D7F04A] selection:text-[#141518] min-h-screen pt-24 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
        {/* Top Radar Coordinates */}
        <div className="pb-6 border-b border-[#141518] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 font-mono text-xs">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#52555F] block mb-1">
              Active Courier Radar · Realtime Telemetry
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#141518]">
              {order.restaurantName.toUpperCase()}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#8A8D98]">Ticket #{order.id.slice(-6).toUpperCase()}</span>
            <span className="px-2.5 py-1 bg-[#D7F04A] text-[#141518] font-bold uppercase tracking-wider text-[11px]">
              {order.status === 'delivered' ? 'Completed' : `ETA ${order.eta || 18} MINS`}
            </span>
          </div>
        </div>

        {/* Spatial Grid: Map (Dominant) & Living Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
          {/* Map & Telemetry Canvas (Dominant: 8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Visual Real Interactive Map & Telemetry Surface */}
            <LiveRadarMapCanvas
              restaurantName={order.restaurantName}
              customerAddress={order.address?.fullAddress || 'Flat 402, Skyline Towers'}
              currentStageIndex={currentStageIndex}
              etaMins={order.eta || 18}
              otpCode="4821"
              orderId={order.id}
            />

            {/* Courier Contextual Card */}
            <div className="p-6 bg-white border border-[#E2DED4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#141518] text-[#D7F04A] font-bold text-base flex items-center justify-center shadow-md">
                  RD
                </div>
                <div>
                  <span className="text-[10px] text-[#8A8D98] uppercase">Assigned Courier</span>
                  <h4 className="font-heading font-bold text-sm text-[#141518]">Rider Ranga · 4.9 ★</h4>
                  <span className="text-[11px] text-[#52555F]">Hero Splendor EV · 1,420 Deliveries</span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href="tel:+919876543210"
                  className="btn-graphic-primary text-xs flex-1 sm:flex-initial py-2.5 px-4 text-center"
                >
                  Call Courier
                </a>
              </div>
            </div>
          </div>

          {/* Living Timeline & Order Ticket (Right: 4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Living Timeline */}
            <div className="p-6 bg-white border border-[#141518] flex flex-col gap-6 shadow-sm">
              <div className="pb-2 border-b border-[#E2DED4]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8D98]">
                  Lifecycle
                </span>
                <h3 className="font-heading font-bold text-base text-[#141518]">
                  Living Timeline
                </h3>
              </div>

              <div className="flex flex-col gap-6 relative font-mono text-xs pl-2">
                {stages.map((stage, idx) => {
                  const isDone = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  return (
                    <div key={stage.key} className="flex items-start gap-3 relative">
                      {/* Vertical line connecting stages */}
                      {idx < stages.length - 1 && (
                        <span
                          className={`absolute left-1.5 top-3.5 bottom-0 w-px ${
                            idx < currentStageIndex ? 'bg-[#141518]' : 'bg-[#E2DED4]'
                          }`}
                        />
                      )}
                      {/* Status Dot */}
                      <span
                        className={`w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 border ${
                          isDone
                            ? isCurrent
                              ? 'bg-[#D7F04A] border-[#141518]'
                              : 'bg-[#141518] border-[#141518]'
                            : 'bg-white border-[#E2DED4]'
                        }`}
                      />
                      <div>
                        <span
                          className={`font-bold block ${
                            isCurrent ? 'text-[#141518]' : isDone ? 'text-[#141518]' : 'text-[#8A8D98]'
                          }`}
                        >
                          {stage.label}
                        </span>
                        <span className="font-sans text-[11px] text-[#52555F]">
                          {stage.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ticket Contents */}
            <div className="p-6 bg-white border border-[#E2DED4] flex flex-col gap-4 font-mono text-xs shadow-sm">
              <div className="pb-2 border-b border-[#E2DED4] flex items-center justify-between">
                <span className="uppercase text-[#8A8D98]">Items in Ticket</span>
                <span className="font-bold text-[#141518]">₹{order.total}</span>
              </div>

              <div className="flex flex-col gap-2">
                {order.items.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between text-xs">
                    <span className="text-[#52555F]">
                      {item.quantity}× {item.item.name}
                    </span>
                    <span className="text-[#141518]">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#E2DED4] text-[11px] text-[#52555F]">
                <span>Delivering to: {order.address.fullAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
