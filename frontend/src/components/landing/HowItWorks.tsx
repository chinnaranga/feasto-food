import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { Sliders, SearchCheck, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Dietary Profiling',
      desc: 'Create your secure taste credentials. Select flavor tags, diet categories, and strict allergen exclusions.',
      icon: <Sliders className="text-brand-orange" size={22} />,
    },
    {
      num: '02',
      title: 'AI Semantic Mapping',
      desc: 'Our engine cross-references dish ingredients and preparation styles against your taste vector for maximum match accuracy.',
      icon: <SearchCheck className="text-[#f59e0b]" size={22} />,
    },
    {
      num: '03',
      title: 'Optimized Delivery',
      desc: 'Orders are dispatched instantly via local couriers in custom thermal packaging, preserving flavor integrity.',
      icon: <CheckCircle2 className="text-success-main" size={22} />,
    },
  ];

  return (
    <section className="bg-secondary-bg py-20 md:py-24 border-y border-border-main/50 select-none text-left">
      <Container>
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">
            The Discovery Framework
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight mt-2">
            How Feasto Works
          </h2>
          <p className="text-sm text-text-secondary max-w-md mt-3 leading-relaxed">
            Three simple phases mapping flavor preferences to your dining table.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-primary-bg border border-border-main p-8 rounded-2xl shadow-soft flex flex-col items-start text-left relative overflow-hidden group hover:border-brand-orange/20 transition-main"
            >
              <div className="flex items-center justify-between w-full mb-6">
                <div className="w-12 h-12 rounded-xl bg-secondary-bg border border-border-main/50 flex items-center justify-center group-hover:scale-105 transition-main">
                  {step.icon}
                </div>
                <span className="text-3xl font-black font-heading text-[#e2e8f0] tracking-tight">
                  {step.num}
                </span>
              </div>
              <h3 className="text-base font-bold text-text-primary mb-3 font-heading">
                {step.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
