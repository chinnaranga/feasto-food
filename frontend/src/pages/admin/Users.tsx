import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Filter, ShieldCheck, UserX, UserCheck, Eye, Shield } from 'lucide-react';
import useAdminStore, { AdminUser } from '../../store/admin/adminStore';
import { StatusBadge } from './components/AdminComponents';

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

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
            Platform User Directory & Role Privilege Matrix
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage user accounts, assign RBAC permissions, suspend policy violators, and audit login access history
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-2xs">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                userTypeFilter === tab.id
                  ? 'bg-neutral-900 text-white shadow-3xs'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search name, email, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#e35205]"
          />
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                <th className="py-3 px-4">User Name</th>
                <th className="py-3 px-4">Email / Phone</th>
                <th className="py-3 px-4">Account Role</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400 font-bold text-xs">
                    No user accounts match the selected category filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-black text-neutral-900">
                      <button
                        onClick={() => navigate(`/admin/users/${u.id}`)}
                        className="hover:text-[#e35205] cursor-pointer text-left block"
                      >
                        <div>{u.name}</div>
                        <span className="text-[10px] font-mono text-neutral-400 font-normal">
                          {u.userType.replace('_', ' ')}
                        </span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-800">{u.email}</div>
                      <span className="text-[10px] text-neutral-400 font-normal">{u.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700 font-bold">{u.role}</td>
                    <td className="py-3.5 px-4 text-neutral-500">{u.lastLoginAt}</td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/admin/users/${u.id}`)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                          title="Inspect Profile & Permissions"
                        >
                          <Eye size={14} />
                        </button>
                        {u.status === 'active' ? (
                          <button
                            onClick={() => suspendUser(u.id)}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => activateUser(u.id)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-3xs"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
