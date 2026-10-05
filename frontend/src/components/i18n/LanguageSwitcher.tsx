import React from 'react';
import { useLanguage } from '../../hooks/i18n/useLanguage';
import { SUPPORTED_LANGUAGES } from '../../services/i18n/localeConfig';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage, isLoading } = useLanguage();

  return (
    <div className="flex items-center gap-2 select-none relative text-left">
      <Globe size={14} className="text-text-muted" />
      <select
        value={language}
        disabled={isLoading}
        onChange={(e) => changeLanguage(e.target.value as any)}
        className="bg-transparent text-xs font-bold text-text-secondary hover:text-text-primary focus:outline-none cursor-pointer pr-4 py-1"
        aria-label="Switch Language"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-primary-bg text-text-primary font-semibold">
            {lang.flag} &nbsp; {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
};
