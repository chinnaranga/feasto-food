import { useReleaseStore } from '../../store/release/releaseStore';

export const useUpdateRecovery = () => {
  const { 
    showUpdateRecovery, 
    recoveryErrorMsg, 
    triggerRecoveryDialog, 
    closeRecoveryDialog, 
    triggerUpdateReload 
  } = useReleaseStore();

  return {
    showUpdateRecovery,
    recoveryErrorMsg,
    triggerRecoveryDialog,
    closeRecoveryDialog,
    recoverApp: triggerUpdateReload,
  };
};
export default useUpdateRecovery;
