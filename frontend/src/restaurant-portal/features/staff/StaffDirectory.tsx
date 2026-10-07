import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserCheck, ShieldAlert, Phone, Mail, Edit2, Archive, CheckCircle2, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';
import usePortalStaffStore from '../../store/portalStaffStore';
import type { StaffMember } from '../../store/portalStaffStore';
import Card from '../../components/ui/Card';

export const StaffDirectory: React.FC = () => {
  const navigate = useNavigate();
  const {
    staff,
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    clearFilters,
    deactivateStaff
  } = usePortalStaffStore();

  // Filters application
  const filteredStaff = staff.filter((m) => {
    // Search term check
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchEmail = m.email.toLowerCase().includes(q);
      if (!matchName && !matchEmail) return false;
    }

    // Role filter
    if (filters.role !== 'all' && m.role !== filters.role) return false;

    // Branch filter
    if (filters.branch !== 'all' && m.branch !== filters.branch) return false;

    // Status filter
    if (filters.status !== 'all' && m.status !== filters.status) return false;

    return true;
  });

  const getAttendanceBadge = (m: StaffMember) => {
    const styles: Record<string, string> = {
      present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      late: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse',
      'on-leave': 'bg-neutral-50 text-neutral-400 border-neutral-200',
      absent: 'bg-red-50 text-red-700 border-red-200',
      unassigned: 'bg-neutral-50 text-neutral-400 border-neutral-100',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-wider ${styles[m.attendance] || styles.unassigned}`}>
        {m.attendance}
      </span>
    );
  };

  const getRoleLabel = (role: string) => {
    return role.replace('-', ' ');
  };

  // Branch unique candidates
  const branchesList = Array.from(new Set(staff.map((s) => s.branch)));

  return (
    <div className="space-y-5 text-left select-none">
      
      {/* Directory filters bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        {/* Search */}
        <div className="relative w-full sm:w-64 font-mono">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52555F]" />
          <input
            type="text"
            placeholder="Search roster by name/email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-[#FAF8F5] border border-[#141518]/20 focus:border-[#141518] focus:outline-none text-xs font-semibold text-[#141518] transition-all placeholder:text-[#52555F]/60"
          />
        </div>

        {/* Filters select panel */}
        <div className="flex flex-wrap items-center gap-2 font-mono">
          {/* Roles */}
          <select
            value={filters.role}
            onChange={(e) => setFilter('role', e.target.value)}
            className="px-2.5 py-1.5 bg-[#FAF8F5] border border-[#141518]/20 focus:border-[#141518] focus:outline-none text-[10px] font-bold uppercase tracking-wider text-[#141518] cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="owner">Owner / Admin</option>
            <option value="manager">Store Manager</option>
            <option value="kitchen-staff">Kitchen Chef</option>
            <option value="cashier">Cashier</option>
            <option value="inventory-staff">Inventory Staff</option>
            <option value="delivery-coordinator">Delivery Coordinator</option>
          </select>

          {/* Branches */}
          <select
            value={filters.branch}
            onChange={(e) => setFilter('branch', e.target.value)}
            className="px-2.5 py-1.5 bg-[#FAF8F5] border border-[#141518]/20 focus:border-[#141518] focus:outline-none text-[10px] font-bold uppercase tracking-wider text-[#141518] cursor-pointer"
          >
            <option value="all">All Branches</option>
            {branchesList.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => setFilter('status', e.target.value)}
            className="px-2.5 py-1.5 bg-[#FAF8F5] border border-[#141518]/20 focus:border-[#141518] focus:outline-none text-[10px] font-bold uppercase tracking-wider text-[#141518] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Members</option>
            <option value="inactive">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      {filteredStaff.length > 0 ? (
        <div className="border border-neutral-200/80 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)] bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-neutral-50/70 border-b border-neutral-200">
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Staff Name</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left font-heading">Role</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Branch Allocation</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Today Attendance</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Roster Status</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredStaff.map((m) => (
                <tr key={m.id} className="hover:bg-neutral-50/30 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col text-left gap-0.5">
                      <span className="text-xs font-bold text-neutral-800">{m.name}</span>
                      <span className="text-[10px] text-neutral-400 font-semibold">{m.email}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-black text-neutral-600 uppercase tracking-wide text-left">
                    {getRoleLabel(m.role)}
                  </td>
                  <td className="p-4 text-xs text-neutral-500 font-semibold text-left">{m.branch}</td>
                  <td className="p-4 text-left">{getAttendanceBadge(m)}</td>
                  <td className="p-4">
                    {/* Status badge active / deactivate button */}
                    <button
                      onClick={() => deactivateStaff(m.id)}
                      className={`px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        m.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-neutral-50 text-neutral-400 border-neutral-200'
                      }`}
                    >
                      {m.status}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/restaurant-portal/staff/${m.id}`)}
                        className="px-2.5 py-1.5 border border-neutral-200 hover:bg-neutral-50 text-[9px] font-black uppercase tracking-wider text-neutral-600 rounded-lg transition-colors cursor-pointer"
                      >
                        Profile & Shifts
                      </button>
                      <button
                        onClick={() => navigate(`/restaurant-portal/staff/${m.id}/edit`)}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/30">
          <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            No Staff Members Found
          </h4>
          <p className="text-[10px] text-neutral-400 mt-1 max-w-sm leading-relaxed">
            We couldn't find any employees matching your search or filters. Click clear to reset search lists.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-3 py-1.5 border border-neutral-200 hover:bg-neutral-100 text-[10px] font-black uppercase tracking-wider text-neutral-600 rounded-xl transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* AI Staff scheduler optimization tip */}
      <div className="p-3.5 bg-[#FAF8F5] border border-[#141518]/20 shadow-[3px_3px_0px_#141518] flex items-start gap-2.5 font-mono">
        <Sparkles size={14} className="text-[#1B3BFF] shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-[#141518] uppercase tracking-widest font-heading">AI Staff Scheduler</p>
          <p className="text-[10px] text-[#52555F] mt-0.5 leading-relaxed">
            Tanaka Yoshi (Kitchen Chef) has contributed 92% of the kitchen throughput. We suggest scheduling Tanaka on peak dinner slots to maintain lower prep wait averages.
          </p>
        </div>
      </div>

    </div>
  );
};

export default StaffDirectory;
