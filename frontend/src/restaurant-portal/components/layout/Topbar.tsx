import React, { useState } from 'react';
import { Menu, LogOut, Store, Flame, Bell, ChevronDown } from 'lucide-react';
import { usePortalStore } from '../../store/portalStore';
import { usePortalAuthStore } from '../../store/portalAuthStore';
import { usePortalOrderStore } from '../../store/portalOrderStore';
import { Breadcrumbs } from './Breadcrumbs';

interface TopbarProps {
  onMenuToggle: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuToggle }) => {
  const { selectedRestaurant, restaurants, selectRestaurant } = usePortalStore();
  const { user, logoutMerchant } = usePortalAuthStore();
  const { orders } = usePortalOrderStore();

  const [kitchenState, setKitchenState] = useState<'accepting' | 'busy' | 'paused'>('accepting');

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'placed' || o.status === 'confirmed' || o.status === 'preparing'
  ).length;

  return (
    <header className="h-16 border-b border-[#141518]/15 bg-[#FAF8F5] sticky top-0 z-[800] px-4 sm:px-8 flex items-center justify-between text-[#141518] select-none">
      {/* Left side: toggle + breadcrumbs */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuToggle}
          className="p-1.5 border border-[#141518]/20 hover:bg-[#141518] hover:text-white transition-colors cursor-pointer lg:hidden shrink-0"
          aria-label="Toggle operations sidebar"
        >
          <Menu size={16} />
        </button>

        <div className="hidden sm:block min-w-0">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right side: kitchen duty toggle + branch selector + user session */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-mono text-xs">
        {/* Kitchen Status Toggle */}
        <div className="flex items-center border border-[#141518]/20 bg-[#F3F0E8] p-0.5">
          <button
            onClick={() => setKitchenState('accepting')}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
              kitchenState === 'accepting'
                ? 'bg-[#141518] text-[#D7F04A]'
                : 'text-[#52555F] hover:text-[#141518]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
            <span className="hidden md:inline">Open</span>
          </button>
          <button
            onClick={() => setKitchenState('busy')}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
              kitchenState === 'busy'
                ? 'bg-[#141518] text-[#D7F04A]'
                : 'text-[#52555F] hover:text-[#141518]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="hidden md:inline">Rush</span>
          </button>
          <button
            onClick={() => setKitchenState('paused')}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
              kitchenState === 'paused'
                ? 'bg-[#991B1B] text-white'
                : 'text-[#52555F] hover:text-[#141518]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="hidden md:inline">Pause</span>
          </button>
        </div>

        {/* Live Active Orders Quick Badge */}
        {activeOrdersCount > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#D7F04A] border border-[#141518] text-[#141518] font-bold text-[10px] uppercase">
            <Flame size={12} className="text-[#141518]" />
            <span>{activeOrdersCount} IN PREP</span>
          </div>
        )}

        {/* Branch Context Selector */}
        {selectedRestaurant && (
          <div className="flex items-center gap-2 border border-[#141518]/20 px-2.5 py-1.5 bg-[#F3F0E8]">
            <Store size={12} className="text-[#1B3BFF]" />
            <select
              value={selectedRestaurant.id}
              onChange={(e) => selectRestaurant(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#141518] focus:outline-none cursor-pointer pr-1"
            >
              {restaurants.map((rest) => (
                <option key={rest.id} value={rest.id}>
                  {rest.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* User Session & Logout */}
        {user && (
          <div className="flex items-center gap-3 pl-2 border-l border-[#141518]/15">
            <div className="hidden xl:flex flex-col text-right">
              <span className="text-[11px] font-bold text-[#141518] leading-none">
                {user.displayName}
              </span>
              <span className="text-[9px] font-mono uppercase text-[#8A8D98] mt-0.5">
                {user.role}
              </span>
            </div>

            <button
              onClick={logoutMerchant}
              className="flex items-center gap-1 px-2.5 py-1.5 border border-[#141518]/20 hover:bg-[#141518] hover:text-[#D7F04A] text-xs font-bold transition-colors cursor-pointer"
              title="Sign out of Restaurant Studio"
            >
              <LogOut size={12} />
              <span className="hidden md:inline">EXIT</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
