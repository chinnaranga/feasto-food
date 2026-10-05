import { usePrivacyConsentStore } from '@/store/security/privacyConsentStore';
import { useSettingsStore } from '@/store/settingsStore';

/**
 * Utility guard to check whether the application is authorized to track usage analytics.
 * Fully honors the user's granular cookie & privacy consent.
 */
export function isTrackingAllowed(): boolean {
  try {
    const consentState = usePrivacyConsentStore.getState();
    if (!consentState.consent.analytics) {
      return false;
    }

    const settings = useSettingsStore.getState();
    return settings.privacy?.dataUsageAnalytics !== false;
  } catch {
    // Fail-safe: if store is not initialized, default to consent-respecting false
    return false;
  }
}

/**
 * Utility guard for AI taste personalization and dietary recommendations.
 */
export function isPersonalizationAllowed(): boolean {
  try {
    const consentState = usePrivacyConsentStore.getState();
    return !!consentState.consent.personalization;
  } catch {
    return false;
  }
}

/**
 * Utility guard for marketing campaign tags and promotional alerts.
 */
export function isMarketingAllowed(): boolean {
  try {
    const consentState = usePrivacyConsentStore.getState();
    return !!consentState.consent.marketing;
  } catch {
    return false;
  }
}

export default isTrackingAllowed;
