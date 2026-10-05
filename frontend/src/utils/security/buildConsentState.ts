import { PrivacyPreferences } from '../../types/security';
import { DEFAULT_PREFERENCES } from '../../store/security/securityStore';

// Builds unified privacy configuration objects with fallbacks
export const buildConsentState = (
  overrides?: Partial<PrivacyPreferences>
): PrivacyPreferences => {
  return {
    ...DEFAULT_PREFERENCES,
    ...overrides,
  };
};
export default buildConsentState;
