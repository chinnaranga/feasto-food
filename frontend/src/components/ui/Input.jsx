import React from 'react';

export const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 
            ${Icon ? 'pl-12' : ''}
            bg-white/5 
            border border-white/10 
            rounded-xl 
            text-white placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export const TextArea = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-3 
          bg-white/5 
          border border-white/10 
          rounded-xl 
          text-white placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          transition-all duration-200
          resize-none
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
