import React from 'react';
import { Component, Sparkles } from 'lucide-react';
import ComponentPreviewPanel from '../../components/docs/ComponentPreviewPanel';
import { PropTable, CodeSnippetPanel, AccessibilityNote } from '../../components/docs/DocsWidgets';

export const DocsComponentShowcase: React.FC = () => {
  const sampleButtonProps = [
    { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'danger'", defaultValue: "'primary'", required: false, description: 'Visual style of the button.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", required: false, description: 'Controls padding and font size.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', required: false, description: 'Disables user interactions and applies opacity.' },
    { name: 'onClick', type: '() => void', required: false, description: 'Click handler function.' },
  ];

  const sampleSnippet = `<button className="px-4 py-2.5 rounded-xl bg-[#e35205] text-white text-xs font-black uppercase tracking-wider hover:bg-[#c94804] transition-colors shadow-3xs cursor-pointer">
  Confirm Order Payout
</button>`;

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            ● Live Component Catalog & Playground
          </span>
          <span className="text-xs text-neutral-400 font-bold">Interactive Sandbox</span>
        </div>
        <h2 className="text-lg font-black text-neutral-900">
          Component Showcase & Live Inspection Sandbox
        </h2>
        <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl">
          Test interactive UI components live in the sandbox, inspect prop interfaces, review accessibility requirements, and copy production code snippets.
        </p>
      </div>

      {/* Live Interactive Sandbox */}
      <ComponentPreviewPanel />

      {/* Component Prop Specifications */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
          Button Component Prop Specification
        </h4>
        <PropTable props={sampleButtonProps} />
      </div>

      {/* Code Snippet & Accessibility */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeSnippetPanel code={sampleSnippet} language="tsx" />
        <AccessibilityNote note="Ensure all buttons contain descriptive text or aria-label attributes for screen readers. Support focus:ring-2 focus:ring-[#e35205] outlines for keyboard tab navigation." />
      </div>
    </div>
  );
};

export default DocsComponentShowcase;
