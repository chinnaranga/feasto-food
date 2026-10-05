import { useI18nStore } from '../../store/i18n/i18nStore';
import { REGIONS_CONFIG } from '../../services/i18n/localeConfig';
import { RegionConfig } from '../../types/i18n';

export const useLocale = () => {
  const { region, currency, timezone, dir, setRegion } = useI18nStore();

  const activeRegionConfig: RegionConfig = REGIONS_CONFIG[region];

  const changeRegion = async (newRegion: typeof region) => {
    await setRegion(newRegion);
  };

  return {
    region,
    currency,
    timezone,
    dir,
    regionConfig: activeRegionConfig,
    changeRegion,
  };
};
export { useLocale as useRegionConfig }; // support alias lookups
