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
        <label htmlFor={id} className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full px-3 py-2 bg-white border ${
          error ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-200 focus:border-[#e35205] focus:ring-[#e35205]/20'
        } focus:outline-none focus:ring-2 rounded-lg text-xs text-neutral-800 transition-all duration-200 placeholder:text-neutral-400`}
        {...props}
      />
      {error && <span className="text-[10px] font-bold text-red-600 mt-0.5">{error}</span>}
    </div>
  );
};
export default Input;
