import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types & Interfaces ───────────────────────────────────────────────────────

export type ObservabilityTimeRange = '1h' | '24h' | '7d' | '30d';

export interface RouteLatencyBenchmark {
  id: string;
  routeName: string;
  category: 'checkout' | 'search' | 'menu' | 'dashboard' | 'portal';
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  slaThresholdMs: number;
  isRegression: boolean;
}

export interface GroupedErrorItem {
  id: string;
  title: string;
  category: 'frontend' | 'api_500' | 'validation' | 'auth' | 'payment_timeout';
  occurrences: number;
  affectedUsers: number;
  firstSeen: string;
  lastSeen: string;
  sourceFile: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'investigating' | 'resolved';
}

export interface RegionUptime {
  regionCode: string;
  regionName: string;
  uptimePercentage: number;
  latencyMs: number;
  status: 'operational' | 'degraded' | 'outage';
}

export interface QueueHealth {
  queueName: string;
  backlogCount: number;
  throughputPerSec: number;
  retryCount: number;
  status: 'healthy' | 'warning' | 'critical';
}

export interface DeploymentRelease {
  version: string;
  releaseName: string;
  deployedAt: string;
  environment: 'production' | 'staging';
  status: 'healthy' | 'warning' | 'rollback_recommended';
  errorCountPostDeploy: number;
  rollbackAvailable: boolean;
}

export interface ModuleHealthScore {
  moduleName: string;
  moduleKey: string;
  uptimePct: number;
  avgLatencyMs: number;
  errorRatePct: number;
  status: 'healthy' | 'warning' | 'degraded';
}

export interface ObservabilityAIInsight {
  id: string;
  title: string;
  type: 'regression' | 'anomaly' | 'root_cause' | 'stability';
  severity: 'info' | 'warning' | 'critical';
  description: string;
  impactText?: string;
}

// ─── Initial Mock Datasets ────────────────────────────────────────────────────

const MOCK_LATENCY: RouteLatencyBenchmark[] = [
  { id: 'lat-1', routeName: 'Guest Cart & Checkout Flow', category: 'checkout', p50Ms: 110, p95Ms: 185, p99Ms: 290, slaThresholdMs: 300, isRegression: false },
  { id: 'lat-[#2]', routeName: 'Menu Catalog & Item Search', category: 'search', p50Ms: 42, p95Ms: 78, p99Ms: 140, slaThresholdMs: 150, isRegression: false },
  { id: 'lat-3', routeName: 'Merchant KDS Realtime Orders', category: 'portal', p50Ms: 65, p95Ms: 110, p99Ms: 210, slaThresholdMs: 200, isRegression: true },
  { id: 'lat-[#4]', routeName: 'Restaurant Analytics Overview', category: 'dashboard', p50Ms: 95, p95Ms: 160, p99Ms: 250, slaThresholdMs: 400, isRegression: false },
];

const MOCK_ERRORS: GroupedErrorItem[] = [
  { id: 'err-1', title: 'HTTP 504 Payment Gateway Gateway Timeout', category: 'payment_timeout', occurrences: 28, affectedUsers: 14, firstSeen: '2026-07-21 14:00', lastSeen: '2026-07-21 21:30', sourceFile: 'paymentGatewayClient.ts:89', severity: 'high', status: 'investigating' },
  { id: 'err-2', title: 'Uncaught TypeError: Cannot read property "id" of null', category: 'frontend', occurrences: 112, affectedUsers: 45, firstSeen: '2026-07-20 09:00', lastSeen: '2026-07-21 22:15', sourceFile: 'CartDrawer.tsx:142', severity: 'medium', status: 'active' },
];

const MOCK_REGIONS: RegionUptime[] = [
  { regionCode: 'ap-south-1', regionName: 'India (Mumbai Gateway Node)', uptimePercentage: 99.99, latencyMs: 18, status: 'operational' },
  { regionCode: 'eu-central-1', regionName: 'EU (Frankfurt Node)', uptimePercentage: 99.98, latencyMs: 45, status: 'operational' },
  { regionCode: 'us-east-1', regionName: 'US East (N. Virginia Node)', uptimePercentage: 99.95, latencyMs: 110, status: 'operational' },
];

const MOCK_QUEUES: QueueHealth[] = [
  { queueName: 'Order Sync WebSocket Channel', backlogCount: 4, throughputPerSec: 140, retryCount: 0, status: 'healthy' },
  { queueName: 'FCM Push Notification Worker', backlogCount: 0, throughputPerSec: 320, retryCount: 0, status: 'healthy' },
  { queueName: 'Payment Webhook Processing Queue', backlogCount: 12, throughputPerSec: 45, retryCount: 2, status: 'warning' },
];

