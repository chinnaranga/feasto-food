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
    <div className="flex border-b border-neutral-200 overflow-x-auto select-none no-scrollbar py-1 text-left shrink-0 bg-white">
      <nav className="flex gap-1.5 px-6">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/restaurant-portal/profile'}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                  : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50/50'
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
