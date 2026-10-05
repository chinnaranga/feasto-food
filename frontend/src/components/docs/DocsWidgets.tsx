import React, { useState } from 'react';
import { CheckCircle2, XCircle, Copy, Check, Info, ShieldCheck } from 'lucide-react';
import { ComponentProp, DesignToken } from '../../types/docs';

// ─── PropTable ───────────────────────────────────────────────────────────────
export const PropTable: React.FC<{ props: ComponentProp[] }> = ({ props }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200/90 bg-white shadow-2xs text-left">
      <table className="w-full text-xs text-left border-collapse">
        <thead className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-black uppercase tracking-wider text-neutral-500 font-heading">
          <tr>
            <th className="px-4 py-3">Prop Name</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Default</th>
            <th className="px-4 py-3">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {props.map((p) => (
            <tr key={p.name} className="hover:bg-neutral-50/50 transition-colors">
              <td className="px-4 py-3 font-mono font-bold text-neutral-900 flex items-center gap-1.5">
                <span>{p.name}</span>
                {p.required && (
                  <span className="text-[9px] font-black text-red-600 bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
                    Required
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-neutral-600 text-[11px]">{p.type}</td>
              <td className="px-4 py-3 font-mono text-neutral-400 text-[11px]">{p.defaultValue || '—'}</td>
              <td className="px-4 py-3 text-neutral-600 leading-relaxed text-xs">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── TokenTable ──────────────────────────────────────────────────────────────
export const TokenTable: React.FC<{ tokens: DesignToken[] }> = ({ tokens }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200/90 bg-white shadow-2xs text-left">
      <table className="w-full text-xs text-left border-collapse">
        <thead className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-black uppercase tracking-wider text-neutral-500 font-heading">
          <tr>
            <th className="px-4 py-3">Token Variable</th>
            <th className="px-4 py-3">Value / Preview</th>
            <th className="px-4 py-3">Usage Guidelines</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {tokens.map((t) => (
            <tr key={t.name} className="hover:bg-neutral-50/50 transition-colors">
              <td className="px-4 py-3 font-mono font-bold text-neutral-900">{t.name}</td>
              <td className="px-4 py-3 font-mono text-neutral-700">
                <div className="flex items-center gap-2">
                  {t.previewColor && (
                    <span className="w-4 h-4 rounded border border-neutral-300 shadow-3xs shrink-0" style={{ backgroundColor: t.previewColor }} />
                  )}
                  <span>{t.value}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-neutral-600 leading-relaxed text-xs">{t.usageNotes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── DoDontBlock ─────────────────────────────────────────────────────────────
export const DoDontBlock: React.FC<{ doText: string; dontText: string }> = ({ doText, dontText }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-700" />
          <h5 className="text-xs font-black text-emerald-900 font-heading">DO</h5>
        </div>
        <p className="text-xs text-emerald-900 leading-relaxed font-semibold">{doText}</p>
      </div>

      <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-2">
        <div className="flex items-center gap-2">
          <XCircle size={16} className="text-red-700" />
          <h5 className="text-xs font-black text-red-900 font-heading">DON'T</h5>
        </div>
        <p className="text-xs text-red-900 leading-relaxed font-semibold">{dontText}</p>
      </div>
    </div>
  );
};

// ─── CodeSnippetPanel ────────────────────────────────────────────────────────
export const CodeSnippetPanel: React.FC<{ code: string; language?: string }> = ({ code, language = 'tsx' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-neutral-900 text-neutral-100 shadow-2xs overflow-hidden text-left font-mono">
      <div className="px-4 py-2 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
        <span>{language.toUpperCase()}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
        </button>
      </div>
      <pre className="p-4 text-xs overflow-x-auto scrollbar-none leading-relaxed text-neutral-200">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// ─── AccessibilityNote ───────────────────────────────────────────────────────
export const AccessibilityNote: React.FC<{ note: string }> = ({ note }) => {
  return (
    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-left space-y-1.5">
      <div className="flex items-center gap-2">
        <ShieldCheck size={16} className="text-blue-700" />
        <h5 className="text-xs font-black text-blue-900 font-heading">Accessibility Note (WCAG 2.1 AA)</h5>
      </div>
      <p className="text-xs text-blue-900 leading-relaxed">{note}</p>
    </div>
  );
};