const MOCK_RELEASES: DeploymentRelease[] = [
  { version: 'v2.4.1-prod', releaseName: 'Stage R16 Security & DPDP Compliance Patch', deployedAt: '2026-07-21 16:00', environment: 'production', status: 'healthy', errorCountPostDeploy: 2, rollbackAvailable: true },
  { version: 'v2.4.0-prod', releaseName: 'Stage R15 Super Admin Operations Center', deployedAt: '2026-07-20 12:00', environment: 'production', status: 'healthy', errorCountPostDeploy: 0, rollbackAvailable: true },
];

const MOCK_MODULE_HEALTH: ModuleHealthScore[] = [
  { moduleName: 'Customer Ordering Web App', moduleKey: 'customer_app', uptimePct: 100.0, avgLatencyMs: 48, errorRatePct: 0.01, status: 'healthy' },
  { moduleName: 'Merchant Restaurant Portal', moduleKey: 'restaurant_portal', uptimePct: 99.9, avgLatencyMs: 72, errorRatePct: 0.02, status: 'healthy' },
  { moduleName: 'Super Admin Control Center', moduleKey: 'admin_control', uptimePct: 100.0, avgLatencyMs: 34, errorRatePct: 0.00, status: 'healthy' },
  { moduleName: 'Platform Security & DPDP Desk', moduleKey: 'security_desk', uptimePct: 100.0, avgLatencyMs: 28, errorRatePct: 0.00, status: 'healthy' },
  { moduleName: 'Accounting & Finance Module', moduleKey: 'finance_system', uptimePct: 99.8, avgLatencyMs: 95, errorRatePct: 0.04, status: 'healthy' },
  { moduleName: 'Feasto Progressive Web App (PWA)', moduleKey: 'pwa_app', uptimePct: 100.0, avgLatencyMs: 38, errorRatePct: 0.00, status: 'healthy' },
];

const MOCK_OBS_INSIGHTS: ObservabilityAIInsight[] = [
  { id: 'obs-ai-1', title: 'Platform Performance Regression Alert', type: 'regression', severity: 'warning', description: 'Merchant KDS Realtime Orders route p99 latency increased by 18ms following v2.4.1 deployment.', impactText: '+18ms p99 Latency' },
  { id: 'obs-ai-2', title: 'System Stability Score Nominal', type: 'stability', severity: 'info', description: 'Overall platform stability score is 99.8/100 across all 6 core microservice modules.', impactText: '99.8 / 100 Score' },
];

// ─── Store Interface ──────────────────────────────────────────────────────────

interface AdminObservabilityStoreState {
  timeRange: ObservabilityTimeRange;
  benchmarks: RouteLatencyBenchmark[];
  errors: GroupedErrorItem[];
  regions: RegionUptime[];
  queues: QueueHealth[];
  releases: DeploymentRelease[];
  moduleHealth: ModuleHealthScore[];
  insights: ObservabilityAIInsight[];

  stabilityScore: number;

  // Actions
  setTimeRange: (range: ObservabilityTimeRange) => void;
  triggerRollback: (version: string) => void;
  acknowledgeError: (id: string) => void;
}

// ─── Zustand Store Implementation ─────────────────────────────────────────────

export const useAdminObservabilityStore = create<AdminObservabilityStoreState>()(
  persist(
    (set) => ({
      timeRange: '24h',
      benchmarks: MOCK_LATENCY,
      errors: MOCK_ERRORS,
      regions: MOCK_REGIONS,
      queues: MOCK_QUEUES,
      releases: MOCK_RELEASES,
      moduleHealth: MOCK_MODULE_HEALTH,
      insights: MOCK_OBS_INSIGHTS,
      stabilityScore: 99.8,

      setTimeRange: (timeRange) => set({ timeRange }),

      triggerRollback: (version) => {
        set((state) => ({
          releases: state.releases.map((rel) =>
            rel.version === version ? { ...rel, status: 'rollback_recommended' } : rel
          ),
        }));
      },

      acknowledgeError: (id) => {
        set((state) => ({
          errors: state.errors.map((err) => (err.id === id ? { ...err, status: 'resolved' } : err)),
        }));
      },
    }),
    {
      name: 'feasto-super-admin-observability-store',
      partialize: (state) => ({
        timeRange: state.timeRange,
        stabilityScore: state.stabilityScore,
      }),
    }
  )
);

export default useAdminObservabilityStore;
