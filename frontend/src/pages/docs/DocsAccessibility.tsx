import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AccessibilityNote } from '../../components/docs/DocsWidgets';

export const DocsAccessibility: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            ● WCAG 2.1 AA Accessibility Standard
          </span>
          <span className="text-xs text-neutral-400 font-bold">Screen Reader & Keyboard Nav</span>
        </div>
        <h2 className="text-lg font-black text-neutral-900">
          Accessibility (A11y) Guidelines & Focus Management
        </h2>
        <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl">
          Comprehensive accessibility guidelines enforcing keyboard tab focus outlines, 4.5:1 color contrast ratios, ARIA dialog roles, and screen reader announcements.
        </p>
      </div>

      {/* Guidelines Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AccessibilityNote note="All interactive controls (buttons, inputs, links, tabs) must feature visible keyboard focus outlines using focus:outline-none focus:ring-2 focus:ring-[#e35205]." />
        <AccessibilityNote note="Modals and slide-over drawers must trap focus inside the container while open and restore focus to the trigger element upon pressing Escape." />
      </div>
    </div>
  );
};

export default DocsAccessibility;
