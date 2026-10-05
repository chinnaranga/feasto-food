import React from 'react';
import { CheckCircle2, ShieldCheck, Zap, Activity, Globe, Check, Smartphone, Monitor } from 'lucide-react';
import type { TestSuite, WorkflowCoverageItem, AccessibilityAuditItem, PerformanceBudgetItem, DeviceMatrixItem } from '../../types/quality';

// ─── TestSuiteCard ───────────────────────────────────────────────────────────
export const TestSuiteCard: React.FC<{ suite: TestSuite }> = ({ suite }) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#e35205]/10 text-[#e35205] border border-[#e35205]/20">
          {suite.category} suite
        </span>
        <span className="text-[9px] font-mono text-neutral-400 font-bold">{suite.executionTimeMs}ms</span>
      </div>

      <div>
        <h4 className="text-xs font-black text-neutral-900 font-heading">{suite.name}</h4>
        <span className="text-[10px] font-mono text-neutral-400 block truncate">{suite.targetFile}</span>
      </div>

      <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150 flex justify-between items-center text-xs">
        <span className="text-neutral-500 font-medium">Pass Rate:</span>
        <strong className="text-emerald-600 font-black">{suite.passingTests} / {suite.totalTests} PASS (100%)</strong>
      </div>
    </div>
  );
};

// ─── WorkflowCoverageCard ──────────────────────────────────────────────────
export const WorkflowCoverageCard: React.FC<{ item: WorkflowCoverageItem }> = ({ item }) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-xs font-black text-neutral-900 font-heading">{item.workflowName}</h4>
        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          {item.criticalPathStatus}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-neutral-500 font-bold">
          <span>Coverage Index</span>
          <span>{item.coveragePercentage}% Covered</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-neutral-100 overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${item.coveragePercentage}%` }} />
        </div>
      </div>

      <span className="text-[9px] text-neutral-400 block">Verified: {item.lastPassedAt}</span>
    </div>
  );
};

// ─── AccessibilityChecklistCard ──────────────────────────────────────────────
export const AccessibilityChecklistCard: React.FC<{ audit: AccessibilityAuditItem }> = ({ audit }) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-blue-600" />
          <h4 className="text-xs font-black text-neutral-900 font-heading">{audit.ruleName}</h4>
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          WCAG {audit.wcagLevel}
        </span>
      </div>
      <p className="text-xs text-neutral-600 leading-relaxed">{audit.recommendation}</p>
    </div>
  );
};

// ─── PerformanceBudgetCard ───────────────────────────────────────────────────
export const PerformanceBudgetCard: React.FC<{ budget: PerformanceBudgetItem }> = ({ budget }) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-neutral-900 font-heading">{budget.routeName}</span>
        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Within SLA
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-150 text-center">
        <div>
          <span className="text-[9px] font-bold text-neutral-400 block uppercase">Target Budget</span>
          <span className="text-xs font-black text-neutral-900">{budget.targetValue}{budget.unit}</span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-neutral-400 block uppercase">Actual Measured</span>
          <span className="text-xs font-black text-emerald-600">{budget.actualValue}{budget.unit}</span>
        </div>
      </div>
    </div>
  );
};

export default TestSuiteCard;
