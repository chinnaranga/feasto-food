import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Navigation,
  Compass,
  CornerUpLeft,
  CornerUpRight,
  Phone,
  ShieldAlert,
  CheckCircle,
  MapPin,
  Volume2,
  VolumeX,
  Layers,
  Crosshair
} from 'lucide-react';
import useRiderDashboardStore from '../../store/useRiderDashboardStore';
import useRiderStore from '../../store/useRiderStore';

export const RiderDashboardHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { dutyState, assignedZone, summary, toggleDutyState } = useRiderDashboardStore();
  const { profile, activeOffer } = useRiderStore();

  const [stepState, setStepState] = useState<'to_pickup' | 'at_pickup' | 'to_drop' | 'arrived'>('to_drop');
  const [soundMuted, setSoundMuted] = useState(false);
  const [mapMode, setMapMode] = useState<'satellite' | 'vector'>('vector');

  // Active delivery context (defaulting to live order context)
  const currentCustomer = {
    name: 'Ranga',
    phone: '+91 98201 44821',
    address: 'Flat 402, Perry Cross Road, Bandra West',
    otp: '4821',
    orderNumber: '#1809',
    kitchen: 'Spice Route',
    items: 'Hyderabadi Dum Biryani x 2, Mirchi Ka Salan'
  };

  return (
    <div className="flex-1 w-full h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row bg-[#0D0F12] text-[#F3F0E8] overflow-hidden select-none">
      
      {/* ── 70-80% DOMINANT NAVIGATION INSTRUMENT (MAP & HUD) ── */}
      <div className="relative flex-1 lg:w-[75%] h-full bg-[#111317] overflow-hidden flex flex-col justify-between">
        
        {/* Dynamic Architectural Radar Map Background */}
        <div className="absolute inset-0 z-0">
          <svg className="w-full h-full object-cover opacity-60" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="radar-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1D222D" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="#0D0F12" />
            <rect width="100%" height="100%" fill="url(#radar-grid)" />

            {/* Simulated Road Arteries */}
            <path
              d="M -100 200 C 300 220, 500 120, 900 240 C 1300 360, 1600 200, 2000 220"
              fill="none"
              stroke="#1E2430"
              strokeWidth="24"
            />
            <path
              d="M 400 -100 C 420 300, 360 600, 480 1200"
              fill="none"
              stroke="#1E2430"
              strokeWidth="18"
            />
            <path
              d="M 800 -100 C 820 400, 920 800, 940 1200"
              fill="none"
              stroke="#1E2430"
              strokeWidth="14"
            />

            {/* Active GPS Route Path (Electric Cobalt) */}
            <path
              d="M 280 620 L 410 460 L 590 460 L 780 240 L 980 230"
              fill="none"
              stroke="#1B3BFF"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 280 620 L 410 460 L 590 460 L 780 240 L 980 230"
              fill="none"
              stroke="#D7F04A"
              strokeWidth="2"
              strokeDasharray="8 8"
              className="animate-pulse"
            />

            {/* Origin (Spice Route) */}
            <circle cx="280" cy="620" r="10" fill="#141518" stroke="#D7F04A" strokeWidth="4" />

            {/* Rider Current Position Icon */}
            <g transform="translate(590, 460)">
              <circle cx="0" cy="0" r="24" fill="#1B3BFF" fillOpacity="0.25" className="animate-ping" />
              <circle cx="0" cy="0" r="12" fill="#1B3BFF" stroke="#FFFFFF" strokeWidth="3" />
              <polygon points="0,-18 7,-6 -7,-6" fill="#D7F04A" />
            </g>

            {/* Destination (Customer: Ranga) */}
            <g transform="translate(980, 230)">
              <circle cx="0" cy="0" r="16" fill="#D7F04A" stroke="#141518" strokeWidth="4" />
              <text x="24" y="5" fill="#F3F0E8" fontSize="13" fontFamily="monospace" fontWeight="bold">
                DROP: RANGA (OTP 4821)
              </text>
            </g>
          </svg>
        </div>

        {/* ── TOP HUD: ULTRA-LARGE INSTRUCTION BAR (MANDATORY REQUIREMENT) ── */}
        <div className="relative z-10 m-4 sm:m-6 p-6 sm:p-8 bg-[#14161B]/95 border border-[#2B303D] backdrop-blur-md max-w-xl text-left shadow-2xl">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-[#1B3BFF] text-white flex items-center justify-center shrink-0">
              <CornerUpLeft size={36} strokeWidth={2.5} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3 font-mono text-xs text-[#D7F04A] font-bold tracking-widest uppercase">
                <span>NEXT MANEUVER</span>
                <span>·</span>
                <span>LINKING ROAD</span>
              </div>
              <h1 className="font-heading font-black text-3xl sm:text-5xl tracking-tight text-white leading-none uppercase">
                TURN LEFT
              </h1>
              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-mono font-black text-2xl sm:text-3xl text-[#D7F04A]">
                  120 m
                </span>
                <span className="font-mono text-xs text-[#8E929C] uppercase tracking-wider">
                  Then continue straight for 600m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Floating Controls */}
        <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="w-10 h-10 bg-[#14161B] border border-[#2A2E3B] text-white flex items-center justify-center hover:bg-[#1E232E] cursor-pointer"
            title="Toggle Voice Prompts"
          >
            {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            onClick={() => setMapMode(mapMode === 'vector' ? 'satellite' : 'vector')}
            className="w-10 h-10 bg-[#14161B] border border-[#2A2E3B] text-white flex items-center justify-center hover:bg-[#1E232E] cursor-pointer"
            title="Switch Map Layers"
          >
            <Layers size={16} />
          </button>
          <button
            className="w-10 h-10 bg-[#1B3BFF] text-white flex items-center justify-center hover:bg-[#142ecc] cursor-pointer"
            title="Recenter Instrument"
          >
            <Crosshair size={16} />
          </button>
        </div>

        {/* ── BOTTOM HUD TELEMETRY STRIP ── */}
        <div className="relative z-10 bg-[#14161B]/95 border-t border-[#252934] px-6 py-4 flex flex-wrap items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-[9px] text-[#8E929C] block uppercase tracking-wider">CURRENT SPEED</span>
              <span className="text-base font-black text-white">34 KM/H</span>
            </div>
            <div className="border-l border-[#252934] pl-6">
              <span className="text-[9px] text-[#8E929C] block uppercase tracking-wider">EST. TIME</span>
              <span className="text-base font-black text-[#D7F04A]">4 MIN</span>
            </div>
            <div className="border-l border-[#252934] pl-6">
              <span className="text-[9px] text-[#8E929C] block uppercase tracking-wider">REMAINING</span>
              <span className="text-base font-black text-white">1.1 KM</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#8E929C]">VESSEL COMPASS: 284° WNW</span>
            <span className="px-2 py-0.5 bg-[#1B3BFF] text-white font-bold text-[10px]">RADAR LOCK</span>
          </div>
        </div>
      </div>

      {/* ── 25-30% CURRENT DELIVERY CONTEXT (SIDE INSTRUMENT) ── */}
      <div className="w-full lg:w-[25%] lg:min-w-[340px] bg-[#14161B] border-t lg:border-t-0 lg:border-l border-[#252934] flex flex-col justify-between p-6 sm:p-8 text-left z-20 overflow-y-auto">
        <div className="space-y-8">
          
          {/* Status Label */}
          <div className="border-b border-[#252934] pb-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#D7F04A] block">
                CURRENT OBJECTIVE
              </span>
              <h2 className="font-heading font-black text-xl text-white uppercase tracking-tight">
                DROP-OFF TO CUSTOMER
              </h2>
            </div>
            <span className="w-3 h-3 bg-[#D7F04A] animate-pulse" />
          </div>

          {/* Customer Block (Stark, Clean, Typographic) */}
          <div className="space-y-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#8E929C] block">
                CUSTOMER
              </span>
              <h3 className="font-heading font-black text-3xl text-white tracking-tight">
                {currentCustomer.name}
              </h3>
              <p className="font-mono text-xs text-[#8E929C] mt-1">
                {currentCustomer.address}
              </p>
            </div>

            {/* OTP Block (High Visibility) */}
            <div className="p-4 bg-[#0D0F12] border border-[#2B303D]">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#8E929C] block">
                DELIVERY HANDOFF OTP
              </span>
              <span className="font-mono font-black text-4xl tracking-widest text-[#D7F04A] block mt-1">
                {currentCustomer.otp}
              </span>
              <span className="font-mono text-[10px] text-[#8E929C] block mt-1">
                Verify this code with customer before completion
              </span>
            </div>

            {/* Direct Comms */}
            <div className="flex gap-2">
              <a
                href={`tel:${currentCustomer.phone}`}
                className="flex-1 py-3 px-4 bg-[#1E232E] hover:bg-[#282F3E] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#2B303D] transition-colors"
              >
                <Phone size={14} className="text-[#D7F04A]" />
                <span>CALL ({currentCustomer.phone})</span>
              </a>
            </div>
          </div>

          {/* Cargo Details */}
          <div className="space-y-2 border-t border-[#252934] pt-4 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-widest text-[#8E929C] block">
              CARGO DISPATCH {currentCustomer.orderNumber}
            </span>
            <div className="text-white font-bold">{currentCustomer.kitchen}</div>
            <div className="text-[#8E929C] text-[11px] leading-relaxed">
              {currentCustomer.items}
            </div>
          </div>
        </div>

        {/* Primary Action Button (The "ARRIVE" prompt) */}
        <div className="pt-6 border-t border-[#252934] space-y-3">
          {stepState === 'to_drop' && (
            <button
              onClick={() => setStepState('arrived')}
              className="w-full py-5 bg-[#D7F04A] hover:bg-[#c6df3d] text-[#141518] font-heading font-black text-lg uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-3"
            >
              <span>ARRIVE AT LOCATION →</span>
            </button>
          )}

          {stepState === 'arrived' && (
            <button
              onClick={() => {
                alert(`Delivery for ${currentCustomer.name} (OTP ${currentCustomer.otp}) verified and completed!`);
                navigate('/rider/orders');
              }}
              className="w-full py-5 bg-[#1B3BFF] hover:bg-[#142ecc] text-white font-heading font-black text-lg uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-3"
            >
              <span>VERIFY OTP & COMPLETE DROP →</span>
            </button>
          )}

          <div className="flex items-center justify-between font-mono text-[10px] text-[#8E929C]">
            <button
              onClick={() => navigate('/rider/support')}
              className="hover:text-red-400 uppercase flex items-center gap-1 cursor-pointer"
            >
              <ShieldAlert size={12} />
              <span>REPORT INCIDENT / SOS</span>
            </button>
            <span className="text-[#D7F04A]">BATTERY 88%</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RiderDashboardHomePage;
