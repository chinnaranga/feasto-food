import React, { useState } from 'react';
import { FileText, Download, Search, Filter, ShieldCheck, User } from 'lucide-react';
import useAdminStore from '../../store/admin/adminStore';

export const AuditLogs: React.FC = () => {
  const { auditLogs } = useAdminStore();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesCategory = categoryFilter === 'all' || log.actionCategory === categoryFilter;
    const matchesSearch =
      log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search);
    return matchesCategory && matchesSearch;
  });

  const handleExportLogs = () => {
    alert(`Exporting ${filteredLogs.length} audit trail records to CSV/JSON package...`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Immutable Governance Audit Trail
            </span>
            <span className="text-xs text-neutral-400 font-bold">SOC-2 & ISO Compliance Log</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Platform Compliance & Action Audit Trail
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Record of all administrator actions, merchant verification approvals, user role changes, feature flag toggles, and system security overrides.
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs shrink-0"
        >
          <Download size={14} />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {['all', 'restaurant', 'user', 'trust_safety', 'support', 'flag', 'system'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-neutral-900 text-white shadow-3xs'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search actor, action, IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#e35205]"
          />
        </div>
      </div>

      {/* Log Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Action Performed</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-neutral-500 text-[11px]">{log.timestamp}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-neutral-900">{log.actorName}</div>
                    <span className="text-[10px] text-neutral-400 font-normal">{log.actorRole}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {log.actionCategory}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-neutral-800">{log.action}</td>
                  <td className="py-3.5 px-4 font-mono text-neutral-500 text-[11px]">{log.ipAddress}</td>
                  <td className="py-3.5 px-4 text-neutral-500 font-normal max-w-xs truncate">
                    {log.details || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
