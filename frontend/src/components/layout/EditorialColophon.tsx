import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { LogOut } from 'lucide-react';

export const EditorialColophon: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    addToast({ message: 'Signed out of Feasto successfully.', type: 'info' });
    navigate('/');
  };

  return (
    <footer className="w-full bg-[#141518] text-[#F3F0E8] hairline-t pt-16 pb-20 px-6 sm:px-12 select-none">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-16">
        {/* Large Statement */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pb-12 border-b border-white/10">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#D7F04A] block mb-2">
              FEASTO CANVAS · 2026
            </span>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F3F0E8] leading-none">
              A Living World<br />of Food.
            </h2>
          </div>
          <p className="font-sans text-sm text-[#8A8D98] max-w-sm">
            Independent restaurants, regional kitchens, and intelligent food discovery composed for true eaters.
          </p>
        </div>

        {/* Directory columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs font-mono">
          <div className="flex flex-col gap-3">
            <span className="uppercase text-[#8A8D98] tracking-widest">Navigation</span>
            <Link to="/" className="hover:text-[#D7F04A] transition-colors">01. Discovery Canvas</Link>
            <Link to="/restaurants" className="hover:text-[#D7F04A] transition-colors">02. All Kitchens</Link>
            <Link to="/discover?collection=curated" className="hover:text-[#D7F04A] transition-colors">03. Culinary Archives</Link>
            <Link to="/orders" className="hover:text-[#D7F04A] transition-colors">04. Live Tracking</Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="uppercase text-[#8A8D98] tracking-widest">Platforms</span>
            <Link to="/restaurant/login" className="hover:text-[#D7F04A] transition-colors">Kitchen Studio</Link>
            <Link to="/rider/login" className="hover:text-[#D7F04A] transition-colors">Rider Instrument</Link>
            <Link to="/admin" className="hover:text-[#D7F04A] transition-colors">Operations Room</Link>
            <Link to="/support" className="hover:text-[#D7F04A] transition-colors">Culinary Support</Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="uppercase text-[#8A8D98] tracking-widest">Presence</span>
            <span className="text-[#F3F0E8]/70">Hyderabad · Jubilee Hills</span>
            <span className="text-[#F3F0E8]/70">Bengaluru · Indiranagar</span>
            <span className="text-[#F3F0E8]/70">Mumbai · Bandra West</span>
            <span className="text-[#F3F0E8]/70">Delhi NCR · Cyber Hub</span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="uppercase text-[#8A8D98] tracking-widest">Standard</span>
            <span className="text-[#F3F0E8]/70">Real-Time Dispatch</span>
            <span className="text-[#F3F0E8]/70">Razorpay Verified</span>
            <span className="text-[#F3F0E8]/70">Zero Preservatives</span>
            <span className="text-[#D7F04A]">Status: Normal</span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="uppercase text-[#8A8D98] tracking-widest">Account</span>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-[#D7F04A] hover:underline font-bold">
                  {user?.name || 'Passport'} →
                </Link>
                <Link to="/orders" className="hover:text-[#D7F04A] transition-colors">Order History</Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-[#ff738c] hover:text-white hover:underline text-left cursor-pointer font-bold mt-1"
                >
                  <LogOut size={11} />
                  <span>SIGN OUT</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/signin" className="text-[#D7F04A] hover:underline font-bold">Sign In →</Link>
                <Link to="/auth/signup" className="hover:text-white transition-colors">Create Account</Link>
              </>
            )}
          </div>
        </div>

        {/* Bottom Hairline & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#8A8D98]">
          <span>© 2026 FEASTO PLATFORM. ALL RIGHTS RESERVED.</span>
          <span>PRINT & ARCHITECTURAL EDITION V3.0</span>
        </div>
      </div>
    </footer>
  );
};
