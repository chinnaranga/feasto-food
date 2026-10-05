import React, { useState } from 'react';
import { useAdminStore } from '../../store/admin/adminStore';
import { SmartTable, TableColumn } from '../../components/admin/SmartTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { AdminOrder } from '../../types/admin';
import { Button } from '@/components/ui/Button';
import { Clock, ShieldAlert, CheckCircle, Truck, XCircle, ArrowRight } from 'lucide-react';

export const Orders: React.FC = () => {
  const { orders, updateOrderStatus } = useAdminStore();
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const columns: TableColumn<AdminOrder>[] = [
    {
      key: 'id',
      label: 'Order ID',
      sortable: true,
      render: (item) => (
        <button
          onClick={() => setSelectedOrder(item)}
          className="font-mono font-bold text-brand-orange hover:underline text-left cursor-pointer"
        >
          {item.id}
        </button>
      ),
    },
    {
      key: 'customerName',
      label: 'Customer Name',
      sortable: true,
    },
    {
      key: 'restaurantName',
      label: 'Restaurant',
      sortable: true,
    },
    {
      key: 'placedAt',
      label: 'Placed At',
      sortable: true,
      render: (item) => (
        <div className="text-left font-mono">
          {new Date(item.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Schedule Type',
      sortable: true,
      render: (item) => (
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Clock size={11} className="text-text-muted" />
          <span className="capitalize">{item.type}</span>
        </span>
      ),
    },
    {
      key: 'total',
      label: 'Order Total',
      sortable: true,
      render: (item) => <span className="font-bold">₹{item.total.toLocaleString()}</span>,
    },
    {
      key: 'fraudAlert',
      label: 'Fraud Flag',
      sortable: true,
      render: (item) =>
        item.fraudAlert ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-error-main/20 bg-error-main/5 text-error-main text-[10px] font-black uppercase">
            <ShieldAlert size={10} /> Flagged
          </span>
        ) : (
          <span className="text-[10px] text-text-muted font-bold">—</span>
        ),
    },
    {
      key: 'status',
      label: 'Order Status',
      sortable: true,
      render: (item) => <StatusBadge value={item.status} />,
    },
    {
      key: 'actions',
      label: 'Dispatch Actions',
      render: (item) => (
        <div className="flex gap-1.5 justify-start">
          {item.status === 'placed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateOrderStatus(item.id, 'preparing')}
              className="h-7 text-[10px] font-bold py-1 px-2 rounded-lg"
            >
              Start Prep
            </Button>
          )}
          {item.status === 'preparing' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => updateOrderStatus(item.id, 'dispatched')}
              className="h-7 text-[10px] font-bold py-1 px-2 rounded-lg"
            >
              <Truck size={12} /> Dispatch Rider
            </Button>
          )}
          {item.status === 'dispatched' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => updateOrderStatus(item.id, 'delivered')}
              className="h-7 text-[10px] font-bold py-1 px-2 rounded-lg"
            >
              Complete Order
            </Button>
          )}
        </div>
      ),
    },
  ];

  const bulkActions = [
    {
      label: 'Cancel Selected',
      onClick: (selected: AdminOrder[]) => {
        selected.forEach((o) => updateOrderStatus(o.id, 'cancelled'));
      },
      variant: 'danger' as const,
    },
    {
      label: 'Mark Prepared',
      onClick: (selected: AdminOrder[]) => {
        selected.forEach((o) => updateOrderStatus(o.id, 'dispatched'));
      },
      variant: 'outline' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div className="text-left">
          <h2 className="text-lg font-extrabold text-text-primary tracking-tight font-heading">
            Live Order Logistics Console
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Monitor real-time customer order queues, dispatch contracted logistics riders, and review system risk flags.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Data Grid list */}
        <div className={selectedOrder ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <SmartTable
            data={orders}
            columns={columns}
            searchPlaceholder="Search orders by ID or customer..."
            searchFields={['id', 'customerName', 'restaurantName']}
            filterField="status"
            filterOptions={[
              { value: 'placed', label: 'Placed Requests' },
              { value: 'preparing', label: 'In Preparation' },
              { value: 'dispatched', label: 'Dispatched (With Rider)' },
              { value: 'delivered', label: 'Completed Deliveries' },
              { value: 'cancelled', label: 'Cancelled Audits' },
            ]}
            bulkActions={bulkActions}
          />
        </div>

        {/* Right Column: Selected Order Details Pane */}
        {selectedOrder && (
          <div className="lg:col-span-4 bg-primary-bg border border-border-main rounded-xl p-5 shadow-xs text-left animate-fade-in sticky top-20">
            <div className="flex items-center justify-between gap-4 border-b border-border-main/50 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase">Selected Receipt</span>
                <h3 className="text-sm font-extrabold text-brand-orange font-heading tracking-tight mt-0.5">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-bg transition-main cursor-pointer"
              >
                <XCircle size={16} />
              </button>
            </div>

            {/* Receipt details */}
            <div className="space-y-4 text-xs">
              <div className="flex justify-between">
                <span className="text-text-secondary">Customer</span>
                <span className="font-semibold text-text-primary">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Merchant Restaurant</span>
                <span className="font-semibold text-text-primary">{selectedOrder.restaurantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Payment Method</span>
                <span className="font-bold text-text-primary uppercase">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Value</span>
                <span className="font-extrabold text-text-primary">₹{selectedOrder.total}</span>
              </div>

              {/* Order Tracking Timeline visual */}
              <div className="border-t border-border-main/50 pt-5 mt-4">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-4">
                  Logistics Tracking Timeline
                </h4>
                <div className="space-y-5 relative pl-4 border-l border-border-main/80 ml-2">
                  
                  {/* Step 1: Placed */}
                  <div className="relative text-left">
                    <div className={`absolute -left-[21px] top-0 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center bg-primary-bg ${
                      ['placed', 'preparing', 'dispatched', 'delivered'].includes(selectedOrder.status)
                        ? 'border-success-main text-success-main'
                        : 'border-border-main text-text-muted'
                    }`}>
                      <CheckCircle size={10} className="fill-current bg-primary-bg rounded-full" />
                    </div>
                    <p className="text-[11px] font-bold text-text-primary">Order Placed & Validated</p>
                    <p className="text-[9px] text-text-muted mt-0.5">
                      Accepted via {selectedOrder.paymentMethod.toUpperCase()} gateway.
                    </p>
                  </div>

                  {/* Step 2: Preparing */}
                  <div className="relative text-left">
                    <div className={`absolute -left-[21px] top-0 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center bg-primary-bg ${
                      ['preparing', 'dispatched', 'delivered'].includes(selectedOrder.status)
                        ? 'border-success-main text-success-main'
                        : 'border-border-main text-text-muted'
                    }`}>
                      <ArrowRight size={8} />
                    </div>
                    <p className="text-[11px] font-bold text-text-primary">Kitchen Preparing Items</p>
                    <p className="text-[9px] text-text-muted mt-0.5">
                      Dishes are currently being cooked.
                    </p>
                  </div>

                  {/* Step 3: Dispatched */}
                  <div className="relative text-left">
                    <div className={`absolute -left-[21px] top-0 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center bg-primary-bg ${
                      ['dispatched', 'delivered'].includes(selectedOrder.status)
                        ? 'border-success-main text-success-main'
                        : 'border-border-main text-text-muted'
                    }`}>
                      <Truck size={10} />
                    </div>
                    <p className="text-[11px] font-bold text-text-primary">Dispatched (Rider GPS Active)</p>
                    <p className="text-[9px] text-text-muted mt-0.5">
                      Logistics rider is en route to gate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
