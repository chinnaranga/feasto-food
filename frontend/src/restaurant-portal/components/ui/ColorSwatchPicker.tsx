import React, { useId } from 'react';
import { Check } from 'lucide-react';

const PRESET_COLORS = [
  { label: 'Feasto Orange', value: '#e35205' },
  { label: 'Crimson Red',   value: '#dc2626' },
  { label: 'Forest Green',  value: '#16a34a' },
  { label: 'Ocean Blue',    value: '#2563eb' },
  { label: 'Violet',        value: '#7c3aed' },
  { label: 'Amber Gold',    value: '#d97706' },
  { label: 'Slate',         value: '#475569' },
  { label: 'Rose',          value: '#e11d48' },
];

interface ColorSwatchPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const ColorSwatchPicker: React.FC<ColorSwatchPickerProps> = ({ value, onChange }) => {
  const hexId = useId();

  const isPreset = PRESET_COLORS.some((c) => c.value === value);

  return (
    <div className="space-y-3">
      {/* Preset swatches */}
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((preset) => {
          const isActive = value === preset.value;
          return (
            <button
              key={preset.value}
              type="button"
              title={preset.label}
              aria-label={`Select ${preset.label}`}
              onClick={() => onChange(preset.value)}
              className={`w-7 h-7 rounded-full border-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 cursor-pointer flex items-center justify-center shrink-0 ${
                isActive
                  ? 'border-neutral-800 scale-110 shadow-md'
                  : 'border-transparent hover:scale-105 hover:border-neutral-300'
              }`}
              style={{ backgroundColor: preset.value }}
            >
              {isActive && <Check size={11} className="text-white drop-shadow-sm" strokeWidth={3} />}
            </button>
          );
        })}
      </div>

      {/* Custom hex input */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg border border-neutral-200 shrink-0 shadow-inner"
          style={{ backgroundColor: value }}
        />
        <div className="flex flex-col gap-0.5 flex-1">
          <label htmlFor={hexId} className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
            Custom Hex
          </label>
          <input
            id={hexId}
            type="text"
            value={value}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
            }}
            maxLength={7}
            placeholder="#e35205"
            className={`w-36 px-2.5 py-1.5 bg-white border text-[11px] font-mono font-semibold text-neutral-800 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#e35205]/20 ${
              isPreset ? 'border-neutral-200' : 'border-[#e35205] ring-1 ring-[#e35205]/20'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorSwatchPicker;
