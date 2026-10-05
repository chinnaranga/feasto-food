import { useSecurityStore } from '../../store/security/securityStore';
import { privacyClient } from '../../services/security/privacyClient';
import { PrivacyPreferences } from '../../types/security';

export const usePrivacyPreferences = () => {
  const {
    privacyPreferences,
    setPrivacyPreference,
  } = useSecurityStore();

  const togglePreference = (key: keyof PrivacyPreferences) => {
    setPrivacyPreference(key, !privacyPreferences[key]);
  };

  const triggerLocationSync = async (): Promise<boolean> => {
    return await privacyClient.requestLocationPermission();
  };

  const requestGDPRArchive = async () => {
    return await privacyClient.requestDataExport();
  };

  return {
    preferences: privacyPreferences,
    togglePreference,
    triggerLocationSync,
    requestGDPRArchive,
  };
};
