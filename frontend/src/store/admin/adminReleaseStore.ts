import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types & Interfaces ───────────────────────────────────────────────────────

export interface BuildCheck {
  id: string;
  name: string;
  category: 'type_check' | 'lint' | 'test' | 'bundle' | 'asset' | 'route' | 'pwa';
  status: 'pass' | 'warning' | 'fail';
  executionTimeMs: number;
  details: string;
}

export interface EnvironmentVariable {
  key: string;
  isSecret: boolean;
  isRequired: boolean;
  isConfigured: boolean;
  maskedValue: string;
  scope: 'production' | 'preview' | 'all';
}

export interface VersionInfo {
  appVersion: string;
  buildTimestamp: string;
  commitHash: string;
  gitBranch: string;
  channel: 'stable' | 'preview' | 'canary';
  isVersionMismatch: boolean;
}

export interface DeploymentGate {
  environment: 'production' | 'staging' | 'preview';
  previewUrl: string;
  gateStatus: 'ready' | 'blocked' | 'in_review';
  lastValidatedAt: string;
  validatedBy: string;
}

export interface RollbackState {
  previousVersion: string;
  rollbackEnabled: boolean;
  rollbackStatus: 'idle' | 'preparing' | 'reverted';
  revertTimestamp?: string;
}

export interface ReleaseNoteItem {
  id: string;
  version: string;
  releaseTitle: string;
  releaseDate: string;
  features: string[];
  bugFixes: string[];
  performanceImprovements: string[];
  securityPatches: string[];
}

export interface ReleaseAIInsight {
  id: string;
  title: string;
  type: 'risk_score' | 'failure_prediction' | 'regression_alert';
  severity: 'info' | 'warning' | 'critical';
  description: string;
  riskScore: number; // 0.00 to 1.00
}

// ─── Initial Mock Datasets ────────────────────────────────────────────────────

const MOCK_BUILD_CHECKS: BuildCheck[] = [
  { id: 'chk-1', name: 'TypeScript Strict Type Compilation', category: 'type_check', status: 'pass', executionTimeMs: 4200, details: 'tsc --noEmit passed with 0 errors across 480 TSX source files.' },
  { id: 'chk-2', name: 'ESLint Code Quality & Security Audit', category: 'lint', status: 'pass', executionTimeMs: 2100, details: '0 lint errors, 0 security warnings.' },
  { id: 'chk-3', name: 'Vite Production Bundle Code Splitting', category: 'bundle', status: 'pass', executionTimeMs: 8500, details: 'Gzip bundle size 284kB (well under 500kB threshold).' },
  { id: 'chk-4', name: 'PWA Web App Manifest & Service Worker', category: 'pwa', status: 'pass', executionTimeMs: 450, details: 'PWA icons, manifest.json & offline Service Worker verified.' },
  { id: 'chk-5', name: 'Route Tree & Fallback Boundary Verification', category: 'route', status: 'pass', executionTimeMs: 320, details: 'All 85 React Router sub-routes compiled cleanly.' },
];

const MOCK_ENVS: EnvironmentVariable[] = [
  { key: 'VITE_FIREBASE_API_KEY', isSecret: true, isRequired: true, isConfigured: true, maskedValue: 'AIzaSyD...49102', scope: 'all' },
  { key: 'VITE_FIREBASE_AUTH_DOMAIN', isSecret: false, isRequired: true, isConfigured: true, maskedValue: 'feasto-prod.firebaseapp.com', scope: 'all' },
  { key: 'VITE_API_GATEWAY_URL', isSecret: false, isRequired: true, isConfigured: true, maskedValue: 'https://api.feasto.com/v2', scope: 'production' },
  { key: 'VITE_STRIPE_PUBLIC_KEY', isSecret: false, isRequired: true, isConfigured: true, maskedValue: 'pk_live_51...9012', scope: 'all' },
];

