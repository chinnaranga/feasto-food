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
      title: 'OPERATIONAL HUB',
      items: [
        { label: 'Control Center', path: '/rider/dashboard', icon: <Home size={16} /> },
        {
          label: 'Available Offers',
          path: '/rider/orders',
          icon: <ShoppingBag size={16} />,
          badge: deliveryOffers.length > 0 ? `${deliveryOffers.length} NEW` : undefined,
        },
        {
          label: 'Active Delivery Task',
          path: '/rider/active',
          icon: <Navigation size={16} />,
          badge: activeOffer ? '#1809' : undefined,
        },
      ],
    },
    {
      title: 'FINANCIAL & EARNINGS',
      items: [
        { label: 'Earnings & Wallet', path: '/rider/earnings', icon: <Wallet size={16} /> },
        { label: 'Direct Bank Payouts', path: '/rider/earnings/payouts', icon: <CreditCard size={16} /> },
        { label: 'Surge Quests & Bonuses', path: '/rider/earnings/bonuses', icon: <Sparkles size={16} /> },
      ],
    },
    {
      title: 'COURIER DOSSIER',
      items: [
        { label: 'Profile & Operational Setup', path: '/rider/profile', icon: <User size={16} /> },
        { label: 'Vehicle Fleet Details', path: '/rider/profile/vehicle', icon: <Bike size={16} /> },
        { label: 'KYC & License Audit', path: '/rider/profile/documents', icon: <FileText size={16} /> },
        { label: 'System Readiness SLA', path: '/rider/profile/readiness', icon: <CheckCircle size={16} /> },
        { label: 'Emergency Support / SOS', path: '/rider/support', icon: <HelpCircle size={16} /> },
        { label: 'App Configuration', path: '/rider/settings', icon: <Settings size={16} /> },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-[#FAF8F5] border-r border-[#141518] h-screen sticky top-0 shrink-0 select-none z-[300]">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-[#141518] flex items-center justify-between">
        <div
          className="flex items-center gap-2.5 cursor-pointer text-left"
          onClick={() => navigate('/rider/dashboard')}
        >
          <div className="w-8 h-8 bg-[#141518] text-[#D7F04A] border border-[#141518] flex items-center justify-center font-mono font-black text-xs">
            FC
          </div>
          <div>
            <h2 className="text-sm font-heading font-black text-[#141518] tracking-wider uppercase leading-none">
              FEASTO COURIER
            </h2>
            <span className="text-[10px] text-[#55565B] font-mono block mt-0.5">
              VESSEL DISPATCH CONSOLE
            </span>
          </div>
        </div>

        <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 bg-[#F3F0E8] text-[#141518] border border-[#141518]">
          {profile.riderCode}
        </span>
      </div>

      {/* Navigation Menu Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1.5 text-left">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#55565B] px-3 block">
              {group.title}
            </span>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/rider/dashboard' && location.pathname.startsWith(item.path));

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2 border transition-all cursor-pointer font-mono text-xs uppercase tracking-wider ${
                      isActive
                        ? 'bg-[#D7F04A] text-[#141518] border-[#141518] font-bold shadow-[2px_2px_0px_#141518]'
                        : 'border-transparent text-[#55565B] hover:text-[#141518] hover:bg-[#F3F0E8] hover:border-[#141518]/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-[#141518]' : 'text-[#55565B]'}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span className="text-[9px] font-mono font-black px-1.5 py-0.2 bg-[#141518] text-[#D7F04A] border border-[#141518]">
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight size={13} className={isActive ? 'text-[#141518]' : 'text-[#141518]/30'} />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Duty Switcher & Profile Card */}
      <div className="p-4 border-t border-[#141518] bg-[#F3F0E8] space-y-3 font-mono">
        {/* On Duty Switcher */}
        <button
          onClick={toggleAvailability}
          className={`w-full py-2.5 px-3 border border-[#141518] text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between shadow-[2px_2px_0px_#141518] ${
            availability === 'online'
              ? 'bg-[#D7F04A] text-[#141518]'
              : 'bg-[#FAF8F5] text-[#55565B]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Power size={14} />
            <span>{availability === 'online' ? 'ON DUTY DISPATCH' : 'STANDBY (PAUSED)'}</span>
          </div>
          <span
            className={`w-2 h-2 border border-[#141518] ${
              availability === 'online' ? 'bg-[#141518] animate-pulse' : 'bg-[#55565B]'
            }`}
          />
        </button>

        {/* User Card */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 bg-[#141518] text-[#D7F04A] border border-[#141518] flex items-center justify-center font-bold text-xs font-mono">
              {profile.fullName.charAt(0)}
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#141518] leading-tight">{profile.fullName}</h4>
              <span className="text-[10px] text-[#55565B] block font-mono">★ {profile.rating} SLA</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/rider/login')}
            className="p-1.5 bg-[#FAF8F5] border border-[#141518] hover:bg-red-50 text-[#141518] hover:text-red-700 transition-colors cursor-pointer shadow-[2px_2px_0px_#141518]"
            title="Log Out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default RiderDesktopSidebar;
