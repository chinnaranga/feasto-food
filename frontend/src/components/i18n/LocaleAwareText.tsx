import React from 'react';
import { useLanguage } from '../../hooks/i18n/useLanguage';

export interface LocaleAwareTextProps {
  tKey: string;
  variables?: Record<string, string | number>;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'label';
}

export const LocaleAwareText: React.FC<LocaleAwareTextProps> = ({
  tKey,
  variables,
  className = '',
  as = 'span',
}) => {
  const { t } = useLanguage();
  const Tag = as;

  return (
    <Tag className={className} data-tkey={tKey}>
      {t(tKey, variables)}
    </Tag>
  );
};
