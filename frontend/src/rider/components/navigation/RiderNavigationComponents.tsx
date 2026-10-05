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
    high_accuracy: { label: '🟢 GPS Locked (3m)', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
    low_accuracy: { label: '🟡 Low Signal (15m)', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
    lost_signal: { label: '🔴 GPS Lost', bg: 'bg-red-50 border-red-200', text: 'text-red-700' },
    permission_denied: { label: '⚠️ GPS Disabled', bg: 'bg-neutral-100 border-neutral-250', text: 'text-neutral-600' },
  };

  const curr = styles[status] || styles.high_accuracy;

  return (
    <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${curr.bg} ${curr.text}`}>
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
    return <CornerUpRight size={size} className="text-emerald-600" />;
  }
  if (direction === 'turn_left' || direction === 'slight_left') {
    return <CornerUpLeft size={size} className="text-emerald-600" />;
  }
  if (direction === 'arrive_destination') {
    return <MapPin size={size} className="text-[#e35205]" />;
  }
  return <ArrowUp size={size} className="text-emerald-600" />;
};

// ─── NavigationSubNavTabBar ──────────────────────────────────────────────────
export const NavigationSubNavTabBar: React.FC = () => {
  const tabs = [
    { label: 'Live Guidance', path: '/rider/navigation/live' },
    { label: 'Route Progress', path: '/rider/navigation/route' },
    { label: 'Map View', path: '/rider/navigation/map' },
    { label: 'ETA & Distance', path: '/rider/navigation/eta' },
    { label: 'GPS Alerts', path: '/rider/navigation/alerts' },
  ];

  return (
    <div className="w-full bg-white border-y border-neutral-200/80 px-2 py-2 overflow-x-auto scrollbar-none text-left select-none">
      <div className="flex items-center gap-1 min-w-max">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/rider/navigation/live' || tab.path === '/rider/navigation'}
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-3xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
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
      className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3 text-left cursor-pointer transition-colors hover:bg-neutral-50/50"
    >
      <div className="flex items-start gap-3">
        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
          <TurnIcon direction={instruction.direction} size={24} />
        </div>

        <div className="space-y-0.5 flex-1">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
            In {instruction.distanceMeters} Meters
          </span>
          <h3 className="text-base font-black text-neutral-900 font-heading leading-snug">
            {instruction.streetName}
          </h3>
          {instruction.landmarkNote && (
            <p className="text-xs text-neutral-500">{instruction.landmarkNote}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono pt-2 border-t border-neutral-100">
        <span>Tap card to advance turn maneuver</span>
        <span className="text-emerald-700 font-bold">Step Forward →</span>
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

          // Restaurant Marker (Red Icon)
          const restIcon = L.divIcon({
            className: 'custom-rest-marker',
            html: `<div style="background-color:#e35205; width:28px; height:28px; border-radius:50%; border:2px solid #fff; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:bold; font-size:12px; shadow:0 2px 6px rgba(0,0,0,0.3)">R</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });
          L.marker([restaurantLat, restaurantLng], { icon: restIcon })
            .addTo(map)
            .bindPopup('<b>Restaurant: La Pasta Bella</b>');

          // Customer Marker (Dark Icon)
          const custIcon = L.divIcon({
            className: 'custom-cust-marker',
            html: `<div style="background-color:#111827; width:28px; height:28px; border-radius:50%; border:2px solid #fff; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:bold; font-size:12px; shadow:0 2px 6px rgba(0,0,0,0.3)">C</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });
          L.marker([customerLat, customerLng], { icon: custIcon })
            .addTo(map)
            .bindPopup('<b>Customer: Rahul Sharma</b>');

          // Animated Courier Rider Marker (Emerald Pulse)
          const riderIcon = L.divIcon({
            className: 'custom-rider-marker',
            html: `<div style="background-color:#10b981; width:24px; height:24px; border-radius:50%; border:3px solid #fff; box-shadow:0 0 0 6px rgba(16,185,129,0.3);"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
          const riderMarker = L.marker([courierLat, courierLng], { icon: riderIcon }).addTo(map);
          riderMarkerRef.current = riderMarker;

          // Polyline Driving Route Path (Emerald Line)
          const defaultPoly: [number, number][] = polylineCoords || [
            [restaurantLat, restaurantLng],
            [19.064, 72.831],
            [customerLat, customerLng],
          ];
          const polyline = L.polyline(defaultPoly, {
            color: '#10b981',
            weight: 5,
            opacity: 0.85,
            dashArray: '6, 6',
          }).addTo(map);
          polylineRef.current = polyline;

          mapInstanceRef.current = map;
          setMapLoaded(true);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Update Map Layer (Streets vs Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    loadLeafletSDK().then((L) => {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);

      if (routeSummary.tileMode === 'satellite') {
        tileLayerRef.current = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 19 }
        );
      } else {
        tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        });
      }

      tileLayerRef.current.addTo(mapInstanceRef.current);
    });
  }, [routeSummary.tileMode]);

  // 3. Update Courier Location Marker
  useEffect(() => {
    if (riderMarkerRef.current && routeSummary.courierLat && routeSummary.courierLng) {
      riderMarkerRef.current.setLatLng([routeSummary.courierLat, routeSummary.courierLng]);
    }
  }, [routeSummary.courierLat, routeSummary.courierLng]);

  // 4. Handle Recenter Action
  const handleRecenterClick = () => {
    if (mapInstanceRef.current && routeSummary.courierLat && routeSummary.courierLng) {
      mapInstanceRef.current.setView([routeSummary.courierLat, routeSummary.courierLng], 15, {
        animate: true,
      });
    }
    onRecenter();
  };

  return (
    <div className="relative w-full h-80 rounded-3xl bg-neutral-100 border border-neutral-200/90 shadow-inner overflow-hidden select-none">
      {/* Leaflet Real Interactive Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Fallback overlay if loading */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-neutral-100/90 flex items-center justify-center text-xs font-bold text-neutral-400 animate-pulse z-10">
          Initializing Real Map Engine...
        </div>
      )}

      {/* Map Recenter, Layer & Reroute Overlay Controls */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-2 z-[400]">
        {onToggleTileMode && (
          <button
            onClick={onToggleTileMode}
            className="p-2.5 rounded-2xl bg-white text-neutral-800 shadow-md border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
            title="Toggle Map Style"
          >
            <Layers size={15} className="text-[#e35205]" />
            <span>{routeSummary.tileMode === 'satellite' ? 'Streets' : 'Satellite'}</span>
          </button>
        )}

        <button
          onClick={handleRecenterClick}
          className="p-2.5 rounded-2xl bg-white text-neutral-800 shadow-md border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
          title="Recenter Camera"
        >
          <Compass size={15} className="text-[#e35205]" />
          <span>Recenter</span>
        </button>

        <button
          onClick={onReroute}
          className="p-2.5 rounded-2xl bg-neutral-900 text-white shadow-md hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
        >
          <RotateCcw size={14} />
          <span>Reroute</span>
        </button>
      </div>

      {/* Live Street Name Overlay */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-neutral-200 shadow-3xs flex items-center gap-1.5 text-xs font-bold text-neutral-900 z-[400]">
        <Navigation size={14} className="text-[#e35205]" />
        <span>{routeSummary.currentStreetName}</span>
      </div>
    </div>
  );
};

export const LiveMapCard = RealLiveMapCanvas;
