import { usePrivacyConsentStore } from '../../store/security/privacyConsentStore';

export const useConsentStatus = () => {
  const {
    isBannerOpen,
    consent,
    acceptAll,
    openBanner,
    openPreferencesModal,
  } = usePrivacyConsentStore();

  return {
    isBannerVisible: isBannerOpen,
    hasAcceptedEssential: consent.necessary,
    acceptAllConsents: acceptAll,
    openBanner,
    openPreferencesModal,
  };
};

export default useConsentStatus;
