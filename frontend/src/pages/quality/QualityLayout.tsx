import React, { Suspense } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Zap,
  Activity,
  Smartphone,
  Globe,
  RefreshCw,
  RotateCcw,
  ListCheck,
  Play,
  FileCheck,
} from 'lucide-react';
import usePortalQualityStore from '../../store/portal/portalQualityStore';

export const QualityLayout: React.FC = () => {
  const location = useLocation();
  const { confidenceScore, runAllTestSuites } = usePortalQualityStore();

  const qualityNavTabs = [
    { label: 'Quality Overview', path: '/restaurant/quality/overview', icon: <ShieldCheck size={14} /> },
    { label: 'Test Suites (480+)', path: '/restaurant/quality/test-suites', icon: <CheckCircle2 size={14} /> },
    { label: '17 Critical Workflows', path: '/restaurant/quality/workflows', icon: <ListCheck size={14} /> },
    { label: 'Accessibility (A11y)', path: '/restaurant/quality/accessibility', icon: <ShieldCheck size={14} /> },
    { label: 'Performance Budget', path: '/restaurant/quality/performance', icon: <Zap size={14} /> },
    { label: 'Responsiveness Matrix', path: '/restaurant/quality/responsiveness', icon: <Smartphone size={14} /> },
    { label: 'Regression Suite', path: '/restaurant/quality/regressions', icon: <RotateCcw size={14} /> },
    { label: 'Browser Matrix', path: '/restaurant/quality/browser-matrix', icon: <Globe size={14} /> },
    { label: 'Release Confidence', path: '/restaurant/quality/release-confidence', icon: <FileCheck size={14} /> },
    { label: 'Error Recovery', path: '/restaurant/quality/error-recovery', icon: <RefreshCw size={14} /> },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Quality Header Bar */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● 100% Production Ready ({confidenceScore.overallScore}/100)
            </span>
            <span className="text-xs text-neutral-400 font-bold">10/10 Quality Gates Passed</span>
          </div>
          <h2 className="text-xl font-black text-neutral-900 font-heading">
            Quality Assurance, Performance & Reliability Center
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Automated test suite verification (480+ unit, component & integration tests), 17 critical workflow coverage, WCAG 2.1 AA accessibility, and latency SLA budgets.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={runAllTestSuites}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
          >
            <Play size={13} />
            <span>Run All Test Suites</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-neutral-200/80 shadow-2xs overflow-x-auto scrollbar-none">
        <div className="flex gap-1 min-w-max">
          {qualityNavTabs.map((tab) => {
            const isActive =
              location.pathname === tab.path ||
              (tab.path.endsWith('/overview') &&
                (location.pathname === '/restaurant/quality' || location.pathname === '/restaurant/quality/'));
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-3xs'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/70'
                }`}
              >
                <span className={isActive ? 'text-[#e35205]' : 'text-neutral-400'}>{tab.icon}</span>
                <span>{tab.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Sub-Route Container */}
      <Suspense fallback={<div className="py-16 text-center text-xs font-bold text-neutral-400 animate-pulse">Loading Quality Module...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default QualityLayout;
