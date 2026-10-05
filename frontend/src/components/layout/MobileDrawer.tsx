import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, Store, ShoppingBag, User, Bell, HelpCircle, Settings } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchClick?: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onSearchClick,
}) => {
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      showHeader={false}
      zIndexClass="z-[400]"
      className="top-[calc(4rem+env(safe-area-inset-top))] h-[calc(100dvh-4rem-env(safe-area-inset-top))] w-full max-w-xs sm:max-w-sm"
      overlayClassName="top-[calc(4rem+env(safe-area-inset-top))]"
    >
      <div className="flex flex-col gap-6 h-full py-1">
        {/* Search trigger */}
        <button
          onClick={() => {
            onClose();
            if (onSearchClick) onSearchClick();
          }}
          className="flex items-center gap-3 px-4 py-2.5 bg-secondary-bg hover:bg-surface-bg border border-border-main text-text-muted hover:text-text-secondary text-sm rounded-xl transition-main cursor-pointer w-full text-left shrink-0"
        >
          <Search size={16} />
          <span>Search food, cuisines...</span>
        </button>

        {/* Navigation links */}
        <nav className="flex flex-col gap-1 overflow-y-auto pr-1">
          <button
            onClick={() => handleNav('/discover')}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-surface-bg text-text-primary text-sm font-semibold transition-main text-left cursor-pointer"
          >
            <Compass size={18} className="text-text-secondary" />
            <span>Discover</span>
          </button>
          <button
            onClick={() => handleNav('/restaurants')}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-surface-bg text-text-primary text-sm font-semibold transition-main text-left cursor-pointer"
          >
            <Store size={18} className="text-text-secondary" />
            <span>Restaurants</span>
          </button>
          <button
            onClick={() => handleNav('/cart')}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-surface-bg text-text-primary text-sm font-semibold transition-main text-left cursor-pointer"
          >
            <ShoppingBag size={18} className="text-text-secondary" />
            <span>My Cart</span>
          </button>
          <button
            onClick={() => handleNav('/notifications')}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-surface-bg text-text-primary text-sm font-semibold transition-main text-left cursor-pointer"
          >
            <Bell size={18} className="text-text-secondary" />
            <span>Notifications</span>
          </button>
          <button
            onClick={() => handleNav('/profile')}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-surface-bg text-text-primary text-sm font-semibold transition-main text-left cursor-pointer"
          >
            <User size={18} className="text-text-secondary" />
            <span>My Profile</span>
          </button>
          <button
            onClick={() => handleNav('/settings')}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-surface-bg text-text-primary text-sm font-semibold transition-main text-left cursor-pointer"
          >
            <Settings size={18} className="text-text-secondary" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => handleNav('/support')}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-surface-bg text-text-primary text-sm font-semibold transition-main text-left cursor-pointer"
          >
            <HelpCircle size={18} className="text-text-secondary" />
            <span>Help Center</span>
          </button>
        </nav>

        {/* Bottom CTA */}
        <div className="mt-auto flex flex-col gap-2.5 pt-4 border-t border-border-main shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={() => handleNav('/auth/signin')}
            className="w-full justify-center rounded-xl font-bold"
          >
            Sign In
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => handleNav('/auth/signup')}
            className="w-full justify-center rounded-xl font-bold"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
