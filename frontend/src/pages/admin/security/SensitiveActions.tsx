import React from 'react';
import { Lock, ShieldAlert, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import useAdminSecurityStore from '../../../store/admin/adminSecurityStore';

export const SensitiveActions: React.FC = () => {
  const { sensitiveActions } = useAdminSecurityStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              ● High-Impact System Mutations
            </span>
            <span className="text-xs text-neutral-400 font-bold">Dual-Control Audit Stream</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Sensitive Operations & Mutative Action Review
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Audit high-risk operations including merchant bank account overrides, super admin role assignments, bulk refund approvals, and emergency kill switches.
          </p>
        </div>
      </div>

      {/* Sensitive Actions Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                <th className="py-3 px-4">Action Performed</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Actor Email</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-center">Confirmation Status</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
              {sensitiveActions.map((sa) => (
                <tr key={sa.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-black text-neutral-900">{sa.actionName}</td>
                  <td className="py-3.5 px-4 font-bold text-neutral-700">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {sa.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-800">{sa.actorEmail}</td>
                  <td className="py-3.5 px-4 text-neutral-500">{sa.targetEntity}</td>
                  <td className="py-3.5 px-4 font-mono text-neutral-500 text-[11px]">{sa.ipAddress}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Confirmed & Logged
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-neutral-400 text-[11px]">{sa.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SensitiveActions;
