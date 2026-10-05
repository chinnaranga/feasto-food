import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { Quote, Star } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

export const Testimonials: React.FC = () => {
  const customerReviews = [
    {
      name: 'Sarah Jenkins',
      role: 'Dietitian & Food Blogger',
      quote:
        "The flavor vector mapping is scarily accurate. Feasto suggested a custom low-sodium bowl from a local bistro that perfectly suited my macros. I don't use regular apps anymore.",
      rating: 5,
    },
    {
      name: 'Rohan Sharma',
      role: 'Software Architect',
      quote:
        "As someone with severe tree nut allergies, eating out is always stressful. Feasto's strict dietary block is absolute. I can search safely knowing they scan ingredients automatically.",
      rating: 5,
    },
    {
      name: 'Elena Rostova',
      role: 'Creative Director',
      quote:
        "Feels like Stripe or Airbnb for dining. Spacing is beautiful, interactions are fluid, and the maps highlight flavor hubs rather than cluttered listing feeds. Pure luxury.",
      rating: 5,
    },
  ];

  return (
    <section className="bg-primary-bg py-20 md:py-24 select-none text-left">
      <Container>
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">
            Customer Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight mt-2">
            Loved by Food Enthusiasts
          </h2>
          <p className="text-sm text-text-secondary max-w-md mt-3 leading-relaxed">
            Read how dining vectors are transforming the food discovery experience.
          </p>
        </div>

        {/* Reviews Deck */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {customerReviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#f8f9fb] border border-border-main p-8 rounded-2xl flex flex-col justify-between min-h-[250px] shadow-soft relative"
            >
              <Quote className="absolute top-6 right-6 text-border-main shrink-0 w-8 h-8" />

              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: rev.rating }).map((_, sIdx) => (
                    <Star key={sIdx} size={14} className="text-[#f59e0b] fill-[#f59e0b]" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-8 italic">
                  "{rev.quote}"
                </p>
              </div>

              {/* Bio details */}
              <div className="flex items-center gap-3 border-t border-border-main/50 pt-4 mt-auto">
                <Avatar name={rev.name} size="sm" />
                <div className="text-left select-none">
                  <h4 className="text-xs font-bold text-text-primary">{rev.name}</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">{rev.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
