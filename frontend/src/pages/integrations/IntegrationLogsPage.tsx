import React from 'react';
import { Activity, Search, Filter } from 'lucide-react';
import usePortalIntegrationsStore from '../../store/portal/portalIntegrationsStore';
import { LogTable, IntegrationsEmptyState } from './IntegrationsComponents';

export const IntegrationLogsPage: React.FC = () => {
  const {
    activityLogs,
    searchQuery,
    logSeverityFilter,
    setSearchQuery,
    setLogSeverityFilter,
  } = usePortalIntegrationsStore();

  const severities = [
    { label: 'All Severities', value: 'all' },
    { label: 'Success', value: 'success' },
    { label: 'Info', value: 'info' },
    { label: 'Warning', value: 'warning' },
    { label: 'Error', value: 'error' },
  ];

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSeverity = logSeverityFilter === 'all' || log.severity === logSeverityFilter;
    const matchesSearch =
      !searchQuery ||
      log.sourceApp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.eventType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Search & Severity Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search integration activity logs..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          {severities.map((sev) => (
            <button
              key={sev.value}
              onClick={() => setLogSeverityFilter(sev.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                logSeverityFilter === sev.value
                  ? 'bg-neutral-900 text-white shadow-3xs'
                  : 'bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/60'
              }`}
            >
              {sev.label}
            </button>
          ))}
        </div>
      </div>

      {/* Log Table View */}
      {filteredLogs.length > 0 ? (
        <LogTable logs={filteredLogs} />
      ) : (
        <IntegrationsEmptyState
          title="No Logs Matching Filters"
          description="No activity logs match your selected filter options."
          actionLabel="Reset Log Filters"
          onAction={() => {
            setSearchQuery('');
            setLogSeverityFilter('all');
          }}
        />
      )}
    </div>
  );
};

export default IntegrationLogsPage;
