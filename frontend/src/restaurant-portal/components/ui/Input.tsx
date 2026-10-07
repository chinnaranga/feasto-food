import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  id,
  className = '',
  type = 'text',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 text-left w-full">
      {label && (
        <label htmlFor={id} className="text-[10px] font-mono font-bold text-[#141518] uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full px-3 py-2.5 bg-white border ${
          error
            ? 'border-red-600 focus:ring-1 focus:ring-red-600'
            : 'border-[#141518]/20 focus:border-[#141518] focus:ring-1 focus:ring-[#141518]'
        } focus:outline-none text-xs font-mono font-medium text-[#141518] transition-all duration-150 placeholder:text-[#8A8D98] ${className}`}
        {...props}
      />
      {error && <span className="text-[10px] font-mono font-bold text-red-600 mt-0.5">⚠ {error}</span>}
    </div>
  );
};
export default Input;
