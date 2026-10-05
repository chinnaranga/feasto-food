import React from 'react';
import { Globe, Shield, Phone } from 'lucide-react';
import usePortalBranchesStore from '../../store/portal/portalBranchesStore';

export const RegionConfigPage: React.FC = () => {
  const { regions } = usePortalBranchesStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header Bar */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              🌐 Regional Policy & Tax Governance
            </span>
          </div>
          <h3 className="text-base font-black text-neutral-900 font-heading">
            Regional Operational Configurations & Local Terms
          </h3>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Configure regional currencies, timezones, GST tax labels, regional hotline contacts, and local policy compliance.
          </p>
        </div>
      </div>

      {/* Region Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {regions.map((reg) => (
          <div key={reg.id} className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h4 className="text-sm font-black text-neutral-900 font-heading">{reg.regionName}</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                {reg.localeLanguage}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">Currency</span>
                <span className="font-mono font-bold text-neutral-900">{reg.primaryCurrency}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">Tax Label</span>
                <span className="font-mono font-bold text-neutral-900">{reg.taxLabel}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150 col-span-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">Timezone</span>
                <span className="font-mono text-neutral-800">{reg.primaryTimezone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionConfigPage;
