import React from 'react';
import { FileCheck, ShieldCheck, CheckCircle2, AlertTriangle, Globe } from 'lucide-react';
import useAdminSecurityStore from '../../../store/admin/adminSecurityStore';
import { ComplianceCard } from './SecurityComponents';

export const ComplianceOverview: React.FC = () => {
  const { complianceItems } = useAdminSecurityStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Statutory Regulatory Frameworks
            </span>
            <span className="text-xs text-neutral-400 font-bold">India DPDP Act 2023 · EU GDPR · SOC-2</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Compliance Posture & Data Fiduciary Governance
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Audit region-specific data protection regulations, consent logging mechanisms, data retention schedules, and tokenized payment encryption.
          </p>
        </div>
      </div>

      {/* Region Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-neutral-800 font-heading">India DPDP Act 2023</span>
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              100% Compliant
            </span>
          </div>
          <p className="text-xs text-neutral-500">Consent manager & data fiduciary logging active.</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-neutral-800 font-heading">EU GDPR Framework</span>
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              100% Compliant
            </span>
          </div>
          <p className="text-xs text-neutral-500">Right to erasure & automated export bundles active.</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-neutral-800 font-heading">Global SOC-2 & PCI-DSS</span>
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Action Required
            </span>
          </div>
          <p className="text-xs text-neutral-500">Tokenized card gateway audit due in 12 days.</p>
        </div>
      </div>

      {/* Compliance Items Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
          Compliance Checklist & Control Audit Items
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {complianceItems.map((item) => (
            <ComplianceCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceOverview;
