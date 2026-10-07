import React, { useEffect } from 'react';
import { Sparkles, Navigation, Layers } from 'lucide-react';
import useRiderNavigationStore from '../../store/useRiderNavigationStore';
import { RealLiveMapCanvas, NextTurnCard, GPSStatusBadge } from '../../components/navigation/RiderNavigationComponents';
import { RiderButton, RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderNavigationLivePage: React.FC = () => {
  const {
    routeSummary,
    instructions,
    currentInstructionIndex,
    routePolylineCoords,
    aiInsight,
    advanceInstruction,
    recenterMap,
    triggerReroute,
    toggleTileMode,
    startLiveGPS,
    stopLiveGPS,
    loadRealOSRMRoute,
  } = useRiderNavigationStore();

  const currentInstruction = instructions[currentInstructionIndex] || instructions[0];

  useEffect(() => {
    // Start real HTML5 Geolocation Watch on mount
    startLiveGPS();

    // Fetch real OSRM driving route between courier & destination
    if (routeSummary.courierLat && routeSummary.courierLng && routeSummary.customerLat && routeSummary.customerLng) {
      loadRealOSRMRoute(
        routeSummary.courierLat,
        routeSummary.courierLng,
        routeSummary.customerLat,
        routeSummary.customerLng
      );
    }

    return () => {
      stopLiveGPS();
    };
  }, []);

  return (
    <div className="space-y-4 text-left font-mono">
      <div className="flex items-center justify-between">
        <RiderPageHeader
          title="TURN-BY-TURN GPS GUIDANCE"
          subtitle={`MISSION ${routeSummary.orderNumber} • ${routeSummary.currentStreetName}`}
        />
        <GPSStatusBadge status={routeSummary.gpsSignal} />
      </div>

      {/* Real Live Map Canvas Component */}
      <div className="border border-[#141518] shadow-[4px_4px_0px_#141518] overflow-hidden bg-[#14161B]">
        <RealLiveMapCanvas
          routeSummary={routeSummary}
          polylineCoords={routePolylineCoords}
          onRecenter={recenterMap}
          onReroute={triggerReroute}
          onToggleTileMode={toggleTileMode}
        />
      </div>

      {/* Next Turn Direction Banner */}
      <NextTurnCard instruction={currentInstruction} onAdvance={advanceInstruction} />

      {/* Dynamic ETA & Distance Telemetry Tiles */}
      <div className="grid grid-cols-2 gap-3 font-mono">
        <div className="p-4 bg-[#FAF8F5] border border-[#141518] shadow-[3px_3px_0px_#141518] space-y-1">
          <span className="text-[10px] font-black uppercase text-[#55565B] tracking-wider">ESTIMATED ETA</span>
          <h4 className="text-xl font-black text-[#141518] leading-none">{routeSummary.estimatedEtaMins} MINS</h4>
          <span className="text-[11px] text-[#55565B] block pt-1 font-mono">{aiInsight.bestRouteName}</span>
        </div>

        <div className="p-4 bg-[#FAF8F5] border border-[#141518] shadow-[3px_3px_0px_#141518] space-y-1">
          <span className="text-[10px] font-black uppercase text-[#55565B] tracking-wider">REMAINING DISTANCE</span>
          <h4 className="text-xl font-black text-[#141518] leading-none">{routeSummary.distanceRemainingKm} KM</h4>
          <span className="text-[11px] text-[#141518] font-black block pt-1 uppercase">
            {aiInsight.etaConfidenceScorePct}% CONFIDENCE
          </span>
        </div>
      </div>

      {/* AI Traffic Reroute Suggestion */}
      <div className="p-4 bg-[#FAF8F5] border border-[#141518] shadow-[3px_3px_0px_#141518] space-y-2 text-xs font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-[#141518]">
            <Sparkles size={15} className="text-[#141518]" />
            <span className="uppercase tracking-wider">AI SATELLITE TRAFFIC TELEMETRY</span>
          </div>
          <span className="text-[10px] font-mono font-black px-2 py-0.5 bg-[#D7F04A] text-[#141518] border border-[#141518]">
            5G SYNCED
          </span>
        </div>

        <p className="text-[#55565B] leading-relaxed font-sans">{aiInsight.rerouteRecommendation}</p>
      </div>
    </div>
  );
};

export default RiderNavigationLivePage;
