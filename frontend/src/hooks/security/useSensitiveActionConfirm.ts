import { useSecurityStore } from '../../store/security/securityStore';

export const useSensitiveActionConfirm = () => {
  const {
    activeConfirmAction,
    triggerSensitiveAction,
    clearSensitiveAction,
  } = useSecurityStore();

  const confirmAction = async () => {
    if (activeConfirmAction) {
      await activeConfirmAction.onConfirm();
      clearSensitiveAction();
    }
  };

  const cancelAction = () => {
    clearSensitiveAction();
  };

  return {
    isConfirmOpen: !!activeConfirmAction,
    actionConfig: activeConfirmAction?.config || null,
    confirmAction,
    cancelAction,
    requestConfirmation: triggerSensitiveAction,
  };
};
