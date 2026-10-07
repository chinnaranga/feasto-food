import React, { useId } from 'react';
import { Check } from 'lucide-react';

const PRESET_COLORS = [
  { label: 'Feasto Cobalt', value: '#1B3BFF' },
  { label: 'Acid Lime',    value: '#D7F04A' },
  { label: 'Tactile Ink',   value: '#141518' },
  { label: 'Crimson Red',   value: '#DC2626' },
  { label: 'Forest Green',  value: '#16A34A' },
  { label: 'Amber Gold',    value: '#D97706' },
  { label: 'Slate Gray',    value: '#475569' },
  { label: 'Warm Sand',     value: '#F3F0E8' },
];

interface ColorSwatchPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const ColorSwatchPicker: React.FC<ColorSwatchPickerProps> = ({ value, onChange }) => {
  const hexId = useId();

  const isPreset = PRESET_COLORS.some((c) => c.value.toLowerCase() === value.toLowerCase());

  return (
    <div className="space-y-3">
      {/* Preset swatches */}
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((preset) => {
          const isActive = value.toLowerCase() === preset.value.toLowerCase();
          return (
            <button
              key={preset.value}
              type="button"
              title={preset.label}
              aria-label={`Select ${preset.label}`}
              onClick={() => onChange(preset.value)}
              className={`w-7 h-7 border border-[#141518]/30 transition-all duration-150 focus:outline-none cursor-pointer flex items-center justify-center shrink-0 ${
                isActive
                  ? 'ring-2 ring-[#141518] scale-110 shadow-[2px_2px_0px_#141518]'
                  : 'hover:scale-105 hover:border-[#141518]'
              }`}
              style={{ backgroundColor: preset.value }}
            >
              {isActive && (
                <Check
                  size={12}
                  className={preset.value === '#D7F04A' || preset.value === '#F3F0E8' ? 'text-[#141518]' : 'text-white'}
                  strokeWidth={3}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Custom hex input */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 border border-[#141518]/30 shrink-0 shadow-inner"
          style={{ backgroundColor: value }}
        />
        <div className="flex flex-col gap-0.5 flex-1">
          <label htmlFor={hexId} className="font-mono text-[9px] font-bold text-[#52555F] uppercase tracking-wider">
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
            placeholder="#1B3BFF"
            className={`w-36 px-2.5 py-1.5 bg-[#FAF8F5] border text-[11px] font-mono font-semibold text-[#141518] transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#141518] ${
              isPreset ? 'border-[#141518]/20' : 'border-[#141518] ring-1 ring-[#141518]'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorSwatchPicker;
