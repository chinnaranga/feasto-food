import React from 'react';
import { Bookmark, FileCheck, CheckCircle2, Clock } from 'lucide-react';
import useAdminSecurityStore from '../../../store/admin/adminSecurityStore';

export const PolicyManagement: React.FC = () => {
  const { policies } = useAdminSecurityStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ● Policy & Regulatory Version Control
            </span>
            <span className="text-xs text-neutral-400 font-bold">Terms & Privacy Policy Versions</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Platform Legal Terms & Policy Versioning
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Manage terms of service releases, privacy policy versioning (`v4.2`), user acknowledgement ratios, and statutory policy amendment logs.
          </p>
        </div>
      </div>

      {/* Policy List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies.map((pol) => (
          <div key={pol.id} className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                {pol.version}
              </span>

              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {pol.status}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-black text-neutral-900">{pol.title}</h4>
              <p className="text-xs text-neutral-400 mt-1">Effective Date: {pol.effectiveDate}</p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-150 flex items-center justify-between text-xs">
              <span className="text-neutral-500">User Acknowledgment Ratio:</span>
              <span className="font-black text-emerald-600">{pol.acknowledgmentRatePct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolicyManagement;
