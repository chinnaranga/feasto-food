import React, { useState, useMemo } from 'react';
import {
  Flame,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Volume2,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import {
  usePortalOrderStore,
  type PortalOrder,
  type PortalOrderItem,
} from '../../store/portalOrderStore';
import {
  FeastoOperationalStatement,
  FeastoStatus,
  FeastoButton,
  FeastoSectionHeader,
} from '@/components/design-system';

export const KitchenDisplayView: React.FC = () => {
  const { orders, updateOrderStatus } = usePortalOrderStore();
  const [stationFilter, setStationFilter] = useState<'all' | 'dum' | 'grill' | 'cold'>('all');

  // Filter to active kitchen tickets (placed, confirmed, preparing)
  const activeTickets = useMemo(() => {
    return orders.filter(
      (o) => o.status === 'placed' || o.status === 'confirmed' || o.status === 'preparing'
    );
  }, [orders]);

  const handleBumpTicket = async (orderId: string, currentStatus: string) => {
    if (currentStatus === 'placed' || currentStatus === 'confirmed') {
      await updateOrderStatus(orderId, 'preparing', 15);
    } else if (currentStatus === 'preparing') {
      await updateOrderStatus(orderId, 'ready', 0);
    }
  };

  return (
    <div className="w-full space-y-6 text-left select-none bg-[#141518] text-[#F3F0E8] p-6 sm:p-8 min-h-[85vh] border border-[#22242B]">
      {/* KDS Header with High-Contrast Operational Telemetry */}
      <div className="pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#D7F04A] mb-1">
            <Flame size={14} className="text-[#D7F04A] animate-pulse" />
            <span>KITCHEN DISPLAY SYSTEM · STATION ALPHA</span>
          </div>
          <FeastoOperationalStatement as="h1" size="giant" className="text-white">
            WHAT NEEDS TO BE PREPARED NOW?
          </FeastoOperationalStatement>
        </div>

        {/* Station Station Selectors & Quick Bump Counter */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {(['all', 'dum', 'grill', 'cold'] as const).map((station) => (
            <button
              key={station}
              onClick={() => setStationFilter(station)}
              className={`px-3 py-1.5 uppercase font-bold tracking-wider transition-colors cursor-pointer border ${
                stationFilter === station
                  ? 'bg-[#D7F04A] text-[#141518] border-[#D7F04A]'
                  : 'bg-[#1D212A] text-[#8E929C] border-white/10 hover:text-white'
              }`}
            >
              {station === 'all'
                ? `ALL STATIONS (${activeTickets.length})`
                : `${station.toUpperCase()} HEARTH`}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Queue Grid */}
      {activeTickets.length === 0 ? (
        <div className="p-16 border border-white/10 bg-[#1D212A] text-center font-mono space-y-3">
          <CheckCircle2 size={40} className="mx-auto text-[#D7F04A]" />
          <h2 className="font-heading font-black text-2xl uppercase text-white">
            ALL TICKETS CLEARED
          </h2>
          <p className="text-xs text-[#8E929C]">
            Line cooks standing by. New customer tickets will sound chime and appear immediately.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeTickets.map((order, idx) => {
            const isCooking = order.status === 'preparing';

            return (
              <div
                key={order.id}
                className={`p-5 border flex flex-col justify-between transition-colors ${
                  isCooking
                    ? 'bg-[#1D212A] border-[#D7F04A] text-white ring-1 ring-[#D7F04A]'
                    : 'bg-[#181B22] border-white/15 text-[#F3F0E8]'
                }`}
              >
                {/* Ticket Top Bezel */}
                <div className="pb-3 border-b border-white/10 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs uppercase text-[#8E929C] block">
                      TICKET {idx + 1} OF {activeTickets.length}
                    </span>
                    <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-white mt-0.5">
                      #{order.orderNumber}
                    </h3>
                  </div>

                  <div className="text-right font-mono">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase ${
                        isCooking
                          ? 'bg-[#D7F04A] text-[#141518]'
                          : 'bg-white/10 text-[#8E929C]'
                      }`}
                    >
                      {isCooking ? 'FIRING NOW' : 'QUEUED'}
                    </span>
                    <span className="text-[11px] text-[#8E929C] block mt-1">
                      {order.estimatedPrepTimeMins}m target
                    </span>
                  </div>
                </div>

                {/* Items on the Ticket (Large, readable font for kitchen line cooks) */}
                <div className="my-4 space-y-3 font-mono">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-black/30 border border-white/5 space-y-1"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-black text-lg text-[#D7F04A] leading-tight shrink-0">
                          {item.quantity}x
                        </span>
                        <span className="font-heading font-bold text-base text-white flex-1 leading-snug uppercase">
                          {item.name}
                        </span>
                      </div>
                      {item.notes && (
                        <p className="font-sans text-xs font-bold text-amber-300 bg-amber-950/40 p-1 border border-amber-800">
                          ALLERGEN/NOTE: {item.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom Ticket Bump Bar Action */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-[#8E929C]">
                    Guest: <strong className="text-white">{order.customerName}</strong>
                  </span>

                  <button
                    onClick={() => handleBumpTicket(order.id, order.status)}
                    className={`px-4 py-2 font-mono text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border ${
                      isCooking
                        ? 'bg-[#D7F04A] text-[#141518] border-[#D7F04A] hover:bg-[#c6df3d]'
                        : 'bg-white text-[#141518] border-white hover:bg-[#D7F04A]'
                    }`}
                  >
                    {isCooking ? 'BUMP TICKET (READY) ✓' : 'START TICKET →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KitchenDisplayView;
