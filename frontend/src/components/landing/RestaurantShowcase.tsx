import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Filter } from 'lucide-react';
import { MOCK_RESTAURANTS, CUISINES } from '@/data/restaurants';
import { RestaurantCard } from '@/components/discovery/RestaurantCard';

export const RestaurantShowcase: React.FC = () => {
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');

  const filteredRestaurants =
    selectedCuisine === 'All'
      ? MOCK_RESTAURANTS.slice(0, 4)
      : MOCK_RESTAURANTS.filter((r) =>
          r.cuisine.some((c) => c.toLowerCase() === selectedCuisine.toLowerCase())
        ).slice(0, 4);

  const availableCuisines = ['All', 'Indian', 'Mediterranean', 'Italian', 'Japanese', 'Vegan'];

  return (
    <section className="py-20 md:py-32 bg-[#08090D] border-t border-[#1F2232] select-none text-[#F4F5F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4FD1E8] mb-2 block">
              Culinary Network
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#F4F5F7] tracking-tight leading-[1.08] mb-3">
              Great food. Great kitchens.
            </h2>
            <p className="text-base text-[#A7ACB8] font-normal">
              Every partner is individually audited for hygiene standards, ingredient sourcing, and thermal courier coordination.
            </p>
          </div>

          {/* Cuisine Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {availableCuisines.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCuisine(c)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCuisine === c
                    ? 'bg-[#6D5EF5] text-white shadow-xs'
                    : 'bg-[#101218] border border-[#1F2232] text-[#A7ACB8] hover:bg-[#141720] hover:text-[#F4F5F7]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Existing Production RestaurantCard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant, idx) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              index={idx}
            />
          ))}
        </div>

        {/* Bottom CTA to Full Restaurant Directory */}
        <div className="mt-12 text-center">
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#101218] border border-[#1F2232] hover:border-[#6D5EF5]/60 hover:bg-[#141720] text-[#F4F5F7] text-xs font-bold transition-all shadow-md"
          >
            <span>Explore All 250+ Audited Hyderabad Kitchens</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
};
