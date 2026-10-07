import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  Navigation,
  MapPin,
  Clock,
  Compass,
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  X,
  Volume2,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import type { TurnInstruction, GPSStatus, LiveRouteSummary, NavigationAlertItem, MapTileMode } from '../../types/navigation';
import { loadLeafletSDK, fetchOSRMRoute } from '../../services/riderNavigationServices';
import { RiderButton } from '../RiderUIComponents';

// ─── GPSStatusBadge ──────────────────────────────────────────────────────────
export const GPSStatusBadge: React.FC<{ status: GPSStatus }> = ({ status }) => {
  const styles: Record<GPSStatus, { label: string; bg: string; text: string }> = {
    high_accuracy: { label: '🟢 5G RTK LOCK (3M)', bg: 'bg-[#D7F04A] border-[#141518]', text: 'text-[#141518]' },
    low_accuracy: { label: '🟡 DEGRADED (15M)', bg: 'bg-[#FEF08A] border-[#141518]', text: 'text-[#141518]' },
    lost_signal: { label: '🔴 SATELLITE LOST', bg: 'bg-[#FEE2E2] border-[#141518]', text: 'text-[#991B1B]' },
    permission_denied: { label: '⚠️ GPS INACTIVE', bg: 'bg-[#F3F0E8] border-[#141518]/30', text: 'text-[#55565B]' },
  };

  const curr = styles[status] || styles.high_accuracy;

  return (
    <span
      className={`text-[9px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 border shadow-[1px_1px_0px_#141518] ${curr.bg} ${curr.text}`}
    >
      {curr.label}
    </span>
  );
};

// ─── TurnIcon ────────────────────────────────────────────────────────────────
export const TurnIcon: React.FC<{ direction: TurnInstruction['direction']; size?: number }> = ({
  direction,
  size = 20,
}) => {
  if (direction === 'turn_right' || direction === 'slight_right') {
    return <CornerUpRight size={size} className="text-[#141518]" />;
  }
  if (direction === 'turn_left' || direction === 'slight_left') {
    return <CornerUpLeft size={size} className="text-[#141518]" />;
  }
  if (direction === 'arrive_destination') {
    return <MapPin size={size} className="text-[#141518]" />;
  }
  return <ArrowUp size={size} className="text-[#141518]" />;
};

