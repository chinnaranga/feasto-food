import React, { Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Navigation,
  Compass,
  Zap,
  PhoneCall,
  Menu,
  X,
  Radio,
  Power,
  LogOut
} from 'lucide-react';
import useRiderStore from '../store/useRiderStore';
import { useAuthStore } from '@/store/authStore';

export const RiderAppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, availability, toggleAvailability, isDrawerOpen, setDrawerOpen } = useRiderStore();
  const { logout } = useAuthStore();

  const handleRiderSignOut = async () => {
    setDrawerOpen(false);
    await logout();
    navigate('/rider/login');
  };

  const isNavActive = location.pathname.includes('/rider/dashboard') || location.pathname.includes('/rider/active');
  const isOrdersActive = location.pathname.includes('/rider/orders');
  const isEarningsActive = location.pathname.includes('/rider/earnings');

  return (
    <div className="min-h-screen bg-[#0D0F12] text-[#F3F0E8] font-sans flex flex-col antialiased select-none overflow-x-hidden">
      {/* Precision Instrument Bezel (Top) */}
      <header className="h-14 bg-[#14161B] border-b border-[#222630] px-4 md:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/rider/dashboard')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-none bg-[#D7F04A] text-[#141518] flex items-center justify-center font-mono font-black text-xs">
              FR
            </div>
            <div className="text-left">
              <span className="font-heading font-black text-xs uppercase tracking-widest text-[#F3F0E8] block">
                FEASTO INSTRUMENT
              </span>
              <span className="font-mono text-[9px] text-[#A0A2AA] tracking-wider block">
                VESSEL TELEMETRY v2.6
              </span>
            </div>
          </button>

          {/* Quick Instrument Mode Selectors */}
          <nav className="hidden sm:flex items-center gap-1 ml-6 border-l border-[#222630] pl-6 font-mono text-[11px] uppercase tracking-wider">
            <button
              onClick={() => navigate('/rider/dashboard')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                isNavActive
                  ? 'bg-[#1B3BFF] text-white font-bold'
                  : 'text-[#8E929C] hover:text-white'
              }`}
            >
              01 NAVIGATION
            </button>
            <button
              onClick={() => navigate('/rider/orders')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                isOrdersActive
                  ? 'bg-[#1B3BFF] text-white font-bold'
                  : 'text-[#8E929C] hover:text-white'
              }`}
            >
              02 OFFERS
            </button>
            <button
              onClick={() => navigate('/rider/earnings')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                isEarningsActive
                  ? 'bg-[#1B3BFF] text-white font-bold'
                  : 'text-[#8E929C] hover:text-white'
              }`}
            >
              03 EARNINGS
            </button>
          </nav>
        </div>

        {/* Right Bezel Status & Duty Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAvailability}
            className={`flex items-center gap-2 px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer border transition-colors ${
              availability === 'online'
                ? 'bg-[#D7F04A] text-[#141518] border-[#D7F04A]'
                : 'bg-transparent text-[#8E929C] border-[#2E3340] hover:text-white'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                availability === 'online' ? 'bg-[#141518] animate-pulse' : 'bg-[#555A68]'
              }`}
            />
            {availability === 'online' ? 'ON DUTY' : 'STANDBY'}
          </button>

          <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-[#A0A2AA] border-l border-[#222630] pl-4">
            <Radio size={12} className="text-[#D7F04A] animate-pulse" />
            <span>GPS 5G RTK</span>
          </div>

          <button
            onClick={handleRiderSignOut}
            className="flex items-center gap-1.5 px-2.5 py-1 border border-[#661527] text-[#ff738c] hover:bg-[#661527] hover:text-white font-mono text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer"
            title="Sign out of Rider Instrument"
          >
            <LogOut size={12} />
            <span className="hidden sm:inline">SIGN OUT</span>
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 border border-[#2A2E3B] text-[#A0A2AA] hover:text-white hover:border-white transition-colors cursor-pointer"
            aria-label="Toggle drawer"
          >
            <Menu size={16} />
          </button>
        </div>
      </header>

      {/* Main Full-Bleed Instrument Viewport */}
      <main className="flex-1 w-full flex flex-col relative overflow-hidden">
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center font-mono text-xs text-[#D7F04A] animate-pulse">
              SYNCING SATELLITE INSTRUMENT...
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      {/* Drawer Context Sheet */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs cursor-pointer"
          />
          <div className="relative w-full max-w-sm bg-[#14161B] border-l border-[#252934] h-full flex flex-col justify-between p-6 z-10 text-left">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#252934] pb-4">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#D7F04A] block">
                    OPERATOR CALLSIGN
                  </span>
                  <h3 className="font-heading font-black text-lg text-white">
                    {profile.fullName || 'Rider-01'}
                  </h3>
                  <span className="font-mono text-xs text-[#8E929C]">{profile.phone}</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 border border-[#2E3340] text-white hover:bg-white hover:text-black cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-1 font-mono text-xs uppercase tracking-wider">
                <button
                  onClick={() => { setDrawerOpen(false); navigate('/rider/dashboard'); }}
                  className="w-full text-left p-3 hover:bg-[#1C2028] text-white flex items-center justify-between"
                >
                  <span>01 NAVIGATION INSTRUMENT</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => { setDrawerOpen(false); navigate('/rider/orders'); }}
                  className="w-full text-left p-3 hover:bg-[#1C2028] text-white flex items-center justify-between"
                >
                  <span>02 DISPATCH OFFERS</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => { setDrawerOpen(false); navigate('/rider/earnings'); }}
                  className="w-full text-left p-3 hover:bg-[#1C2028] text-white flex items-center justify-between"
                >
                  <span>03 EARNINGS & PAYOUTS</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => { setDrawerOpen(false); navigate('/rider/history'); }}
                  className="w-full text-left p-3 hover:bg-[#1C2028] text-white flex items-center justify-between"
                >
                  <span>04 ROUTE LOG</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => { setDrawerOpen(false); navigate('/rider/support'); }}
                  className="w-full text-left p-3 hover:bg-[#1C2028] text-white flex items-center justify-between"
                >
                  <span>05 SOS & DISPATCH COMMS</span>
                  <span>→</span>
                </button>

                <div className="pt-4 border-t border-[#252934]">
                  <button
                    onClick={handleRiderSignOut}
                    className="w-full text-left p-3 bg-[#661527]/20 border border-[#661527] text-[#ff738c] hover:bg-[#661527] hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <LogOut size={14} />
                      <span>SIGN OUT OPERATOR</span>
                    </span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#252934] flex items-center justify-between font-mono text-[10px] text-[#8E929C]">
              <span>FEASTO RIDER ENGINE</span>
              <span className="text-[#D7F04A]">STANDBY READY</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderAppShell;
