import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import type { OrderStatus } from '@/store/userStore';

export const OrderTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { activeOrders, pastOrders, updateOrderStatus } = useUserStore();

  const order = activeOrders.find((o) => o.id === id) || pastOrders.find((o) => o.id === id);

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
    }, 12000);

    return () => clearInterval(interval);
  }, [order, updateOrderStatus]);

  if (!order) {
    return (
      <div className="min-h-[80vh] bg-[#F3F0E8] flex flex-col items-center justify-center gap-4 text-center px-6 pt-28 select-none">
        <span className="font-mono text-xs uppercase tracking-widest text-[#52555F]">
          Active Radar
        </span>
        <h2 className="editorial-display-giant text-[#141518]">NO ORDER.</h2>
        <p className="font-sans text-sm text-[#52555F] max-w-sm">
          No live delivery matches this identifier.
        </p>
        <Link to="/orders" className="btn-graphic-primary mt-4">
          View Past Orders →
        </Link>
      </div>
    );
  }

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
        return 0;
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
              {order.status === 'delivered' ? 'Completed' : `ETA ${order.eta || 20} MINS`}
            </span>
          </div>
        </div>

        {/* Spatial Grid: Map (Dominant) & Living Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
          
          {/* Map & Telemetry Canvas (Dominant: 8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Visual Map Surface */}
            <div className="relative w-full h-[480px] bg-[#141518] border border-black overflow-hidden select-none">
              
              {/* Architectural Grid Lines */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Road vectors simulation */}
              <svg className="absolute inset-0 w-full h-full stroke-white/20 stroke-1" fill="none">
                <path d="M 50 100 L 250 180 L 450 150 L 650 320 L 800 400" />
                <path d="M 200 50 L 250 180 L 280 420" />
                <path d="M 450 150 L 480 350 L 700 360" />
              </svg>

              {/* Kitchen Origin Node */}
              <div className="absolute top-24 left-16 flex flex-col items-center">
                <span className="w-4 h-4 bg-white border-2 border-[#141518] shadow-md" />
                <span className="font-mono text-[9px] uppercase bg-white text-[#141518] px-1.5 py-0.5 mt-1 font-bold">
                  {order.restaurantName}
                </span>
              </div>

              {/* Animated Courier Node */}
              <motion.div
                animate={{
                  x: currentStageIndex === 0 ? 80 : currentStageIndex === 1 ? 260 : currentStageIndex === 2 ? 500 : 720,
                  y: currentStageIndex === 0 ? 110 : currentStageIndex === 1 ? 175 : currentStageIndex === 2 ? 260 : 380,
                }}
                transition={{ duration: 3, ease: 'easeInOut' }}
                className="absolute top-0 left-0 flex flex-col items-center"
              >
                <div className="relative">
                  <span className="w-5 h-5 rounded-full bg-[#D7F04A] flex items-center justify-center text-[#141518] font-bold text-[10px] shadow-lg shadow-[#D7F04A]/50">
                    ⚡
                  </span>
                  <span className="absolute -inset-1 rounded-full border border-[#D7F04A] animate-ping" />
                </div>
                <span className="font-mono text-[9px] uppercase bg-[#D7F04A] text-[#141518] px-1.5 py-0.5 mt-1 font-bold">
                  Rider Ranga · EV
                </span>
              </motion.div>

              {/* Customer Destination Pin */}
              <div className="absolute bottom-16 right-20 flex flex-col items-center">
                <span className="w-4 h-4 bg-[#1B3BFF] border-2 border-white shadow-md" />
                <span className="font-mono text-[9px] uppercase bg-[#1B3BFF] text-white px-1.5 py-0.5 mt-1 font-bold">
                  Your Address
                </span>
              </div>

              {/* Map HUD Overlay */}
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-[#F3F0E8] p-3 font-mono text-xs border border-white/10">
                <span className="text-[#8A8D98] block text-[10px]">RADAR ACTIVE</span>
                <span className="text-[#D7F04A] font-bold">DISPATCH CORRIDOR: OPEN</span>
              </div>

              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-[#F3F0E8] p-3 font-mono text-xs border border-white/10 text-right">
                <span className="text-[#8A8D98] block text-[10px]">DELIVERY HANDOFF OTP</span>
                <span className="text-xl font-bold tracking-widest text-[#D7F04A]">4821</span>
              </div>
            </div>

            {/* Courier Contextual Card */}
            <div className="p-6 bg-white border border-[#E2DED4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#141518] text-[#D7F04A] font-bold text-base flex items-center justify-center">
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
                  className="btn-graphic-primary text-xs flex-1 sm:flex-initial py-2.5 px-4"
                >
                  Call Courier
                </a>
              </div>
            </div>

          </div>

          {/* Living Timeline & Order Ticket (Right: 4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Living Timeline */}
            <div className="p-6 bg-white border border-[#141518] flex flex-col gap-6">
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
            <div className="p-6 bg-white border border-[#E2DED4] flex flex-col gap-4 font-mono text-xs">
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
