import React from 'react';
import { ShieldCheck, Cpu, BarChart2 } from 'lucide-react';

export const AuthIllustrationPanel: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 bg-neutral-50/50 border-l border-neutral-200 w-1/2 min-h-screen text-left select-none relative overflow-hidden">
      
      {/* Background abstract overlay grids */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#e35205_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Top logo/branding descriptor */}
      <div className="flex items-center gap-2 z-10">
        <div className="w-6 h-6 rounded bg-[#e35205] flex items-center justify-center text-white font-black text-[10px]">
          F
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-800">
          Feasto Merchant Services
        </span>
      </div>

      {/* Middle Mock Dashboard Illustration */}
      <div className="max-w-md w-full mx-auto my-auto space-y-6 z-10">
        <div className="space-y-2">
          <h2 className="text-xl font-black text-neutral-900 tracking-tight leading-tight">
            Run your kitchen operations with enterprise clarity.
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Consolidate your POS terminals, delivery channels, menu logs, and kitchen displays into a single operational workspace.
          </p>
        </div>

        {/* Mock Stats Cards */}
        <div className="border border-neutral-200 bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 size={14} className="text-[#e35205]" />
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">Sync Status</span>
            </div>
            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 uppercase">
              Online
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <span className="text-[9px] font-bold text-neutral-400 block uppercase">POS Orders</span>
              <span className="text-lg font-black text-neutral-800">4,821</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-neutral-400 block uppercase">Fulfill SLA</span>
              <span className="text-lg font-black text-neutral-800">99.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom checklist descriptor */}
      <div className="flex items-center gap-6 text-[10px] font-bold text-neutral-400 z-10">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-emerald-500" />
          <span>PCI-DSS Compliant</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Cpu size={12} className="text-blue-500" />
          <span>99.99% Uptime</span>
        </div>
      </div>

    </div>
  );
};
export default AuthIllustrationPanel;
