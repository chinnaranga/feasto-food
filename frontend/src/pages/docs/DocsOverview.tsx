import React from 'react';
import { BookOpen, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';
import { DoDontBlock } from '../../components/docs/DocsWidgets';

export const DocsOverview: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            ● Enterprise Design System Standard
          </span>
          <span className="text-xs text-neutral-400 font-bold">Feasto UI Core v2.4.1</span>
        </div>
        <h2 className="text-xl font-black text-neutral-900 font-heading">
          Feasto Design System & UX Principles
        </h2>
        <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl">
          The Feasto Design System is built to deliver a calm, clear, and enterprise-grade user interface inspired by Stripe, Vercel, Notion, and Apple. It provides a light-theme aesthetic focused on typography, data clarity, and WCAG 2.1 AA accessibility.
        </p>
      </div>

      {/* Core Principles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">1</div>
          <h4 className="text-xs font-black text-neutral-900 font-heading">Data-First Clarity</h4>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Prioritize financial metrics, order statuses, and operational alerts with high-contrast typography and subtle borders.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">2</div>
          <h4 className="text-xs font-black text-neutral-900 font-heading">Light-Theme Restraint</h4>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Clean white surfaces (`#ffffff`), warm slate tints (`#f8fafc`), and restrained brand orange (`#e35205`) accents.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">3</div>
          <h4 className="text-xs font-black text-neutral-900 font-heading">Accessibility Built-In</h4>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Enforce full keyboard focus outlines (`focus:ring-2`), WCAG 2.1 AA 4.5:1 contrast ratios, and clear ARIA roles.
          </p>
        </div>
      </div>

      {/* Do & Don't Guidelines */}
      <DoDontBlock
        doText="Use soft warm neutral backgrounds (#f8fafc) and subtle 1px borders (#e2e8f0) with clear metric hierarchy."
        dontText="Do NOT use dark theme NOC dashboard layouts or noisy fluorescent backgrounds."
      />
    </div>
  );
};

export default DocsOverview;
