import React, { useRef } from 'react';

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  disabled?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  // Split value into array and pad with empty strings
  const otpValues = value.split('').concat(Array(length).fill('')).slice(0, length);

  const handleChange = (val: string, index: number) => {
    // Only accept numeric digits
    if (val && !/^[0-9]$/.test(val)) return;

    const newValues = [...otpValues];
    newValues[index] = val;
    const combinedValue = newValues.join('');
    onChange(combinedValue);

    // Focus next input if entering a digit
    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      // If current input is empty, focus previous input and clear its value
      if (!otpValues[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
        const newValues = [...otpValues];
        newValues[index - 1] = '';
        onChange(newValues.join(''));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^[0-9]+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, length).split('');
    const newValues = [...otpValues];

    digits.forEach((digit, idx) => {
      newValues[idx] = digit;
    });

    onChange(newValues.join(''));

    // Focus the last filled input or the last input
    const focusIdx = Math.min(digits.length, length - 1);
    inputsRef.current[focusIdx]?.focus();
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-2.5 justify-center">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otpValues[index]}
            disabled={disabled}
            ref={(el) => {
              if (el) inputsRef.current[index] = el;
            }}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`w-11 h-13 text-center text-lg font-bold rounded-xl border bg-primary-bg transition-main focus-ring disabled:opacity-50
              ${
                error
                  ? 'border-error-main focus-visible:outline-error-main'
                  : 'border-border-main focus-visible:outline-brand-orange'
              }`}
          />
        ))}
      </div>
      {error && <span className="text-xs text-error-main font-medium mt-1">{error}</span>}
    </div>
  );
};
