import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Maximize2,
  Minimize2,
  Crosshair,
  Layers,
  MapPin,
  Zap,
  Navigation,
  Compass,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Radio,
  Eye,
  Activity,
} from 'lucide-react';
import { loadLeafletSDK } from '@/rider/services/riderNavigationServices';

export type MapTileTheme = 'radar' | 'streets' | 'satellite';
export type MapViewMode = 'standard' | 'expanded' | 'fullscreen';

interface LiveRadarMapProps {
  restaurantName: string;
  restaurantAddress?: string;
  customerAddress?: string;
  currentStageIndex: number; // 0: placed, 1: preparing, 2: dispatched, 3: delivered
  etaMins?: number;
  otpCode?: string;
  orderId?: string;
}

export const LiveRadarMapCanvas: React.FC<LiveRadarMapProps> = ({
  restaurantName,
  restaurantAddress = 'Spice Route Kitchen, Sector 4',
  customerAddress = 'Your Delivery Address',
  currentStageIndex,
  etaMins = 18,
  otpCode = '4821',
  orderId = 'TX-9482',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const riderMarkerRef = useRef<any>(null);
  const restaurantMarkerRef = useRef<any>(null);
  const destinationMarkerRef = useRef<any>(null);
  const activePolylineRef = useRef<any>(null);
  const glowPolylineRef = useRef<any>(null);

  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const [activeTheme, setActiveTheme] = useState<MapTileTheme>('radar');
  const [viewMode, setViewMode] = useState<MapViewMode>('standard');
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [riderSpeed, setRiderSpeed] = useState(34);
  const [riderBattery, setRiderBattery] = useState(91);
  const [isFollowingRider, setIsFollowingRider] = useState(false);

  // ── Realistic Corridor Coordinates (Restaurant to Customer) ──────────────────
  const corridorWaypoints: [number, number][] = useMemo(
    () => [
      [17.4415, 78.3882], // 0. Restaurant Origin (Spice Route)
      [17.4385, 78.3934], // 1. Main junction corridor
      [17.4342, 78.4012], // 2. Arterial expressway
      [17.4298, 78.4085], // 3. Residential boulevard
      [17.4245, 78.4148], // 4. Neighborhood entrance
      [17.4195, 78.4215], // 5. Customer doorstep
    ],
    []
  );

  const restaurantCoords = corridorWaypoints[0];
  const customerCoords = corridorWaypoints[corridorWaypoints.length - 1];

  // Rider position based on delivery progression stage
  const riderCoords = useMemo(() => {
    switch (currentStageIndex) {
      case 0:
        return corridorWaypoints[0];
      case 1:
        return corridorWaypoints[1];
      case 2:
        return corridorWaypoints[3];
      case 3:
      default:
        return corridorWaypoints[5];
    }
  }, [currentStageIndex, corridorWaypoints]);

  // ── 1. Initialize Map Instance ──────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    loadLeafletSDK()
      .then((L) => {
        if (!isMounted || !mapContainerRef.current) return;

        if (!mapInstanceRef.current) {
          const map = L.map(mapContainerRef.current, {
            center: [17.431, 78.405],
            zoom: 14,
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: true,
          });

          // Default Dark Radar Layer (CartoDB Dark Matter)
          const radarTile = L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            {
              subdomains: 'abcd',
              maxZoom: 19,
            }
          );
          radarTile.addTo(map);
          tileLayerRef.current = radarTile;

          // ── Markers ──────────────────────────────────────────────────────────

          // 1. Restaurant Origin Marker (Feasto White Tactical Badge)
          const restIcon = L.divIcon({
            className: 'feasto-rest-marker',
            html: `
              <div class="relative flex flex-col items-center select-none" style="transform: translate(-50%, -100%);">
                <div class="w-5 h-5 bg-white border-2 border-[#141518] shadow-2xl flex items-center justify-center font-bold text-[10px] text-[#141518]">
                  🍲
                </div>
                <div class="font-mono text-[9px] uppercase tracking-wider bg-white text-[#141518] px-2 py-0.5 mt-1 font-black whitespace-nowrap shadow-md border border-[#141518]">
                  ${restaurantName.toUpperCase()}
                </div>
                <div class="w-1.5 h-1.5 bg-white rotate-45 -mt-1 border-r border-b border-[#141518]"></div>
              </div>
            `,
            iconSize: [0, 0],
          });
          restaurantMarkerRef.current = L.marker(restaurantCoords, { icon: restIcon })
            .addTo(map)
            .bindPopup(
              `<div style="font-family:monospace; font-size:11px; padding:4px;"><b>${restaurantName}</b><br/>Dispatching Kitchen Corridor</div>`
            );

          // 2. Customer Destination Marker (Electric Blue Badge)
          const custIcon = L.divIcon({
            className: 'feasto-cust-marker',
            html: `
              <div class="relative flex flex-col items-center select-none" style="transform: translate(-50%, -100%);">
                <div class="w-5 h-5 bg-[#1B3BFF] border-2 border-white shadow-2xl flex items-center justify-center text-white font-bold text-[10px]">
                  📍
                </div>
                <div class="font-mono text-[9px] uppercase tracking-wider bg-[#1B3BFF] text-white px-2 py-0.5 mt-1 font-bold whitespace-nowrap shadow-md border border-white">
                  YOUR ADDRESS
                </div>
                <div class="w-1.5 h-1.5 bg-[#1B3BFF] rotate-45 -mt-1 border-r border-b border-white"></div>
              </div>
            `,
            iconSize: [0, 0],
          });
          destinationMarkerRef.current = L.marker(customerCoords, { icon: custIcon })
            .addTo(map)
            .bindPopup(
              `<div style="font-family:monospace; font-size:11px; padding:4px;"><b>Doorstep Location</b><br/>${customerAddress}</div>`
            );

          // 3. Dynamic Courier Marker (Pulsing Neon EV Radar Node)
          const riderIcon = L.divIcon({
            className: 'feasto-rider-marker',
            html: `
              <div class="relative flex flex-col items-center select-none" style="transform: translate(-50%, -50%);">
                <div class="relative w-8 h-8 flex items-center justify-center">
                  <span class="absolute inset-0 rounded-full bg-[#D7F04A]/30 animate-ping"></span>
                  <span class="absolute inset-1 rounded-full border border-[#D7F04A] animate-pulse"></span>
                  <div class="w-6 h-6 rounded-full bg-[#D7F04A] text-[#141518] flex items-center justify-center font-black text-xs shadow-lg shadow-[#D7F04A]/50">
                    ⚡
                  </div>
                </div>
                <div class="font-mono text-[9px] uppercase tracking-wider bg-[#D7F04A] text-[#141518] px-2 py-0.5 mt-1 font-black whitespace-nowrap shadow-md border border-[#141518] flex items-center gap-1">
                  <span>RIDER RANGA · EV</span>
                  <span class="text-[8px] bg-[#141518] text-[#D7F04A] px-1 rounded-sm">34 KM/H</span>
                </div>
              </div>
            `,
            iconSize: [0, 0],
          });
          riderMarkerRef.current = L.marker(riderCoords, { icon: riderIcon, zIndexOffset: 1000 })
            .addTo(map)
            .bindPopup(
              `<div style="font-family:monospace; font-size:11px; padding:4px;"><b>Rider Ranga · EV Fleet</b><br/>Battery: 91% · Speed: 34 km/h</div>`
            );

          // ── Route Polylines ──────────────────────────────────────────────────
          // Glow layer underneath
          glowPolylineRef.current = L.polyline(corridorWaypoints, {
            color: '#D7F04A',
            weight: 8,
            opacity: 0.25,
            lineCap: 'round',
          }).addTo(map);

          // Foreground dynamic dashed pulse route
          activePolylineRef.current = L.polyline(corridorWaypoints, {
            color: '#D7F04A',
            weight: 3.5,
            opacity: 0.95,
            dashArray: '8, 8',
            lineCap: 'round',
          }).addTo(map);

          // Fit initial bounds to show whole corridor
          map.fitBounds(L.polyline(corridorWaypoints).getBounds(), {
            padding: [60, 60],
            maxZoom: 15,
          });

          mapInstanceRef.current = map;
          setIsLeafletReady(true);
        }
      })
      .catch((err) => {
        console.warn('[RADAR MAP] Leaflet initialization warning:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [corridorWaypoints, customerAddress, customerCoords, restaurantCoords, restaurantName, riderCoords]);

  // ── 2. Update Map Layer Theme ───────────────────────────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    loadLeafletSDK().then((L) => {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);

      if (activeTheme === 'satellite') {
        tileLayerRef.current = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 19 }
        );
      } else if (activeTheme === 'streets') {
        tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        });
      } else {
        // Radar Dark
        tileLayerRef.current = L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          {
            subdomains: 'abcd',
            maxZoom: 19,
          }
        );
      }

      tileLayerRef.current.addTo(mapInstanceRef.current);
    });
  }, [activeTheme]);

  // ── 3. Smooth Rider Movement & Telemetry Fluctuation ────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current || !riderMarkerRef.current) return;

    loadLeafletSDK().then((L) => {
      riderMarkerRef.current.setLatLng(riderCoords);

      if (isFollowingRider) {
        mapInstanceRef.current.panTo(riderCoords, { animate: true, duration: 1.2 });
      }
    });

    // Speed fluctuation simulator
    const speedInterval = setInterval(() => {
      setRiderSpeed((prev) => {
        const next = Math.floor(prev + (Math.random() * 6 - 3));
        return Math.min(45, Math.max(22, next));
      });
    }, 4000);

    return () => clearInterval(speedInterval);
  }, [riderCoords, isFollowingRider]);

  // ── 4. Map Container Resize Trigger on ViewMode Toggle ──────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [viewMode]);

  // ── Helper Actions ─────────────────────────────────────────────────────────
  const handleRecenterRider = () => {
    if (!mapInstanceRef.current) return;
    setIsFollowingRider(true);
    mapInstanceRef.current.flyTo(riderCoords, 16, { animate: true, duration: 1.2 });
  };

  const handleFitCorridor = () => {
    if (!mapInstanceRef.current) return;
    setIsFollowingRider(false);
    loadLeafletSDK().then((L) => {
      mapInstanceRef.current.fitBounds(L.polyline(corridorWaypoints).getBounds(), {
        padding: [70, 70],
        animate: true,
        duration: 1.2,
      });
    });
  };

  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomOut();
  };

  const handleCopyOtp = () => {
    navigator.clipboard.writeText(otpCode);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  // Height class mapping based on viewMode
  const containerClasses =
    viewMode === 'fullscreen'
      ? 'fixed inset-0 z-[9999] w-screen h-screen bg-[#0c0d10] p-4 sm:p-6'
      : viewMode === 'expanded'
      ? 'relative w-full h-[660px] border border-black overflow-hidden shadow-2xl transition-all duration-300'
      : 'relative w-full h-[480px] border border-black overflow-hidden shadow-2xl transition-all duration-300';

  return (
    <div className={containerClasses}>
      {/* Visual Map Surface */}
      <div
        ref={mapContainerRef}
        className="w-full h-full bg-[#0c0d10] z-0 focus:outline-none"
        style={{ cursor: 'grab' }}
      />

      {/* Cyber Grid Lines Overlay (Only on Radar Mode) */}
      {activeTheme === 'radar' && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20 z-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      )}

      {/* ── Top Left: Active Radar Status & Telemetry HUD ──────────────────────── */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-auto">
        <div className="bg-black/90 backdrop-blur-md text-[#F3F0E8] p-3 font-mono text-xs border border-white/15 shadow-2xl max-w-[280px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#D7F04A] animate-pulse"></span>
            <span className="text-[#8A8D98] text-[10px] tracking-widest uppercase">
              RADAR ACTIVE · SAT-12
            </span>
          </div>
          <div className="text-[#D7F04A] font-bold text-xs uppercase tracking-wider flex items-center justify-between">
            <span>DISPATCH CORRIDOR: OPEN</span>
            <span className="text-[10px] text-[#8A8D98]">±1.8m</span>
          </div>
          <div className="hairline-t border-t border-white/10 mt-2 pt-2 text-[10px] text-[#A1A4B0] flex items-center justify-between">
            <span>COURIER: RANGA (EV)</span>
            <span className="font-bold text-[#D7F04A]">{riderSpeed} KM/H</span>
          </div>
        </div>
      </div>

      {/* ── Top Right: Layer Switcher & View Mode Controls ─────────────────────── */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        {/* Layer Switcher Pills */}
        <div className="bg-black/90 backdrop-blur-md p-1 border border-white/15 flex items-center gap-1 font-mono text-[10px] shadow-2xl">
          <button
            onClick={() => setActiveTheme('radar')}
            className={`px-2.5 py-1 uppercase tracking-wider font-bold transition-colors cursor-pointer ${
              activeTheme === 'radar'
                ? 'bg-[#D7F04A] text-[#141518]'
                : 'text-[#8A8D98] hover:text-white'
            }`}
            title="Dark Tactical Radar"
          >
            Radar
          </button>
          <button
            onClick={() => setActiveTheme('streets')}
            className={`px-2.5 py-1 uppercase tracking-wider font-bold transition-colors cursor-pointer ${
              activeTheme === 'streets'
                ? 'bg-[#D7F04A] text-[#141518]'
                : 'text-[#8A8D98] hover:text-white'
            }`}
            title="OpenStreetMap Streets"
          >
            Streets
          </button>
          <button
            onClick={() => setActiveTheme('satellite')}
            className={`px-2.5 py-1 uppercase tracking-wider font-bold transition-colors cursor-pointer ${
              activeTheme === 'satellite'
                ? 'bg-[#D7F04A] text-[#141518]'
                : 'text-[#8A8D98] hover:text-white'
            }`}
            title="Satellite Imagery"
          >
            Satellite
          </button>
        </div>

        {/* View Mode Switcher (Standard, Expanded, Fullscreen) */}
        <div className="bg-black/90 backdrop-blur-md p-1 border border-white/15 flex items-center gap-1 font-mono text-xs shadow-2xl text-white">
          <button
            onClick={() => setViewMode(viewMode === 'expanded' ? 'standard' : 'expanded')}
            className={`px-2 py-1 flex items-center gap-1 hover:bg-white/10 transition-colors cursor-pointer text-[10px] uppercase font-bold ${
              viewMode === 'expanded' ? 'text-[#D7F04A]' : 'text-[#8A8D98]'
            }`}
            title="Expand Map Canvas"
          >
            <Activity size={12} />
            <span>{viewMode === 'expanded' ? 'Standard' : 'Expand'}</span>
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'fullscreen' ? 'standard' : 'fullscreen')}
            className="p-1.5 hover:bg-white/10 transition-colors cursor-pointer text-[#8A8D98] hover:text-white"
            title={viewMode === 'fullscreen' ? 'Exit Fullscreen' : 'Cinematic Fullscreen'}
          >
            {viewMode === 'fullscreen' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* ── Mid Right: Zoom & Recenter Navigation Float ────────────────────────── */}
      <div className="absolute right-4 top-20 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-black/90 backdrop-blur-md text-white border border-white/15 flex items-center justify-center hover:bg-[#D7F04A] hover:text-[#141518] hover:border-black transition-colors cursor-pointer shadow-lg"
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-black/90 backdrop-blur-md text-white border border-white/15 flex items-center justify-center hover:bg-[#D7F04A] hover:text-[#141518] hover:border-black transition-colors cursor-pointer shadow-lg"
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={handleRecenterRider}
          className={`w-8 h-8 backdrop-blur-md border border-white/15 flex items-center justify-center transition-colors cursor-pointer shadow-lg ${
            isFollowingRider
              ? 'bg-[#D7F04A] text-[#141518] border-black font-bold'
              : 'bg-black/90 text-white hover:bg-white/20'
          }`}
          title="Target & Track Rider"
        >
          <Crosshair size={14} />
        </button>
        <button
          onClick={handleFitCorridor}
          className="w-8 h-8 bg-black/90 backdrop-blur-md text-white border border-white/15 flex items-center justify-center hover:bg-[#D7F04A] hover:text-[#141518] hover:border-black transition-colors cursor-pointer shadow-lg"
          title="Fit Whole Delivery Corridor"
        >
          <Compass size={14} />
        </button>
      </div>

      {/* ── Bottom Left: Live Corridor ETA & Metric Badge ───────────────────────── */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-auto flex items-center gap-2">
        <div className="bg-black/90 backdrop-blur-md text-[#F3F0E8] px-3.5 py-2.5 font-mono text-xs border border-white/15 shadow-2xl flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Radio size={13} className="text-[#D7F04A] animate-pulse" />
            <span className="text-[10px] text-[#8A8D98] uppercase">LIVE RADAR</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="text-[#D7F04A] font-bold text-xs">
            ETA: {etaMins} MINS
          </div>
          <span className="text-white/20">|</span>
          <div className="text-[10px] text-[#A1A4B0]">
            1.4 KM LEFT
          </div>
        </div>
      </div>

      {/* ── Bottom Right: Delivery Handoff OTP HUD ──────────────────────────────── */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
        <div className="bg-black/90 backdrop-blur-md text-[#F3F0E8] p-3 font-mono text-xs border border-white/15 shadow-2xl text-right flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-[#8A8D98] block text-[10px] uppercase tracking-wider">
              DELIVERY HANDOFF OTP
            </span>
            <button
              onClick={handleCopyOtp}
              className="text-[#8A8D98] hover:text-[#D7F04A] transition-colors cursor-pointer p-0.5"
              title="Copy OTP to Clipboard"
            >
              {copiedOtp ? <Check size={12} className="text-[#D7F04A]" /> : <Copy size={12} />}
            </button>
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-widest text-[#D7F04A] font-mono mt-0.5">
            {otpCode}
          </span>
          <span className="text-[9px] text-[#8A8D98] block mt-0.5">
            Share with rider upon arrival
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveRadarMapCanvas;
