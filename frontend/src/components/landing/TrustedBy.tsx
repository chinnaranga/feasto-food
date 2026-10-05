import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';

export const TrustedBy: React.FC = () => {
  const stats = [
    { value: '100,000+', label: 'Active Taste Profiles' },
    { value: '250+', label: 'Premium Kitchens' },
    { value: '1,200,000+', label: 'Completed Deliveries' },
    { value: '4.92★', label: 'Average Customer Rating' },
  ];

  const partners = ['Stripe Kitchens', 'Linear Dining', 'Notion Cafe', 'OpenAI Catering', 'Perplexity Foods'];

  return (
    <section className="bg-secondary-bg border-y border-border-main/50 py-12 select-none">
      <Container>
        <div className="flex flex-col gap-10">
          {/* Partners list */}
          <div className="flex flex-col items-center gap-5 text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">
              Supporting Culinary Partner Networks
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-sm font-semibold text-text-secondary/70">
              {partners.map((partner, idx) => (
                <span key={idx} className="hover:text-text-primary transition-main">
                  {partner}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-border-main/30 my-2" />

          {/* Stats count */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center"
              >
                <span className="text-2xl sm:text-3xl font-black font-heading text-brand-orange tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-text-secondary mt-1">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
