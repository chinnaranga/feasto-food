import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Bell, MapPin, Search, Sparkles } from 'lucide-react';
import { Container } from './Container';
import { Logo } from './Logo';
import { NavLink } from './NavLink';
import { SearchButton } from './SearchButton';
import { ProfileMenu } from './ProfileMenu';
import { MobileDrawer } from './MobileDrawer';
import { IconButton } from '@/components/ui/IconButton';
import { Badge } from '@/components/ui/Badge';
import { NotificationBadge } from '@/components/notifications/NotificationBadge';
import { useCartStore } from '@/store/cartStore';
import { NetworkStatusChip } from '../pwa/NetworkStatusChip';

export const Header: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 w-full z-[500] select-none transition-all duration-300 pt-[env(safe-area-inset-top)] ${
        isScrolled
          ? 'h-14 bg-[#08090D]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40'
          : 'h-16 bg-[#08090D]/70 backdrop-blur-md border-b border-white/5'
      }`}
    >
      <Container className="h-full flex items-center justify-between">
        
        {/* Left: Spatial Logo & Floating Nav Links */}
        <div className="flex items-center gap-8">
          <Logo />

          {/* Desktop OS-Like Control Surface Nav */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/5" aria-label="Primary navigation">
            <NavLink to="/discover" className="text-xs font-semibold px-3 py-1.5 rounded-lg text-[#A7ACB8] hover:text-[#F4F5F7] hover:bg-white/5 transition-all">
              Discover
            </NavLink>
            <NavLink to="/restaurants" className="text-xs font-semibold px-3 py-1.5 rounded-lg text-[#A7ACB8] hover:text-[#F4F5F7] hover:bg-white/5 transition-all">
              Restaurants
            </NavLink>
            <Link
              to="/discover?collection=comfort"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#A7ACB8] hover:text-[#F4F5F7] hover:bg-white/5 transition-all"
            >
              Collections
            </Link>
          </nav>
        </div>

        {/* Right: Location, Tools & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          
          {/* Dynamic Location Surface */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/8 text-xs font-semibold text-[#F4F5F7]">
            <MapPin size={13} className="text-[#4FD1E8]" />
            <span>Hyderabad</span>
          </div>

          {/* Network Indicator */}
          <NetworkStatusChip />

          {/* Desktop Search */}
          <SearchButton className="hidden md:inline-flex" />

          {/* Notifications */}
          <Link to="/notifications" className="relative hidden sm:inline-flex" aria-label="Notifications">
            <IconButton variant="ghost" size="md" className="relative text-[#A7ACB8] hover:text-white hover:bg-white/5">
              <Bell size={18} />
              <NotificationBadge />
            </IconButton>
          </Link>

          {/* Floating Cart Trigger */}
          <Link 
            to="/cart" 
            className="relative" 
            aria-label={cartCount > 0 ? `Cart with ${cartCount} items` : 'Shopping Cart'}
          >
            <IconButton variant="ghost" size="md" className="relative text-[#A7ACB8] hover:text-white hover:bg-white/5">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-black min-w-4.5 h-4.5 flex items-center justify-center rounded-full bg-[#6D5EF5] text-white shadow-sm shadow-[#6D5EF5]/50 animate-in zoom-in-75 duration-200">
                  {cartCount}
                </span>
              )}
            </IconButton>
          </Link>

          {/* Profile Menu */}
          <div className="hidden md:block">
            <ProfileMenu />
          </div>

          {/* Mobile Search */}
          <Link to="/discover" className="md:hidden">
            <IconButton variant="ghost" size="md" aria-label="Search" className="text-[#A7ACB8] hover:text-white">
              <Search size={18} />
            </IconButton>
          </Link>

          {/* Mobile Drawer */}
          <IconButton
            variant="ghost"
            size="md"
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            aria-label={isDrawerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isDrawerOpen}
            className="lg:hidden text-[#A7ACB8] hover:text-white"
          >
            {isDrawerOpen ? <X size={20} /> : <Menu size={20} />}
          </IconButton>
        </div>
      </Container>

      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </header>
  );
};
