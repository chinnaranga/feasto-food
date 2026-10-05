import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePortalDashboardStore from '../../store/portalDashboardStore';
import usePortalStore from '../../store/portalStore';

export const DashboardOverviewTab: React.FC = () => {
  const navigate = useNavigate();
  const { selectedRestaurant } = usePortalStore();
  const { metrics, liveOps, subscribeToRealtimeOrders } = usePortalDashboardStore();

  useEffect(() => {
    const unsub = subscribeToRealtimeOrders();
    return () => unsub();
  }, [subscribeToRealtimeOrders]);

  const formattedRevenue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(metrics.revenueToday || 42800);

  return (
    <div className="w-full bg-[#F3F0E8] text-[#141518] p-6 sm:p-8 select-none min-h-[85vh]">
      
      {/* Studio Workspace Header */}
      <div className="pb-6 border-b border-[#141518] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#52555F] block mb-1">
            Restaurant Studio · Station Alpha
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#141518]">
            {selectedRestaurant?.name ? selectedRestaurant.name.toUpperCase() : 'KITCHEN WORKSPACE'}
          </h1>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="flex items-center gap-1.5 text-[#15803D] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#15803D] animate-ping" />
            Kitchen Firing Live
          </span>
          <span className="text-[#8A8D98]">17°23'N · Hyd Metropole</span>
        </div>
      </div>

      {/* Main Studio Workspace: 3 Cohesive Visual Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
        
        {/* Pane 1: Today's Kitchen (Left: 3 Cols) */}
        <div className="lg:col-span-3 bg-white border border-[#141518] p-6 flex flex-col gap-6">
          <div className="pb-2 border-b border-[#E2DED4]">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8D98] block">
              Active Stations
            </span>
            <h3 className="font-heading font-bold text-base text-[#141518]">
              Kitchen Floor
            </h3>
          </div>

          <div className="flex flex-col gap-4 font-mono text-xs">
            <div className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#E2DED4]">
              <div>
                <span className="font-bold text-[#141518] block">Dum Hearth 01</span>
                <span className="text-[10px] text-[#52555F]">Biryani Deghs</span>
              </div>
              <span className="text-xs font-bold text-[#1B3BFF]">4 ACTIVE</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#E2DED4]">
              <div>
                <span className="font-bold text-[#141518] block">Wood Hearth 02</span>
                <span className="text-[10px] text-[#52555F]">480°C Neapolitan</span>
              </div>
              <span className="text-xs font-bold text-[#15803D]">3 ACTIVE</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#E2DED4]">
              <div>
                <span className="font-bold text-[#141518] block">Cold Larder</span>
                <span className="text-[10px] text-[#52555F]">Heirloom Salads</span>
              </div>
              <span className="text-xs font-bold text-[#8A8D98]">1 PREP</span>
            </div>
          </div>

          {/* Kitchen Summary Counts */}
          <div className="pt-4 border-t border-[#E2DED4] flex flex-col gap-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[#52555F]">Preparing right now</span>
              <span className="font-bold text-[#141518]">{liveOps.preparingCount || 7}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#52555F]">Ready for pickup</span>
              <span className="font-bold text-[#15803D]">{liveOps.readyForPickupCount || 4}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#52555F]">Dispatched</span>
              <span className="font-bold text-[#1B3BFF]">{liveOps.dispatchedCount || 2}</span>
            </div>
          </div>
        </div>

        {/* Pane 2: Live Orders Stream (Center: 6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-[#141518] p-6 flex flex-col gap-6">
          <div className="pb-2 border-b border-[#E2DED4] flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8D98] block">
                Direct Dispatch Stream
              </span>
              <h3 className="font-heading font-bold text-lg text-[#141518]">
                Live Orders
              </h3>
            </div>
            <button
              onClick={() => navigate('/restaurant-portal/orders')}
              className="font-mono text-xs text-[#1B3BFF] font-bold hover:underline"
            >
              All Orders ({metrics.ordersToday || 124}) →
            </button>
          </div>

          {/* Live Order Tickets */}
          <div className="flex flex-col gap-3">
            <div className="p-4 border border-[#141518] bg-[#FAF8F5] flex flex-col gap-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2DED4]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D7F04A]" />
                  <span className="font-bold text-[#141518]">#FST-8821</span>
                  <span className="text-[#8A8D98]">· 6 mins ago</span>
                </div>
                <span className="font-bold text-[#141518]">₹760</span>
              </div>
              <div className="text-xs font-sans text-[#141518]">
                2× Special Mutton Dum Biryani, 1× Mirchi Ka Salan, 1× Double Ka Meetha
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[#8A8D98]">Courier: Assigned (Ranga)</span>
                <span className="px-2.5 py-1 bg-[#141518] text-[#D7F04A] font-bold uppercase text-[10px]">
                  Mark Ready →
                </span>
              </div>
            </div>

            <div className="p-4 border border-[#E2DED4] bg-white flex flex-col gap-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2DED4]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1B3BFF]" />
                  <span className="font-bold text-[#141518]">#FST-8820</span>
                  <span className="text-[#8A8D98]">· 14 mins ago</span>
                </div>
                <span className="font-bold text-[#141518]">₹420</span>
              </div>
              <div className="text-xs font-sans text-[#141518]">
                1× Wood-Fired Margherita Pizza, 1× Artisan Burrata Salad
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[#15803D] font-bold">READY AT PACK COUNTER</span>
                <span className="px-2.5 py-1 bg-[#E2DED4] text-[#141518] font-bold uppercase text-[10px]">
                  Handoff to Courier →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pane 3: Business Signals (Right: 3 Cols) */}
        <div className="lg:col-span-3 bg-white border border-[#141518] p-6 flex flex-col gap-6">
          <div className="pb-2 border-b border-[#E2DED4]">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8D98] block">
              Financial Signals
            </span>
            <h3 className="font-heading font-bold text-base text-[#141518]">
              Today's Volume
            </h3>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-[#8A8D98]">Gross Revenue Today</span>
            <span className="font-mono text-3xl font-bold text-[#141518]">
              {formattedRevenue}
            </span>
            <span className="font-mono text-[11px] text-[#15803D] font-bold">
              +18.4% vs last week
            </span>
          </div>

          <div className="pt-4 border-t border-[#E2DED4] flex flex-col gap-3 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[#52555F]">Orders Dispatched</span>
              <span className="font-bold text-[#141518]">{metrics.ordersToday || 124}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#52555F]">Average Ticket Size</span>
              <span className="font-bold text-[#141518]">₹345</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#52555F]">Kitchen Rating</span>
              <span className="font-bold text-[#141518]">4.87 ★</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2DED4]">
            <button
              onClick={() => navigate('/restaurant-portal/menu')}
              className="btn-graphic-acid w-full justify-center text-xs py-2.5"
            >
              Open Menu Studio →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
export default DashboardOverviewTab;
