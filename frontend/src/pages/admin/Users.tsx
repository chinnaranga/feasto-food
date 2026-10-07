import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  UserX,
  UserCheck,
  Eye,
  Shield,
  User,
} from 'lucide-react';
import useAdminStore, { AdminUser } from '../../store/admin/adminStore';
import {
  FeastoSectionHeader,
  FeastoStatus,
  FeastoButton,
  FeastoDataTable,
  FeastoColumn,
} from '@/components/design-system';

export const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const { users, suspendUser, activateUser } = useAdminStore();

  const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredUsers = users.filter((u) => {
    const matchesType = userTypeFilter === 'all' || u.userType === userTypeFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const columns: FeastoColumn<AdminUser>[] = [
    {
      key: 'name',
      header: 'USER / CUSTOMER',
      render: (u) => (
        <button
          onClick={() => navigate(`/admin/users/${u.id}`)}
          className="hover:text-[#D7F04A] transition-colors cursor-pointer text-left block"
        >
          <strong className="text-white font-heading font-bold text-sm block">
            {u.name}
          </strong>
          <span className="text-[10px] font-mono text-[#8E929C]">ID: {u.id}</span>
        </button>
      ),
    },
    {
      key: 'contact',
      header: 'EMAIL & PHONE',
      render: (u) => (
        <div className="font-mono text-xs">
          <div className="text-white font-bold">{u.email}</div>
          <span className="text-[10px] text-[#8E929C]">{u.phone}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'ACCOUNT ROLE',
      render: (u) => (
        <span className="font-mono text-xs text-[#8E929C] uppercase font-bold">
          {u.role}
        </span>
      ),
    },
    {
      key: 'activity',
      header: 'LAST LOGIN',
      render: (u) => (
        <span className="font-mono text-xs text-[#8E929C]">{u.lastLoginAt}</span>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (u) => <FeastoStatus status={u.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      align: 'right',
      render: (u) => (
        <div className="flex items-center justify-end gap-1 font-mono text-[10px]">
          <button
            onClick={() => navigate(`/admin/users/${u.id}`)}
            className="p-1.5 border border-white/20 text-[#8E929C] hover:text-white hover:border-white transition-colors cursor-pointer"
            title="Inspect user profile"
          >
            <Eye size={12} />
          </button>
          {u.status === 'suspended' ? (
            <button
              onClick={() => activateUser(u.id)}
              className="px-2 py-1 bg-[#15803D] hover:bg-[#126b33] text-white font-bold uppercase cursor-pointer"
            >
              Reactivate
            </button>
          ) : (
            <button
              onClick={() => suspendUser(u.id)}
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
        index="06"
        title="USER GOVERNANCE & GUEST DIRECTORY"
        subtitle="Manage customer profiles, assign RBAC permissions, audit authentication records, and enforce trust policies."
        dark
      />

      {/* ── FILTER & SEARCH HUD ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#14161B] border border-white/10 font-mono text-xs">
        {/* Category Filter */}
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'All Users' },
            { id: 'customer', label: 'Customers' },
            { id: 'restaurant_owner', label: 'Restaurant Owners' },
            { id: 'platform_admin', label: 'Platform Admins' },
            { id: 'support', label: 'Support & Finance' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setUserTypeFilter(tab.id)}
              className={`px-3 py-1.5 uppercase font-bold tracking-wider transition-colors cursor-pointer border ${
                userTypeFilter === tab.id
                  ? 'bg-[#1B3BFF] text-white border-[#1B3BFF]'
                  : 'bg-[#1D212A] text-[#8E929C] border-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E929C]" />
          <input
            type="text"
            placeholder="Search name, email, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#1D212A] border border-white/10 focus:border-[#1B3BFF] focus:outline-none text-xs font-mono text-white placeholder:text-[#8E929C]"
          />
        </div>
      </div>

      {/* ── DATA TABLE ── */}
      <FeastoDataTable
        columns={columns}
        data={filteredUsers}
        keyExtractor={(u) => u.id}
        dark
      />
    </div>
  );
};

export default AdminUsers;
