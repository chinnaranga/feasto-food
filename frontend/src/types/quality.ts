// ─── Quality Assurance & Reliability Types ─────────────────────────────────────

export type TestSuiteCategory = 'unit' | 'component' | 'integration' | 'a11y' | 'regression';

export interface TestSuite {
  id: string;
  name: string;
  category: TestSuiteCategory;
  totalTests: number;
  passingTests: number;
  failingTests: number;
  status: 'pass' | 'warning' | 'fail';
  executionTimeMs: number;
  targetFile: string;
}

export interface WorkflowCoverageItem {
  id: string;
  workflowName: string;
  category: 'auth' | 'onboarding' | 'menu' | 'kitchen' | 'finance' | 'admin' | 'security' | 'release';
  coveragePercentage: number;
  criticalPathStatus: 'covered' | 'partial' | 'uncovered';
  lastPassedAt: string;
}

export interface AccessibilityAuditItem {
  id: string;
  ruleName: string;
  wcagLevel: 'AA' | 'AAA';
  status: 'pass' | 'warning';
  affectedRoutes: string[];
  recommendation: string;
}

export interface PerformanceBudgetItem {
  id: string;
  routeName: string;
  budgetType: 'latency' | 'bundle' | 'inp';
  targetValue: number;
  actualValue: number;
  unit: string;
  isWithinBudget: boolean;
}

export interface DeviceMatrixItem {
  deviceName: string;
  screenSize: string;
  browser: string;
  status: 'pass' | 'warning';
  notes: string;
}

export interface ReleaseConfidenceScore {
  overallScore: number; // e.g. 98.5
  qualityGatesPassed: number; // e.g. 10
  totalQualityGates: number; // 10
  blockerCount: number; // 0
  status: 'production_ready' | 'review_required';
}

export default TestSuite;
