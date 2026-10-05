import { useSecurityStore } from '../../store/security/securityStore';
import { securityClient } from '../../services/security/securityClient';

export const useSessionSecurity = () => {
  const {
    sessionStatus,
    isReauthOpen,
    openReauthPrompt,
    closeReauthPrompt,
    reauthCallback,
  } = useSecurityStore();

  const handleReauthSubmit = async (password: string): Promise<boolean> => {
    const isValid = await securityClient.verifyCredentials(password);
    if (isValid && reauthCallback) {
      // Execute original queued action
      await reauthCallback(password);
    }
    
    // Close modal on evaluation
    closeReauthPrompt();
    return isValid;
  };

  const logoutSession = () => {
    securityClient.terminateSession();
  };

  return {
    sessionStatus,
    isReauthOpen,
    logoutSession,
    triggerReauth: openReauthPrompt,
    cancelReauth: closeReauthPrompt,
    confirmReauth: handleReauthSubmit,
  };
};
