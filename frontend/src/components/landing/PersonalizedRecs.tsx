import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { Sparkles, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/Button';

export const PersonalizedRecs: React.FC = () => {
  const recommendations = [
    {
      name: 'Avocado Greens Protein Bowl',
      restaurant: 'The Greenery Co.',
      match: '98%',
      price: '₹340',
      tags: ['High Protein', 'Vegan'],
      calories: '420 kcal',
    },
    {
      name: 'Citrus Ponzu Salmon Salad',
      restaurant: 'Izakaya & Sushi Bar',
      match: '95%',
      price: '₹480',
      tags: ['Omega-3', 'Low Carb'],
      calories: '380 kcal',
    },
    {
      name: 'Truffle Wild Mushroom Risotto',
      restaurant: 'Aria Trattoria',
      match: '92%',
      price: '₹420',
      tags: ['Vegetarian', 'Gluten Free'],
      calories: '510 kcal',
    },
  ];

  return (
    <section className="bg-primary-bg py-20 md:py-24 select-none text-left">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">
              Live AI Inference
            </span>
            <h2 className="text-3xl font-extrabold font-heading text-text-primary tracking-tight mt-2">
              Your Personalized Recommendations
            </h2>
            <p className="text-sm text-text-secondary mt-1 max-w-xl">
              Freshly calculated dish matches mapped directly to your active taste vector.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-bold text-text-muted">
            <span className="w-2 h-2 rounded-full bg-success-main animate-pulse" />
            <span>Updated 2 mins ago</span>
          </div>
        </div>

        {/* Recs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendations.map((rec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-secondary-bg/40 hover:bg-secondary-bg border border-border-main hover:border-[#cbd5e1] rounded-2xl p-6 flex flex-col justify-between min-h-[280px] shadow-soft transition-main group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-[10px] font-extrabold text-[#f59e0b] bg-[#f59e0b]/5 px-2 py-0.5 rounded border border-[#f59e0b]/15 uppercase tracking-wide">
                    {rec.calories}
                  </span>

                  {/* Match percentage badge */}
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-brand-orange bg-brand-orange/5 px-2 py-0.5 border border-brand-orange/15 rounded-lg shadow-xs select-none">
                    <Sparkles size={11} className="shrink-0 animate-pulse" />
                    <span>{rec.match} Match</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-text-primary mb-1 tracking-tight group-hover:text-brand-orange transition-main">
                  {rec.name}
                </h3>
                <p className="text-xs text-text-secondary mb-4">by {rec.restaurant}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {rec.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 bg-primary-bg border border-border-main text-[10px] font-bold text-text-secondary rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between border-t border-border-main/50 pt-4 mt-auto">
                <span className="text-base font-black text-text-primary font-heading">
                  {rec.price}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl bg-white flex items-center gap-1.5 font-bold shadow-soft"
                >
                  <ShoppingCart size={13} />
                  <span>Add</span>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
