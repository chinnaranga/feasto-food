import React from 'react';
import { Search, Activity, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const DiagnosticsTracing: React.FC = () => {
  const sampleTraceHops = [
    { hop: 'Client Browser Request Ingress', durationMs: 12, status: 'ok' },
    { hop: 'Cloudflare Edge CDN WAF Route', durationMs: 18, status: 'ok' },
    { hop: 'API Gateway Routing & Auth Check', durationMs: 24, status: 'ok' },
    { hop: 'Cloud Firestore Database Query', durationMs: 38, status: 'ok' },
    { hop: 'Response Serialization & Delivery', durationMs: 10, status: 'ok' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ● Distributed Request Tracing (OpenTelemetry)
            </span>
            <span className="text-xs text-neutral-400 font-bold">Trace ID: #TRC-89102-MUM</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Distributed Diagnostics & Request Waterfall Tracing
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Inspect distributed request waterfall traces, network hop latencies, database query times, and support session context snapshots.
          </p>
        </div>
      </div>

      {/* Trace Waterfall Card */}
      <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <span className="text-xs font-black text-neutral-800 font-heading">
            Trace Waterfall: Checkout Order Fulfillment API (/api/v2/orders/create)
          </span>
          <span className="text-xs font-black text-emerald-600">Total Duration: 102ms</span>
        </div>

        <div className="space-y-2">
          {sampleTraceHops.map((hop, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-neutral-50 border border-neutral-150 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-neutral-400 font-bold">0{idx + 1}.</span>
                <span className="font-bold text-neutral-800">{hop.hop}</span>
              </div>
              <span className="font-mono font-black text-neutral-900">{hop.durationMs}ms</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsTracing;