const MOCK_VERSION: VersionInfo = {
  appVersion: 'v2.4.1',
  buildTimestamp: '2026-07-21 23:20 IST',
  commitHash: 'c7f901a',
  gitBranch: 'main',
  channel: 'stable',
  isVersionMismatch: false,
};

const MOCK_GATE: DeploymentGate = {
  environment: 'production',
  previewUrl: 'https://feasto-preview-v241.web.app',
  gateStatus: 'ready',
  lastValidatedAt: '2026-07-21 23:15',
  validatedBy: 'Release Engineering Automation',
};

const MOCK_ROLLBACK: RollbackState = {
  previousVersion: 'v2.4.0-prod',
  rollbackEnabled: true,
  rollbackStatus: 'idle',
};

const MOCK_RELEASE_NOTES: ReleaseNoteItem[] = [
  {
    id: 'rn-241',
    version: 'v2.4.1',
    releaseTitle: 'Stage R16 Security & DPDP Compliance Release',
    releaseDate: '2026-07-21',
    features: ['Super Admin Security Operations Control Center (/admin/security)', 'DPDP & GDPR Statutory Privacy Request Queue with SLA countdown timers', 'PII Data Masking Toggle for platform operators'],
    bugFixes: ['Resolved payment gateway webhook timeout race condition', 'Fixed menu item allergen badge display glitch'],
    performanceImprovements: ['Optimized Vite bundle chunk splitting by 14%', 'Reduced p99 checkout route latency to 185ms'],
    securityPatches: ['SOC-2 compliance audit logging enabled across all administrative mutations'],
  },
];

const MOCK_AI_INSIGHTS: ReleaseAIInsight[] = [
  { id: 'rel-ai-1', title: 'Low Release Risk Score', type: 'risk_score', severity: 'info', description: 'Build verification score is 0.02 (Risk < 0.15 is approved for automatic production gate clearance).', riskScore: 0.02 },
  { id: 'rel-ai-2', title: 'Zero Version Drift Detected', type: 'regression_alert', severity: 'info', description: 'Production client bundles match server API schema versions 100%.', riskScore: 0.00 },
];

// ─── Store Interface ──────────────────────────────────────────────────────────

interface AdminReleaseStoreState {
  buildChecks: BuildCheck[];
  envVars: EnvironmentVariable[];
  version: VersionInfo;
  deploymentGate: DeploymentGate;
  rollbackState: RollbackState;
  releaseNotes: ReleaseNoteItem[];
  insights: ReleaseAIInsight[];

  // Actions
  runBuildChecks: () => void;
  triggerRollback: () => void;
  publishReleaseNotes: (note: Omit<ReleaseNoteItem, 'id' | 'releaseDate'>) => void;
}

// ─── Zustand Store Implementation ─────────────────────────────────────────────

export const useAdminReleaseStore = create<AdminReleaseStoreState>()(
  persist(
    (set) => ({
      buildChecks: MOCK_BUILD_CHECKS,
      envVars: MOCK_ENVS,
      version: MOCK_VERSION,
      deploymentGate: MOCK_GATE,
      rollbackState: MOCK_ROLLBACK,
      releaseNotes: MOCK_RELEASE_NOTES,
      insights: MOCK_AI_INSIGHTS,

      runBuildChecks: () => {
        set((state) => ({
          buildChecks: state.buildChecks.map((b) => ({ ...b, status: 'pass' })),
        }));
      },

      triggerRollback: () => {
        set((state) => ({
          rollbackState: {
            ...state.rollbackState,
            rollbackStatus: 'reverted',
            revertTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          },
        }));
      },

      publishReleaseNotes: (data) => {
        const id = `rn-${Date.now()}`;
        const newNote: ReleaseNoteItem = {
          ...data,
          id,
          releaseDate: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ releaseNotes: [newNote, ...state.releaseNotes] }));
      },
    }),
    {
      name: 'feasto-super-admin-release-store',
      partialize: (state) => ({
        version: state.version,
        rollbackState: state.rollbackState,
      }),
    }
  )
);

export default useAdminReleaseStore;
