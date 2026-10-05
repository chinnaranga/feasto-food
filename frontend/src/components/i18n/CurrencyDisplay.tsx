import React from 'react';
import { useCurrencyFormatter } from '../../hooks/i18n/useFormatters';
import { Currency } from '../../types/i18n';

export interface CurrencyDisplayProps {
  value: number;
  customCurrency?: Currency;
  className?: string;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  value,
  customCurrency,
  className = '',
}) => {
  const { formatCurrency } = useCurrencyFormatter();

  return (
    <span className={`font-semibold ${className}`} data-testid="currency-display">
      {formatCurrency(value, customCurrency)}
    </span>
  );
};
