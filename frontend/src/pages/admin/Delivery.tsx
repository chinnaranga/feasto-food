import React from 'react';
import { useAdminStore } from '../../store/admin/adminStore';
import { SmartTable, TableColumn } from '../../components/admin/SmartTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { AdminDeliveryPartner } from '../../types/admin';
import { DashboardCard } from '../../components/admin/DashboardCard';
import { Map, ShieldCheck, Compass } from 'lucide-react';

export const Delivery: React.FC = () => {
  const { deliveryPartners } = useAdminStore();

  const columns: TableColumn<AdminDeliveryPartner>[] = [
    {
      key: 'name',
      label: 'Rider Profile',
      sortable: true,
      render: (item) => (
        <div className="text-left flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 font-bold flex items-center justify-center text-xs">
            {item.name.substring(0, 2)}
          </div>
          <div>
            <div className="font-extrabold text-text-primary">{item.name}</div>
            <div className="text-[10px] text-text-muted mt-0.5">{item.phone}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'zone',
      label: 'Assigned Zone',
      sortable: true,
    },
    {
      key: 'currentDeliveries',
      label: 'Current Tasks',
      sortable: true,
      render: (item) => (
        <span className={`font-semibold ${item.currentDeliveries > 0 ? 'text-brand-orange' : 'text-text-muted'}`}>
          {item.currentDeliveries} active order(s)
        </span>
      ),
    },
    {
      key: 'deliveriesCount',
      label: 'Total Completed',
      sortable: true,
      render: (item) => <span className="font-mono">{item.deliveriesCount} drops</span>,
    },
    {
      key: 'rating',
      label: 'Rider Rating',
      sortable: true,
      render: (item) => <span className="font-bold text-text-primary">★ {item.rating.toFixed(1)}</span>,
    },
    {
      key: 'status',
      label: 'Online Status',
      sortable: true,
      render: (item) => <StatusBadge value={item.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div className="text-left">
          <h2 className="text-lg font-extrabold text-text-primary tracking-tight font-heading">
            Logistics Dispatch Center
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Track active delivery courier coordinates, optimize dispatch zones, and evaluate customer feedback ratings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Map Widget (5 Columns) */}
        <div className="lg:col-span-5">
          <DashboardCard
            title="Active Dispatch Zones"
            description="Geofenced operational delivery quadrants and live rider density indicators."
            action={
              <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                <Compass size={10} className="animate-spin" /> GPS Link Active
              </span>
            }
          >
            {/* Visual Geofence Grid representing Indiranagar, Koramangala, Whitefield */}
            <div className="h-72 w-full border border-border-main rounded-xl bg-surface-bg/30 relative overflow-hidden flex flex-col justify-between p-4">
              {/* Geofenced Dots/Grid visual mapping */}
              <div className="absolute inset-0 opacity-10 grid grid-cols-6 grid-rows-6 pointer-events-none">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="border-t border-l border-text-primary/50" />
                ))}
              </div>

              {/* Mock Zone Indicators */}
              <div className="absolute top-8 left-10 text-left bg-white border border-border-main px-3 py-1.5 rounded-lg shadow-sm">
                <p className="text-[10px] font-extrabold text-text-primary">Indiranagar (Zone A)</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success-main" />
                  <span className="text-[9px] text-text-secondary">4 Riders Online</span>
                </div>
              </div>

              <div className="absolute bottom-16 right-10 text-left bg-white border border-border-main px-3 py-1.5 rounded-lg shadow-sm">
                <p className="text-[10px] font-extrabold text-text-primary">Koramangala (Zone B)</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success-main animate-pulse" />
                  <span className="text-[9px] text-text-secondary">8 Riders Active</span>
                </div>
              </div>

              {/* Status footer inside visual map */}
              <div className="mt-auto flex items-center justify-between text-[10px] bg-white border border-border-main p-2.5 rounded-lg relative z-10">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Map size={14} className="text-blue-500" />
                  <span>Geofencing: 3 Active Quadrants</span>
                </div>
                <div className="flex items-center gap-1 text-success-main font-bold">
                  <ShieldCheck size={12} />
                  <span>SLA Met (98%)</span>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Right Column: Active Courier Table (7 Columns) */}
        <div className="lg:col-span-7">
          <SmartTable
            data={deliveryPartners}
            columns={columns}
            searchPlaceholder="Search active riders by name or phone..."
            searchFields={['name', 'phone', 'zone']}
            filterField="status"
            filterOptions={[
              { value: 'active', label: 'Idle / Active Riders' },
              { value: 'on_delivery', label: 'Riders En Route' },
              { value: 'offline', label: 'Offline / Sign-outs' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
