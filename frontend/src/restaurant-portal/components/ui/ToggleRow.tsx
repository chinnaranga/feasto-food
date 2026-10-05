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
    <div className={`flex items-center justify-between gap-4 py-3.5 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex flex-col gap-0.5">
        <label
          htmlFor={id}
          className="text-xs font-semibold text-neutral-800 cursor-pointer select-none"
        >
          {label}
        </label>
        {description && (
          <p className="text-[10px] text-neutral-400 leading-relaxed">{description}</p>
        )}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex w-9 h-5 shrink-0 rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e35205]/30 cursor-pointer ${
          checked ? 'bg-[#e35205]' : 'bg-neutral-200'
        } ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        <span
          className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleRow;
