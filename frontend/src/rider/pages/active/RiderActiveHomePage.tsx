import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Phone, AlertTriangle, ShieldCheck, MapPin, Navigation, CheckCircle2 } from 'lucide-react';
import useRiderActiveStore from '../../store/useRiderActiveStore';
import useRiderNavigationStore from '../../store/useRiderNavigationStore';
import { DeliveryFocusCard } from '../../components/active/RiderActiveComponents';
import { RealLiveMapCanvas } from '../../components/navigation/RiderNavigationComponents';
import { RiderButton, RiderEmptyState } from '../../components/RiderUIComponents';

export const RiderActiveHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { activeTask, aiInsight, advanceStage, setReportIssueModalOpen } = useRiderActiveStore();
  const { routeSummary, recenterMap, triggerReroute, toggleTileMode } = useRiderNavigationStore();

  if (!activeTask) {
    return (
      <RiderEmptyState
        title="No Active Delivery Task"
        description="You do not currently have an accepted order in progress. Go to the Offers Feed to accept a delivery job."
      />
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 font-heading tracking-tight">
            Active Delivery Workflow
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Order {activeTask.orderNumber} • {activeTask.currentStage === 'en_route_to_pickup' ? 'Navigating to Restaurant' : 'Navigating to Customer'}
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/80 w-fit">
          ● Order In Transit
        </span>
      </div>

      {/* Responsive Split Delivery Workspace (7 cols Map + 5 cols Delivery Focus Card on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Map Canvas (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          <RealLiveMapCanvas
            routeSummary={routeSummary}
            onRecenter={recenterMap}
            onReroute={triggerReroute}
            onToggleTileMode={toggleTileMode}
          />

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-600" />
                <h3 className="text-xs font-black uppercase text-neutral-900 font-heading">AI Route Telemetry</h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700">96% Accuracy</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">{aiInsight.routeEfficiencyTip}</p>
          </div>
        </div>

        {/* Right Column: Focus Card & Step Checklist (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <DeliveryFocusCard task={activeTask} onAdvance={advanceStage} />

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <span className="text-xs font-bold text-neutral-900 font-heading">Fulfillment Assistance</span>
              <button
                onClick={() => setReportIssueModalOpen(true)}
                className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <AlertTriangle size={14} />
                <span>Report Delivery Issue</span>
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono text-neutral-700">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <span>Pickup SLA Window</span>
                <strong className="text-neutral-900 font-bold">{activeTask.pickupSlaTime}</strong>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <span>Customer Contact</span>
                <span className="text-[#e35205] font-bold">{activeTask.customerPhone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderActiveHomePage;
