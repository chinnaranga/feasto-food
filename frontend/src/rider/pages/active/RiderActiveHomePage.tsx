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
        title="NO ACTIVE DISPATCH MISSION"
        description="You do not currently have an accepted courier mission in progress. Return to Available Offers to accept a live delivery order."
      />
    );
  }

  return (
    <div className="space-y-6 text-left font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#141518]/15">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-[#141518] uppercase tracking-tight">
            ACTIVE COURIER WORKFLOW
          </h1>
          <p className="text-xs text-[#55565B] font-mono mt-0.5">
            MISSION {activeTask.orderNumber} • {activeTask.currentStage === 'en_route_to_pickup' ? 'ROUTE TO KITCHEN' : 'ROUTE TO CUSTOMER'}
          </p>
        </div>

        <span className="text-xs font-mono font-black px-3 py-1.5 bg-[#D7F04A] text-[#141518] border border-[#141518] shadow-[2px_2px_0px_#141518] w-fit">
          ● VESSEL EN ROUTE
        </span>
      </div>

      {/* Responsive Split Delivery Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Map Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-[#141518] shadow-[4px_4px_0px_#141518] overflow-hidden bg-[#14161B]">
            <RealLiveMapCanvas
              routeSummary={routeSummary}
              onRecenter={recenterMap}
              onReroute={triggerReroute}
              onToggleTileMode={toggleTileMode}
            />
          </div>

          <div className="p-4 sm:p-5 bg-[#FAF8F5] border border-[#141518] shadow-[3px_3px_0px_#141518] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#141518]" />
                <h3 className="text-xs font-mono font-black uppercase text-[#141518] tracking-wider">
                  AI DISPATCH ROUTE TELEMETRY
                </h3>
              </div>
              <span className="text-xs font-mono font-black px-2 py-0.5 bg-[#D7F04A] text-[#141518] border border-[#141518]">
                96% ACCURACY
              </span>
            </div>
            <p className="text-xs text-[#141518] leading-relaxed font-mono">{aiInsight.routeEfficiencyTip}</p>
          </div>
        </div>

        {/* Right Column: Focus Card & Step Checklist */}
        <div className="lg:col-span-5 space-y-4">
          <DeliveryFocusCard task={activeTask} onAdvance={advanceStage} />

          <div className="p-4 sm:p-5 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-3">
            <div className="flex items-center justify-between border-b border-[#141518]/15 pb-2">
              <span className="text-xs font-mono font-black text-[#141518] uppercase tracking-wider">
                FULFILLMENT PROTOCOL
              </span>
              <button
                onClick={() => setReportIssueModalOpen(true)}
                className="text-xs font-mono font-bold text-[#EF4444] hover:underline flex items-center gap-1 cursor-pointer uppercase"
              >
                <AlertTriangle size={14} />
                <span>REPORT ISSUE</span>
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono text-[#141518]">
              <div className="flex items-center justify-between p-2.5 bg-[#F3F0E8] border border-[#141518]">
                <span className="text-[#55565B]">PICKUP SLA WINDOW</span>
                <strong className="text-[#141518] font-black">{activeTask.pickupSlaTime}</strong>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#F3F0E8] border border-[#141518]">
                <span className="text-[#55565B]">CUSTOMER CONTACT</span>
                <span className="text-[#141518] font-black">{activeTask.customerPhone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderActiveHomePage;
