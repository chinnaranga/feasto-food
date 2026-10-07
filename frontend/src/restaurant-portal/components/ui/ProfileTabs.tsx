import React from 'react';
import { NavLink } from 'react-router-dom';
import { Store, ShieldCheck, MapPin, Settings, Palette, Eye, Sliders } from 'lucide-react';

interface TabNode {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const ProfileTabs: React.FC = () => {
  const tabs: TabNode[] = [
    { label: 'Identity', path: '/restaurant-portal/profile', icon: <Store size={13} /> },
    { label: 'Business info', path: '/restaurant-portal/profile/business', icon: <ShieldCheck size={13} /> },
    { label: 'Location', path: '/restaurant-portal/profile/location', icon: <MapPin size={13} /> },
    { label: 'Operations', path: '/restaurant-portal/profile/operations', icon: <Sliders size={13} /> },
    { label: 'Branding', path: '/restaurant-portal/profile/branding', icon: <Palette size={13} /> },
    { label: 'Settings', path: '/restaurant-portal/profile/settings', icon: <Settings size={13} /> },
    { label: 'Live Preview', path: '/restaurant-portal/profile/preview', icon: <Eye size={13} /> },
  ];

  return (
    <div className="flex border-b border-[#141518]/15 overflow-x-auto select-none no-scrollbar py-2 text-left shrink-0 bg-[#FAF8F5] px-4 font-mono">
      <nav className="flex gap-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/restaurant-portal/profile'}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all duration-150 cursor-pointer border ${
                isActive
                  ? 'bg-[#141518] text-[#FAF8F5] font-bold border-[#141518] shadow-[2px_2px_0px_#141518]'
                  : 'text-[#52555F] hover:text-[#141518] hover:bg-[#EBE7DD] border-transparent'
              }`
            }
          >
            {tab.icon}
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default ProfileTabs;
