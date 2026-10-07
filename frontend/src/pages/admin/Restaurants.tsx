import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Eye,
  XCircle,
  FileText,
  Store,
} from 'lucide-react';
import useAdminStore, { AdminRestaurant } from '../../store/admin/adminStore';
import {
  FeastoSectionHeader,
  FeastoStatus,
  FeastoButton,
  FeastoDataTable,
  FeastoColumn,
} from '@/components/design-system';

export const AdminRestaurants: React.FC = () => {
  const navigate = useNavigate();
  const { restaurants, verifyRestaurant, suspendRestaurant } = useAdminStore();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      r.branchCode.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns: FeastoColumn<AdminRestaurant>[] = [
    {
      key: 'name',
      header: 'MERCHANT IDENTITY',
      render: (r) => (
        <button
          onClick={() => navigate(`/admin/restaurants/${r.id}`)}
          className="hover:text-[#D7F04A] transition-colors cursor-pointer text-left block"
        >
          <strong className="text-white font-heading font-bold text-sm block">
            {r.name}
          </strong>
          <span className="text-[10px] font-mono text-[#8E929C]">
            BRANCH: {r.branchCode} · {r.city}
          </span>
        </button>
      ),
    },
    {
      key: 'owner',
      header: 'OPERATOR & CONTACT',
      render: (r) => (
        <div className="font-mono text-xs">
          <div className="text-white font-bold">{r.ownerName}</div>
          <span className="text-[10px] text-[#8E929C]">{r.ownerEmail}</span>
        </div>
      ),
    },
    {
      key: 'risk',
      header: 'RISK INDEX',
      align: 'center',
      render: (r) => (
        <span
          className={`font-mono text-xs font-bold px-2 py-0.5 border ${
            r.riskScore > 50
              ? 'bg-[#991B1B]/20 text-red-400 border-red-500/40'
              : 'bg-[#15803D]/20 text-[#15803D] border-[#15803D]/40'
          }`}
        >
          {r.riskScore} / 100
        </span>
      ),
    },
    {
      key: 'status',
      header: 'OPERATIONAL STATUS',
      render: (r) => <FeastoStatus status={r.status} size="sm" />,
    },
    {
      key: 'volume',
      header: 'CUMULATIVE GMV',
      align: 'right',
      render: (r) => (
        <div className="font-mono text-right">
          <strong className="text-white font-black text-sm block">
            ₹{r.grossRevenue.toLocaleString('en-IN')}
          </strong>
          <span className="text-[10px] text-[#8E929C]">{r.totalOrders} tickets cleared</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1 font-mono text-[10px]">
          <button
            onClick={() => navigate(`/admin/restaurants/${r.id}`)}
            className="p-1.5 border border-white/20 text-[#8E929C] hover:text-white hover:border-white transition-colors cursor-pointer"
            title="Inspect dossier"
          >
            <Eye size={12} />
          </button>
          {r.status !== 'verified' && (
            <button
              onClick={() => verifyRestaurant(r.id)}
              className="px-2 py-1 bg-[#D7F04A] hover:bg-[#c6df3d] text-[#141518] font-bold uppercase cursor-pointer"
            >
              Approve
            </button>
          )}
          {r.status !== 'suspended' && (
            <button
              onClick={() => suspendRestaurant(r.id)}
              className="px-2 py-1 bg-[#991B1B]/20 hover:bg-[#991B1B] text-white border border-red-500/30 font-bold uppercase cursor-pointer"
            >
              Suspend
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6 text-left select-none text-[#F3F0E8]">
      {/* ── SECTION HEADER ── */}
      <FeastoSectionHeader
        index="04"
        title="RESTAURANT OVERSIGHT DIRECTORY"
        subtitle="Manage merchant onboarding certifications (FSSAI, GST), audit operational hearth states, and enforce network compliance."
        dark
      />

      {/* ── FILTER & SEARCH HUD ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#14161B] border border-white/10 font-mono text-xs">
        {/* Status Filters */}
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {['all', 'pending', 'verified', 'flagged', 'suspended'].map((tab) => (
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
            placeholder="Search name, owner, branch code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#1D212A] border border-white/10 focus:border-[#1B3BFF] focus:outline-none text-xs font-mono text-white placeholder:text-[#8E929C]"
          />
        </div>
      </div>

      {/* ── DATA TABLE ── */}
      <FeastoDataTable
        columns={columns}
        data={filteredRestaurants}
        keyExtractor={(r) => r.id}
        dark
      />
    </div>
  );
};

export default AdminRestaurants;
