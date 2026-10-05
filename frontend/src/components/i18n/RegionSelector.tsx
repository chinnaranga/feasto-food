import React from 'react';
import { useLocale } from '../../hooks/i18n/useLocale';
import { REGIONS_CONFIG } from '../../services/i18n/localeConfig';
import { MapPin } from 'lucide-react';
import { Region } from '../../types/i18n';

export const RegionSelector: React.FC = () => {
  const { region, changeRegion } = useLocale();

  return (
    <div className="flex items-center gap-2 select-none text-left">
      <MapPin size={14} className="text-text-muted" />
      <select
        value={region}
        onChange={(e) => changeRegion(e.target.value as Region)}
        className="bg-transparent text-xs font-bold text-text-secondary hover:text-text-primary focus:outline-none cursor-pointer pr-4 py-1"
        aria-label="Switch Market Region"
      >
        {Object.entries(REGIONS_CONFIG).map(([code, config]) => (
          <option key={code} value={code} className="bg-primary-bg text-text-primary font-semibold">
            {config.flag} &nbsp; {config.name} ({code})
          </option>
        ))}
      </select>
    </div>
  );
};
