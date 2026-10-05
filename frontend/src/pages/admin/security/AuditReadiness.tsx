import React from 'react';
import { FileText, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import useAdminSecurityStore from '../../../store/admin/adminSecurityStore';

export const AuditReadiness: React.FC = () => {
  const { incidents, accessEvents, sensitiveActions } = useAdminSecurityStore();

  const handleExportAuditBundle = () => {
    alert('Generating SOC-2 Type II audit readiness evidence package (ZIP containing log streams & sign-in telemetry)...');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● SOC-2 Type II & ISO 27001 Audit Ready
            </span>
            <span className="text-xs text-neutral-400 font-bold">Evidence Vault</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Security Audit Readiness & Evidence Export
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Consolidated security audit logs, access telemetry, incident response notes, and sensitive action trails prepared for external compliance auditors.
          </p>
        </div>

        <button
          onClick={handleExportAuditBundle}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs shrink-0"
        >
          <Download size={14} />
          <span>Export Audit Evidence Package</span>
        </button>
      </div>

      {/* Audit Readiness Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Logged Security Events</span>
          <h3 className="text-2xl font-black text-neutral-900">{accessEvents.length + sensitiveActions.length}</h3>
          <span className="text-[10px] text-emerald-600 font-bold">● Signed & Timestamped</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Incident Response Audits</span>
          <h3 className="text-2xl font-black text-neutral-900">{incidents.length} Records</h3>
          <span className="text-[10px] text-neutral-400">Complete timeline & SLA tracking</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Audit Evidence Status</span>
          <h3 className="text-2xl font-black text-emerald-600">100% Ready</h3>
          <span className="text-[10px] text-neutral-400">Zero unlogged mutative actions</span>
        </div>
      </div>
    </div>
  );
};

export default AuditReadiness;
