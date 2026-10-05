import React from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

export const Orders: React.FC = () => {
  const { activeOrders, pastOrders } = useUserStore();

  return (
    <div className="w-full bg-[#F3F0E8] text-[#141518] selection:bg-[#D7F04A] selection:text-[#141518] min-h-screen pt-28 pb-32">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-12">
        
        {/* Header */}
        <div className="pb-8 border-b border-[#141518] flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#52555F] block mb-1">
              Telemetry & Receipts
            </span>
            <h1 className="editorial-display-sub text-[#141518]">
              ORDER ARCHIVE.
            </h1>
          </div>
          <Link to="/restaurants" className="btn-graphic-ghost text-xs font-mono">
            Explore Kitchens →
          </Link>
        </div>

        {/* Active Deliveries */}
        {activeOrders.length > 0 && (
          <div className="mt-12 flex flex-col gap-6">
            <div className="flex items-center gap-2 font-mono text-xs text-[#141518]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D7F04A] animate-ping" />
              <span className="uppercase font-bold tracking-wider">Active Radar Dispatches ({activeOrders.length})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 bg-white border border-[#141518] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2DED4] font-mono text-xs">
                      <span className="text-[#1B3BFF] font-bold">#{order.id.slice(-6).toUpperCase()}</span>
                      <span className="text-[#8A8D98]">ETA {order.eta || 20} MINS</span>
                    </div>

                    <h3 className="font-heading font-bold text-xl text-[#141518] mt-3">
                      {order.restaurantName}
                    </h3>

                    <div className="mt-2 text-xs font-mono text-[#52555F]">
                      {order.items.map((i) => `${i.quantity}× ${i.item.name}`).join(', ')}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E2DED4] flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-base text-[#141518]">₹{order.total}</span>
                    <Link
                      to={`/orders/${order.id}/track`}
                      className="btn-graphic-acid py-2 px-3 text-xs"
                    >
                      Open Live Radar →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Orders */}
        <div className="mt-16 flex flex-col gap-6">
          <div className="pb-2 border-b border-[#E2DED4] font-mono text-xs uppercase tracking-wider text-[#52555F]">
            Completed Order Receipts
          </div>

          {pastOrders.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-[#E2DED4] p-8">
              <span className="font-mono text-xs uppercase text-[#8A8D98] block mb-2">No Past Orders</span>
              <p className="font-sans text-sm text-[#52555F]">
                Your completed dining history will be archived here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#E2DED4] border-t border-b border-[#E2DED4]">
              {pastOrders.map((order) => (
                <div
                  key={order.id}
                  className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs"
                >
                  <div>
                    <span className="text-[10px] text-[#8A8D98] block mb-1">
                      {order.placedAt ? new Date(order.placedAt).toLocaleDateString() : 'Recent'} · #{order.id.slice(-6).toUpperCase()}
                    </span>
                    <h4 className="font-heading font-bold text-base text-[#141518]">
                      {order.restaurantName}
                    </h4>
                    <p className="font-sans text-xs text-[#52555F] mt-0.5">
                      {order.items.map((i) => `${i.quantity}× ${i.item.name}`).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="font-bold text-sm text-[#141518]">₹{order.total}</span>
                    <Link
                      to={`/orders/${order.id}/track`}
                      className="btn-graphic-ghost text-xs"
                    >
                      Receipt & Route →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
