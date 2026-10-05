import React from 'react';
import { UserCheck, Download, Clock, CheckCircle2, ShieldCheck, Filter } from 'lucide-react';
import useAdminSecurityStore from '../../../store/admin/adminSecurityStore';
import { PrivacyRequestCard } from './SecurityComponents';

export const PrivacyRequests: React.FC = () => {
  const { privacyRequests, resolvePrivacyRequest } = useAdminSecurityStore();

  const handleExportBundleAll = () => {
    alert('Generating combined GDPR/DPDP encrypted ZIP package for statutory data export requests...');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              ● Statutory User Privacy Desk
            </span>
            <span className="text-xs text-neutral-400 font-bold">DPDP Section 12 · GDPR Article 15/17</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Privacy Data Access, Export & Account Deletion Queue
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Process statutory requests for user personal data exports, right to be forgotten account erasures, and marketing consent opt-outs within statutory SLA windows.
          </p>
        </div>

        <button
          onClick={handleExportBundleAll}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs shrink-0"
        >
          <Download size={14} />
          <span>Export Bundle Package</span>
        </button>
      </div>

      {/* Request Queue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {privacyRequests.map((req) => (
          <PrivacyRequestCard key={req.id} request={req} onResolve={resolvePrivacyRequest} />
        ))}
      </div>
    </div>
  );
};

export default PrivacyRequests;
