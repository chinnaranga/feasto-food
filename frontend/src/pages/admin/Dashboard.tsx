import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  Radio,
  Navigation,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  Maximize2,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Compass
} from 'lucide-react';
import useAdminStore from '../../store/admin/adminStore';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { restaurants, users, supportTickets, trustReports, featureFlags } = useAdminStore();

  const [activeSector, setActiveSector] = useState<'all' | 'west' | 'central' | 'south'>('all');
  const [streamFilter, setStreamFilter] = useState<'all' | 'orders' | 'riders' | 'alerts'>('all');

  // Live real-time operations activity stream
  const liveEvents = [
    { id: '1', time: '16:54:12', type: 'order', label: 'Order #1814 dispatched to Spice Route', sector: 'Bandra West', value: '₹940', state: 'prep' },
    { id: '2', time: '16:53:40', type: 'rider', label: 'Rider #42 (Ranga) turned onto Perry Cross', sector: 'Bandra West', value: '34 km/h', state: 'transit' },
    { id: '3', time: '16:52:18', type: 'alert', label: 'Surge dispatch threshold reached in BKC Zone', sector: 'BKC Central', value: 'Surge 1.4x', state: 'alert' },
    { id: '4', time: '16:51:02', type: 'order', label: 'Order #1809 marked ready by Kitchen', sector: 'Bandra West', value: '₹680', state: 'ready' },
    { id: '5', time: '16:49:55', type: 'rider', label: 'Rider #18 arrived at Bombay Brasserie', sector: 'Worli South', value: '0m wait', state: 'arrival' },
    { id: '6', time: '16:48:30', type: 'order', label: 'Order #1805 handoff verified via OTP 4821', sector: 'Khar West', value: 'Delivered', state: 'done' },
  ];

  const pendingApprovals = restaurants.filter(r => r.status === 'pending');
  const activeAlertsCount = supportTickets.filter(t => t.status === 'open' || t.status === 'escalated').length;

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* ── MISSION CONTROL HEADER (WHAT IS HAPPENING NOW?) ── */}
      <div className="bg-[#141518] text-[#F3F0E8] p-6 border-b border-[#252830] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#D7F04A] animate-pulse" />
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#D7F04A]">
              LIVE PLATFORM TELEMETRY · GLOBAL OPERATIONS ROOM
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight uppercase mt-1">
            WHAT IS HAPPENING NOW
          </h1>
          <p className="font-mono text-xs text-[#8E929C] mt-1">
            48 couriers en route · 124 active dispatches · 38 kitchens preparing · 99.98% gateway uptime
          </p>
        </div>

        {/* Sector Filter & Direct Actions */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="bg-[#1D212A] border border-[#2D3342] p-1 flex items-center gap-1">
            {(['all', 'west', 'central', 'south'] as const).map(sec => (
              <button
                key={sec}
                onClick={() => setActiveSector(sec)}
                className={`px-3 py-1 uppercase text-[10px] tracking-wider transition-colors cursor-pointer ${
                  activeSector === sec ? 'bg-[#1B3BFF] text-white font-bold' : 'text-[#8E929C] hover:text-white'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/admin/restaurants')}
            className="px-4 py-2 bg-[#D7F04A] text-[#141518] font-bold text-xs uppercase tracking-wider hover:bg-[#c6df3d] transition-colors cursor-pointer"
          >
            Review Approvals ({pendingApprovals.length})
          </button>
        </div>
      </div>

      {/* ── CORE OPERATIONS ROOM GRID: MAP + LIVE STREAMS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── LEFT & CENTER: DOMINANT MISSION-CONTROL RADAR MAP (8 COLS) ── */}
        <div className="lg:col-span-8 bg-[#141518] border border-[#252830] flex flex-col justify-between overflow-hidden relative min-h-[500px]">
          
          {/* Top Bar of the Map */}
          <div className="p-4 border-b border-[#252830] flex items-center justify-between z-10 bg-[#141518]/90 backdrop-blur-xs font-mono text-xs">
            <div className="flex items-center gap-3">
              <Compass size={14} className="text-[#D7F04A] animate-spin" />
              <span className="text-white font-bold uppercase tracking-wider">
                MUMBAI METROPOLITAN SECTOR GRID
              </span>
            </div>
            <div className="flex items-center gap-4 text-[#8E929C] text-[10px]">
              <span>ZOOM: 14x</span>
              <span className="text-[#D7F04A]">● SAT-LINK ACTIVE</span>
            </div>
          </div>

          {/* SVG Tactical Radar Vector Map */}
          <div className="absolute inset-0 top-12 bottom-12 overflow-hidden">
            <svg className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="ops-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1F232D" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="#111317" />
              <rect width="100%" height="100%" fill="url(#ops-grid)" />

              {/* Major Arteries */}
              <path d="M 0 160 Q 300 180 600 120 T 1200 180" fill="none" stroke="#1D222C" strokeWidth="20" />
              <path d="M 280 0 Q 300 300 240 700" fill="none" stroke="#1D222C" strokeWidth="16" />
              <path d="M 540 0 Q 560 300 620 700" fill="none" stroke="#1D222C" strokeWidth="16" />

              {/* Active Couriers Vectors (Moving dots & lines) */}
              <path d="M 280 280 L 420 340 L 540 260" fill="none" stroke="#1B3BFF" strokeWidth="3" strokeDasharray="4 4" />
              <circle cx="420" cy="340" r="6" fill="#1B3BFF" className="animate-pulse" />
              <text x="432" y="344" fill="#8E929C" fontSize="10" fontFamily="monospace">RIDER-09 (32km/h)</text>

              <path d="M 540 180 L 620 220 L 720 200" fill="none" stroke="#1B3BFF" strokeWidth="3" strokeDasharray="4 4" />
              <circle cx="620" cy="220" r="6" fill="#1B3BFF" className="animate-pulse" />
              <text x="632" y="224" fill="#8E929C" fontSize="10" fontFamily="monospace">RIDER-42 (28km/h)</text>

              {/* Active Kitchen Hubs (Acid Beacons) */}
              <circle cx="280" cy="280" r="8" fill="#D7F04A" />
              <text x="295" y="284" fill="#D7F04A" fontSize="11" fontFamily="monospace" fontWeight="bold">
                SPICE ROUTE (7 active)
              </text>

              <circle cx="540" cy="180" r="8" fill="#D7F04A" />
              <text x="555" y="184" fill="#D7F04A" fontSize="11" fontFamily="monospace" fontWeight="bold">
                BOMBAY BRASSERIE (12 active)
              </text>

              <circle cx="680" cy="380" r="8" fill="#D7F04A" />
              <text x="695" y="384" fill="#D7F04A" fontSize="11" fontFamily="monospace" fontWeight="bold">
                COPPER CHIMNEY (4 active)
              </text>

              {/* Surge Warning Zone Highlight */}
              <circle cx="700" cy="200" r="60" fill="#661527" fillOpacity="0.25" stroke="#661527" strokeWidth="2" strokeDasharray="6 4" />
              <text x="660" y="140" fill="#ff738c" fontSize="10" fontFamily="monospace">SURGE PRESSURE: BKC</text>
            </svg>
          </div>

          {/* Bottom Telemetry HUD */}
          <div className="p-4 border-t border-[#252830] z-10 bg-[#141518]/95 backdrop-blur-xs flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[9px] text-[#8E929C] uppercase block">INFLUX RATE</span>
                <span className="text-sm font-black text-white">14.2 ORDERS/MIN</span>
              </div>
              <div className="border-l border-[#252830] pl-6">
                <span className="text-[9px] text-[#8E929C] uppercase block">AVG DELIVERY</span>
                <span className="text-sm font-black text-[#D7F04A]">28.4 MIN</span>
              </div>
              <div className="border-l border-[#252830] pl-6">
                <span className="text-[9px] text-[#8E929C] uppercase block">FLEET SATURATION</span>
                <span className="text-sm font-black text-white">82% DEPLOYED</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold text-[10px] uppercase">
                DISPATCH PIPELINE CLEAR
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: LIVE ACTIVITY STREAM & SYSTEM HEALTH (4 COLS) ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Live Activity Stream */}
          <div className="bg-[#141518] border border-[#252830] p-5 text-left font-mono">
            <div className="flex items-center justify-between border-b border-[#252830] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Radio size={14} className="text-[#1B3BFF] animate-pulse" />
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white">
                  REAL-TIME DISPATCH STREAM
                </h3>
              </div>
              <span className="text-[9px] text-[#8E929C] uppercase">SYNC 1s</span>
            </div>

            {/* Stream List */}
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {liveEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 bg-[#0D0F12] border border-[#252830] hover:border-[#1B3BFF] transition-colors text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#8E929C]">{evt.time}</span>
                    <span className="text-[#D7F04A] font-bold">{evt.sector}</span>
                  </div>
                  <p className="text-[#F3F0E8] font-sans font-medium text-[11px] leading-snug">
                    {evt.label}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-[#1C2028] text-[10px]">
                    <span className="uppercase text-[#8E929C]">METRIC: {evt.value}</span>
                    <span className="text-[#1B3BFF] font-bold uppercase">{evt.state}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Operations Health & Alerts */}
          <div className="bg-[#141518] border border-[#252830] p-5 text-left font-mono space-y-4">
            <div className="flex items-center justify-between border-b border-[#252830] pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert size={14} className="text-[#ff738c]" />
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white">
                  OPERATIONS ALERTS ({activeAlertsCount})
                </h3>
              </div>
              <span className="text-[9px] text-[#ff738c] font-bold">1 BREACH THREAT</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#1C0E12] border border-[#661527] space-y-1">
                <div className="flex items-center justify-between text-[#ff738c] font-bold text-[10px]">
                  <span>SUPPORT ESCALATION</span>
                  <span>SLA 1h 48m</span>
                </div>
                <p className="text-white font-sans text-xs">
                  Merchant #104 (Spice Route) reported POS sync timeout.
                </p>
                <button
                  onClick={() => navigate('/admin/support')}
                  className="text-[10px] text-[#D7F04A] hover:underline uppercase block pt-1"
                >
                  OPEN TICKET DISPATCH →
                </button>
              </div>

              <div className="p-3 bg-[#0D0F12] border border-[#252830] space-y-1">
                <div className="flex items-center justify-between text-[#8E929C] text-[10px]">
                  <span>SECURITY AUDIT</span>
                  <span>ALL PASS</span>
                </div>
                <p className="text-[#A0A2AA] font-sans text-xs">
                  Zero anomalous token refreshes across last 24h.
                </p>
              </div>
            </div>

            {/* Quick Command Navigation */}
            <div className="pt-2 border-t border-[#252830] grid grid-cols-2 gap-2 text-center text-[10px]">
              <button
                onClick={() => navigate('/admin/users')}
                className="p-2 border border-[#252830] hover:bg-[#1C2028] text-white uppercase tracking-wider"
              >
                RBAC USERS →
              </button>
              <button
                onClick={() => navigate('/admin/health')}
                className="p-2 border border-[#252830] hover:bg-[#1C2028] text-white uppercase tracking-wider"
              >
                SYSTEM HEALTH →
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
