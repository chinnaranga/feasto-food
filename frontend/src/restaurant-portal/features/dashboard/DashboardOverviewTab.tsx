import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  Sparkles,
  Truck,
  RotateCcw,
} from 'lucide-react';
import usePortalDashboardStore from '../../store/portalDashboardStore';
import usePortalStore from '../../store/portalStore';
import { usePortalOrderStore } from '../../store/portalOrderStore';
import {
  FeastoEditorialHeading,
  FeastoOperationalStatement,
  FeastoSectionHeader,
  FeastoMetric,
  FeastoStatus,
  FeastoButton,
} from '@/components/design-system';

export const DashboardOverviewTab: React.FC = () => {
  const navigate = useNavigate();
  const { selectedRestaurant } = usePortalStore();
  const { metrics, liveOps, alerts, subscribeToRealtimeOrders } = usePortalDashboardStore();
  const { orders, updateOrderStatus, acceptOrder } = usePortalOrderStore();

  useEffect(() => {
    const unsub = subscribeToRealtimeOrders();
    return () => unsub();
  }, [subscribeToRealtimeOrders]);

  const restaurantName = selectedRestaurant?.name?.toUpperCase() || 'KITCHEN WORKSPACE';

  const inPrepOrders = orders.filter(
    (o) => o.status === 'placed' || o.status === 'confirmed' || o.status === 'preparing'
  );
  const readyOrders = orders.filter((o) => o.status === 'ready');

  const formattedRevenue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(metrics.revenueToday || 42800);

  return (
    <div className="w-full space-y-8 text-left select-none">
      {/* ── 01. EDITORIAL OPENING STATEMENT ── */}
      <section className="pb-6 border-b border-[#141518]/20 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#52555F] mb-1">
            <span className="font-bold text-[#1B3BFF]">01 · OPERATIONAL OVERVIEW</span>
            <span>·</span>
            <span>HYDERABAD METROPOLE · 17°23'N</span>
          </div>

          <span className="font-mono text-xs uppercase tracking-wider text-[#8A8D98] block">
            GOOD MORNING,
          </span>
          <FeastoEditorialHeading as="h1" className="text-3xl sm:text-5xl text-[#141518] mt-1">
            {restaurantName}
          </FeastoEditorialHeading>
        </div>

        {/* Today at a Glance summary pill */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <div className="p-3 bg-[#FAF8F5] border border-[#141518]/20">
            <span className="text-[10px] text-[#8A8D98] uppercase block">TODAY AT A GLANCE</span>
            <div className="flex items-center gap-4 mt-1 font-bold">
              <span className="text-[#15803D]">● {inPrepOrders.length} In Prep</span>
              <span className="text-[#1B3BFF]">● {readyOrders.length} Ready for Pickup</span>
              <span className="text-[#141518]">● {metrics.ordersToday || 38} Completed</span>
            </div>
          </div>

          <FeastoButton
            variant="acid"
            size="md"
            icon={<Flame size={14} />}
            onClick={() => navigate('/restaurant-portal/kitchen')}
          >
            OPEN KITCHEN (KDS) →
          </FeastoButton>
        </div>
      </section>

      {/* ── 02. PRIMARY OPERATIONAL HIERARCHY: METRICS WITH ATTITUDE ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FeastoMetric
          index="01"
          label="TODAY'S REVENUE"
          value={formattedRevenue}
          delta={{ value: '+14.2% VS YESTERDAY', positive: true }}
          subtitle="Net settlements after dispatch fee"
          highlight
        />

        <FeastoMetric
          index="02"
          label="ORDERS IN MOTION"
          value={inPrepOrders.length + readyOrders.length}
          delta={{ value: `${inPrepOrders.length} ON FIRE`, neutral: true }}
          subtitle="Target ticket pace: 16m"
        />

        <FeastoMetric
          index="03"
          label="AVERAGE TICKET SPEED"
          value={`${metrics.avgPrepTimeMin || 18}m`}
          delta={{ value: '2m FASTER', positive: true }}
          subtitle="Hearth cycle efficiency 98.4%"
        />

        <FeastoMetric
          index="04"
          label="ONLINE CAPACITY"
          value="100%"
          delta={{ value: 'ALL HEARTHS ON', positive: true }}
          subtitle="Staff active: 6 line cooks, 2 runners"
        />
      </div>

      {/* ── 03. LIVE OPERATIONS MATRIX: ORDERS NOW + KITCHEN STATIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT / CENTER: LIVE ORDERS WORKSPACE (8 COLS) */}
        <div className="lg:col-span-8 space-y-4">
          <FeastoSectionHeader
            index="02"
            title="ACTIVE ORDERS NOW"
            subtitle="Immediate line queue. Tickets automatically sorted by urgency and courier arrival ETA."
            rightElement={
              <FeastoButton
                variant="ghost"
                size="sm"
                onClick={() => navigate('/restaurant-portal/orders')}
              >
                VIEW FULL WORKSPACE →
              </FeastoButton>
            }
          />

          {inPrepOrders.length === 0 ? (
            <div className="p-12 border border-[#141518]/20 bg-[#FAF8F5] text-center font-mono space-y-2">
              <CheckCircle2 size={32} className="mx-auto text-[#15803D]" />
              <h3 className="font-heading font-black text-lg uppercase text-[#141518]">
                ALL TICKETS CLEARED
              </h3>
              <p className="text-xs text-[#52555F]">
                Kitchen line is ready for upcoming orders. Couriers are in position.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {inPrepOrders.slice(0, 5).map((order) => {
                const totalItemsCount = order.items.reduce((acc, i) => acc + i.quantity, 0);

                return (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 bg-white border border-[#141518] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-[#FAF8F5]"
                  >
                    {/* Order Metadata */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-[#141518]">
                          #{order.orderNumber}
                        </span>
                        <FeastoStatus status={order.status} size="sm" />
                        <span className="font-mono text-[10px] text-[#8A8D98]">
                          Placed by {order.customerName}
                        </span>
                      </div>

                      {/* Items Preview */}
                      <p className="font-sans font-bold text-sm text-[#141518] line-clamp-1">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(' · ')}
                      </p>

                      <div className="flex items-center gap-4 font-mono text-[11px] text-[#52555F]">
                        <span>{totalItemsCount} items</span>
                        <span>₹{order.totalAmount}</span>
                        <span className="flex items-center gap-1 text-[#1B3BFF]">
                          <Clock size={11} />
                          ETA: {order.estimatedPrepTimeMins}m
                        </span>
                      </div>
                    </div>

                    {/* Quick State Update Action */}
                    <div className="shrink-0 flex items-center gap-2">
                      {order.status === 'placed' && (
                        <FeastoButton
                          variant="acid"
                          size="sm"
                          onClick={() => acceptOrder(order.id)}
                        >
                          ACCEPT & FIRE →
                        </FeastoButton>
                      )}
                      {order.status === 'confirmed' && (
                        <FeastoButton
                          variant="primary"
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'preparing', 15)}
                        >
                          START PREPARING →
                        </FeastoButton>
                      )}
                      {order.status === 'preparing' && (
                        <FeastoButton
                          variant="accent"
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'ready', 0)}
                        >
                          MARK READY →
                        </FeastoButton>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: KITCHEN STATIONS & COURIER DISPATCH STREAM (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Kitchen Stations */}
          <div className="p-5 bg-[#FAF8F5] border border-[#141518]/20 space-y-4">
            <div className="border-b border-[#141518]/15 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8D98] block">
                KITCHEN DISPLAY
              </span>
              <h3 className="font-heading font-black text-sm uppercase text-[#141518]">
                Floor Stations
              </h3>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 bg-white border border-[#E2DED4] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#141518] block">Station 01 · Dum Hearth</span>
                  <span className="text-[10px] text-[#52555F]">Slow-cooked Deghs</span>
                </div>
                <span className="font-bold text-[#1B3BFF]">3 ACTIVE</span>
              </div>

              <div className="p-3 bg-white border border-[#E2DED4] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#141518] block">Station 02 · Wood Hearth</span>
                  <span className="text-[10px] text-[#52555F]">480°C Neapolitan</span>
                </div>
                <span className="font-bold text-[#15803D]">2 ACTIVE</span>
              </div>

              <div className="p-3 bg-white border border-[#E2DED4] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#141518] block">Station 03 · Cold Larder</span>
                  <span className="text-[10px] text-[#52555F]">Heirloom Salads & Mezze</span>
                </div>
                <span className="font-bold text-[#8A8D98]">READY</span>
              </div>
            </div>
          </div>

          {/* Courier Telemetry Stream */}
          <div className="p-5 bg-white border border-[#141518] space-y-4">
            <div className="border-b border-[#141518]/15 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8D98] block">
                DISPATCH INTEGRATION
              </span>
              <h3 className="font-heading font-black text-sm uppercase text-[#141518]">
                Couriers En Route
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-start gap-2.5">
                <Truck size={14} className="text-[#1B3BFF] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>Rider #42 · Ranga</span>
                    <span className="text-[#15803D]">3m AWAY</span>
                  </div>
                  <p className="text-[10px] text-[#52555F]">Assigned to Order #1814 (Biryani)</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Truck size={14} className="text-[#8A8D98] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>Rider #18 · Vikram</span>
                    <span className="text-[#8A8D98]">ARRIVED</span>
                  </div>
                  <p className="text-[10px] text-[#52555F]">Waiting at pass for Order #1809</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewTab;
