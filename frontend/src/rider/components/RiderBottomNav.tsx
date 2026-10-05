import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Navigation, Wallet, User } from 'lucide-react';
import useRiderStore from '../store/useRiderStore';

export const RiderBottomNav: React.FC = () => {
  const location = useLocation();
  const { deliveryOffers, activeOffer } = useRiderStore();

  const navItems = [
    { label: 'Home', path: '/rider/dashboard', icon: <Home size={18} /> },
    { label: 'Offers', path: '/rider/orders', icon: <ShoppingBag size={18} />, badge: deliveryOffers.length },
    { label: 'Active Task', path: '/rider/active', icon: <Navigation size={18} />, badge: activeOffer ? 1 : 0 },
    { label: 'Earnings', path: '/rider/earnings', icon: <Wallet size={18} /> },
    { label: 'Profile', path: '/rider/profile', icon: <User size={18} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 z-[400] py-2 px-3 select-none pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer relative ${
                isActive ? 'text-[#e35205] font-black' : 'text-neutral-500 hover:text-neutral-900 font-bold'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 text-[9px] font-black px-1.5 py-0.2 rounded-full bg-[#e35205] text-white">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default RiderBottomNav;
