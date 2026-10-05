import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { Sparkles, BrainCircuit, Heart, ShieldCheck } from 'lucide-react';

export const AiDiscovery: React.FC = () => {
  // Mock radar attributes
  const [flavorValues, setFlavorValues] = useState({
    spicy: 75,
    sweet: 30,
    savory: 90,
    umami: 85,
    tangy: 50,
  });

  const updateAttribute = (key: keyof typeof flavorValues, val: number) => {
    setFlavorValues((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <section className="bg-primary-bg py-20 md:py-24 select-none text-left">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Description */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b]/5 border border-[#f59e0b]/15 text-[#b45309] text-xs font-bold mb-4">
              <BrainCircuit size={13} />
              <span>Semantic Flavor Mapping</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight leading-tight mb-6">
              AI Food Discovery.<br />
              Mapped to Your Taste buds.
            </h2>

            <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-8">
              Traditional platforms sort menus by generic reviews and basic filters. Feasto's semantic intelligence parses dish ingredients, preparation methods, and historical ratings to match local food collections accurately with your biological taste settings.
            </p>

            {/* List of benefits */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-brand-orange/5 border border-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-primary">Custom Profile Vectors</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Continuous training maps food preferences dynamically.</p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-brand-orange/5 border border-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0">
                  <Heart size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-primary">Dietary Constraints Guarantee</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Strict safety layers block incompatible ingredients automatically.</p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-brand-orange/5 border border-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-primary">Contextual Recommendation</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Adapts dining prompts dynamically based on local weather and time of day.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Flavor Radar Card */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md p-6 bg-[#f8f9fb] border border-border-main rounded-2xl shadow-medium flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-border-main pb-4">
                <div>
                  <h3 className="text-sm font-bold text-text-primary">Interactive Flavor Profile</h3>
                  <p className="text-[10px] text-text-muted mt-0.5">Tune sliders to see recommendation weighting shift</p>
                </div>
                <span className="text-[10px] font-extrabold text-[#f59e0b] bg-[#f59e0b]/5 px-2 py-0.5 rounded border border-[#f59e0b]/15 uppercase tracking-wide">
                  Active Vector
                </span>
              </div>

              {/* Sliders Control Panel */}
              <div className="flex flex-col gap-4">
                {(Object.keys(flavorValues) as Array<keyof typeof flavorValues>).map((key) => (
                  <div key={key} className="flex flex-col gap-1.5 text-left">
                    <div className="flex items-center justify-between text-xs font-bold text-text-secondary capitalize">
                      <span>{key}</span>
                      <span>{flavorValues[key]}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={flavorValues[key]}
                      onChange={(e) => updateAttribute(key, Number(e.target.value))}
                      className="w-full h-1 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-brand-orange"
                    />
                  </div>
                ))}
              </div>

              {/* Mock recommendation feedback */}
              <div className="p-3 bg-white border border-border-main rounded-xl flex items-center justify-between shadow-soft">
                <span className="text-xs font-semibold text-text-secondary">AI Profile Alignment:</span>
                <span className="text-xs font-extrabold text-brand-orange bg-brand-orange/5 px-2 py-0.5 rounded">
                  96.8% Optimized
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};
