import React from 'react';
import { Layers } from 'lucide-react';
import { DesignTokenConstants } from '../../constants/docs';
import { TokenTable } from '../../components/docs/DocsWidgets';

export const DocsTokens: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            ● Token Architecture Specification
          </span>
          <span className="text-xs text-neutral-400 font-bold">Tailwind & CSS Variables</span>
        </div>
        <h2 className="text-lg font-black text-neutral-900">
          Design System Tokens & Visual Variables
        </h2>
        <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl">
          Standardized tokens for colors, typography scales, spacing grids, border radiuses, and shadow elevations across the Feasto platform.
        </p>
      </div>

      {/* Color Tokens */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
          Color Palette Tokens
        </h4>
        <TokenTable tokens={DesignTokenConstants.COLORS} />
      </div>

      {/* Spacing Tokens */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
          Spacing & Layout Scale Tokens
        </h4>
        <TokenTable tokens={DesignTokenConstants.SPACING} />
      </div>
    </div>
  );
};

export default DocsTokens;
