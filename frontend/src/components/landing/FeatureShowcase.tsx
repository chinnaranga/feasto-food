import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { Map, Share2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const FeatureShowcase: React.FC = () => {
  return (
    <section className="bg-primary-bg py-20 md:py-24 select-none text-left flex flex-col gap-24 md:gap-32">
      {/* Feature 1: Culinary Map */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/5 border border-brand-orange/15 text-brand-orange text-xs font-bold mb-4">
              <Map size={13} />
              <span>Visual Flavor Coordinates</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight leading-tight mb-6">
              Navigate local menus with Culinary Maps.
            </h2>

            <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-8">
              Explore your neighborhood visually. Feasto's interactive Culinary Map renders flavor profiles as hot spots, letting you see exactly where the highest concentration of dishes matching your taste profile reside.
            </p>

            <Button variant="outline" size="md" className="rounded-xl flex items-center gap-2 font-bold">
              <span>Explore Map View</span>
              <ArrowRight size={14} />
            </Button>
          </div>

          {/* Right Visual Graphic */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md p-6 bg-[#f8f9fb] border border-border-main rounded-2xl shadow-medium flex flex-col gap-4 text-left relative overflow-hidden"
            >
              {/* Simulated Map Header */}
              <div className="flex items-center justify-between border-b border-border-main/50 pb-3">
                <span className="text-xs font-bold text-text-primary">Culinary Radar</span>
                <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-ping" />
              </div>

              {/* Mock Map View grid representation */}
              <div className="h-44 bg-white border border-border-main/50 rounded-xl relative overflow-hidden flex items-center justify-center">
                {/* SVG mock map path grid lines */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 0 40 L 400 40 M 0 100 L 400 100 M 0 160 L 400 160 M 80 0 L 80 200 M 200 0 L 200 200 M 320 0 L 320 200"
                    stroke="#9ca3af"
                    strokeWidth="1"
                  />
                </svg>

                {/* Flavor clusters */}
                <div className="absolute top-10 left-12 w-16 h-16 rounded-full bg-brand-orange/15 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-brand-orange/30 flex items-center justify-center">
                    <div className="w-3.5 h-3.5 bg-brand-orange rounded-full" />
                  </div>
                </div>

                <div className="absolute bottom-6 right-20 w-24 h-24 rounded-full bg-[#f59e0b]/10 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#f59e0b]/25 flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#f59e0b] rounded-full" />
                  </div>
                </div>

                <span className="absolute bottom-4 left-4 text-[9px] font-extrabold text-[#f59e0b] bg-[#f59e0b]/5 px-2 py-0.5 rounded border border-[#f59e0b]/15 uppercase tracking-wide">
                  Spicy Cluster
                </span>

                <span className="absolute top-4 right-4 text-[9px] font-extrabold text-brand-orange bg-brand-orange/5 px-2 py-0.5 rounded border border-brand-orange/15 uppercase tracking-wide">
                  98% Match Peak
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* Feature 2: Dining Playlists */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Visual Graphic */}
          <div className="lg:col-span-6 order-last lg:order-first flex justify-center">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md p-6 bg-[#f8f9fb] border border-border-main rounded-2xl shadow-medium flex flex-col gap-4 text-left relative overflow-hidden"
            >
              {/* Playlist details mock card */}
              <div className="flex items-center justify-between border-b border-border-main/50 pb-3">
                <span className="text-xs font-bold text-text-primary">Shared Dinings</span>
                <span className="text-[10px] font-bold text-text-muted">4.9k Views</span>
              </div>

              <div className="bg-white border border-border-main/50 p-4 rounded-xl shadow-soft">
                <h4 className="text-sm font-bold text-text-primary mb-1">"Cozy Rain Friday Nights"</h4>
                <p className="text-[10px] text-text-muted mb-4">
                  Curated collection of 5 hot soups & desserts
                </p>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-text-primary">1. Spicy Tonkotsu Ramen</span>
                    <span className="text-brand-orange font-bold">98% match</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-text-primary">2. Hot Chili Wontons</span>
                    <span className="text-brand-orange font-bold">94% match</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-text-primary">3. Matcha Lava Cake</span>
                    <span className="text-[#f59e0b] font-bold">89% match</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b]/5 border border-[#f59e0b]/15 text-[#b45309] text-xs font-bold mb-4">
              <Share2 size={13} />
              <span>Social Dining Catalogs</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight leading-tight mb-6">
              Curate and share custom Food Playlists.
            </h2>

            <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-8">
              Think Spotify playlists, but for meals. Curate your favorite dining selections for
              rainy days, high-protein weeks, or romantic dates, and share them with the Feasto
              community or friends.
            </p>

            <Button variant="outline" size="md" className="rounded-xl flex items-center gap-2 font-bold">
              <span>View Shared Playlists</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};
