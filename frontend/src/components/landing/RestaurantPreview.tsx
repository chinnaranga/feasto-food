import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { Star, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTrackEvent } from '@/hooks/analytics/useTrackEvent';

export const RestaurantPreview: React.FC = () => {
  const trackEvent = useTrackEvent();
  const restaurants = [
    {
      id: 'artisan-table',
      name: 'The Artisan Table',
      cuisine: 'Mediterranean • Organic',
      rating: '4.9',
      reviews: '230',
      time: '15-25 min',
      distance: '1.2 km',
      badge: 'Michelin Partner',
      bgGrad: 'from-amber-500/10 to-brand-orange/5',
    },
    {
      id: 'sora-sushi',
      name: 'Sora Sushi',
      cuisine: 'Traditional Japanese • Edomae',
      rating: '4.8',
      reviews: '412',
      time: '20-30 min',
      distance: '2.4 km',
      badge: 'Elite Partner',
      bgGrad: 'from-blue-500/10 to-indigo-500/5',
    },
    {
      id: 'la-cucina',
      name: 'La Cucina',
      cuisine: 'Authentic Neapolitan • Italian',
      rating: '4.9',
      reviews: '185',
      time: '25-35 min',
      distance: '3.1 km',
      badge: 'Feasto Exclusive',
      bgGrad: 'from-emerald-500/10 to-teal-500/5',
    },
  ];

  return (
    <section className="bg-secondary-bg py-20 md:py-24 border-y border-border-main/50 select-none text-left">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">
              Partner Kitchens
            </span>
            <h2 className="text-3xl font-extrabold font-heading text-text-primary tracking-tight mt-2">
              Featured Kitchen Partners
            </h2>
            <p className="text-sm text-text-secondary mt-1 max-w-xl">
              Hand-picked local establishments meeting our strict flavor and quality benchmarks.
            </p>
          </div>

          <Link
            to="/restaurants"
            onClick={() => {
              trackEvent('hero_cta_click', { ctaLabel: 'View All Partner Kitchens', section: 'restaurant_preview' }, 'Landing Page');
            }}
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:text-[#c94804] transition-main"
          >
            <span>View All Partner Kitchens</span>
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-main" />
          </Link>
        </div>

        {/* Restaurant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {restaurants.map((rest, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-primary-bg border border-border-main hover:border-[#cbd5e1] rounded-2xl overflow-hidden shadow-soft transition-main flex flex-col justify-between group h-full"
            >
              {/* Graphic Header Block */}
              <div
                className={`h-40 bg-gradient-to-br ${rest.bgGrad} relative flex items-center justify-center p-6 border-b border-border-main/40`}
              >
                <span className="absolute top-4 left-4 text-[9px] font-extrabold text-brand-orange bg-brand-orange/5 px-2 py-0.5 rounded border border-brand-orange/15 uppercase tracking-wider">
                  {rest.badge}
                </span>

                <span className="text-4xl select-none group-hover:scale-110 transition-main duration-300">
                  🍽️
                </span>
              </div>

              {/* Description Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-text-primary mb-1 tracking-tight group-hover:text-brand-orange transition-main">
                    {rest.name}
                  </h3>
                  <p className="text-xs text-text-secondary mb-4">{rest.cuisine}</p>
                </div>

                {/* Meta details list */}
                <div className="flex items-center justify-between gap-2 border-t border-border-main/50 pt-4 mt-auto text-xs font-semibold text-text-muted">
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-[#f59e0b] fill-[#f59e0b]" />
                    <span className="text-text-primary font-bold">{rest.rating}</span>
                    <span>({rest.reviews})</span>
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{rest.time}</span>
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{rest.distance}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
