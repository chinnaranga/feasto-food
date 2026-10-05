import React, { useState } from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import usePortalDashboardStore from '../../store/portalDashboardStore';
import AlertCard from '../../components/ui/AlertCard';
import Card from '../../components/ui/Card';

export const DashboardAlertsTab: React.FC = () => {
  const { alerts, dismissAlert, resolveAllAlerts } = usePortalDashboardStore();
  const [filterType, setFilterType] = useState<'all' | 'error' | 'warning' | 'info'>('all');

  const activeAlerts = alerts.filter((a) => !a.dismissed);
  
  const filteredAlerts = activeAlerts.filter((a) => {
    if (filterType === 'all') return true;
    return a.type === filterType;
  });

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Alert Header controls strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-800">Operational Alert Feed</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            View active operational warning logs, stock discrepancies, and SLA alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented alert filters */}
          <div className="bg-neutral-100 p-0.5 rounded-xl flex items-center border border-neutral-200/40">
            {(['all', 'error', 'warning', 'info'] as const).map((type) => {
              const count = activeAlerts.filter((a) => type === 'all' ? true : a.type === type).length;
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                    filterType === type
                      ? 'bg-white text-neutral-800 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  {type} {count > 0 ? `(${count})` : ''}
                </button>
              );
            })}
          </div>

          {/* Resolve all */}
          {activeAlerts.length > 0 && (
            <button
              type="button"
              onClick={resolveAllAlerts}
              className="px-3 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-[10px] font-black uppercase tracking-wider text-neutral-600 transition-colors cursor-pointer"
            >
              Resolve All
            </button>
          )}
        </div>
      </div>

      {/* Main Alert List */}
      {filteredAlerts.length > 0 ? (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onDismiss={dismissAlert}
            />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
            <ShieldCheck size={18} />
          </div>
          <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            All Systems Optimal
          </h4>
          <p className="text-[10px] text-neutral-400 mt-1 max-w-sm leading-relaxed">
            There are no active alerts or stock warnings currently logged for this workspace location.
          </p>
        </Card>
      )}

      {/* SLA Notification Footer */}
      <div className="flex items-start gap-2.5 p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl">
        <Info size={13} className="text-neutral-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-neutral-500 leading-normal">
          System telemetry checks run every 5 minutes. Resolved alerts are logged inside the workspace audit list and can be queried inside analytical files.
        </p>
      </div>

    </div>
  );
};

export default DashboardAlertsTab;
