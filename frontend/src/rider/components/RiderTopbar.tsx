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
    if (pathname.includes('/orders')) return 'Available Delivery Offers';
    if (pathname.includes('/active')) return 'Active Delivery Workflow';
    if (pathname.includes('/navigation')) return 'Turn-by-Turn GPS Guidance';
    if (pathname.includes('/earnings')) return 'Rider Earnings & Wallet Hub';
    if (pathname.includes('/profile')) return 'Rider Profile & Vehicle Operations';
    if (pathname.includes('/support')) return 'Emergency Support & SOS';
    if (pathname.includes('/settings')) return 'Partner System Settings';
    return 'Daily Operational Control Center';
  };

  return (
    <header className="sticky top-0 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80 z-[400] px-4 sm:px-6 lg:px-8 py-3 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile Drawer Trigger & Page Title Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDrawer}
            className="lg:hidden p-2 rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer active:scale-95"
            aria-label="Open rider drawer menu"
          >
            <Menu size={20} />
          </button>

          {/* Mobile Brand Logo */}
          <div className="flex lg:hidden items-center gap-1.5 cursor-pointer" onClick={() => navigate('/rider/dashboard')}>
            <span className="text-sm font-black text-neutral-900 tracking-tight font-heading">
              Feasto<span className="text-[#e35205]">Rider</span>
            </span>
            <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
              {profile.riderCode}
            </span>
          </div>

          {/* Desktop Page Title & Breadcrumb */}
          <div className="hidden lg:block">
            <h1 className="text-sm font-black text-neutral-900 font-heading leading-none">
              {getPageTitle(location.pathname)}
            </h1>
            <span className="text-[11px] text-neutral-400 font-mono block mt-0.5">
              Feasto Delivery Partner Console • Bandra Operations Hub
            </span>
          </div>
        </div>

        {/* Center/Right: Zone Info, Duty Switcher & Notifications */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Active Zone Badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-100/80 px-3 py-1.5 rounded-xl border border-neutral-200/60">
            <MapPin size={13} className="text-[#e35205]" />
            <span>Zone: <strong className="text-neutral-900 font-bold">{currentZone}</strong></span>
          </div>

          {/* Duty Switcher Toggle */}
          <button
            onClick={toggleAvailability}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-3xs flex items-center gap-2 ${
              availability === 'online'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'
            }`}
          >
            <Power size={13} />
            <span>{availability === 'online' ? 'On Duty' : 'Off Duty'}</span>
          </button>

          {/* Notifications Link */}
          <button
            onClick={() => navigate('/rider/notifications')}
            className="p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 relative transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#e35205]" />
            )}
          </button>

          {/* Profile Trigger on Desktop Header */}
          <div
            onClick={() => navigate('/rider/profile')}
            className="hidden sm:flex items-center gap-2 pl-2 border-l border-neutral-200 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded-full bg-[#e35205]/10 text-[#e35205] flex items-center justify-center font-bold text-xs font-mono">
              {profile.fullName.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold text-neutral-800 block leading-tight">{profile.fullName}</span>
              <span className="text-[10px] text-neutral-400 font-mono block">★ {profile.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RiderTopbar;
