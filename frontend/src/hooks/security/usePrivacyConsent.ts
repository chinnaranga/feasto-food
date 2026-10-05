import { usePrivacyConsentStore } from '../../store/security/privacyConsentStore';

export const usePrivacyConsent = () => {
  const {
    consent,
    hasSavedConsent,
    isBannerOpen,
    isPreferencesModalOpen,
    draftPreferences,
    isConfirmationToastVisible,
    confirmationMessage,
    confirmationDetail,
    openBanner,
    closeBanner,
    openPreferencesModal,
    closePreferencesModal,
    setDraftCategory,
    saveDraftPreferences,
    acceptAll,
    rejectOptional,
    dismissConfirmationToast,
    reopenFromConfirmation,
  } = usePrivacyConsentStore();

  return {
    consent,
    hasSavedConsent,
    isBannerOpen,
    isPreferencesModalOpen,
    draftPreferences,
    isConfirmationToastVisible,
    confirmationMessage,
    confirmationDetail,
    openBanner,
    closeBanner,
    openPreferencesModal,
    closePreferencesModal,
    setDraftCategory,
    saveDraftPreferences,
    acceptAll,
    rejectOptional,
    dismissConfirmationToast,
    reopenFromConfirmation,
  };
};

export default usePrivacyConsent;
