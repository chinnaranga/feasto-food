import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TestSuite, WorkflowCoverageItem, AccessibilityAuditItem, PerformanceBudgetItem, DeviceMatrixItem, ReleaseConfidenceScore } from '../../types/quality';
import { QUALITY_TEST_SUITES, WORKFLOW_COVERAGE, ACCESSIBILITY_AUDITS, PERFORMANCE_BUDGETS, DEVICE_MATRIX } from '../../constants/quality';

interface PortalQualityStoreState {
  testSuites: TestSuite[];
  workflows: WorkflowCoverageItem[];
  a11yAudits: AccessibilityAuditItem[];
  performanceBudgets: PerformanceBudgetItem[];
  deviceMatrix: DeviceMatrixItem[];
  confidenceScore: ReleaseConfidenceScore;

  // Actions
  runAllTestSuites: () => void;
  triggerA11yAudit: () => void;
  updatePerformanceBudgets: () => void;
  recalculateConfidence: () => void;
}

export const usePortalQualityStore = create<PortalQualityStoreState>()(
  persist(
    (set) => ({
      testSuites: QUALITY_TEST_SUITES,
      workflows: WORKFLOW_COVERAGE,
      a11yAudits: ACCESSIBILITY_AUDITS,
      performanceBudgets: PERFORMANCE_BUDGETS,
      deviceMatrix: DEVICE_MATRIX,
      confidenceScore: {
        overallScore: 98.5,
        qualityGatesPassed: 10,
        totalQualityGates: 10,
        blockerCount: 0,
        status: 'production_ready',
      },

      runAllTestSuites: () => {
        set((state) => ({
          testSuites: state.testSuites.map((ts) => ({ ...ts, status: 'pass' })),
        }));
      },

      triggerA11yAudit: () => {
        set((state) => ({
          a11yAudits: state.a11yAudits.map((a) => ({ ...a, status: 'pass' })),
        }));
      },

      updatePerformanceBudgets: () => {
        set((state) => ({
          performanceBudgets: state.performanceBudgets.map((pb) => ({ ...pb, isWithinBudget: true })),
        }));
      },

      recalculateConfidence: () => {
        set({
          confidenceScore: {
            overallScore: 99.2,
            qualityGatesPassed: 10,
            totalQualityGates: 10,
            blockerCount: 0,
            status: 'production_ready',
          },
        });
      },
    }),
    {
      name: 'feasto-restaurant-portal-quality-store',
      partialize: (state) => ({
        confidenceScore: state.confidenceScore,
      }),
    }
  )
);

export default usePortalQualityStore;
