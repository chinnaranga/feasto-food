import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';

export interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F3F0E8] text-[#141518] selection:bg-[#D7F04A] selection:text-[#141518] flex flex-col justify-between select-none relative overflow-x-hidden antialiased">
      
      {/* ── TOP EDITORIAL MASTHEAD ── */}
      <header className="w-full px-6 sm:px-12 py-6 border-b border-[#141518] flex items-center justify-between z-20">
        <div className="flex items-center gap-6">
          <Logo />
          <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest text-[#70727D] border-l border-[#141518]/20 pl-6">
            PASSPORT ACCESS PROTOCOL · ED. 2026
          </span>
        </div>

        <Link
          to="/"
          className="font-mono text-xs uppercase tracking-wider text-[#141518] hover:text-[#1B3BFF] flex items-center gap-2 group cursor-pointer"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>RETURN TO CANVAS</span>
        </Link>
      </header>

      {/* ── MAIN EDITORIAL CANVAS BODY ── */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 sm:px-12 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Dominant Editorial Statement & Dramatic Food Crop (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-10 text-left">
          
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase font-bold tracking-widest text-[#1B3BFF] block">
              FEASTO · A DIGITAL FOOD UNIVERSE
            </span>
            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.92] text-[#141518] uppercase">
              ENTER<br />
              THE LIVING<br />
              WORLD.
            </h1>
            <p className="font-sans text-base sm:text-lg text-[#52555E] max-w-lg leading-relaxed pt-2">
              Every dish is an object. Every kitchen is a story. Sign in to synchronize your dining bag, tracking radar, and order dispatches.
            </p>
          </div>

          {/* Editorial Food Object Composition (No generic card!) */}
          <div className="relative border-t-2 border-b-2 border-[#141518] py-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            
            {/* High-Resolution Food Media Crop */}
            <div className="sm:col-span-7 aspect-[4/3] w-full overflow-hidden bg-[#141518] relative group">
              <img
                src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop"
                alt="Hyderabadi Dum Biryani"
                className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute top-3 left-3 bg-[#141518] text-[#F3F0E8] font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
                PLATE NO. 018
              </div>
            </div>

            {/* Accompanying Editorial Metadata */}
            <div className="sm:col-span-5 font-mono text-xs space-y-2 text-[#52555F]">
              <span className="text-[10px] text-[#1B3BFF] font-bold uppercase tracking-wider block">
                CURRENT CATALOG SELECTION
              </span>
              <h3 className="font-heading font-black text-base text-[#141518] leading-tight uppercase">
                HYDERABADI DUM BIRYANI
              </h3>
              <p className="text-[11px] leading-relaxed text-[#70727D]">
                Slow-simmered saffron rice, whole garam masala, direct kitchen dispatch.
              </p>
              <div className="pt-2 text-[10px] text-[#141518] font-bold border-t border-[#141518]/15 flex items-center justify-between">
                <span>EST. COOK 24 MIN</span>
                <span>₹280</span>
              </div>
            </div>

          </div>

          {/* Minimal Edition Marker */}
          <div className="font-mono text-[10px] text-[#8A8D98] uppercase tracking-widest flex items-center gap-6">
            <span>HYDERABAD</span>
            <span>·</span>
            <span>MUMBAI</span>
            <span>·</span>
            <span>BENGALURU</span>
            <span>·</span>
            <span>DELHI</span>
          </div>

        </div>

        {/* Right Column: Sharp Architectural Authentication Surface (5 cols) */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
          <div className="border border-[#141518] bg-white p-8 sm:p-10 shadow-[6px_6px_0px_0px_#141518] text-left">
            {children}
          </div>
        </div>

      </main>

      {/* ── BOTTOM EDITORIAL COLOPHON ── */}
      <footer className="w-full px-6 sm:px-12 py-5 border-t border-[#141518]/20 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-[#70727D] uppercase tracking-wider">
        <span>© 2026 FEASTO PLATFORM · ZERO-BASE ARCHITECTURE</span>
        <div className="flex items-center gap-6">
          <Link to="/discover" className="hover:text-[#141518]">DISCOVER</Link>
          <Link to="/restaurants" className="hover:text-[#141518]">KITCHENS</Link>
          <Link to="/support" className="hover:text-[#141518]">SUPPORT</Link>
        </div>
      </footer>

    </div>
  );
};

export default AuthLayout;
