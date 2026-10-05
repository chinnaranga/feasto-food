import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Zap, Smartphone, Sparkles, FileCheck } from 'lucide-react';
import usePortalQualityStore from '../../store/portal/portalQualityStore';
import { TestSuiteCard, WorkflowCoverageCard, AccessibilityChecklistCard } from './QualityComponents';

export const QualityOverview: React.FC = () => {
  const navigate = useNavigate();
  const { testSuites, workflows, a11yAudits, confidenceScore } = usePortalQualityStore();

  return (
    <div className="space-y-6 text-left">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-heading">
            Release Confidence Index
          </span>
          <h3 className="text-2xl font-black text-neutral-900 mt-2 font-mono">{confidenceScore.overallScore} / 100</h3>
          <span className="text-[10px] text-emerald-600 font-bold">● 100% Production Ready</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-heading">
            Automated Test Suites
          </span>
          <h3 className="text-2xl font-black text-neutral-900 mt-2 font-mono">480 / 480 PASS</h3>
          <span className="text-[10px] text-blue-600 font-bold">0 Failed Tests</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-heading">
            17 Critical Workflows
          </span>
          <h3 className="text-2xl font-black text-neutral-900 mt-2 font-mono">100% Covered</h3>
          <span className="text-[10px] text-emerald-600 font-bold">● Zero Uncovered Paths</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-heading">
            Accessibility (WCAG AA)
          </span>
          <h3 className="text-2xl font-black text-neutral-900 mt-2 font-mono">100% Compliant</h3>
          <span className="text-[10px] text-purple-600 font-bold">Keyboard & Focus Ring Ok</span>
        </div>
      </div>

      {/* Split Grid: Test Suites & Workflow Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
              Active Test Suites Status
            </h4>
            <button onClick={() => navigate('/restaurant/quality/test-suites')} className="text-[10px] font-bold text-[#e35205] cursor-pointer">
              All Test Suites →
            </button>
          </div>

          <div className="space-y-3">
            {testSuites.slice(0, 3).map((suite) => (
              <TestSuiteCard key={suite.id} suite={suite} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
              17 Critical Workflows Coverage Map
            </h4>
            <button onClick={() => navigate('/restaurant/quality/workflows')} className="text-[10px] font-bold text-[#e35205] cursor-pointer">
              All Workflows →
            </button>
          </div>

          <div className="space-y-3">
            {workflows.slice(0, 3).map((item) => (
              <WorkflowCoverageCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityOverview;
