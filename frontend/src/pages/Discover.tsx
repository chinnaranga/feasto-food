import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_RESTAURANTS, FEATURED_COLLECTIONS } from '@/data/restaurants';

export const Discover: React.FC = () => {
  const navigate = useNavigate();

  const curatedStories = [
    {
      id: 'heritage',
      number: '01',
      title: 'HEIRLOOM CLAYPOT & DUM COOKING',
      subtitle: 'Charcoal embers, slow reduction, recipes spanning three generations.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80',
      kitchen: 'Spice Route',
      restaurantId: 'spice-route',
      tag: 'Heritage Indian',
    },
    {
      id: 'wood-fired',
      number: '02',
      title: 'THE 480°C VESUVIAN ASH HEARTH',
      subtitle: 'Naturally leavened sourdough with fresh buffalo mozzarella from Caserta.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80',
      kitchen: 'La Cucina',
      restaurantId: 'la-cucina',
      tag: 'Wood-Fired Pizza',
    },
    {
      id: 'nocturnal',
      number: '03',
      title: 'NOCTURNAL BROTH & NOODLE MASTERY',
      subtitle: '18-hour bone broths simmering deep into midnight for nocturnal eaters.',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&auto=format&fit=crop&q=80',
      kitchen: 'Sora Japanese',
      restaurantId: 'sora-sushi',
      tag: 'Japanese Ramen',
    },
    {
      id: 'botanical',
      number: '04',
      title: 'EARLY MORNING BOTANICAL HARVEST',
      subtitle: 'Clean proteins, cold-pressed oils, wild ocean catch with zero refined sugar.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&auto=format&fit=crop&q=80',
      kitchen: 'Verde Kitchen',
      restaurantId: 'verde-kitchen',
      tag: 'Whole Food Botanical',
    },
  ];

  return (
    <div className="w-full bg-[#F3F0E8] text-[#141518] selection:bg-[#D7F04A] selection:text-[#141518] min-h-screen pt-28 pb-32">
      
      {/* Header Statement */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 pb-12 border-b border-[#141518]">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#52555F] block mb-2">
              Curated Editions · 2026
            </span>
            <h1 className="editorial-display-giant text-[#141518]">
              COLLECTIONS.
            </h1>
          </div>
          <p className="font-sans text-sm text-[#52555F] max-w-sm">
            Dishes grouped by cooking philosophy, fire temperature, and nocturnal availability rather than arbitrary filters.
          </p>
        </div>
      </section>

      {/* Editorial Curation Blocks */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 py-16 flex flex-col gap-24">
        {curatedStories.map((story) => (
          <article
            key={story.id}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-20 border-b border-[#E2DED4] last:border-b-0"
          >
            <div className="lg:col-span-2 font-mono text-xs text-[#52555F] flex flex-col gap-1">
              <span className="text-3xl font-bold text-[#141518]">{story.number}</span>
              <span className="uppercase tracking-widest text-[#1B3BFF] font-bold">{story.tag}</span>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4">
              <h2 className="editorial-display-sub text-[#141518]">
                {story.title}
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#52555F] leading-relaxed">
                {story.subtitle}
              </p>
              <div className="pt-2">
                <Link
                  to={`/restaurants/${story.restaurantId}`}
                  className="btn-graphic-primary"
                >
                  Explore {story.kitchen} →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative overflow-hidden group">
              <Link to={`/restaurants/${story.restaurantId}`}>
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-[420px] object-cover border border-[#141518] group-hover:scale-102 transition-transform duration-500"
                />
              </Link>
            </div>
          </article>
        ))}
      </section>

    </div>
  );
};
