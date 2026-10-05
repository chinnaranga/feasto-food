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
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <RiderPageHeader
          title="Turn-by-Turn GPS Guidance"
          subtitle={`Order ${routeSummary.orderNumber} • ${routeSummary.currentStreetName}`}
        />
        <GPSStatusBadge status={routeSummary.gpsSignal} />
      </div>

      {/* Real Live Map Canvas Component */}
      <RealLiveMapCanvas
        routeSummary={routeSummary}
        polylineCoords={routePolylineCoords}
        onRecenter={recenterMap}
        onReroute={triggerReroute}
        onToggleTileMode={toggleTileMode}
      />

      {/* Next Turn Direction Banner */}
      <NextTurnCard instruction={currentInstruction} onAdvance={advanceInstruction} />

      {/* Dynamic ETA & Distance Telemetry Tiles */}
      <div className="grid grid-cols-2 gap-3 font-mono">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase text-neutral-400 font-heading">Estimated Delivery ETA</span>
          <h4 className="text-xl font-black text-emerald-700 leading-none">{routeSummary.estimatedEtaMins} Mins</h4>
          <span className="text-[11px] text-neutral-500 block pt-1">{aiInsight.bestRouteName}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase text-neutral-400 font-heading">Remaining Distance</span>
          <h4 className="text-xl font-black text-neutral-900 leading-none">{routeSummary.distanceRemainingKm} KM</h4>
          <span className="text-[11px] text-emerald-700 font-bold block pt-1">
            {aiInsight.etaConfidenceScorePct}% ETA Confidence
          </span>
        </div>
      </div>

      {/* AI Traffic Reroute Suggestion */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-neutral-900">
            <Sparkles size={15} className="text-[#e35205]" />
            <span>AI Traffic Delay Telemetry</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-700">Live Traffic Sync</span>
        </div>

        <p className="text-neutral-600 leading-relaxed">{aiInsight.rerouteRecommendation}</p>
      </div>
    </div>
  );
};

export default RiderNavigationLivePage;
