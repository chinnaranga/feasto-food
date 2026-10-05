import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTrackEvent } from '@/hooks/analytics/useTrackEvent';

export const Membership: React.FC = () => {
  const trackEvent = useTrackEvent();
  const benefits = [
    'Unlimited free delivery on all culinary orders',
    'Unlocked advanced flavor vector parameters',
    'Exclusive access to weekly guest-chef menu drops',
    'Prioritized delivery routes and kitchen dispatches',
    'Zero service fees on partner kitchens orders',
  ];

  return (
    <section className="bg-secondary-bg py-20 md:py-24 border-y border-border-main/50 select-none text-left">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b]/5 border border-[#f59e0b]/15 text-[#b45309] text-xs font-bold mb-4">
              <Shield size={13} />
              <span>Premium Membership</span>
            </div>

            <h2 className="text-3xl font-extrabold font-heading text-text-primary tracking-tight leading-tight mb-6">
              Unlock the full culinary mapping experience.
            </h2>

            <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6">
              Upgrade to Feasto Gold to unlock deep customization vectors, bypass service fees, and gain exclusive menus curated by leading local chefs.
            </p>
          </div>

          {/* Right Cards Spotlight */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-lg bg-primary-bg border-2 border-brand-orange/20 rounded-3xl p-8 shadow-modal relative overflow-hidden text-left"
            >
              {/* Gold abstract overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full filter blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between border-b border-border-main/50 pb-6 mb-6">
                <div>
                  <span className="text-[10px] font-extrabold text-[#f59e0b] bg-[#f59e0b]/5 px-2 py-0.5 rounded border border-[#f59e0b]/15 uppercase tracking-wider">
                    Feasto Gold
                  </span>
                  <h3 className="text-2xl font-black font-heading text-text-primary mt-2">
                    Ultimate Taste
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black font-heading text-text-primary">₹199</span>
                  <span className="text-xs text-text-muted font-bold block mt-0.5">/ month</span>
                </div>
              </div>

              {/* Benefits list */}
              <div className="flex flex-col gap-3.5 mb-8">
                {benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 text-xs font-semibold text-text-secondary"
                  >
                    <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  trackEvent('hero_cta_click', { ctaLabel: 'Subscribe to Feasto Gold', section: 'membership' }, 'Landing Page');
                }}
                className="w-full justify-center rounded-xl font-bold py-3.5 shadow-soft"
              >
                Subscribe to Feasto Gold
              </Button>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};
