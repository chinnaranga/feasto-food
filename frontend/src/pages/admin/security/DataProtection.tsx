import React from 'react';
import { Database, Eye, EyeOff, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import useAdminSecurityStore from '../../../store/admin/adminSecurityStore';

export const DataProtection: React.FC = () => {
  const { isDataMasked, toggleDataMasking } = useAdminSecurityStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Automated PII Masking & Redaction
            </span>
            <span className="text-xs text-neutral-400 font-bold">Data Minimization Controls</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Data Protection & PII Masking Controls
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Manage automatic PII redaction across customer emails, phone numbers, credit card tokens, and merchant bank account details for platform operators.
          </p>
        </div>

        <button
          onClick={toggleDataMasking}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            isDataMasked
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-3xs'
              : 'bg-amber-500 hover:bg-amber-600 text-white shadow-3xs'
          }`}
        >
          {isDataMasked ? <EyeOff size={14} /> : <Eye size={14} />}
          <span>Toggle PII Masking ({isDataMasked ? 'ON' : 'OFF'})</span>
        </button>
      </div>

      {/* PII Protection Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-neutral-800 font-heading">Customer PII Redaction</span>
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active
            </span>
          </div>
          <p className="text-xs text-neutral-500">Emails & phones masked as <code className="bg-neutral-100 px-1 font-mono">r***@g***.com</code></p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-neutral-800 font-heading">PCI-DSS Tokenization</span>
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active
            </span>
          </div>
          <p className="text-xs text-neutral-500">Zero raw card storage. Gateway tokens only.</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-neutral-800 font-heading">Merchant Bank Masking</span>
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active
            </span>
          </div>
          <p className="text-xs text-neutral-500">Bank accounts masked as <code className="bg-neutral-100 px-1 font-mono">****4102</code></p>
        </div>
      </div>
    </div>
  );
};

export default DataProtection;
