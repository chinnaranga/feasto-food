import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MOCK_RESTAURANTS } from '@/data/restaurants';
import { useDiscoveryStore } from '@/store/discoveryStore';
import type { Restaurant } from '@/data/restaurants';

const CUISINE_TAGS = ['All', 'Indian', 'Italian', 'Japanese', 'Healthy', 'Late Night'];

export const Restaurants: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedTag, setSelectedTag] = useState('All');
  const { restaurants: storeRestaurants } = useDiscoveryStore();

  const sourceRestaurants = storeRestaurants && storeRestaurants.length > 0 ? storeRestaurants : MOCK_RESTAURANTS;

  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  const filtered = useMemo(() => {
    let list = [...sourceRestaurants];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.cuisine?.some((c) => c.toLowerCase().includes(q)) ||
          r.tags?.some((t) => t.toLowerCase().includes(q)) ||
          r.topDishes?.some((d) => d.name.toLowerCase().includes(q))
      );
    }
    if (selectedTag !== 'All') {
      const tagLower = selectedTag.toLowerCase();
      list = list.filter(
        (r) =>
          r.cuisine?.some((c) => c.toLowerCase().includes(tagLower)) ||
          r.tags?.some((t) => t.toLowerCase().includes(tagLower))
      );
    }
    return list;
  }, [sourceRestaurants, searchQuery, selectedTag]);

  return (
    <div className="w-full bg-[#F3F0E8] text-[#141518] selection:bg-[#D7F04A] selection:text-[#141518] min-h-screen pt-28 pb-32">
      
      {/* ─────────────────────────────────────────────────────────────
          1. EDITORIAL HEADER & FILTER STRIP
      ────────────────────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 pb-12 border-b border-[#141518]">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#52555F] block mb-2">
              Kitchen Directory · Hyderabad Metropole
            </span>
            <h1 className="editorial-display-giant text-[#141518]">
              REAL KITCHENS.
            </h1>
          </div>
          <p className="font-sans text-sm text-[#52555F] max-w-sm">
            Curated regional restaurants and independent kitchens operating with live order tracking.
          </p>
        </div>

        {/* Typographic Search & Index Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-[#E2DED4]">
          {/* Query Field */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by kitchen, dish, or cuisine..."
              className="w-full px-4 py-2.5 bg-white border border-[#141518] text-xs font-sans text-[#141518] placeholder:text-[#8A8D98] focus:outline-none focus:ring-1 focus:ring-[#141518]"
            />
          </div>

          {/* Typographic Tag Filters (No pills) */}
          <div className="flex items-center gap-3 overflow-x-auto text-xs font-mono py-1">
            {CUISINE_TAGS.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`pb-0.5 whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'text-[#141518] font-bold border-b-2 border-[#1B3BFF]'
                      : 'text-[#8A8D98] hover:text-[#141518]'
                  }`}
                >
                  {tag.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. VERTICAL EDITORIAL FEED
          Asymmetric story blocks, large photos, authentic pricing.
      ────────────────────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 py-16 flex flex-col gap-24">
        {filtered.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <span className="font-mono text-xs uppercase text-[#8A8D98]">No matches found</span>
            <h3 className="font-display text-3xl font-bold">Try searching for Biryani, Dosa, or Pizza</h3>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('All');
              }}
              className="btn-graphic-primary mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filtered.map((restaurant, index) => {
            const indexStr = String(index + 1).padStart(2, '0');
            const isEven = index % 2 === 0;

            const cover =
              (restaurant as any).coverImage ||
              (restaurant.id === 'spice-route'
                ? 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80'
                : restaurant.id === 'la-cucina'
                ? 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80'
                : restaurant.id === 'sora-sushi'
                ? 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop&q=80');

            return (
              <article
                key={restaurant.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-20 border-b border-[#E2DED4] last:border-b-0"
              >
                {/* Asymmetric layout switch */}
                <div
                  className={`lg:col-span-6 flex flex-col gap-5 ${
                    isEven ? 'order-1 lg:order-1' : 'order-1 lg:order-2'
                  }`}
                >
                  <div className="flex items-center gap-3 font-mono text-xs text-[#52555F]">
                    <span className="text-2xl font-bold text-[#141518]">{indexStr}</span>
                    <span>·</span>
                    <span className="uppercase tracking-widest text-[#1B3BFF] font-bold">
                      {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(' / ') : 'Kitchen'}
                    </span>
                  </div>

                  <h2 className="editorial-display-sub text-[#141518]">
                    {restaurant.name}
                  </h2>

                  <p className="font-sans text-sm sm:text-base text-[#52555F] leading-relaxed max-w-lg">
                    {restaurant.tagline || 'Crafted with precision using fresh regional produce.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-[#141518] pt-2">
                    <span className="text-sm font-bold text-[#141518]">★ {restaurant.rating}</span>
                    <span className="text-[#8A8D98]">·</span>
                    <span>{restaurant.deliveryTime} MINS</span>
                    <span className="text-[#8A8D98]">·</span>
                    <span>{restaurant.distance || '2.4 km'}</span>
                    <span className="text-[#8A8D98]">·</span>
                    <span className="text-[#8A8D98]">Min ₹{restaurant.minOrder}</span>
                  </div>

                  {/* Signature Dish Callout */}
                  {restaurant.topDishes && restaurant.topDishes[0] && (
                    <div className="mt-2 p-3 bg-white border border-[#E2DED4] flex items-center justify-between font-mono text-xs max-w-md">
                      <div>
                        <span className="text-[10px] uppercase text-[#8A8D98] block">Signature Dish</span>
                        <span className="font-bold text-[#141518]">{restaurant.topDishes[0].name}</span>
                      </div>
                      <span className="font-bold text-[#141518]">₹{restaurant.topDishes[0].price}</span>
                    </div>
                  )}

                  <div className="pt-3">
                    <Link
                      to={`/restaurants/${restaurant.id}`}
                      className="btn-graphic-primary"
                    >
                      Explore Menu & Story →
                    </Link>
                  </div>
                </div>

                {/* Big Image Column */}
                <div
                  className={`lg:col-span-6 relative overflow-hidden group ${
                    isEven ? 'order-2 lg:order-2' : 'order-2 lg:order-1'
                  }`}
                >
                  <Link to={`/restaurants/${restaurant.id}`} className="block">
                    <img
                      src={cover}
                      alt={restaurant.name}
                      className="w-full h-[400px] sm:h-[480px] object-cover border border-[#141518] group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-[#141518] text-[#F3F0E8] font-mono text-[10px] px-2.5 py-1 uppercase tracking-wider">
                      {restaurant.isOpen ? 'Kitchen Open' : 'Prep Mode'}
                    </div>
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </section>

    </div>
  );
};
