import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Search, Filter, ShieldCheck, Eye, X } from 'lucide-react';
import useAdminStore, { TrustSafetyReport } from '../../store/admin/adminStore';
import { StatusBadge } from './components/AdminComponents';

export const TrustSafety: React.FC = () => {
  const { trustReports, resolveTrustReport } = useAdminStore();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<TrustSafetyReport | null>(null);
  const [investigatorNotes, setInvestigatorNotes] = useState<string>('');

  const filteredReports = trustReports.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReport) {
      resolveTrustReport(
        selectedReport.id,
        investigatorNotes || 'Manual inspection completed. Policy enforcement action taken.'
      );
      setSelectedReport(null);
      setInvestigatorNotes('');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              ● Policy & Food Safety Moderation
            </span>
            <span className="text-xs text-neutral-400 font-bold">Trust & Safety Desk</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Trust & Safety Investigation Queue
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Investigate reported merchant food safety violations, fraudulent review clusters, abusive guest behavior, and illegal listing items.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'All Reports' },
            { id: 'open', label: 'Open' },
            { id: 'investigating', label: 'Investigating' },
            { id: 'resolved', label: 'Resolved' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-neutral-900 text-white shadow-3xs'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                <th className="py-3 px-4">Entity Reported</th>
                <th className="py-3 px-4">Report Type</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Reported Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400 font-bold text-xs">
                    No active trust & safety reports in this filter view.
                  </td>
                </tr>
              ) : (
                filteredReports.map((tr) => (
                  <tr key={tr.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-black text-neutral-900">
                      <div>{tr.entityName}</div>
                      <span className="text-[10px] text-neutral-400 font-normal">By {tr.reportedBy}</span>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-neutral-800">
                      {tr.reportType.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          tr.riskLevel === 'high' || tr.riskLevel === 'critical'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {tr.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500">{tr.reportedAt}</td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={tr.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {tr.status !== 'resolved' ? (
                        <button
                          onClick={() => setSelectedReport(tr)}
                          className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                        >
                          Investigate
                        </button>
                      ) : (
                        <span className="text-[10px] text-neutral-400 font-normal">Closed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Investigation Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4 text-left border border-neutral-200">
            <h3 className="text-sm font-black text-neutral-800 uppercase tracking-wider font-heading">
              Investigate Report — {selectedReport.entityName}
            </h3>

            <div className="p-3 bg-neutral-50 rounded-xl space-y-1.5 text-xs text-neutral-700">
              <span className="font-bold block">Description:</span>
              <p className="leading-relaxed text-neutral-600">{selectedReport.description}</p>
            </div>

            <form onSubmit={handleResolveSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Investigator Resolution Notes *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Record verification outcome or policy action taken..."
                  value={investigatorNotes}
                  onChange={(e) => setInvestigatorNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-3.5 py-1.5 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors"
                >
                  Resolve Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustSafety;
