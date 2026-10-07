import React from 'react';
import { BarChart3, Sparkles, Award, TrendingUp, Zap, HelpCircle } from 'lucide-react';
import usePortalStaffStore from '../../store/portalStaffStore';
import Card from '../../components/ui/Card';

export const PerformanceHub: React.FC = () => {
  const { staff } = usePortalStaffStore();

  // Find top contributor ( Tanaka San or highest orders handled )
  const sortedByOrders = [...staff].sort((a, b) => b.performance.ordersHandled - a.performance.ordersHandled);
  const topPerformer = sortedByOrders[0];

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Title */}
      <div className="border-b border-neutral-100 pb-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest"> Roster Performance telemetry</h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Review employee throughput statistics, station task averages, and shift reliability indices.
        </p>
      </div>

      {/* Roster performance telemetry widgets */}
      {topPerformer && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Top Performer Award card */}
          <Card className="md:col-span-2 bg-[#141518] border border-[#141518] text-[#FAF8F5] p-5 flex flex-col justify-between min-h-36 shadow-[4px_4px_0px_#141518] font-mono">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 bg-[#D7F04A] text-[#141518] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                  <Award size={10} />
                  Top Contributor
                </span>
                <h4 className="font-heading font-black text-sm uppercase tracking-tight mt-2.5 text-[#FAF8F5]">{topPerformer.name}</h4>
                <p className="text-[10px] text-[#FAF8F5]/70 mt-0.5">
                  Allocated to {topPerformer.branch} as a <span className="uppercase font-bold text-[#D7F04A]">{topPerformer.role}</span>.
                </p>
              </div>
              
              <Zap size={22} className="text-[#D7F04A] shrink-0" />
            </div>

            <div className="flex items-center gap-6 mt-6 border-t border-[#FAF8F5]/10 pt-3">
              <div>
                <p className="text-[9px] text-[#FAF8F5]/60 uppercase font-semibold">Orders Handled</p>
                <p className="text-sm font-black text-[#FAF8F5]">{topPerformer.performance.ordersHandled} orders</p>
              </div>
              <div>
                <p className="text-[9px] text-[#FAF8F5]/60 uppercase font-semibold">Kitchen Throughput</p>
                <p className="text-sm font-black text-[#D7F04A]">{topPerformer.performance.kitchenThroughputPct}% rate</p>
              </div>
              <div>
                <p className="text-[9px] text-[#FAF8F5]/60 uppercase font-semibold">Shift Reliability</p>
                <p className="text-sm font-black text-[#FAF8F5]">{topPerformer.performance.shiftReliabilityPct}% score</p>
              </div>
            </div>
          </Card>

          {/* AI Optimizer insights */}
          <Card className="text-left space-y-3.5 justify-between flex flex-col font-mono">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Sparkles size={12} className="text-[#1B3BFF]" />
                <h5 className="text-[10px] font-bold text-[#52555F] uppercase tracking-wider">AI Operations Suggestion</h5>
              </div>
              <p className="text-[10px] text-[#52555F] leading-relaxed">
                Tanaka Yoshi has handled <strong>1,200 orders</strong> with a kitchen throughput contribution rate of <strong>92%</strong>. We suggest cloning his kitchen schedule model for other cloud kitchen lines.
              </p>
            </div>
            <div className="p-2.5 bg-neutral-50 border border-neutral-100 rounded-lg text-[9px] text-neutral-400">
              Reliability average across all branch staff is 94.2%.
            </div>
          </Card>
        </div>
      )}

      {/* Performance statistics Table */}
      <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-50/70 border-b border-neutral-200">
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Staff Name</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Tasks Completed</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Orders Handled</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Avg Response Wait</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Shift Reliability</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Kitchen Throughput</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {staff.map((m) => (
              <tr key={m.id} className="hover:bg-neutral-50/30 transition-colors">
                <td className="p-4 text-xs font-bold text-neutral-800 text-left">
                  <div className="flex flex-col gap-0.5">
                    <span>{m.name}</span>
                    <span className="text-[9px] text-neutral-400 uppercase font-semibold tracking-wider">{m.role.replace('-', ' ')}</span>
                  </div>
                </td>
                <td className="p-4 text-xs font-bold text-neutral-700 text-left">{m.performance.tasksCompleted}</td>
                <td className="p-4 text-xs font-bold text-neutral-700 text-left">{m.performance.ordersHandled}</td>
                <td className="p-4 text-xs font-mono font-bold text-[#1B3BFF] text-left">{m.performance.avgResponseTimeMin} min</td>
                <td className="p-4 text-left">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                    {m.performance.shiftReliabilityPct}%
                  </span>
                </td>
                <td className="p-4 text-left">
                  <span className="text-xs font-bold text-neutral-700 bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 rounded">
                    {m.performance.kitchenThroughputPct}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default PerformanceHub;
