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
    <div className="flex items-center gap-3 py-2.5 border-b border-neutral-100 last:border-0">
      {/* Day label */}
      <span className="w-24 shrink-0 text-[11px] font-semibold text-neutral-700">
        {entry.day}
      </span>

      {/* Closed toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={entry.isClosed}
        onClick={() => onChange({ isClosed: !entry.isClosed })}
        className={`relative inline-flex w-7 h-4 shrink-0 rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e35205]/30 cursor-pointer ${
          entry.isClosed ? 'bg-neutral-200' : 'bg-[#e35205]'
        }`}
      >
        <span
          className={`w-3 h-3 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
            entry.isClosed ? 'translate-x-0' : 'translate-x-3'
          }`}
        />
      </button>

      {entry.isClosed ? (
        <span className="text-[10px] text-neutral-400 font-semibold italic">Closed</span>
      ) : (
        <div className="flex items-center gap-2 flex-1">
          {/* Open time */}
          <select
            value={entry.open}
            onChange={(e) => onChange({ open: e.target.value })}
            aria-label={`${entry.day} opening time`}
            className="flex-1 px-2 py-1.5 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 focus:outline-none rounded-lg text-[11px] font-semibold text-neutral-800 cursor-pointer transition-all duration-150"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <span className="text-[10px] text-neutral-400 font-semibold">to</span>

          {/* Close time */}
          <select
            value={entry.close}
            onChange={(e) => onChange({ close: e.target.value })}
            aria-label={`${entry.day} closing time`}
            className="flex-1 px-2 py-1.5 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 focus:outline-none rounded-lg text-[11px] font-semibold text-neutral-800 cursor-pointer transition-all duration-150"
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
