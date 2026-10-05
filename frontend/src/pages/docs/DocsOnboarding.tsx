import React from 'react';
import { Code, Terminal, CheckCircle2, FolderTree } from 'lucide-react';
import { CodeSnippetPanel } from '../../components/docs/DocsWidgets';

export const DocsOnboarding: React.FC = () => {
  const folderStructureSnippet = `src/
  ├── app/                  # Application root & router configuration
  ├── components/           # Reusable UI components & docs widgets
  ├── constants/            # System constants, navigation & tokens
  ├── hooks/                # Custom React hooks (security, docs, sync)
  ├── pages/                # Admin, Observability, Release & Docs pages
  │   ├── admin/            # Super Admin, Security, Observability, Release
  │   └── docs/             # Design System Documentation views
  ├── restaurant-portal/    # Restaurant merchant portal & finance modules
  ├── services/             # API services & docs search client
  ├── store/                # Zustand state management stores
  └── types/                # Strict TypeScript type interfaces`;

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            ● Developer Onboarding & Handover Manual
          </span>
          <span className="text-xs text-neutral-400 font-bold">Architecture & Conventions</span>
        </div>
        <h2 className="text-lg font-black text-neutral-900">
          Developer Onboarding & Architecture Handover Guide
        </h2>
        <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl">
          Quick start guide for new engineering team members explaining folder structure, component patterns, Zustand state conventions, and release verification protocols.
        </p>
      </div>

      {/* Folder Structure */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading flex items-center gap-2">
          <FolderTree size={14} className="text-[#e35205]" />
          <span>Codebase Folder Structure Overview</span>
        </h4>
        <CodeSnippetPanel code={folderStructureSnippet} language="txt" />
      </div>
    </div>
  );
};

export default DocsOnboarding;
