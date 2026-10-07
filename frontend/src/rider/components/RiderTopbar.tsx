import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, MapPin, Power, User } from 'lucide-react';
import useRiderStore from '../store/useRiderStore';

export const RiderTopbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, availability, currentZone, toggleAvailability, toggleDrawer, unreadNotificationsCount } =
    useRiderStore();

  const getPageTitle = (pathname: string) => {
    if (pathname.includes('/orders')) return 'Available Dispatch Offers';
    if (pathname.includes('/active')) return 'Active Courier Mission';
    if (pathname.includes('/navigation')) return 'GPS Turn-by-Turn Guidance';
    if (pathname.includes('/earnings')) return 'Settlement & Wallet Hub';
    if (pathname.includes('/profile')) return 'Courier Dossier & Fleet Setup';
    if (pathname.includes('/support')) return 'Emergency Dispatch Support';
    if (pathname.includes('/settings')) return 'Courier System Config';
    return 'Daily Operations Control';
  };

  return (
    <header className="sticky top-0 w-full bg-[#FAF8F5] border-b border-[#141518] z-[400] px-4 sm:px-6 lg:px-8 py-3 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile Drawer Trigger & Page Title Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDrawer}
            className="lg:hidden p-2 bg-[#FAF8F5] border border-[#141518] text-[#141518] hover:bg-[#F3F0E8] shadow-[2px_2px_0px_#141518] cursor-pointer"
            aria-label="Open rider drawer menu"
          >
            <Menu size={18} />
          </button>

          {/* Mobile Brand Logo */}
          <div
            className="flex lg:hidden items-center gap-2 cursor-pointer"
            onClick={() => navigate('/rider/dashboard')}
          >
            <div className="w-7 h-7 bg-[#141518] text-[#D7F04A] flex items-center justify-center font-mono font-black text-xs border border-[#141518]">
              FC
            </div>
            <span className="text-xs font-mono font-black uppercase tracking-wider text-[#141518]">
              FEASTO RIDER
            </span>
            <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 bg-[#F3F0E8] text-[#141518] border border-[#141518]">
              {profile.riderCode}
            </span>
          </div>

          {/* Desktop Page Title & Telemetry */}
          <div className="hidden lg:block text-left">
            <h1 className="text-sm font-heading font-black text-[#141518] uppercase tracking-wider leading-none">
              {getPageTitle(location.pathname)}
            </h1>
            <span className="text-[10px] text-[#55565B] font-mono block mt-1 uppercase">
              SECTOR: {currentZone || 'BANDRA WEST'} · SATELLITE DISPATCH ACTIVE
            </span>
          </div>
        </div>

        {/* Center/Right: Zone Info, Duty Switcher & Notifications */}
        <div className="flex items-center gap-3 sm:gap-4 font-mono">
          {/* Active Zone Badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#141518] bg-[#F3F0E8] px-3 py-1.5 border border-[#141518]">
            <MapPin size={13} className="text-[#141518]" />
            <span className="text-[10px] uppercase">
              ZONE: <strong className="font-black">{currentZone}</strong>
            </span>
          </div>

          {/* Duty Switcher Toggle */}
          <button
            onClick={toggleAvailability}
            className={`px-3.5 py-1.5 text-xs font-mono font-black uppercase tracking-wider cursor-pointer border border-[#141518] flex items-center gap-2 transition-all ${
              availability === 'online'
                ? 'bg-[#D7F04A] text-[#141518] shadow-[2px_2px_0px_#141518]'
                : 'bg-[#F3F0E8] text-[#55565B] shadow-[2px_2px_0px_#141518]'
            }`}
          >
            <span
              className={`w-2 h-2 border border-[#141518] ${
                availability === 'online' ? 'bg-[#141518] animate-pulse' : 'bg-[#55565B]'
              }`}
            />
            <span>{availability === 'online' ? 'ON DUTY' : 'STANDBY'}</span>
          </button>

          {/* Notifications Link */}
          <button
            onClick={() => navigate('/rider/notifications')}
            className="p-2 bg-[#FAF8F5] border border-[#141518] text-[#141518] hover:bg-[#F3F0E8] relative shadow-[2px_2px_0px_#141518] cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D7F04A] border border-[#141518]" />
            )}
          </button>

          {/* Profile Trigger on Desktop Header */}
          <div
            onClick={() => navigate('/rider/profile')}
            className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-[#141518]/20 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-[#141518] text-[#D7F04A] border border-[#141518] flex items-center justify-center font-mono font-black text-xs">
              {profile.fullName.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-mono font-bold text-[#141518] block leading-tight">
                {profile.fullName}
              </span>
              <span className="text-[10px] text-[#55565B] font-mono block">
                ★ {profile.rating} SLA
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RiderTopbar;
