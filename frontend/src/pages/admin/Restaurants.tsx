import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, Filter, CheckCircle2, ShieldAlert, AlertTriangle, Eye, XCircle, FileText } from 'lucide-react';
import useAdminStore, { AdminRestaurant } from '../../store/admin/adminStore';
import { StatusBadge } from './components/AdminComponents';

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

  return (
    <div className="space-y-6 text-left">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
            Platform Restaurant Oversight Directory
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Audit merchant verification documents, approve onboarding accounts, monitor risk scores, and manage suspensions
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {['all', 'pending', 'verified', 'flagged', 'suspended'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-neutral-900 text-white shadow-3xs'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search name, owner, branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#e35205]"
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                <th className="py-3 px-4">Restaurant / Branch</th>
                <th className="py-3 px-4">Owner & Contact</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4 text-center">Risk Score</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Orders / Revenue</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
              {filteredRestaurants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400 font-bold text-xs">
                    No restaurant accounts match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredRestaurants.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-black text-neutral-900">
                      <button
                        onClick={() => navigate(`/admin/restaurants/${r.id}`)}
                        className="hover:text-[#e35205] cursor-pointer text-left block"
                      >
                        <div>{r.name}</div>
                        <span className="text-[10px] font-mono text-neutral-400 font-normal">
                          {r.branchCode}
                        </span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-800">{r.ownerName}</div>
                      <span className="text-[10px] text-neutral-400 font-normal">{r.ownerEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500">{r.city}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-xs font-black ${
                          r.riskScore > 50 ? 'text-red-600' : 'text-emerald-600'
                        }`}
                      >
                        {r.riskScore} / 100
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-black text-neutral-900">₹{r.grossRevenue.toLocaleString('en-IN')}</div>
                      <span className="text-[10px] text-neutral-400 font-normal">{r.totalOrders} orders</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/admin/restaurants/${r.id}`)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                          title="Inspect Details"
                        >
                          <Eye size={14} />
                        </button>
                        {r.status !== 'verified' && (
                          <button
                            onClick={() => verifyRestaurant(r.id)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-3xs"
                          >
                            Approve
                          </button>
                        )}
                        {r.status !== 'suspended' && (
                          <button
                            onClick={() => suspendRestaurant(r.id)}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Suspend
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

export default AdminRestaurants;
