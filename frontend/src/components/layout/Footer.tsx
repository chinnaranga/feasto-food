import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from './Container';
import { Logo } from './Logo';
import { Globe, Github, Twitter, Instagram, Sparkles } from 'lucide-react';
import { usePrivacyConsent } from '../../hooks/security/usePrivacyConsent';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { openPreferencesModal } = usePrivacyConsent();

  return (
    <footer className="w-full bg-[#08090D] border-t border-white/5 py-16 text-left select-none relative overflow-hidden">
      {/* Background Subtle Ambient Light */}
      <div 
        className="pointer-events-none absolute bottom-0 left-1/3 w-[600px] h-[300px] rounded-full blur-[140px] opacity-10"
        style={{ background: 'radial-gradient(circle, #6D5EF5 0%, #4FD1E8 100%)' }}
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Brand Identity */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-[#A7ACB8] max-w-sm leading-relaxed">
              An intelligent operating system for food. Connecting cravings, local kitchen craft, and precision thermal dispatch.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="text-[#6F7480] hover:text-[#4FD1E8] transition-colors">
                <Twitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-[#6F7480] hover:text-[#A78BFA] transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-[#6F7480] hover:text-[#F4F5F7] transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-xs font-black text-[#F4F5F7] uppercase tracking-wider font-heading">
              Platform
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-semibold">
              <li>
                <Link to="/discover" className="text-[#A7ACB8] hover:text-white transition-colors">
                  Conversational Discovery
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-[#A7ACB8] hover:text-white transition-colors">
                  Kitchen Network
                </Link>
              </li>
              <li>
                <Link to="/discover?collection=comfort" className="text-[#A7ACB8] hover:text-white transition-colors">
                  Smart Collections
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3.5">
            <h4 className="text-xs font-black text-[#F4F5F7] uppercase tracking-wider font-heading">
              Operations
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-semibold">
              <li>
                <Link to="/support" className="text-[#A7ACB8] hover:text-white transition-colors">
                  Kitchen Verification
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-[#A7ACB8] hover:text-white transition-colors">
                  Courier Protocol
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-[#A7ACB8] hover:text-white transition-colors">
                  Thermal Standards
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3.5">
            <h4 className="text-xs font-black text-[#F4F5F7] uppercase tracking-wider font-heading">
              Trust & Data
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-semibold">
              <li>
                <Link to="/support" className="text-[#A7ACB8] hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openPreferencesModal}
                  className="text-[#A7ACB8] hover:text-white transition-colors cursor-pointer text-left font-semibold border-none bg-transparent p-0"
                >
                  Privacy Preferences
                </button>
              </li>
              <li>
                <span className="text-[#6F7480] text-xs">
                  Zero Third-Party Trackers
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-[#6F7480]">
          <span>&copy; {currentYear} Feasto. Operating System for Food.</span>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-[#A7ACB8] font-semibold">
              <Globe size={14} className="text-[#4FD1E8]" />
              <span>English (India) • ₹ INR</span>
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
