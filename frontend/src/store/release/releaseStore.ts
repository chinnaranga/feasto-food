import { create } from 'zustand';
import { BuildMetadata, EnvValidationResult, ChecklistSummary } from '../../types/release';
import { buildMetadata } from '../../services/release/buildMetadata';
import { validateEnvironment } from '../../utils/release/validateEnvironment';
import { verifyDeployment } from '../../utils/release/verifyDeployment';
import { detectVersionMismatch } from '../../utils/release/detectVersionMismatch';
import { VERSION_KEY } from '../../constants/release';

interface ReleaseState {
  metadata: BuildMetadata;
  envValidation: EnvValidationResult;
  deploymentSummary: ChecklistSummary;
  versionMismatch: boolean;
  isCheckingUpdate: boolean;
  updateStatus: 'idle' | 'checking' | 'ready' | 'failed';
  showUpdateRecovery: boolean;
  recoveryErrorMsg: string | null;

  initializeReleaseStore: () => void;
  triggerUpdateReload: () => void;
  dismissMismatchBanner: () => void;
  triggerRecoveryDialog: (msg: string) => void;
  closeRecoveryDialog: () => void;
  checkServerVersion: () => Promise<void>;
}

export const useReleaseStore = create<ReleaseState>((set) => ({
  metadata: buildMetadata,
  envValidation: { isValid: true, results: [] },
  deploymentSummary: { score: 100, passedCount: 0, totalCount: 0, items: [] },
  versionMismatch: false,
  isCheckingUpdate: false,
  updateStatus: 'idle',
  showUpdateRecovery: false,
  recoveryErrorMsg: null,

  initializeReleaseStore: () => {
    const envRes = validateEnvironment();
    const deploySummary = verifyDeployment();
    const mismatch = detectVersionMismatch(buildMetadata.version);

    set({
      envValidation: envRes,
      deploymentSummary: deploySummary,
      versionMismatch: mismatch,
    });
  },

  triggerUpdateReload: () => {
    // Write new target version to cache and force clear page reload
    localStorage.setItem(VERSION_KEY, buildMetadata.version);
    set({ versionMismatch: false });
    window.location.reload();
  },

  dismissMismatchBanner: () => set({ versionMismatch: false }),

  triggerRecoveryDialog: (msg) => {
    set({ showUpdateRecovery: true, recoveryErrorMsg: msg });
  },

  closeRecoveryDialog: () => {
    set({ showUpdateRecovery: false, recoveryErrorMsg: null });
  },

  checkServerVersion: async () => {
    set({ isCheckingUpdate: true, updateStatus: 'checking' });
    try {
      // Simulate checking staging or production endpoint for updates
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const serverVersion = buildMetadata.version;
      const mismatch = detectVersionMismatch(serverVersion);
      
      set({
        versionMismatch: mismatch,
        updateStatus: mismatch ? 'ready' : 'idle',
        isCheckingUpdate: false,
      });
    } catch (e) {
      set({ isCheckingUpdate: false, updateStatus: 'failed' });
    }
  },
}));
export default useReleaseStore;
