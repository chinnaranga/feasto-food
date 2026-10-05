import React, { useMemo } from 'react';
import { Clock, AlertTriangle, CheckCircle2, ChevronRight, Star, Phone, MapPin, CreditCard, Package } from 'lucide-react';
import { usePortalOrderStore, type PortalOrder, type PortalOrderStatus } from '../../store/portalOrderStore';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PortalOrderStatus, { label: string; color: string; bg: string; dot: string }> = {
  placed:    { label: 'New',       color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',   dot: 'bg-amber-500' },
  confirmed: { label: 'Confirmed', color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',     dot: 'bg-blue-500' },
  preparing: { label: 'Preparing', color: 'text-violet-700',  bg: 'bg-violet-50 border-violet-200', dot: 'bg-violet-500' },
  ready:     { label: 'Ready',     color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200',dot: 'bg-emerald-500' },
  picked_up: { label: 'Picked Up', color: 'text-sky-700',     bg: 'bg-sky-50 border-sky-200',       dot: 'bg-sky-500' },
  delivered: { label: 'Delivered', color: 'text-neutral-500', bg: 'bg-neutral-50 border-neutral-200',dot: 'bg-neutral-400' },
  cancelled: { label: 'Cancelled', color: 'text-red-600',     bg: 'bg-red-50 border-red-200',       dot: 'bg-red-500' },
};

const NEXT_STATUS: Partial<Record<PortalOrderStatus, { label: string; status: PortalOrderStatus; eta?: number }>> = {
  placed:    { label: 'Accept Order',      status: 'confirmed', eta: 25 },
  confirmed: { label: 'Start Preparing',   status: 'preparing', eta: 20 },
  preparing: { label: 'Mark Ready',        status: 'ready',     eta: 5 },
  ready:     { label: 'Mark Picked Up',    status: 'picked_up', eta: 0 },
  picked_up: { label: 'Mark Delivered',    status: 'delivered', eta: 0 },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m ago`;
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order, isSelected, onSelect }: { order: PortalOrder; isSelected: boolean; onSelect: () => void }) {
  const { acceptOrder, updateOrderStatus, rejectOrder, markPriority } = usePortalOrderStore();
  const cfg = STATUS_CONFIG[order.status];
  const next = NEXT_STATUS[order.status];

  const handleNext = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (order.status === 'placed') {
      await acceptOrder(order.id);
    } else if (next) {
      await updateOrderStatus(order.id, next.status, next.eta);
    }
  };

  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await rejectOrder(order.id);
  };

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-xl border cursor-pointer transition-all duration-150 overflow-hidden ${
        isSelected
          ? 'border-[#e35205] shadow-md shadow-orange-100/60'
          : 'border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
      } bg-white`}
    >
      {/* Priority stripe */}
      {order.isPriority && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />
      )}

      <div className="p-4 pl-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-black text-neutral-800 truncate">#{order.id}</span>
            {order.isPriority && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                <Star size={9} className="fill-amber-500 text-amber-500" />
                Priority
              </span>
            )}
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold ${cfg.bg} ${cfg.color} shrink-0`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </div>
        </div>

        {/* Customer + time */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500">
          <span className="font-semibold text-neutral-700">{order.customerName}</span>
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {timeAgo(order.placedAt)}
          </span>
        </div>

        {/* Items summary */}
        <div className="mt-2 text-[11px] text-neutral-500 truncate">
          {order.items.slice(0, 3).map((item, i) => (
            <span key={item.id}>
              {i > 0 && <span className="mx-1 text-neutral-300">·</span>}
              {item.quantity}× {item.name}
            </span>
          ))}
          {order.items.length > 3 && <span className="ml-1 text-neutral-400">+{order.items.length - 3} more</span>}
        </div>

        {/* Total + actions */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-sm font-black text-neutral-900">₹{order.total.toLocaleString()}</span>

          <div className="flex items-center gap-1.5">
            {order.status === 'placed' && (
              <button
                onClick={handleReject}
                className="px-2.5 py-1 text-[10px] font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all"
              >
                Reject
              </button>
            )}
            {next && (
              <button
                onClick={handleNext}
                className="px-2.5 py-1 text-[10px] font-bold text-white bg-[#e35205] rounded-lg hover:bg-orange-600 transition-all"
              >
                {next.label}
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); markPriority(order.id, !order.isPriority); }}
              className={`p-1.5 rounded-lg border transition-all ${
                order.isPriority ? 'border-amber-300 bg-amber-50 text-amber-500' : 'border-neutral-200 text-neutral-300 hover:text-amber-400'
              }`}
              title="Toggle priority"
            >
              <Star size={11} className={order.isPriority ? 'fill-current' : ''} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Order Detail Panel ───────────────────────────────────────────────────────

function OrderDetailPanel({ order }: { order: PortalOrder }) {
  const { updateOrderStatus, rejectOrder } = usePortalOrderStore();
  const cfg = STATUS_CONFIG[order.status];
  const next = NEXT_STATUS[order.status];

  const PIPELINE: PortalOrderStatus[] = ['placed', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered'];
  const currentIdx = PIPELINE.indexOf(order.status);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-neutral-800">Order #{order.id}</h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">{new Date(order.placedAt).toLocaleString()}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold ${cfg.bg} ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </div>
        </div>

        {/* Status Pipeline */}
        {order.status !== 'cancelled' && (
          <div className="mt-4 flex items-center gap-0">
            {PIPELINE.map((s, idx) => {
              const isCompleted = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCompleted ? 'bg-[#e35205] border-[#e35205]' :
                      isCurrent   ? 'bg-white border-[#e35205]' :
                                    'bg-white border-neutral-200'
                    }`}>
                      {isCompleted && <CheckCircle2 size={10} className="text-white fill-white" />}
                      {isCurrent && <div className="w-2 h-2 rounded-full bg-[#e35205]" />}
                    </div>
                    <span className={`text-[8px] font-bold mt-1 capitalize ${isCurrent ? 'text-[#e35205]' : isCompleted ? 'text-neutral-500' : 'text-neutral-300'}`}>
                      {STATUS_CONFIG[s].label}
                    </span>
                  </div>
                  {idx < PIPELINE.length - 1 && (
                    <div className={`h-[2px] flex-1 mx-0.5 ${idx < currentIdx ? 'bg-[#e35205]' : 'bg-neutral-100'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* Customer info */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Customer</h3>
        <div className="bg-neutral-50 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2 text-[11px]">
            <div className="w-7 h-7 rounded-full bg-[#e35205]/10 flex items-center justify-center text-[#e35205] font-black text-[10px]">
              {order.customerName.charAt(0)}
            </div>
            <span className="font-semibold text-neutral-800">{order.customerName}</span>
          </div>
          {order.customerPhone && (
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <Phone size={10} />
              {order.customerPhone}
            </div>
          )}
          <div className="flex items-start gap-2 text-[11px] text-neutral-500">
            <MapPin size={10} className="mt-0.5 shrink-0" />
            <span>{order.address.fullAddress}, {order.address.city} – {order.address.pincode}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Order Items</h3>
        <div className="space-y-1.5">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-neutral-100 flex items-center justify-center text-neutral-400 text-[9px] font-bold">
                  {item.quantity}×
                </div>
                <span className="font-medium text-neutral-700">{item.name}</span>
              </div>
              <span className="font-semibold text-neutral-800">₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Billing */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Billing</h3>
        <div className="bg-neutral-50 rounded-xl p-3 space-y-1.5 text-[11px]">
          <div className="flex justify-between text-neutral-500">
            <span>Subtotal</span>
            <span>₹{order.subtotal.toLocaleString()}</span>
          </div>
          {order.deliveryFee > 0 && (
            <div className="flex justify-between text-neutral-500">
              <span>Delivery Fee</span>
              <span>₹{order.deliveryFee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-neutral-500">
            <span>Taxes</span>
            <span>₹{order.taxes.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount</span>
              <span>-₹{order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between font-black text-neutral-800 pt-1.5 border-t border-neutral-200">
            <span>Total</span>
            <span>₹{order.total.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 pt-1.5 text-neutral-400">
            <CreditCard size={10} />
            <span className="capitalize">{order.paymentMethod}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {order.status !== 'delivered' && order.status !== 'cancelled' && (
        <div className="space-y-2">
          {next && (
            <button
              onClick={() => {
                if (order.status === 'placed') {
                  usePortalOrderStore.getState().acceptOrder(order.id);
                } else {
                  updateOrderStatus(order.id, next.status, next.eta);
                }
              }}
              className="w-full py-2.5 text-xs font-black text-white bg-[#e35205] rounded-xl hover:bg-orange-600 transition-all"
            >
              {next.label}
            </button>
          )}
          <button
            onClick={() => rejectOrder(order.id)}
            className="w-full py-2 text-xs font-bold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-all"
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Live Orders Hub ─────────────────────────────────────────────────────

const STATUS_TABS: { value: PortalOrderStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'placed',    label: 'New' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready',     label: 'Ready' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const LiveOrdersHub: React.FC = () => {
  const { orders, isLoading, selectedOrderId, statusFilter, setStatusFilter, selectOrder } = usePortalOrderStore();

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
    <div className="flex h-[calc(100vh-56px)]">
      {/* ── Left Panel: Order List ── */}
      <div className="w-[380px] shrink-0 border-r border-neutral-200 flex flex-col bg-white">
        {/* Header */}
        <div className="px-5 pt-5 pb-0 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-sm font-black text-neutral-900">Live Orders Hub</h1>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Real-time order management
              </p>
            </div>
            {newOrderCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
                <AlertTriangle size={11} className="text-amber-500" />
                <span className="text-[10px] font-black text-amber-700">{newOrderCount} New</span>
              </div>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-none pb-3">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                  statusFilter === tab.value
                    ? 'bg-[#e35205] text-white'
                    : 'text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                {tab.label}
                {counts[tab.value] > 0 && (
                  <span className={`text-[9px] px-1 rounded-full ${
                    statusFilter === tab.value ? 'bg-white/25 text-white' : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {counts[tab.value]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Order Cards */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 rounded-xl bg-neutral-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <Package size={32} className="text-neutral-300 mb-3" />
              <p className="text-xs font-bold text-neutral-400">No orders in this queue</p>
              <p className="text-[10px] text-neutral-300 mt-1">Orders appear here in real-time as customers place them</p>
            </div>
          ) : (
            filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={order.id === selectedOrderId}
                onSelect={() => selectOrder(order.id === selectedOrderId ? null : order.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Right Panel: Order Detail ── */}
      <div className="flex-1 bg-neutral-50/40">
        {selectedOrder ? (
          <OrderDetailPanel order={selectedOrder} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ChevronRight size={40} className="text-neutral-200 mb-3" />
            <p className="text-xs font-bold text-neutral-400">Select an order to view details</p>
            <p className="text-[10px] text-neutral-300 mt-1">Click any order card on the left to inspect and manage it</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveOrdersHub;
