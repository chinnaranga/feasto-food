import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Eye,
} from 'lucide-react';
import {
  FeastoEditorialHeading,
  FeastoOperationalStatement,
  FeastoSectionHeader,
  FeastoMetric,
  FeastoStatus,
  FeastoButton,
  FeastoDataTable,
  FeastoColumn,
  FeastoDetailPanel,
} from '@/components/design-system';

interface PlatformTransaction {
  id: string;
  orderId: string;
  date: string;
  customerName: string;
  merchantName: string;
  gateway: 'Razorpay' | 'Stripe' | 'UPI' | 'COD';
  grossAmount: number;
  commissionAmount: number;
  riderPayout: number;
  merchantSettlement: number;
  status: 'settled' | 'pending' | 'refunded' | 'failed';
}

export const Payments: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [selectedTx, setSelectedTx] = useState<PlatformTransaction | null>(null);

  const transactions: PlatformTransaction[] = [
    {
      id: 'TXN-90241',
      orderId: '#1814',
      date: 'Today · 16:54',
      customerName: 'Aditya Roy',
      merchantName: 'Spice Route Kitchen',
      gateway: 'UPI',
      grossAmount: 940,
      commissionAmount: 141,
      riderPayout: 120,
      merchantSettlement: 679,
      status: 'settled',
    },
    {
      id: 'TXN-90240',
      orderId: '#1809',
      date: 'Today · 16:51',
      customerName: 'Kavita Mehta',
      merchantName: 'La Pasta Bella',
      gateway: 'Razorpay',
      grossAmount: 680,
      commissionAmount: 102,
      riderPayout: 95,
      merchantSettlement: 483,
      status: 'settled',
    },
    {
      id: 'TXN-90239',
      orderId: '#1805',
      date: 'Today · 16:48',
      customerName: 'Rohan Deshmukh',
      merchantName: 'Sora Japanese Dining',
      gateway: 'Stripe',
      grossAmount: 1420,
      commissionAmount: 213,
      riderPayout: 180,
      merchantSettlement: 1027,
      status: 'settled',
    },
    {
      id: 'TXN-90238',
      orderId: '#1801',
      date: 'Today · 16:32',
      customerName: 'Sneha Patel',
      merchantName: 'Artisan Table',
      gateway: 'UPI',
      grossAmount: 540,
      commissionAmount: 81,
      riderPayout: 80,
      merchantSettlement: 379,
      status: 'pending',
    },
    {
      id: 'TXN-90237',
      orderId: '#1796',
      date: 'Today · 15:10',
      customerName: 'Vikram Seth',
      merchantName: 'Copper Chimney',
      gateway: 'Razorpay',
      grossAmount: 820,
      commissionAmount: 0,
      riderPayout: 0,
      merchantSettlement: 0,
      status: 'refunded',
    },
  ];

  const filteredTx = transactions.filter((t) => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.orderId.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.merchantName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns: FeastoColumn<PlatformTransaction>[] = [
    {
      key: 'id',
      header: 'TRANSACTION REF',
      render: (t) => (
        <button
          onClick={() => setSelectedTx(t)}
          className="text-left font-mono font-bold text-white hover:text-[#D7F04A] transition-colors cursor-pointer block"
        >
          {t.id}
          <span className="text-[10px] text-[#8E929C] block">{t.orderId}</span>
        </button>
      ),
    },
    {
      key: 'date',
      header: 'TIMESTAMP',
      render: (t) => <span className="font-mono text-xs text-[#8E929C]">{t.date}</span>,
    },
    {
      key: 'parties',
      header: 'GUEST & MERCHANT',
      render: (t) => (
        <div>
          <strong className="text-white block">{t.customerName}</strong>
          <span className="font-mono text-[10px] text-[#8E929C]">{t.merchantName}</span>
        </div>
      ),
    },
    {
      key: 'gateway',
      header: 'GATEWAY',
      render: (t) => (
        <span className="font-mono text-xs font-bold text-[#D7F04A]">{t.gateway}</span>
      ),
    },
    {
      key: 'gross',
      header: 'GROSS AMOUNT',
      align: 'right',
      render: (t) => (
        <strong className="font-mono font-black text-sm text-white">
          ₹{t.grossAmount.toLocaleString('en-IN')}
        </strong>
      ),
    },
    {
      key: 'settlement',
      header: 'MERCHANT PAYOUT',
      align: 'right',
      render: (t) => (
        <span className="font-mono text-xs text-[#15803D] font-bold">
          ₹{t.merchantSettlement.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'SETTLEMENT STATE',
      render: (t) => <FeastoStatus status={t.status} size="sm" />,
    },
  ];

  return (
    <div className="w-full space-y-8 text-left select-none text-[#F3F0E8]">
      {/* ── SECTION HEADER ── */}
      <FeastoSectionHeader
        index="07"
        title="FINANCIAL OPERATIONS & SETTLEMENTS"
        subtitle="Global platform transaction archive, merchant clearing ledger, gateway reconciliation, and refund auditing."
        dark
      />

      {/* ── KPI FINANCIAL METRICS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <FeastoMetric
          index="01"
          label="TODAY'S PROCESSED GMV"
          value="₹1,84,200"
          delta={{ value: '+14.2% YOY', positive: true }}
          subtitle="Net clearing after tax"
          dark
          highlight
        />

        <FeastoMetric
          index="02"
          label="PLATFORM COMMISSION (15%)"
          value="₹27,630"
          delta={{ value: 'ACTIVE RUN RATE', positive: true }}
          subtitle="Direct Feasto margin"
          dark
        />

        <FeastoMetric
          index="03"
          label="COURIER DISPATCH PAYOUTS"
          value="₹21,480"
          subtitle="Zero payment holdback"
          dark
        />

        <FeastoMetric
          index="04"
          label="REFUND RATIO"
          value="0.38%"
          delta={{ value: 'LOW RISK', positive: true }}
          subtitle="3 claims processed"
          dark
        />
      </div>

      {/* ── FILTER & SEARCH HUD ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#14161B] border border-white/10 font-mono text-xs">
        {/* Status Filter */}
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {['all', 'settled', 'pending', 'refunded', 'failed'].map((tab) => (
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
            placeholder="Search txn, order ref, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#1D212A] border border-white/10 focus:border-[#1B3BFF] focus:outline-none text-xs font-mono text-white placeholder:text-[#8E929C]"
          />
        </div>
      </div>

      {/* ── DATA TABLE & INSPECTOR PANEL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={selectedTx ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <FeastoDataTable
            columns={columns}
            data={filteredTx}
            keyExtractor={(t) => t.id}
            onRowClick={(t) => setSelectedTx(t)}
            selectedId={selectedTx?.id}
            dark
          />
        </div>

        {selectedTx && (
          <div className="lg:col-span-4 sticky top-20">
            <FeastoDetailPanel
              title={selectedTx.id}
              subtitle={`Linked to ${selectedTx.orderId} · ${selectedTx.date}`}
              index="07"
              onClose={() => setSelectedTx(null)}
              dark
            >
              <div className="p-4 bg-[#1D212A] border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8E929C] uppercase">GATEWAY</span>
                  <strong className="text-[#D7F04A]">{selectedTx.gateway}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8E929C] uppercase">GROSS CHARGE</span>
                  <strong className="text-white">₹{selectedTx.grossAmount}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8E929C] uppercase">FEASTO MARGIN (15%)</span>
                  <strong className="text-[#1B3BFF]">₹{selectedTx.commissionAmount}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8E929C] uppercase">COURIER PAYOUT</span>
                  <strong className="text-white">₹{selectedTx.riderPayout}</strong>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[10px] text-[#8E929C] uppercase font-bold">MERCHANT NET</span>
                  <strong className="text-sm font-black text-[#15803D]">
                    ₹{selectedTx.merchantSettlement}
                  </strong>
                </div>
              </div>
            </FeastoDetailPanel>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
