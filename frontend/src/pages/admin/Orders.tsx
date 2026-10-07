import React, { useState } from 'react';
import {
  Clock,
  ShieldAlert,
  CheckCircle,
  Truck,
  XCircle,
  ArrowRight,
  Search,
  Filter,
  DollarSign,
  Phone,
  User,
  Store,
} from 'lucide-react';
import { useAdminStore } from '../../store/admin/adminStore';
import { AdminOrder } from '../../types/admin';
import {
  FeastoEditorialHeading,
  FeastoOperationalStatement,
  FeastoSectionHeader,
  FeastoStatus,
  FeastoButton,
  FeastoTimeline,
  FeastoDetailPanel,
  FeastoDataTable,
  FeastoColumn,
} from '@/components/design-system';

export const Orders: React.FC = () => {
  const { orders, updateOrderStatus } = useAdminStore();
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.restaurantName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns: FeastoColumn<AdminOrder>[] = [
    {
      key: 'id',
      header: 'ORDER REF',
      render: (item) => (
        <button
          onClick={() => setSelectedOrder(item)}
          className="font-mono font-bold text-white hover:text-[#D7F04A] transition-colors cursor-pointer text-left"
        >
          {item.id}
        </button>
      ),
    },
    {
      key: 'customer',
      header: 'CUSTOMER',
      render: (item) => (
        <div>
          <strong className="text-white font-bold block">{item.customerName}</strong>
          <span className="font-mono text-[10px] text-[#8E929C]">Direct Order</span>
        </div>
      ),
    },
    {
      key: 'restaurant',
      header: 'MERCHANT',
      render: (item) => (
        <span className="font-mono text-xs text-[#8E929C]">{item.restaurantName}</span>
      ),
    },
    {
      key: 'time',
      header: 'PLACED AT',
      render: (item) => (
        <span className="font-mono text-xs text-[#8E929C]">
          {new Date(item.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'total',
      header: 'TOTAL VALUE',
      align: 'right',
      render: (item) => (
        <span className="font-mono font-bold text-white text-sm">
          ₹{item.total.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (item) => <FeastoStatus status={item.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'DISPATCH CONTROL',
      align: 'right',
      render: (item) => (
        <div className="flex gap-1 justify-end font-mono">
          {item.status === 'placed' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateOrderStatus(item.id, 'preparing');
              }}
              className="px-2 py-1 bg-white/10 hover:bg-[#D7F04A] hover:text-[#141518] text-white text-[10px] font-bold uppercase transition-colors cursor-pointer border border-white/20"
            >
              Fire
            </button>
          )}
          {item.status === 'preparing' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateOrderStatus(item.id, 'dispatched');
              }}
              className="px-2 py-1 bg-[#1B3BFF] hover:bg-[#1530d9] text-white text-[10px] font-bold uppercase transition-colors cursor-pointer"
            >
              Dispatch Rider
            </button>
          )}
          {item.status === 'dispatched' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateOrderStatus(item.id, 'delivered');
              }}
              className="px-2 py-1 bg-[#15803D] hover:bg-[#126b33] text-white text-[10px] font-bold uppercase transition-colors cursor-pointer"
            >
              Complete
            </button>
          )}
        </div>
      ),
    },
  ];

  const orderTimeline = selectedOrder
    ? [
        {
          id: 'placed',
          label: 'Order Validated',
          timestamp: new Date(selectedOrder.placedAt).toLocaleTimeString(),
          status: 'completed' as const,
          description: `Gateway authorized via ${selectedOrder.paymentMethod.toUpperCase()}`,
        },
        {
          id: 'preparing',
          label: 'Kitchen Preparation',
          status: ['preparing', 'dispatched', 'delivered'].includes(selectedOrder.status)
            ? ('completed' as const)
            : selectedOrder.status === 'placed'
            ? ('current' as const)
            : ('upcoming' as const),
          description: 'Hearth firing at merchant station',
        },
        {
          id: 'dispatched',
          label: 'Courier Dispatched',
          status: ['dispatched', 'delivered'].includes(selectedOrder.status)
            ? ('completed' as const)
            : selectedOrder.status === 'preparing'
            ? ('current' as const)
            : ('upcoming' as const),
          description: 'Rider GPS lock active on delivery vector',
        },
        {
          id: 'delivered',
          label: 'Customer Handover',
          status: selectedOrder.status === 'delivered' ? ('completed' as const) : ('upcoming' as const),
          description: 'OTP confirmation signed off',
        },
      ]
    : [];

  return (
    <div className="w-full space-y-6 text-left select-none text-[#F3F0E8]">
      {/* ── SECTION HEADER ── */}
      <FeastoSectionHeader
        index="03"
        title="LIVE ORDER LOGISTICS CONSOLE"
        subtitle="Global platform order dispatches, merchant preparation states, and delivery telemetry."
        dark
      />

      {/* ── FILTER & SEARCH HUD ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#14161B] border border-white/10 font-mono text-xs">
        {/* Status Filters */}
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {['all', 'placed', 'preparing', 'dispatched', 'delivered', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 uppercase font-bold tracking-wider transition-colors cursor-pointer border ${
                statusFilter === tab
                  ? 'bg-[#1B3BFF] text-white border-[#1B3BFF]'
                  : 'bg-[#1D212A] text-[#8E929C] border-white/10 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E929C]" />
          <input
            type="text"
            placeholder="Search Order ID, guest, restaurant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#1D212A] border border-white/10 focus:border-[#1B3BFF] focus:outline-none text-xs font-mono text-white placeholder:text-[#8E929C]"
          />
        </div>
      </div>

      {/* ── MAIN WORKSPACE: SPLIT TABLE + DETAIL PANEL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Orders Table */}
        <div className={selectedOrder ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <FeastoDataTable
            columns={columns}
            data={filteredOrders}
            keyExtractor={(item) => item.id}
            onRowClick={(item) => setSelectedOrder(item)}
            selectedId={selectedOrder?.id}
            dark
          />
        </div>

        {/* Selected Order Inspector Panel */}
        {selectedOrder && (
          <div className="lg:col-span-4 sticky top-20">
            <FeastoDetailPanel
              title={`ORDER ${selectedOrder.id}`}
              subtitle={`Placed at ${new Date(selectedOrder.placedAt).toLocaleTimeString()}`}
              index="03"
              onClose={() => setSelectedOrder(null)}
              dark
              actions={
                <div className="flex items-center justify-between gap-2">
                  <FeastoButton
                    variant="danger"
                    size="sm"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                  >
                    EMERGENCY CANCEL
                  </FeastoButton>

                  {selectedOrder.status === 'placed' && (
                    <FeastoButton
                      variant="acid"
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'preparing')}
                    >
                      FIRE TO KITCHEN →
                    </FeastoButton>
                  )}
                  {selectedOrder.status === 'preparing' && (
                    <FeastoButton
                      variant="accent"
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'dispatched')}
                    >
                      ASSIGN RIDER →
                    </FeastoButton>
                  )}
                  {selectedOrder.status === 'dispatched' && (
                    <FeastoButton
                      variant="acid"
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                    >
                      COMPLETE DROP ✓
                    </FeastoButton>
                  )}
                </div>
              }
            >
              {/* Receipt Dossier */}
              <div className="p-4 bg-[#1D212A] border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8E929C] uppercase">GUEST</span>
                  <strong className="text-white">{selectedOrder.customerName}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8E929C] uppercase">MERCHANT</span>
                  <strong className="text-white">{selectedOrder.restaurantName}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8E929C] uppercase">PAYMENT GATEWAY</span>
                  <strong className="text-[#D7F04A]">{selectedOrder.paymentMethod.toUpperCase()}</strong>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[10px] text-[#8E929C] uppercase font-bold">TOTAL GMV</span>
                  <strong className="text-base font-black text-white">₹{selectedOrder.total}</strong>
                </div>
              </div>

              {/* Status Milestone Timeline */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#8E929C] block">
                  DISPATCH MILESTONES
                </span>
                <FeastoTimeline steps={orderTimeline} dark />
              </div>
            </FeastoDetailPanel>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
