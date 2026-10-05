import type { TestSuite, WorkflowCoverageItem, AccessibilityAuditItem, PerformanceBudgetItem, DeviceMatrixItem } from '../types/quality';

export const QUALITY_TEST_SUITES: TestSuite[] = [
  { id: 'ts-1', name: 'Design System & UI Components Test Suite', category: 'component', totalTests: 120, passingTests: 120, failingTests: 0, status: 'pass', executionTimeMs: 3400, targetFile: 'src/components/ui/Buttons.test.tsx' },
  { id: 'ts-2', name: 'Restaurant Portal Authentication & Session Persistence', category: 'integration', totalTests: 45, passingTests: 45, failingTests: 0, status: 'pass', executionTimeMs: 1800, targetFile: 'src/restaurant-portal/auth.test.tsx' },
  { id: 'ts-3', name: 'Kitchen Expeditor KDS Realtime Orders State', category: 'integration', totalTests: 65, passingTests: 65, failingTests: 0, status: 'pass', executionTimeMs: 2200, targetFile: 'src/restaurant-portal/kds.test.tsx' },
  { id: 'ts-4', name: 'Financial Payouts & Accounting Calculation Unit Tests', category: 'unit', totalTests: 180, passingTests: 180, failingTests: 0, status: 'pass', executionTimeMs: 850, targetFile: 'src/restaurant-portal/finance.test.ts' },
  { id: 'ts-5', name: 'Super Admin Security & DPDP Compliance Audit Suite', category: 'a11y', totalTests: 70, passingTests: 70, failingTests: 0, status: 'pass', executionTimeMs: 1400, targetFile: 'src/pages/admin/security.test.tsx' },
];

export const WORKFLOW_COVERAGE: WorkflowCoverageItem[] = [
  { id: 'wf-1', workflowName: 'Stage R2 Restaurant Owner Login & Passkey Flow', category: 'auth', coveragePercentage: 100, criticalPathStatus: 'covered', lastPassedAt: '2026-07-21 23:30' },
  { id: 'wf-2', workflowName: 'Stage R3 Onboarding & Multi-Branch Setup', category: 'onboarding', coveragePercentage: 100, criticalPathStatus: 'covered', lastPassedAt: '2026-07-21 23:30' },
  { id: 'wf-3', workflowName: 'Stage R6 Enterprise Dish & Modifier Menu Builder', category: 'menu', coveragePercentage: 100, criticalPathStatus: 'covered', lastPassedAt: '2026-07-21 23:30' },
  { id: 'wf-4', workflowName: 'Stage R9 KDS Kitchen Expeditor & Ticket Bumping', category: 'kitchen', coveragePercentage: 100, criticalPathStatus: 'covered', lastPassedAt: '2026-07-21 23:30' },
  { id: 'wf-5', workflowName: 'Stage R14 Merchant Invoice & Payout Reconciliation', category: 'finance', coveragePercentage: 100, criticalPathStatus: 'covered', lastPassedAt: '2026-07-21 23:30' },
  { id: 'wf-6', workflowName: 'Stage R16 Platform Security & Statutory DPDP Requests', category: 'security', coveragePercentage: 100, criticalPathStatus: 'covered', lastPassedAt: '2026-07-21 23:30' },
];

export const ACCESSIBILITY_AUDITS: AccessibilityAuditItem[] = [
  { id: 'a11y-1', ruleName: 'Visible Focus Outline (focus:ring-2)', wcagLevel: 'AA', status: 'pass', affectedRoutes: ['/restaurant-portal/*', '/admin/*'], recommendation: 'All interactive elements have focus:ring-2 focus:ring-[#e35205].' },
  { id: 'a11y-2', ruleName: 'Color Contrast Ratio >= 4.5:1', wcagLevel: 'AA', status: 'pass', affectedRoutes: ['All 85 routes'], recommendation: 'Neutral text on white background satisfies WCAG 2.1 AA 4.5:1 ratio.' },
];

export const PERFORMANCE_BUDGETS: PerformanceBudgetItem[] = [
  { id: 'perf-1', routeName: 'Guest Checkout & Payment Processing', budgetType: 'latency', targetValue: 150, actualValue: 110, unit: 'ms', isWithinBudget: true },
  { id: 'perf-2', routeName: 'Merchant KDS Realtime Orders Stream', budgetType: 'latency', targetValue: 200, actualValue: 142, unit: 'ms', isWithinBudget: true },
  { id: 'perf-3', routeName: 'Vite Production Bundle Gzip Chunk', budgetType: 'bundle', targetValue: 500, actualValue: 284, unit: 'kB', isWithinBudget: true },
];

export const DEVICE_MATRIX: DeviceMatrixItem[] = [
  { deviceName: 'Mobile Viewport (iPhone 15 Pro)', screenSize: '393 x 852', browser: 'iOS Safari 17', status: 'pass', notes: 'Drawer slide-over & responsive topbar navigation verified.' },
  { deviceName: 'Tablet Viewport (iPad Air)', screenSize: '820 x 1180', browser: 'Safari 17', status: 'pass', notes: 'Split grid cards & KDS ticket grid scaling verified.' },
  { deviceName: 'Desktop Viewport (MacBook Pro 16")', screenSize: '1728 x 1117', browser: 'Chrome 120+', status: 'pass', notes: 'Full sidebar & multi-column telemetry desks operational.' },
];

export default QUALITY_TEST_SUITES;
