import React, { useId } from 'react';

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}

export const ToggleRow: React.FC<ToggleRowProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) => {
  const id = useId();

  return (
    <div className={`flex items-center justify-between gap-4 py-3.5 border-b border-[#141518]/10 text-left ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex flex-col gap-0.5">
        <label
          htmlFor={id}
          className="text-xs font-mono font-bold text-[#141518] cursor-pointer select-none"
        >
          {label}
        </label>
        {description && (
          <p className="text-[11px] font-sans text-[#52555F] leading-relaxed">{description}</p>
        )}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex w-10 h-5 shrink-0 rounded-full p-0.5 transition-colors duration-150 focus:outline-none cursor-pointer ${
          checked ? 'bg-[#141518] border border-[#141518]' : 'bg-[#E2DED4] border border-[#141518]/20'
        } ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        <span
          className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transform transition-transform duration-150 ${
            checked ? 'translate-x-5 bg-[#D7F04A]' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleRow;
