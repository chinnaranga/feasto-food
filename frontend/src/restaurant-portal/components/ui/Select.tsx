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
        <label htmlFor={id} className="text-[10px] font-mono font-bold text-[#141518] uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-3 py-2.5 bg-white border ${
          error
            ? 'border-red-600 focus:ring-1 focus:ring-red-600'
            : 'border-[#141518]/20 focus:border-[#141518] focus:ring-1 focus:ring-[#141518]'
        } focus:outline-none text-xs font-mono font-bold text-[#141518] transition-all duration-150 cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-[10px] font-mono font-bold text-red-600 mt-0.5">⚠ {error}</span>}
    </div>
  );
};
export default Select;
export default Select;
