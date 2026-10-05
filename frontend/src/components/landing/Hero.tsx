import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTrackEvent } from '@/hooks/analytics/useTrackEvent';

export const Hero: React.FC = () => {
  const trackEvent = useTrackEvent();
  const [searchQuery, setSearchQuery] = useState('');

  const chips = [
    { label: 'Spicy', emoji: '🍜' },
    { label: 'Healthy', emoji: '🥗' },
    { label: 'Burgers', emoji: '🍔' },
    { label: 'Sushi', emoji: '🍣' },
    { label: 'Pizza', emoji: '🍕' },
    { label: 'Coffee', emoji: '☕' },
    { label: 'Vegan', emoji: '🌱' },
    { label: 'High Protein', emoji: '💪' },
    { label: 'Late Night', emoji: '🌙' },
  ];

  return (
    <section className="relative overflow-hidden bg-primary-bg py-20 md:py-28 lg:py-32 select-none text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Editorial Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Sparkle Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/5 border border-brand-orange/15 text-brand-orange text-xs font-bold mb-6"
            >
              <Sparkles size={13} className="animate-pulse" />
              <span>Introducing Feasto AI Taste Engine</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black font-heading text-text-primary tracking-tight leading-[1.05] mb-6 max-w-2xl"
            >
              Every Meal.<br />
              <span className="text-brand-orange">Perfectly Personalized.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-text-secondary text-sm sm:text-base md:text-lg mb-10 max-w-xl leading-relaxed"
            >
              Feasto harnesses advanced context-aware AI models to map your unique flavor profile, matching you with local culinary partners for absolute dining perfection. Real-time maps, zero compromise.
            </motion.p>

            {/* Conversational Search Panel */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-lg mb-8"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    trackEvent('search_submit', { queryText: searchQuery }, 'Landing Page');
                  }
                }}
                className="relative flex items-center p-1.5 bg-[#f8f9fb] border border-border-main hover:border-[#cbd5e1] rounded-2xl transition-main shadow-soft"
              >
                <div className="pl-3.5 text-text-muted shrink-0">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='What should I eat tonight? e.g. "Healthy dinner under ₹400"'
                  className="w-full pl-2.5 pr-20 py-2.5 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="absolute right-1.5 py-2 px-4 rounded-xl font-bold shadow-soft"
                >
                  Ask AI
                </Button>
              </form>
            </motion.div>

            {/* Quick Actions Scroll List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full max-w-xl"
            >
              <div className="flex flex-wrap gap-2">
                {chips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(`Best ${chip.label} nearby`);
                      trackEvent('hero_cta_click', { ctaLabel: chip.label, section: 'hero_chips' }, 'Landing Page');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-secondary-bg hover:bg-surface-bg border border-border-main text-xs font-bold text-text-secondary hover:text-text-primary rounded-xl transition-main cursor-pointer"
                  >
                    <span>{chip.emoji}</span>
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Visual composition: Interactive mapping graphics */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center lg:justify-end min-h-[380px] lg:min-h-[440px]">
            {/* Main radar background circle element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute w-[300px] h-[300px] md:w-[350px] md:h-[350px] border border-dashed border-border-main rounded-full flex items-center justify-center z-0"
            >
              <div className="w-[200px] h-[200px] border border-dashed border-border-main/70 rounded-full flex items-center justify-center">
                <div className="w-[100px] h-[100px] border border-dashed border-border-main/50 rounded-full" />
              </div>
            </motion.div>

            {/* Simulated Radar Line Sweep */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="absolute w-[300px] h-[300px] md:w-[350px] md:h-[350px] rounded-full z-0 pointer-events-none origin-center"
              style={{
                background:
                  'conic-gradient(from 0deg, var(--color-brand-orange) 0%, transparent 25%, transparent 100%)',
                opacity: 0.05,
              }}
            />

            {/* Overlapping card 1: Match Score */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: -40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.4 }}
              className="absolute top-8 left-4 md:left-12 bg-white/95 border border-border-main p-4 rounded-2xl shadow-floating z-10 flex items-center gap-3 backdrop-blur-xs w-48 text-left"
            >
              <div className="w-10 h-10 bg-brand-orange/10 text-brand-orange rounded-xl flex items-center justify-center shrink-0 text-sm font-extrabold">
                98%
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary">AI Taste Match</h4>
                <p className="text-[10px] text-text-secondary mt-0.5">Mediterranean Bowl</p>
              </div>
            </motion.div>

            {/* Overlapping card 2: Delivery Speed */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 50 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ type: 'spring', stiffness: 70, damping: 14, delay: 0.5 }}
              className="absolute bottom-8 right-6 md:right-16 bg-white/95 border border-border-main p-4 rounded-2xl shadow-floating z-10 flex items-center gap-3 backdrop-blur-xs w-52 text-left"
            >
              <div className="w-10 h-10 bg-success-main/10 text-success-main rounded-xl flex items-center justify-center shrink-0">
                ⚡
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary">Optimized Courier</h4>
                <p className="text-[10px] text-text-secondary mt-0.5">Est. Arrival in 18 mins</p>
              </div>
            </motion.div>

            {/* Central radar dot */}
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute w-8 h-8 rounded-full bg-brand-orange/15 flex items-center justify-center z-10 shadow-soft"
            >
              <div className="w-3.5 h-3.5 bg-brand-orange rounded-full" />
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-12 md:mt-20">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-text-muted text-[10px] font-bold uppercase tracking-widest pointer-events-none select-none"
          >
            <div className="w-5 h-9 rounded-full border-2 border-border-main flex items-start justify-center p-1.5">
              <div className="w-1.5 h-2.5 bg-brand-orange rounded-full" />
            </div>
            <span>Scroll to Discover</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
