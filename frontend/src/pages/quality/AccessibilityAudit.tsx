import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import usePortalQualityStore from '../../store/portal/portalQualityStore';
import { AccessibilityChecklistCard } from './QualityComponents';

export const AccessibilityAudit: React.FC = () => {
  const { a11yAudits, triggerA11yAudit } = usePortalQualityStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ● WCAG 2.1 AA Compliance Standard
            </span>
            <span className="text-xs text-neutral-400 font-bold">A11y Automated Audit Engine</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Accessibility Compliance & Focus Management Audit
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Audit visible focus outlines (`focus:ring-2`), keyboard tab navigation, screen reader ARIA roles, color contrast compliance (4.5:1 ratio), and reduced motion support.
          </p>
        </div>

        <button
          onClick={triggerA11yAudit}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs shrink-0"
        >
          <ShieldCheck size={14} />
          <span>Run A11y Audit</span>
        </button>
      </div>

      {/* Audits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {a11yAudits.map((audit) => (
          <AccessibilityChecklistCard key={audit.id} audit={audit} />
        ))}
      </div>
    </div>
  );
};

export default AccessibilityAudit;
