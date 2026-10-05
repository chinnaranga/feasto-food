import React from 'react';
import { Database, Activity, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import useAdminObservabilityStore from '../../../store/admin/adminObservabilityStore';

export const RequestQueueHealth: React.FC = () => {
  const { queues } = useAdminObservabilityStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ● Async Worker Queues & Request Throughput
            </span>
            <span className="text-xs text-neutral-400 font-bold">4,250 RPM Throughput</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Request Telemetry & Queue Backlog Depth
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Monitor API request volumes, failed request rates (0.02%), FCM push notification worker queues, and payment webhook backlog depths.
          </p>
        </div>
      </div>

      {/* Queue Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {queues.map((q) => (
          <div key={q.queueName} className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-neutral-900 font-heading">{q.queueName}</span>
              <span
                className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  q.status === 'healthy'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {q.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-150 text-center">
              <div>
                <span className="text-[9px] font-bold text-neutral-400 block uppercase">Backlog Depth</span>
                <span className="text-sm font-black text-neutral-900">{q.backlogCount} items</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-neutral-400 block uppercase">Throughput</span>
                <span className="text-sm font-black text-neutral-900">{q.throughputPerSec} / sec</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestQueueHealth;
