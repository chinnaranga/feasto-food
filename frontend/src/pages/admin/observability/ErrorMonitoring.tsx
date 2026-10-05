import React, { useState } from 'react';
import { AlertOctagon, Search, CheckCircle2, AlertTriangle, Bug } from 'lucide-react';
import useAdminObservabilityStore from '../../../store/admin/adminObservabilityStore';
import { ErrorTrendCard } from './ObservabilityComponents';

export const ErrorMonitoring: React.FC = () => {
  const { errors, acknowledgeError } = useAdminObservabilityStore();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredErrors = errors.filter((e) => {
    if (categoryFilter === 'all') return true;
    return e.category === categoryFilter;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
              ● Automated Exception & Stack-Trace Grouping
            </span>
            <span className="text-xs text-neutral-400 font-bold">Frontend & API Telemetry</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Error Frequency & Exception Tracking
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Group repeated unhandled JavaScript exceptions, payment gateway timeouts, API 500 errors, and validation failures by source file location.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'All Errors' },
            { id: 'payment_timeout', label: 'Payment Gateway Timeouts' },
            { id: 'frontend', label: 'Frontend JS Exceptions' },
            { id: 'api_500', label: 'API 500 Failures' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                categoryFilter === tab.id
                  ? 'bg-neutral-900 text-white shadow-3xs'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredErrors.map((e) => (
          <ErrorTrendCard key={e.id} error={e} onAcknowledge={acknowledgeError} />
        ))}
      </div>
    </div>
  );
};

export default ErrorMonitoring;
