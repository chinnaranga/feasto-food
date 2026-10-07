import React from 'react';
import type { HoursEntry } from '../../store/portalProfileStore';

const TIME_OPTIONS: string[] = Array.from({ length: 48 }, (_, i) => {
  const totalMins = i * 30;
  const h = Math.floor(totalMins / 60).toString().padStart(2, '0');
  const m = (totalMins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
});

interface HoursRowProps {
  entry: HoursEntry;
  onChange: (patch: Partial<HoursEntry>) => void;
}

export const HoursRow: React.FC<HoursRowProps> = ({ entry, onChange }) => {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[#141518]/10 last:border-0 font-mono">
      {/* Day label */}
      <span className="w-24 shrink-0 text-xs font-bold text-[#141518] uppercase tracking-wider">
        {entry.day}
      </span>

      {/* Closed toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={!entry.isClosed}
        onClick={() => onChange({ isClosed: !entry.isClosed })}
        className={`relative inline-flex w-8 h-4 shrink-0 p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer border border-[#141518] ${
          entry.isClosed ? 'bg-[#FAF8F5]' : 'bg-[#141518]'
        }`}
      >
        <span
          className={`w-3 h-3 transform transition-transform duration-200 ${
            entry.isClosed ? 'bg-[#52555F] translate-x-0' : 'bg-[#D7F04A] translate-x-3.5'
          }`}
        />
      </button>

      {entry.isClosed ? (
        <span className="text-[10px] text-[#52555F] font-bold uppercase tracking-wider italic">Closed Station</span>
      ) : (
        <div className="flex items-center gap-2 flex-1 font-mono">
          {/* Open time */}
          <select
            value={entry.open}
            onChange={(e) => onChange({ open: e.target.value })}
            aria-label={`${entry.day} opening time`}
            className="flex-1 px-2 py-1 bg-[#FAF8F5] border border-[#141518]/20 focus:border-[#141518] focus:outline-none text-[11px] font-bold text-[#141518] cursor-pointer"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <span className="text-[10px] text-[#52555F] font-bold uppercase">TO</span>

          {/* Close time */}
          <select
            value={entry.close}
            onChange={(e) => onChange({ close: e.target.value })}
            aria-label={`${entry.day} closing time`}
            className="flex-1 px-2 py-1 bg-[#FAF8F5] border border-[#141518]/20 focus:border-[#141518] focus:outline-none text-[11px] font-bold text-[#141518] cursor-pointer"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default HoursRow;
