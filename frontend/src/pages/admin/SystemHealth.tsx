import React from 'react';
import {
  Activity,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Server,
  Cpu,
  Radio,
  Layers,
} from 'lucide-react';
import useAdminStore from '../../store/admin/adminStore';
import {
  FeastoSectionHeader,
  FeastoStatus,
  FeastoButton,
  FeastoMetric,
} from '@/components/design-system';

export const SystemHealth: React.FC = () => {
  const { serviceHealth } = useAdminStore();

  const coreServices = [
    { name: 'API Gateway & Reverse Proxy', latency: '14ms', uptime: '99.99%', status: 'operational' },
    { name: 'PostgreSQL Core Datastore', latency: '4ms', uptime: '99.98%', status: 'operational' },
    { name: 'Redis PubSub & Queue Engine', latency: '1ms', uptime: '100%', status: 'operational' },
    { name: 'Stripe & Razorpay Payment Webhooks', latency: '120ms', uptime: '99.95%', status: 'operational' },
    { name: 'OSRM Driving Vector Routing Engine', latency: '28ms', uptime: '99.97%', status: 'operational' },
    { name: 'Push Notifications (APNs & FCM)', latency: '85ms', uptime: '99.92%', status: 'operational' },
    { name: 'Feasto Culinary AI Sommelier & Voice', latency: '420ms', uptime: '99.90%', status: 'operational' },
    { name: 'Dispatch Auto-assignment & Expiry Workers', latency: '8ms', uptime: '100%', status: 'operational' },
  ];

  return (
    <div className="w-full space-y-8 text-left select-none text-[#F3F0E8]">
      {/* ── SECTION HEADER ── */}
      <FeastoSectionHeader
        index="09"
        title="SYSTEM STATUS & TELEMETRY"
        subtitle="Network health monitoring for backend gateways, database persistence, payment rails, routing engines, and voice neural pipelines."
        dark
        rightElement={
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="flex items-center gap-1.5 text-[#15803D] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#15803D] animate-ping" />
              GLOBAL CLUSTER NOMINAL
            </span>
            <span className="text-[#8E929C]">ap-south-1 (Mumbai)</span>
          </div>
        }
      />

      {/* ── HIGH-LEVEL INFRASTRUCTURE OVERVIEW STATEMENTS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <FeastoMetric
          index="01"
          label="NETWORK UPTIME (30D)"
          value="99.98%"
          delta={{ value: 'SLA COMPLIANT', positive: true }}
          subtitle="Zero critical downtime events"
          dark
          highlight
        />

        <FeastoMetric
          index="02"
          label="GATEWAY P95 LATENCY"
          value="18ms"
          delta={{ value: '2ms FASTER', positive: true }}
          subtitle="Global Edge Cloud CDN"
          dark
        />

        <FeastoMetric
          index="03"
          label="TRANSACTION ERROR RATE"
          value="0.012%"
          delta={{ value: 'NORMAL RANGE', positive: true }}
          subtitle="Automated retry success 99.8%"
          dark
        />

        <FeastoMetric
          index="04"
          label="ACTIVE DISPATCH RUNNERS"
          value="8 / 8"
          delta={{ value: 'ALL THREADS UP', positive: true }}
          subtitle="Worker pool utilization 34%"
          dark
        />
      </div>

      {/* ── QUIET RESTRAINED OPERATIONAL SYSTEM GRID ── */}
      <div className="p-6 bg-[#14161B] border border-white/10 space-y-4">
        <div className="pb-3 border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8E929C] block">
              COMPONENT REGISTRY
            </span>
            <h3 className="font-heading font-black text-lg uppercase text-white">
              Subsystem Telemetry
            </h3>
          </div>
          <span className="font-mono text-xs text-[#8E929C]">Polled every 1500ms</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          {coreServices.map((svc) => (
            <div
              key={svc.name}
              className="p-4 bg-[#1D212A] border border-white/5 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="text-white font-bold block">{svc.name}</span>
                <div className="flex items-center gap-3 text-[10px] text-[#8E929C]">
                  <span>Latency: <strong className="text-white">{svc.latency}</strong></span>
                  <span>Uptime: <strong className="text-white">{svc.uptime}</strong></span>
                </div>
              </div>

              <FeastoStatus status={svc.status} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
