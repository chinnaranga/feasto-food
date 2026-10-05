import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 text-left w-full">
      {label && (
        <label htmlFor={id} className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-3 py-2 bg-white border ${
          error ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-200 focus:border-[#e35205] focus:ring-[#e35205]/20'
        } focus:outline-none focus:ring-2 rounded-lg text-xs text-neutral-800 transition-all duration-200 cursor-pointer`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-[10px] font-bold text-red-600 mt-0.5">{error}</span>}
    </div>
  );
};
export default Select;
