import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, History, LogIn, Bell } from 'lucide-react';
import { Dropdown } from '@/components/ui/Dropdown';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/authStore';

export const ProfileMenu: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuthStore();

  const handleSignOut = () => {
    logout();
    navigate('/auth/signin');
  };

  const menuItems = isAuthenticated
    ? [
        {
          label: 'My Profile',
          icon: <User size={16} />,
          onClick: () => navigate('/profile'),
        },
        {
          label: 'Notifications',
          icon: <Bell size={16} />,
          onClick: () => navigate('/notifications'),
        },
        {
          label: 'Order History',
          icon: <History size={16} />,
          onClick: () => navigate('/orders'),
        },
        {
          label: 'Settings',
          icon: <Settings size={16} />,
          onClick: () => navigate('/settings'),
        },
        {
          label: 'Sign Out',
          icon: <LogOut size={16} />,
          onClick: handleSignOut,
          danger: true,
        },
      ]
    : [
        {
          label: 'Sign In',
          icon: <LogIn size={16} />,
          onClick: () => navigate('/auth/signin'),
        },
      ];

  const displayName = user?.displayName || 'Jane Doe';

  return (
    <Dropdown
      align="right"
      trigger={
        <button className="flex items-center justify-center rounded-full hover:ring-2 hover:ring-brand-orange/20 transition-main cursor-pointer focus-ring">
          <Avatar name={displayName} size="sm" />
        </button>
      }
      items={menuItems}
    />
  );
};
