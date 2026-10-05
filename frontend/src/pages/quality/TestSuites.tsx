import React from 'react';
import { CheckCircle2, Play } from 'lucide-react';
import usePortalQualityStore from '../../store/portal/portalQualityStore';
import { TestSuiteCard } from './QualityComponents';

export const TestSuites: React.FC = () => {
  const { testSuites, runAllTestSuites } = usePortalQualityStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Automated Test Runner (480+ Tests)
            </span>
            <span className="text-xs text-neutral-400 font-bold">100% Pass Rate</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Component, Unit & Integration Test Suites
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Execute automated test suites across design system components, authentication, kitchen KDS states, financial calculation units, and security audit rules.
          </p>
        </div>

        <button
          onClick={runAllTestSuites}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs shrink-0"
        >
          <Play size={13} />
          <span>Re-Run All Suites</span>
        </button>
      </div>

      {/* Test Suites List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testSuites.map((suite) => (
          <TestSuiteCard key={suite.id} suite={suite} />
        ))}
      </div>
    </div>
  );
};

export default TestSuites;
