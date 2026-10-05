import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  ShoppingBag,
  Navigation,
  Wallet,
  User,
  Bike,
  FileText,
  HelpCircle,
  Settings,
  ShieldCheck,
  LogOut,
  Power,
  ChevronRight,
  Sparkles,
  CreditCard,
  CheckCircle,
} from 'lucide-react';
import useRiderStore from '../store/useRiderStore';

export const RiderDesktopSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, availability, toggleAvailability, deliveryOffers, activeOffer } = useRiderStore();

  const navGroups = [
    {
      title: 'Operational Hub',
      items: [
        { label: 'Dashboard Control Center', path: '/rider/dashboard', icon: <Home size={18} /> },
        {
          label: 'Available Offers',
          path: '/rider/orders',
          icon: <ShoppingBag size={18} />,
          badge: deliveryOffers.length > 0 ? `${deliveryOffers.length} New` : undefined,
        },
        {
          label: 'Active Delivery Task',
          path: '/rider/active',
          icon: <Navigation size={18} />,
          badge: activeOffer ? '#1809' : undefined,
        },
      ],
    },
    {
      title: 'Financial & Earnings',
      items: [
        { label: 'Earnings & Wallet', path: '/rider/earnings', icon: <Wallet size={18} /> },
        { label: 'Bank Payouts', path: '/rider/earnings/payouts', icon: <CreditCard size={18} /> },
        { label: 'Surge & Quests', path: '/rider/earnings/bonuses', icon: <Sparkles size={18} /> },
      ],
    },
    {
      title: 'Partner Setup',
      items: [
        { label: 'Profile & Operational Setup', path: '/rider/profile', icon: <User size={18} /> },
        { label: 'Vehicle Details', path: '/rider/profile/vehicle', icon: <Bike size={18} /> },
        { label: 'Documents & Verification', path: '/rider/profile/documents', icon: <FileText size={18} /> },
        { label: 'System Readiness', path: '/rider/profile/readiness', icon: <CheckCircle size={18} /> },
        { label: 'Rider Support & SOS', path: '/rider/support', icon: <HelpCircle size={18} /> },
        { label: 'App Settings', path: '/rider/settings', icon: <Settings size={18} /> },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white border-r border-neutral-200/90 h-screen sticky top-0 shrink-0 select-none z-[300]">
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/rider/dashboard')}>
          <div className="w-8 h-8 rounded-xl bg-[#e35205] text-white flex items-center justify-center font-black font-heading shadow-3xs">
            F
          </div>
          <div>
            <h2 className="text-base font-black text-neutral-900 tracking-tight font-heading leading-tight">
              Feasto<span className="text-[#e35205]">Rider</span>
            </h2>
            <span className="text-[10px] text-neutral-400 font-mono block">Enterprise Courier Portal</span>
          </div>
        </div>

        <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
          {profile.riderCode}
        </span>
      </div>

      {/* Navigation Menu Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-heading px-3 block">
              {group.title}
            </span>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/rider/dashboard' && location.pathname.startsWith(item.path));

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#e35205]/10 text-[#e35205] border border-[#e35205]/20 font-black shadow-3xs'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-[#e35205]' : 'text-neutral-500'}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#e35205] text-white">
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight size={14} className={isActive ? 'text-[#e35205]' : 'text-neutral-300'} />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Duty Switcher & Profile Card */}
      <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 space-y-3">
        {/* On Duty Switcher */}
        <button
          onClick={toggleAvailability}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between shadow-3xs ${
            availability === 'online'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Power size={14} />
            <span>{availability === 'online' ? 'On Duty Dispatches' : 'Off Duty (Paused)'}</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        </button>

        {/* User Card */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center font-bold text-neutral-700 text-xs font-mono">
              {profile.fullName.charAt(0)}
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900 leading-tight">{profile.fullName}</h4>
              <span className="text-[10px] text-neutral-500 font-mono block">★ {profile.rating} Rating</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/rider/login')}
            className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default RiderDesktopSidebar;
