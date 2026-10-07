import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Navigation, Wallet, User } from 'lucide-react';
import useRiderStore from '../store/useRiderStore';

export const RiderBottomNav: React.FC = () => {
  const location = useLocation();
  const { deliveryOffers, activeOffer } = useRiderStore();

  const navItems = [
    { label: 'HOME', path: '/rider/dashboard', icon: <Home size={16} /> },
    { label: 'OFFERS', path: '/rider/orders', icon: <ShoppingBag size={16} />, badge: deliveryOffers.length },
    { label: 'ACTIVE', path: '/rider/active', icon: <Navigation size={16} />, badge: activeOffer ? 1 : 0 },
    { label: 'WALLET', path: '/rider/earnings', icon: <Wallet size={16} /> },
    { label: 'DOSSIER', path: '/rider/profile', icon: <User size={16} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#FAF8F5] border-t border-[#141518] z-[400] py-2 px-3 select-none pb-[calc(0.5rem+env(safe-area-inset-bottom))] font-mono">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/rider/dashboard' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1 border transition-all cursor-pointer relative ${
                isActive
                  ? 'bg-[#D7F04A] text-[#141518] border-[#141518] font-black shadow-[2px_2px_0px_#141518]'
                  : 'border-transparent text-[#55565B] hover:text-[#141518] font-bold'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 text-[8px] font-mono font-black px-1 py-0.2 bg-[#141518] text-[#D7F04A] border border-[#141518]">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[9px] uppercase tracking-wider">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default RiderBottomNav;
