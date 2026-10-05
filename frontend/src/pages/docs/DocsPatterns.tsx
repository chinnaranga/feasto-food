import React from 'react';
import { Layout, CheckCircle2 } from 'lucide-react';
import { DoDontBlock } from '../../components/docs/DocsWidgets';

export const DocsPatterns: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            ● Enterprise Layout & Data Patterns
          </span>
          <span className="text-xs text-neutral-400 font-bold">Standard Layout Specs</span>
        </div>
        <h2 className="text-lg font-black text-neutral-900">
          Page Layout, Form & Data Table Patterns
        </h2>
        <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl">
          Standardized architectural patterns for page headers, filter bars, data table pagination, form field layout spacing, and responsive drawer inspection panels.
        </p>
      </div>

      {/* Pattern Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2">
          <h4 className="text-xs font-black text-neutral-900 font-heading">Page Header & Action Bar</h4>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Every page header includes a live status pill, section title, concise summary, and right-aligned quick action buttons.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2">
          <h4 className="text-xs font-black text-neutral-900 font-heading">Filter & Search Bar Pattern</h4>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Data views feature a horizontal search input with filter tabs (`All`, `Pending`, `Approved`) wrapped in a white card.
          </p>
        </div>
      </div>

      <DoDontBlock
        doText="Keep form input field labels explicit and clear above the input with 12px neutral-700 typography."
        dontText="Do NOT rely on placeholder text as a substitute for explicit form input labels."
      />
    </div>
  );
};

export default DocsPatterns;
