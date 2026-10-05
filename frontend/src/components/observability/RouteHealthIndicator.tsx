import React from 'react';
import { Activity } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useObservabilityStore } from '../../store/observability/observabilityStore';
import { useReleaseChannel } from '../../hooks/release/useReleaseChannel';

export const RouteHealthIndicator: React.FC = () => {
  const { isProduction } = useReleaseChannel();
  const location = useLocation();
  const routeHealth = useObservabilityStore((state) => state.routeHealth);

  // Hide completely in production to protect customer interface aesthetics
  if (isProduction) return null;

  const currentMetrics = routeHealth[location.pathname] || { score: 100, errors: 0, warnings: 0 };

  const colorClass =
    currentMetrics.score >= 90
      ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      : currentMetrics.score >= 60
      ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
      : 'text-red-500 bg-red-500/10 border-red-500/20';

  return (
    <div
      className={`fixed top-14 right-4 z-[9970] flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold tracking-wide backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow ${colorClass}`}
      role="status"
      aria-label="Route diagnostic indicator"
    >
      <Activity size={12} className="shrink-0 animate-pulse" />
      <span>
        Route Score: {currentMetrics.score}%
        {currentMetrics.errors > 0 && ` · ${currentMetrics.errors} Err`}
        {currentMetrics.warnings > 0 && ` · ${currentMetrics.warnings} Warn`}
      </span>
    </div>
  );
};
export default RouteHealthIndicator;