// ─── NavigationSubNavTabBar ──────────────────────────────────────────────────
export const NavigationSubNavTabBar: React.FC = () => {
  const tabs = [
    { label: 'LIVE GUIDANCE', path: '/rider/navigation/live' },
    { label: 'ROUTE PROGRESS', path: '/rider/navigation/route' },
    { label: 'MAP RADAR', path: '/rider/navigation/map' },
    { label: 'ETA TELEMETRY', path: '/rider/navigation/eta' },
    { label: 'GPS ALERTS', path: '/rider/navigation/alerts' },
  ];

  return (
    <div className="w-full bg-[#FAF8F5] border-y border-[#141518] px-2 py-2 overflow-x-auto scrollbar-none text-left select-none font-mono">
      <div className="flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/rider/navigation/live' || tab.path === '/rider/navigation'}
            className={({ isActive }) =>
              `px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                isActive
                  ? 'bg-[#D7F04A] text-[#141518] border-[#141518] shadow-[2px_2px_0px_#141518]'
                  : 'bg-[#FAF8F5] border-transparent text-[#55565B] hover:text-[#141518] hover:bg-[#F3F0E8] hover:border-[#141518]/20'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

// ─── NextTurnCard ────────────────────────────────────────────────────────────
export const NextTurnCard: React.FC<{
  instruction: TurnInstruction;
  onAdvance: () => void;
}> = ({ instruction, onAdvance }) => {
  return (
    <div
      onClick={onAdvance}
      className="p-5 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-3 text-left cursor-pointer transition-colors hover:bg-[#F3F0E8] font-mono"
    >
      <div className="flex items-start gap-3.5">
        <div className="p-3 bg-[#D7F04A] text-[#141518] border border-[#141518] shadow-[2px_2px_0px_#141518] shrink-0">
          <TurnIcon direction={instruction.direction} size={24} />
        </div>

        <div className="space-y-0.5 flex-1">
          <span className="text-[10px] font-mono font-black text-[#55565B] uppercase tracking-wider">
            IN {instruction.distanceMeters} METERS
          </span>
          <h3 className="text-base font-heading font-black text-[#141518] uppercase leading-snug">
            {instruction.streetName}
          </h3>
          {instruction.landmarkNote && (
            <p className="text-xs text-[#55565B] font-sans">{instruction.landmarkNote}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#55565B] font-mono pt-2 border-t border-[#141518]/15">
        <span>TAP TO ADVANCE MANEUVER</span>
        <span className="text-[#141518] font-black uppercase">STEP FORWARD →</span>
      </div>
    </div>
  );
};

// ─── RealLiveMapCanvas (Leaflet Real OpenStreetMap / Satellite Engine) ────────
export const RealLiveMapCanvas: React.FC<{
  routeSummary: LiveRouteSummary;
  polylineCoords?: [number, number][];
  onRecenter: () => void;
  onReroute: () => void;
  onToggleTileMode?: () => void;
}> = ({ routeSummary, polylineCoords, onRecenter, onReroute, onToggleTileMode }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const riderMarkerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const courierLat = routeSummary.courierLat || 19.0596;
  const courierLng = routeSummary.courierLng || 72.8295;
  const restaurantLat = routeSummary.restaurantLat || 19.0596;
  const restaurantLng = routeSummary.restaurantLng || 72.8295;
  const customerLat = routeSummary.customerLat || 19.0700;
  const customerLng = routeSummary.customerLng || 72.8340;

  // 1. Initialize Leaflet Map Instance
  useEffect(() => {
    let isMounted = true;

    loadLeafletSDK()
      .then((L) => {
        if (!isMounted || !mapContainerRef.current) return;

        if (!mapInstanceRef.current) {
          const map = L.map(mapContainerRef.current, {
            center: [courierLat, courierLng],
            zoom: 14,
            zoomControl: false,
          });

          // Street Tile Layer (OpenStreetMap)
          const streetTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors',
          });

          streetTile.addTo(map);
          tileLayerRef.current = streetTile;

          // Restaurant Marker (Industrial Inverted Box)
          const restIcon = L.divIcon({
            className: 'custom-rest-marker',
            html: `<div style="background-color:#141518; width:28px; height:28px; border:2px solid #D7F04A; display:flex; align-items:center; justify-content:center; color:#D7F04A; font-weight:900; font-family:monospace; font-size:12px; box-shadow:3px 3px 0px #000;">R</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });
          L.marker([restaurantLat, restaurantLng], { icon: restIcon })
            .addTo(map)
            .bindPopup('<b>Restaurant: La Pasta Bella</b>');

          // Customer Marker (Electric Cobalt)
          const custIcon = L.divIcon({
            className: 'custom-cust-marker',
            html: `<div style="background-color:#1B3BFF; width:28px; height:28px; border:2px solid #fff; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:900; font-family:monospace; font-size:12px; box-shadow:3px 3px 0px #000;">C</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });
          L.marker([customerLat, customerLng], { icon: custIcon })
            .addTo(map)
            .bindPopup('<b>Customer: Rahul Sharma</b>');

          // Animated Courier Rider Marker (Acid Lime Kinetic Ring)
          const riderIcon = L.divIcon({
            className: 'custom-rider-marker',
            html: `<div style="background-color:#D7F04A; width:24px; height:24px; border:3px solid #141518; box-shadow:0 0 0 4px rgba(215,240,74,0.4);"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
          const riderMarker = L.marker([courierLat, courierLng], { icon: riderIcon }).addTo(map);
          riderMarkerRef.current = riderMarker;

          // Polyline Driving Route Path (Electric Cobalt)
          const defaultPoly: [number, number][] = polylineCoords || [
            [restaurantLat, restaurantLng],
            [19.064, 72.831],
            [19.068, 72.833],
            [customerLat, customerLng],
          ];

          const routePoly = L.polyline(defaultPoly, {
            color: '#1B3BFF',
            weight: 6,
            opacity: 0.9,
            lineJoin: 'round',
          }).addTo(map);
          polylineRef.current = routePoly;

          mapInstanceRef.current = map;
          setMapLoaded(true);
        }
      })
      .catch((err) => {
        console.error('Leaflet load error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update Tile Layer if Satellite toggled
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    if (routeSummary.tileMode === 'satellite') {
      const sat = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19 }
      );
      sat.addTo(mapInstanceRef.current);
      tileLayerRef.current = sat;
    } else {
      const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 });
      street.addTo(mapInstanceRef.current);
      tileLayerRef.current = street;
    }
  }, [routeSummary.tileMode]);

  // Recenter handler
  const handleRecenterClick = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([courierLat, courierLng], 15, { animate: true });
    }
    onRecenter();
  };

  return (
    <div className="relative w-full h-80 bg-[#14161B] border border-[#141518] shadow-[4px_4px_0px_#141518] overflow-hidden select-none font-mono">
      {/* Leaflet Real Interactive Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Fallback overlay if loading */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-[#14161B]/90 flex items-center justify-center text-xs font-mono font-bold text-[#D7F04A] animate-pulse z-10">
          INITIALIZING SATELLITE RADAR ENGINE...
        </div>
      )}

      {/* Map Recenter, Layer & Reroute Overlay Controls */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-2 z-[400] font-mono">
        {onToggleTileMode && (
          <button
            onClick={onToggleTileMode}
            className="p-2.5 bg-[#FAF8F5] text-[#141518] border border-[#141518] shadow-[2px_2px_0px_#141518] hover:bg-[#F3F0E8] transition-colors cursor-pointer flex items-center gap-1.5 text-[11px] font-bold"
            title="Toggle Map Style"
          >
            <Layers size={14} className="text-[#141518]" />
            <span>{routeSummary.tileMode === 'satellite' ? 'STREETS' : 'SATELLITE'}</span>
          </button>
        )}

        <button
          onClick={handleRecenterClick}
          className="p-2.5 bg-[#FAF8F5] text-[#141518] border border-[#141518] shadow-[2px_2px_0px_#141518] hover:bg-[#F3F0E8] transition-colors cursor-pointer flex items-center gap-1.5 text-[11px] font-bold"
          title="Recenter Camera"
        >
          <Compass size={14} className="text-[#141518]" />
          <span>RECENTER</span>
        </button>

        <button
          onClick={onReroute}
          className="p-2.5 bg-[#141518] text-[#FAF8F5] border border-[#141518] shadow-[2px_2px_0px_#141518] hover:bg-[#25272c] transition-colors cursor-pointer flex items-center gap-1.5 text-[11px] font-bold"
        >
          <RotateCcw size={14} />
          <span>REROUTE</span>
        </button>
      </div>

      {/* Live Street Name Overlay */}
      <div className="absolute top-3 left-3 bg-[#FAF8F5] px-3 py-1.5 border border-[#141518] shadow-[2px_2px_0px_#141518] flex items-center gap-2 text-xs font-mono font-black text-[#141518] z-[400]">
        <Navigation size={14} className="text-[#141518]" />
        <span>{routeSummary.currentStreetName}</span>
      </div>
    </div>
  );
};

export const LiveMapCard = RealLiveMapCanvas;
