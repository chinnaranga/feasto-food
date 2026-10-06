import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { useAIStore } from '@/store/aiStore';

interface FeastoFloatingNavProps {
  onOpenCommand: () => void;
}

export const FeastoFloatingNav: React.FC<FeastoFloatingNavProps> = ({ onOpenCommand }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { addToast } = useToastStore();

  // Close nav on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await logout();
    addToast({ message: 'Signed out of Feasto successfully.', type: 'info' });
    navigate('/');
  };

  return (
    <div ref={navRef} className="fixed top-6 left-1/2 -translate-x-1/2 z-[500] select-none">
      {/* Floating Control Capsule */}
      <motion.div
        layout
        className="flex items-center gap-2.5 sm:gap-3 bg-[#141518] text-[#F3F0E8] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-black shadow-2xl shadow-black/20 backdrop-blur-md"
      >
        {/* Core FEASTO Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 group focus:outline-none cursor-pointer"
          aria-expanded={isOpen}
          aria-label="Toggle Feasto Navigation"
        >
          <span className="font-heading font-black tracking-tight text-sm text-[#F3F0E8] group-hover:text-[#D7F04A] transition-colors">
            FEASTO
          </span>
          <span className="inline-flex items-center justify-center w-3 h-3 text-[#D7F04A] text-xs font-mono">
            {isOpen ? '×' : '○'}
          </span>
        </button>

        <span className="w-px h-3.5 bg-white/20" />

        {/* Feasto AI Trigger */}
        <button
          onClick={() => useAIStore.getState().setIsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-[#E07A5F]/20 text-[#E07A5F] hover:bg-[#E07A5F] hover:text-white transition-all focus:outline-none cursor-pointer border border-[#E07A5F]/40 shadow-xs"
          title="Open Feasto Culinary AI (NVIDIA Nemotron 3 Ultra)"
        >
          <Sparkles size={12} />
          <span className="font-sans">AI Sommelier</span>
        </button>

        {/* Cart Quick Badge */}
        {cartCount > 0 && (
          <>
            <span className="w-px h-3.5 bg-white/20" />
            <Link
              to="/cart"
              className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono font-bold bg-[#D7F04A] text-[#141518] rounded-full hover:bg-white transition-colors"
            >
              <span>BAG</span>
              <span>{cartCount}</span>
            </Link>
          </>
        )}

        {/* Direct Global Sign Out Button on Nav Bar */}
        {isAuthenticated ? (
          <>
            <span className="w-px h-3.5 bg-white/20" />
            <button
              onClick={handleSignOut}
              title="Sign Out of Feasto"
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono uppercase font-bold tracking-wider text-[#ff738c] hover:text-white hover:bg-[#661527] rounded-full transition-colors focus:outline-none cursor-pointer"
            >
              <LogOut size={12} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </>
        ) : (
          <>
            <span className="w-px h-3.5 bg-white/20" />
            <Link
              to="/auth/signin"
              className="px-2.5 py-1 text-[11px] font-mono uppercase font-bold tracking-wider text-[#D7F04A] hover:text-white transition-colors"
            >
              Sign In
            </Link>
          </>
        )}
      </motion.div>

      {/* Expanded Contextual Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-1/2 -translate-x-1/2 w-72 bg-[#141518] text-[#F3F0E8] border border-white/15 rounded-2xl p-4 shadow-2xl overflow-hidden mt-1"
          >
            <div className="flex flex-col gap-1 text-left">
              <div className="text-[10px] font-mono tracking-widest uppercase text-[#8A8D98] px-3 py-1 hairline-b mb-1">
                Feasto Canvas · 2026
              </div>

              <Link
                to="/"
                className="flex items-center justify-between px-3 py-2 text-sm font-heading font-medium hover:text-[#D7F04A] hover:bg-white/5 rounded-lg transition-colors"
              >
                <span>Discover</span>
                <span className="text-[10px] font-mono text-[#8A8D98]">01</span>
              </Link>

              <Link
                to="/restaurants"
                className="flex items-center justify-between px-3 py-2 text-sm font-heading font-medium hover:text-[#D7F04A] hover:bg-white/5 rounded-lg transition-colors"
              >
                <span>Restaurants</span>
                <span className="text-[10px] font-mono text-[#8A8D98]">02</span>
              </Link>

              <Link
                to="/discover?collection=curated"
                className="flex items-center justify-between px-3 py-2 text-sm font-heading font-medium hover:text-[#D7F04A] hover:bg-white/5 rounded-lg transition-colors"
              >
                <span>Collections</span>
                <span className="text-[10px] font-mono text-[#8A8D98]">03</span>
              </Link>

              <Link
                to="/orders"
                className="flex items-center justify-between px-3 py-2 text-sm font-heading font-medium hover:text-[#D7F04A] hover:bg-white/5 rounded-lg transition-colors"
              >
                <span>Orders & Tracking</span>
                <span className="text-[10px] font-mono text-[#8A8D98]">04</span>
              </Link>

              <div className="hairline-t my-2 pt-2 space-y-1">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center justify-between px-3 py-2 text-xs font-mono text-[#F3F0E8] hover:text-[#D7F04A] hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <span>Passport: {user?.name || 'My Account'}</span>
                      <span className="text-[10px] text-[#D7F04A]">● Active</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono font-bold text-[#ff738c] hover:bg-[#661527]/30 hover:text-white rounded-lg transition-colors cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-2">
                        <LogOut size={13} />
                        <span>Sign Out of Feasto</span>
                      </span>
                      <span>→</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth/signin"
                    className="flex items-center justify-between px-3 py-2 text-xs font-heading font-bold text-[#D7F04A] hover:underline"
                  >
                    <span>Sign In to Feasto</span>
                    <span>→</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeastoFloatingNav;
