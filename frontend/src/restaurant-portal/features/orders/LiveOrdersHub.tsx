import React, { useMemo } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Star,
  Phone,
  MapPin,
  CreditCard,
  Package,
  Printer,
  X,
  Flame,
  Truck,
  User,
} from 'lucide-react';
import {
  usePortalOrderStore,
  type PortalOrder,
  type PortalOrderStatus,
} from '../../store/portalOrderStore';
import {
  FeastoEditorialHeading,
  FeastoOperationalStatement,
  FeastoSectionHeader,
  FeastoStatus,
  FeastoButton,
  FeastoTimeline,
  FeastoDetailPanel,
} from '@/components/design-system';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m ago`;
}

// ─── Compact Operational Order Object ─────────────────────────────────────────

function OperationalOrderCard({
  order,
  isSelected,
  onSelect,
}: {
  order: PortalOrder;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { acceptOrder, updateOrderStatus, rejectOrder } = usePortalOrderStore();

  const handleNext = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (order.status === 'placed') {
      await acceptOrder(order.id);
    } else if (order.status === 'confirmed') {
      await updateOrderStatus(order.id, 'preparing', 20);
    } else if (order.status === 'preparing') {
      await updateOrderStatus(order.id, 'ready', 0);
    } else if (order.status === 'ready') {
      await updateOrderStatus(order.id, 'picked_up', 0);
    }
  };

  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await rejectOrder(order.id);
  };

  const totalItemsCount = order.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div
      onClick={onSelect}
      className={`p-4 border cursor-pointer transition-colors text-left relative overflow-hidden select-none ${
        isSelected
          ? 'bg-[#FAF8F5] border-[#141518] ring-1 ring-[#141518]'
          : 'bg-white border-[#141518]/20 hover:border-[#141518]'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-black text-[#141518]">
            #{order.orderNumber || order.id.slice(-6).toUpperCase()}
          </span>
          <FeastoStatus status={order.status} size="sm" />
          {order.isPriority && (
            <span className="px-1.5 py-0.5 bg-amber-400 text-[#141518] font-mono text-[9px] font-black uppercase">
              RUSH
            </span>
          )}
        </div>

        <span className="font-mono text-[10px] text-[#8A8D98] flex items-center gap-1">
          <Clock size={10} />
          {timeAgo(order.placedAt)}
        </span>
      </div>

      {/* Customer + Items */}
      <div className="mt-2">
        <span className="font-mono text-xs text-[#52555F] block">
          Guest: <strong className="text-[#141518]">{order.customerName}</strong>
        </span>

        <p className="font-sans font-bold text-xs text-[#141518] mt-1 line-clamp-2">
          {order.items.map((item) => `${item.quantity}x ${item.name}`).join(' · ')}
        </p>
      </div>

      {/* Footer & Direct Quick Action */}
      <div className="mt-3 pt-2.5 border-t border-[#141518]/10 flex items-center justify-between gap-2">
        <div className="font-mono text-xs">
          <span className="font-bold text-[#141518]">₹{order.totalAmount ?? order.total}</span>
          <span className="text-[10px] text-[#8A8D98] ml-1">({totalItemsCount} items)</span>
        </div>

        <div className="flex items-center gap-1">
          {order.status === 'placed' && (
            <>
              <button
                onClick={handleReject}
                className="px-2 py-1 font-mono text-[10px] font-bold text-[#991B1B] hover:bg-red-50 border border-transparent hover:border-red-200 cursor-pointer"
              >
                Decline
              </button>
              <button
                onClick={handleNext}
                className="px-2.5 py-1 font-mono text-[10px] font-bold uppercase bg-[#D7F04A] text-[#141518] border border-[#141518] hover:bg-[#c6df3d] cursor-pointer"
              >
                Accept (20m) →
              </button>
            </>
          )}

          {order.status === 'confirmed' && (
            <button
              onClick={handleNext}
              className="px-2.5 py-1 font-mono text-[10px] font-bold uppercase bg-[#141518] text-[#F3F0E8] border border-[#141518] hover:bg-[#D7F04A] hover:text-[#141518] cursor-pointer"
            >
              Start Cooking →
            </button>
          )}

          {order.status === 'preparing' && (
            <button
              onClick={handleNext}
              className="px-2.5 py-1 font-mono text-[10px] font-bold uppercase bg-[#1B3BFF] text-white border border-[#1B3BFF] hover:bg-[#1530d9] cursor-pointer"
            >
              Mark Ready →
            </button>
          )}

          {order.status === 'ready' && (
            <button
              onClick={handleNext}
              className="px-2.5 py-1 font-mono text-[10px] font-bold uppercase bg-[#141518] text-[#D7F04A] border border-[#141518] hover:bg-black cursor-pointer"
            >
              Hand Off →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Order Detail Inspector ───────────────────────────────────────────────────

function OrderDetailInspector({ order }: { order: PortalOrder }) {
  const { updateOrderStatus, acceptOrder, rejectOrder } = usePortalOrderStore();

  const timelineSteps = [
    {
      id: 'placed',
      label: 'Order Placed',
      timestamp: timeAgo(order.placedAt),
      status: 'completed' as const,
      description: `Payment confirmed · ₹${order.totalAmount ?? order.total}`,
    },
    {
      id: 'confirmed',
      label: 'Kitchen Accepted',
      status: ['confirmed', 'preparing', 'ready', 'picked_up', 'delivered'].includes(order.status)
        ? ('completed' as const)
        : order.status === 'placed'
        ? ('current' as const)
        : ('upcoming' as const),
    },
    {
      id: 'preparing',
      label: 'Hearth Firing',
      status: ['preparing', 'ready', 'picked_up', 'delivered'].includes(order.status)
        ? ('completed' as const)
        : order.status === 'confirmed'
        ? ('current' as const)
        : ('upcoming' as const),
    },
    {
      id: 'ready',
      label: 'Ready at Pass',
      status: ['ready', 'picked_up', 'delivered'].includes(order.status)
        ? ('completed' as const)
        : order.status === 'preparing'
        ? ('current' as const)
        : ('upcoming' as const),
    },
    {
      id: 'picked_up',
      label: 'Courier Dispatched',
      status: ['picked_up', 'delivered'].includes(order.status)
        ? ('completed' as const)
        : order.status === 'ready'
        ? ('current' as const)
        : ('upcoming' as const),
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between text-left select-none bg-white border-l border-[#141518]/15">
      {/* Header */}
      <div className="p-6 border-b border-[#141518]/15 bg-[#FAF8F5]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8D98]">
            ORDER DOSSIER
          </span>
          <FeastoStatus status={order.status} />
        </div>

        <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518] mt-1">
          #{order.orderNumber || order.id.slice(-6).toUpperCase()}
        </h2>

        <div className="flex items-center gap-3 font-mono text-xs text-[#52555F] mt-1">
          <span>Placed {new Date(order.placedAt).toLocaleTimeString()}</span>
          <span>·</span>
          <span>ETA: {order.estimatedPrepTimeMins ?? order.eta ?? 20} mins</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
        {/* Customer Section */}
        <div className="p-4 bg-[#FAF8F5] border border-[#E2DED4] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-[#8A8D98]">
              Guest Details
            </span>
            <a
              href={`tel:${order.customerPhone}`}
              className="font-mono text-xs font-bold text-[#1B3BFF] hover:underline flex items-center gap-1"
            >
              <Phone size={12} />
              {order.customerPhone}
            </a>
          </div>
          <h4 className="font-heading font-black text-sm text-[#141518]">
            {order.customerName}
          </h4>
          <p className="font-mono text-xs text-[#52555F] flex items-center gap-1">
            <MapPin size={12} className="shrink-0 text-[#8A8D98]" />
            {order.deliveryAddress || order.address?.fullAddress}
          </p>
        </div>

        {/* Itemized Kitchen Ticket */}
        <div className="space-y-3">
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8A8D98] block">
            KITCHEN TICKET ITEMS ({order.items.length})
          </span>

          <div className="border border-[#141518]/15 divide-y divide-[#141518]/10 font-mono text-xs">
            {order.items.map((item) => (
              <div key={item.id} className="p-3 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#141518]">{item.quantity}x</span>
                    <span className="font-bold text-[#141518]">{item.name}</span>
                  </div>
                  {item.notes && (
                    <p className="text-[11px] text-[#991B1B] font-sans font-bold bg-red-50 p-1 border border-red-200">
                      Note: {item.notes}
                    </p>
                  )}
                </div>
                <span className="font-bold text-[#141518] shrink-0">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#EBE7DD]/40 border border-[#141518]/15 flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-[#52555F]">ORDER TOTAL</span>
            <span className="font-black text-base text-[#141518]">₹{order.totalAmount ?? order.total}</span>
          </div>
        </div>

        {/* Operational Timeline */}
        <div className="space-y-3">
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8A8D98] block">
            PREPARATION MILESTONES
          </span>
          <FeastoTimeline steps={timelineSteps} />
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-[#141518]/15 bg-[#FAF8F5] flex items-center justify-between gap-2">
        <FeastoButton
          variant="ghost"
          size="sm"
          icon={<Printer size={13} />}
          onClick={() => window.print()}
        >
          PRINT TICKET
        </FeastoButton>

        {order.status === 'placed' && (
          <FeastoButton
            variant="acid"
            size="md"
            onClick={() => acceptOrder(order.id)}
          >
            FIRE TO HEARTH →
          </FeastoButton>
        )}
        {order.status === 'confirmed' && (
          <FeastoButton
            variant="primary"
            size="md"
            onClick={() => updateOrderStatus(order.id, 'preparing', 20)}
          >
            START PREPARING →
          </FeastoButton>
        )}
        {order.status === 'preparing' && (
          <FeastoButton
            variant="accent"
            size="md"
            onClick={() => updateOrderStatus(order.id, 'ready', 0)}
          >
            MARK READY AT PASS →
          </FeastoButton>
        )}
        {order.status === 'ready' && (
          <FeastoButton
            variant="acid"
            size="md"
            onClick={() => updateOrderStatus(order.id, 'picked_up', 0)}
          >
            CONFIRM HANDOFF →
          </FeastoButton>
        )}
      </div>
    </div>
  );
}

// ─── Main Live Orders Workspace ───────────────────────────────────────────────

const STAGE_FILTERS: { value: PortalOrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Active' },
  { value: 'placed', label: 'New Tickets' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'In Prep' },
  { value: 'ready', label: 'Ready at Pass' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'delivered', label: 'Delivered' },
];

export const LiveOrdersHub: React.FC = () => {
  const { orders, isLoading, selectedOrderId, statusFilter, setStatusFilter, selectOrder } =
    usePortalOrderStore();

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    orders.forEach((o) => {
      c[o.status] = (c[o.status] || 0) + 1;
    });
    return c;
  }, [orders]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);
  const newOrderCount = orders.filter((o) => o.status === 'placed').length;

  return (
    <div className="w-full space-y-6 text-left select-none">
      {/* Workspace Header */}
      <FeastoSectionHeader
        index="02"
        title="FEASTO LIVE ORDERS WORKSPACE"
        subtitle="Real-time kitchen order dispatch and preparation workflow. Rapid bump-bar status progression."
        rightElement={
          newOrderCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D7F04A] border border-[#141518] text-[#141518] font-mono text-xs font-black uppercase">
              <span className="w-2 h-2 rounded-full bg-[#141518] animate-ping" />
              <span>{newOrderCount} NEW TICKETS AWAITING ACCEPTANCE</span>
            </div>
          )
        }
      />

      {/* Stage Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2 font-mono text-xs">
        {STAGE_FILTERS.map((stage) => {
          const count = counts[stage.value] || 0;
          const isActive = statusFilter === stage.value;

          return (
            <button
              key={stage.value}
              onClick={() => setStatusFilter(stage.value)}
              className={`px-3 py-1.5 border uppercase font-bold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-[#141518] text-[#F3F0E8] border-[#141518]'
                  : 'bg-[#FAF8F5] text-[#52555F] border-[#141518]/20 hover:border-[#141518] hover:text-[#141518]'
              }`}
            >
              <span>{stage.label}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1 font-mono ${
                    isActive ? 'bg-[#D7F04A] text-[#141518]' : 'bg-[#E2DED4] text-[#141518]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Split Workspace Layout: Grid + Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-h-[600px]">
        {/* Left Column: Order Cards Grid */}
        <div
          className={`${
            selectedOrder ? 'lg:col-span-7' : 'lg:col-span-12'
          } space-y-3 transition-all`}
        >
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-[#FAF8F5] border border-[#E2DED4] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 border border-[#141518]/20 bg-[#FAF8F5] text-center font-mono space-y-2">
              <Package size={32} className="mx-auto text-[#8A8D98]" />
              <h4 className="font-heading font-black text-base uppercase text-[#141518]">
                NO ORDERS IN THIS QUEUE
              </h4>
              <p className="text-xs text-[#52555F]">
                New customer orders will stream into this workspace in real-time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((order) => (
                <OperationalOrderCard
                  key={order.id}
                  order={order}
                  isSelected={order.id === selectedOrderId}
                  onSelect={() => selectOrder(order.id === selectedOrderId ? null : order.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Order Detail Inspector */}
        {selectedOrder && (
          <div className="lg:col-span-5 sticky top-20">
            <OrderDetailInspector order={selectedOrder} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveOrdersHub;
