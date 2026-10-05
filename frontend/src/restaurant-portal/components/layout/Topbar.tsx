import React from 'react';
import { Menu, LogOut, Building } from 'lucide-react';
import { usePortalStore } from '../../store/portalStore';
import { usePortalAuthStore } from '../../store/portalAuthStore';
import { Breadcrumbs } from './Breadcrumbs';

interface TopbarProps {
  onMenuToggle: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuToggle }) => {
  const { selectedRestaurant, restaurants, selectRestaurant } = usePortalStore();
  const { user, logoutMerchant } = usePortalAuthStore();

  return (
    <header className="h-14 border-b border-neutral-200 bg-white sticky top-0 z-[900] px-6 flex items-center justify-between">
      {/* Left side: toggle + breadcrumbs */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuToggle}
          className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500 cursor-pointer lg:hidden shrink-0"
          aria-label="Toggle operations sidebar"
        >
          <Menu size={16} />
        </button>
        
        <div className="hidden sm:block min-w-0">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right side: branch selector + user session */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Branch Context Selector */}
        {selectedRestaurant && (
          <div className="flex items-center gap-2 border border-neutral-200 rounded-lg px-2.5 py-1.5 bg-neutral-50 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <Building size={12} className="text-[#e35205]" />
            <select
              value={selectedRestaurant.id}
              onChange={(e) => selectRestaurant(e.target.value)}
              className="bg-transparent text-xs font-bold text-neutral-700 focus:outline-none cursor-pointer pr-1"
            >
              {restaurants.map((rest) => (
                <option key={rest.id} value={rest.id}>
                  {rest.name} ({rest.branchCode})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* User context card */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[11px] font-black text-neutral-800 leading-none">
                {user.displayName}
              </span>
              <span className="text-[9px] font-bold text-neutral-400 mt-1 uppercase tracking-wide">
                Role: {user.role}
              </span>
            </div>
            
            <button
              onClick={logoutMerchant}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 hover:border-red-300 hover:bg-red-50 text-neutral-600 hover:text-red-600 text-xs font-mono font-bold transition-all duration-200 cursor-pointer"
              title="Logout session"
            >
              <LogOut size={13} />
              <span>SIGN OUT</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
export default Topbar;
