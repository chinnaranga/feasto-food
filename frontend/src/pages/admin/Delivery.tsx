import React, { useState } from 'react';
import {
  Map,
  ShieldCheck,
  Compass,
  Search,
  Filter,
  Navigation,
  Phone,
  Truck,
  Star,
  CheckCircle2,
  Radio,
} from 'lucide-react';
import { useAdminStore } from '../../store/admin/adminStore';
import { AdminDeliveryPartner } from '../../types/admin';
import {
  FeastoSectionHeader,
  FeastoStatus,
  FeastoButton,
  FeastoDataTable,
  FeastoColumn,
  FeastoDetailPanel,
} from '@/components/design-system';

export const Delivery: React.FC = () => {
  const { deliveryPartners } = useAdminStore();
  const [selectedPartner, setSelectedPartner] = useState<AdminDeliveryPartner | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredPartners = deliveryPartners.filter((p) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && p.status === 'active') ||
      (statusFilter === 'on_delivery' && p.status === 'on_delivery') ||
      (statusFilter === 'offline' && p.status === 'offline');
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.toLowerCase().includes(search.toLowerCase()) ||
      p.zone.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns: FeastoColumn<AdminDeliveryPartner>[] = [
    {
      key: 'name',
      header: 'COURIER PROFILE',
      render: (item) => (
        <button
          onClick={() => setSelectedPartner(item)}
          className="text-left hover:text-[#D7F04A] transition-colors cursor-pointer block"
        >
          <strong className="text-white font-heading font-bold text-sm block">
            {item.name}
          </strong>
          <span className="font-mono text-[10px] text-[#8E929C]">{item.phone}</span>
        </button>
      ),
    },
    {
      key: 'zone',
      header: 'ASSIGNED SECTOR',
      render: (item) => <span className="font-mono text-xs text-[#8E929C]">{item.zone}</span>,
    },
    {
      key: 'tasks',
      header: 'ACTIVE DISPATCH',
      render: (item) => (
        <span
          className={`font-mono text-xs font-bold ${item.currentDeliveries > 0 ? 'text-[#D7F04A]' : 'text-[#8E929C]'
            }`}
        >
          {item.currentDeliveries > 0 ? `${item.currentDeliveries} in motion` : 'Standby'}
        </span>
      ),
    },
    {
      key: 'drops',
      header: 'COMPLETED DROPS',
      align: 'right',
      render: (item) => (
        <span className="font-mono font-bold text-white text-xs">{item.deliveriesCount} drops</span>
      ),
    },
    {
      key: 'rating',
      header: 'RATING',
      align: 'right',
      render: (item) => (
        <span className="font-mono font-bold text-amber-400 text-xs">
          ★ {item.rating.toFixed(1)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'TELEMETRY STATUS',
      render: (item) => <FeastoStatus status={item.status} size="sm" />,
    },
  ];

  return (
    <div className="w-full space-y-6 text-left select-none text-[#F3F0E8]">
      {/* ── SECTION HEADER ── */}
      <FeastoSectionHeader
        index="05"
        title="FLEET TELEMETRY & COURIER COMMAND"
        subtitle="Real-time GPS coordinates, sector quadrant allocation, and trip completion metrics across all fleet vessels."
        dark
      />

      {/* ── FILTER & SEARCH HUD ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#14161B] border border-white/10 font-mono text-xs">
        {/* Status Tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {['all', 'active', 'on_delivery', 'offline'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 uppercase font-bold tracking-wider transition-colors cursor-pointer border ${statusFilter === tab
                  ? 'bg-[#1B3BFF] text-white border-[#1B3BFF]'
                  : 'bg-[#1D212A] text-[#8E929C] border-white/10 hover:text-white'
                }`}
            >
              {tab === 'on_delivery' ? 'On Delivery' : tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E929C]" />
          <input
            type="text"
            placeholder="Search courier name, phone, zone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#1D212A] border border-white/10 focus:border-[#1B3BFF] focus:outline-none text-xs font-mono text-white placeholder:text-[#8E929C]"
          />
        </div>
      </div>

      {/* ── MAIN WORKSPACE: SPLIT TABLE + INSPECTOR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={selectedPartner ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <FeastoDataTable
            columns={columns}
            data={filteredPartners}
            keyExtractor={(item) => item.id}
            onRowClick={(item) => setSelectedPartner(item)}
            selectedId={selectedPartner?.id}
            dark
          />
        </div>

        {/* Selected Courier Inspector Panel */}
        {selectedPartner && (
          <div className="lg:col-span-4 sticky top-20">
            <FeastoDetailPanel
              title={selectedPartner.name}
              subtitle={`ID: ${selectedPartner.id} · ${selectedPartner.zone}`}
              index="05"
              onClose={() => setSelectedPartner(null)}
              dark
              actions={
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={`tel:${selectedPartner.phone}`}
                    className="px-3 py-2 bg-[#1B3BFF] hover:bg-[#1530d9] text-white font-mono text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
                  >
                    <Phone size={12} />
                    <span>CALL COURIER</span>
                  </a>
                  <FeastoButton
                    variant="acid"
                    size="sm"
                    onClick={() => alert(`Pinged courier ${selectedPartner.name}`)}
                  >
                    SEND DISPATCH PING →
                  </FeastoButton>
                </div>
              }
            >
              <div className="p-4 bg-[#1D212A] border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8E929C] uppercase">STATUS</span>
                  <FeastoStatus status={selectedPartner.status} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8E929C] uppercase">SECTOR QUADRANT</span>
                  <strong className="text-white">{selectedPartner.zone}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8E929C] uppercase">CURRENT LOAD</span>
                  <strong className="text-[#D7F04A]">
                    {selectedPartner.currentDeliveries} active trip(s)
                  </strong>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[10px] text-[#8E929C] uppercase">TOTAL RECORD</span>
                  <strong className="text-white">{selectedPartner.deliveriesCount} drops completed</strong>
                </div>
              </div>

              <div className="p-4 bg-[#14161B] border border-white/10 space-y-2 font-mono text-xs">
                <span className="text-[10px] text-[#8E929C] uppercase block">
                  SAT-LOCK TELEMETRY
                </span>
                <div className="flex items-center gap-2 text-[#15803D] font-bold">
                  <Radio size={12} className="animate-pulse" />
                  <span>5G RTK SIGNAL LOCKED · 3M PRECISION</span>
                </div>
                <p className="text-[11px] text-[#8E929C]">
                  Heading North-West along Perry Cross toward Bandra West.
                </p>
              </div>
            </FeastoDetailPanel>
          </div>
        )}
      </div>
    </div>
  );
};

export default Delivery;
