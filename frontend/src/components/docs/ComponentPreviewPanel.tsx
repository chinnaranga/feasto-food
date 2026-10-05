import React, { useState } from 'react';
import { Play, Check, AlertCircle, Sparkles } from 'lucide-react';

export const ComponentPreviewPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'button' | 'input' | 'badge' | 'card'>('button');
  const [buttonVariant, setButtonVariant] = useState<'primary' | 'secondary' | 'outline' | 'danger'>('primary');
  const [inputValue, setInputValue] = useState('Order #89102 - Kitchen Expeditor');

  return (
    <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-5 text-left">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#e35205]" />
          <h4 className="text-sm font-black text-neutral-900 font-heading">
            Live Component Sandbox Playground
          </h4>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200 text-xs font-bold">
          {(['button', 'input', 'badge', 'card'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                activeTab === tab ? 'bg-white text-neutral-900 shadow-3xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Live Preview Display Box */}
      <div className="p-8 rounded-xl bg-neutral-50 border border-neutral-150 flex items-center justify-center min-h-[140px]">
        {activeTab === 'button' && (
          <button
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-3xs ${
              buttonVariant === 'primary'
                ? 'bg-[#e35205] text-white hover:bg-[#c94804]'
                : buttonVariant === 'secondary'
                ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                : buttonVariant === 'danger'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-100'
            }`}
          >
            Interactive Button ({buttonVariant})
          </button>
        )}

        {activeTab === 'input' && (
          <div className="w-full max-w-sm space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-700 block">Form Field Label</label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#e35205] shadow-3xs"
            />
          </div>
        )}

        {activeTab === 'badge' && (
          <div className="flex gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified (Success)
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Pending (Warning)
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
              Suspended (Danger)
            </span>
          </div>
        )}

        {activeTab === 'card' && (
          <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs max-w-xs space-y-1 text-left">
            <h5 className="text-xs font-black text-neutral-900">Enterprise Container Card</h5>
            <p className="text-[11px] font-medium text-neutral-500">Standard card layout with 16px padding and border-neutral-200.</p>
          </div>
        )}
      </div>

      {/* Controls */}
      {activeTab === 'button' && (
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-neutral-400">Variant:</span>
          {(['primary', 'secondary', 'outline', 'danger'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setButtonVariant(v)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold capitalize transition-all cursor-pointer ${
                buttonVariant === v
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComponentPreviewPanel;
