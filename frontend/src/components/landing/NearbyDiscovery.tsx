import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Star, 
  Navigation, 
  ChevronRight, 
  Compass, 
  Flame, 
  ShoppingBag,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { MOCK_RESTAURANTS, Restaurant } from '@/data/restaurants';

interface GeoZone {
  id: string;
  name: string;
  xPercent: number; // visual spatial coordinate percentage
  yPercent: number;
  restaurantId: string;
  cuisineTag: string;
  neighborhood: string;
}

const HYDERABAD_ZONES: GeoZone[] = [
  { id: 'z1', name: 'Spice Route', xPercent: 34, yPercent: 42, restaurantId: 'spice-route', cuisineTag: 'Biryani & Awadhi', neighborhood: 'Banjara Hills' },
  { id: 'z2', name: 'The Artisan Table', xPercent: 55, yPercent: 32, restaurantId: 'artisan-table', cuisineTag: 'Mediterranean', neighborhood: 'Jubilee Hills' },
  { id: 'z3', name: 'Sora Sushi', xPercent: 70, yPercent: 50, restaurantId: 'sora-sushi', cuisineTag: 'Edomae Sushi', neighborhood: 'Hitech City' },
  { id: 'z4', name: 'Verde Kitchen', xPercent: 46, yPercent: 68, restaurantId: 'verde-kitchen', cuisineTag: 'Plant Bowls', neighborhood: 'Madhapur' },
  { id: 'z5', name: 'La Cucina', xPercent: 24, yPercent: 60, restaurantId: 'la-cucina', cuisineTag: 'Wood-fired Pizza', neighborhood: 'Gachibowli' },
];

export const NearbyDiscovery: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<GeoZone>(HYDERABAD_ZONES[0]);
  const [activeRadius, setActiveRadius] = useState<'3km' | '5km' | '10km'>('5km');

  const activeRestaurant = MOCK_RESTAURANTS.find((r) => r.id === selectedZone.restaurantId) || MOCK_RESTAURANTS[0];

  return (
    <section className="py-20 md:py-32 bg-[#08090D] border-t border-[#1F2232] select-none text-[#F4F5F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4FD1E8] mb-2 block">
              Spatial Culinary Radar
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#F4F5F7] tracking-tight leading-[1.08] mb-3">
              Good food is closer than you think.
            </h2>
            <p className="text-sm sm:text-base text-[#A7ACB8] font-normal">
              Explore live kitchen partners clustered across Hyderabad. Click any culinary node to preview dishes, prep times, and thermal dispatch radiuses.
            </p>
          </div>

          {/* Delivery Radius Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-[#101218] border border-[#1F2232] rounded-2xl shrink-0 self-start md:self-auto shadow-xs">
            <span className="text-[11px] font-bold text-[#6F7480] px-2.5">Radius:</span>
            {(['3km', '5km', '10km'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setActiveRadius(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeRadius === r
                    ? 'bg-[#6D5EF5] text-white shadow-xs'
                    : 'text-[#A7ACB8] hover:text-[#F4F5F7]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Spatial Map Canvas & Restaurant Detail Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Spatial Grid Surface */}
          <div className="lg:col-span-7 bg-[#101218] border border-[#1F2232] rounded-3xl p-6 sm:p-8 shadow-xl relative min-h-[440px] flex flex-col justify-between overflow-hidden">
            
            {/* Top Status Strip */}
            <div className="flex items-center justify-between z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#171923] border border-[#25293A] text-[#F4F5F7] text-xs font-bold">
                <Compass size={14} className="text-[#4FD1E8]" />
                <span>Hyderabad Urban Cluster</span>
              </div>
              <span className="text-xs font-semibold text-[#6F7480]">
                5 Active Hubs in Range
              </span>
            </div>

            {/* Spatial Coordinate Map Canvas */}
            <div className="relative w-full h-[320px] sm:h-[360px] my-4 rounded-2xl bg-[#0B0D14] border border-[#1F2232] overflow-hidden flex items-center justify-center">
              
              {/* Concentric Distance Rings */}
              <div className="absolute w-[180px] h-[180px] rounded-full border border-[#6D5EF5]/20 pointer-events-none" />
              <div className="absolute w-[280px] h-[280px] rounded-full border border-[#4FD1E8]/15 pointer-events-none" />
              <div className="absolute w-[380px] h-[380px] rounded-full border border-[#6D5EF5]/10 pointer-events-none" />

              {/* Central User Location Marker */}
              <div className="absolute flex flex-col items-center pointer-events-none z-10">
                <div className="w-5 h-5 rounded-full bg-[#6D5EF5] text-white flex items-center justify-center shadow-lg shadow-[#6D5EF5]/50 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-[#4FD1E8]" />
                </div>
                <span className="mt-1 px-2 py-0.5 rounded-md bg-[#171923] border border-[#25293A] text-[#F4F5F7] text-[10px] font-extrabold uppercase tracking-wider">
                  You
                </span>
              </div>

              {/* Kitchen Spatial Markers */}
              {HYDERABAD_ZONES.map((zone) => {
                const isSelected = selectedZone.id === zone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZone(zone)}
                    style={{ left: `${zone.xPercent}%`, top: `${zone.yPercent}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none"
                    aria-label={`Select ${zone.name}`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${
                          isSelected
                            ? 'bg-[#6D5EF5] text-white ring-4 ring-[#6D5EF5]/20 shadow-lg shadow-[#6D5EF5]/30 scale-110'
                            : 'bg-[#171923] text-[#F4F5F7] border border-[#25293A] shadow-xs group-hover:scale-105'
                        }`}
                      >
                        <MapPin size={16} className={isSelected ? 'text-[#4FD1E8]' : 'text-[#A7ACB8]'} />
                      </div>
                      <span
                        className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap transition-colors ${
                          isSelected
                            ? 'bg-[#6D5EF5] text-white'
                            : 'bg-[#101218]/90 text-[#A7ACB8] border border-[#25293A] shadow-xs'
                        }`}
                      >
                        {zone.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Coordinate Bar */}
            <div className="flex flex-wrap items-center justify-between text-xs text-[#A7ACB8] pt-2 z-10">
              <span className="flex items-center gap-1.5 font-medium">
                <Navigation size={12} className="text-[#4FD1E8]" />
                Selected: <strong className="text-[#F4F5F7]">{selectedZone.neighborhood}</strong>
              </span>
              <span className="text-[#6F7480]">
                Live GPS Sync • Dispatched within {activeRadius}
              </span>
            </div>

          </div>

          {/* Right: Expandable Selected Restaurant Card Preview */}
          <div className="lg:col-span-5 bg-[#101218] border border-[#1F2232] rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4FD1E8] bg-[#171923] border border-[#25293A] px-2.5 py-1 rounded-md">
                  {selectedZone.neighborhood} Hub
                </span>
                <h3 className="text-2xl font-black text-[#F4F5F7] mt-2">
                  {activeRestaurant.name}
                </h3>
                <p className="text-xs text-[#A7ACB8] mt-0.5">
                  {activeRestaurant.tagline}
                </p>
              </div>

              <div className="text-right">
                <div className="inline-flex items-center gap-1 text-sm font-black text-[#F4F5F7] bg-[#171923] border border-[#25293A] px-2.5 py-1 rounded-xl">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  <span>{activeRestaurant.rating}</span>
                </div>
                <p className="text-[10px] text-[#6F7480] font-bold mt-1">
                  {activeRestaurant.reviewCount} reviews
                </p>
              </div>
            </div>

            {/* Key Delivery & Status Metrics */}
            <div className="grid grid-cols-3 gap-2.5 py-3 border-y border-[#1F2232] my-4 text-center">
              <div className="p-2 rounded-xl bg-[#141720]">
                <span className="text-[10px] uppercase font-bold text-[#6F7480] block">ETA</span>
                <span className="text-xs font-black text-[#F4F5F7]">{activeRestaurant.deliveryTime} mins</span>
              </div>
              <div className="p-2 rounded-xl bg-[#141720]">
                <span className="text-[10px] uppercase font-bold text-[#6F7480] block">Distance</span>
                <span className="text-xs font-black text-[#F4F5F7]">{activeRestaurant.distance}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#141720]">
                <span className="text-[10px] uppercase font-bold text-[#6F7480] block">Kitchen</span>
                <span className="text-xs font-black text-[#2DD4BF]">Open Now</span>
              </div>
            </div>

            {/* Signature Dishes Preview */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6F7480] mb-3">
                Signature Kitchen Highlights
              </p>
              <div className="space-y-2.5">
                {(activeRestaurant.topDishes || []).slice(0, 3).map((dish) => (
                  <div
                    key={dish.id}
                    className="p-3 rounded-2xl bg-[#141720] border border-[#1F2232] flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#F4F5F7]">{dish.name}</p>
                      <p className="text-[11px] text-[#A7ACB8]">{dish.description}</p>
                    </div>
                    <span className="text-xs font-black text-[#F4F5F7] shrink-0 ml-3">
                      ₹{dish.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* View Full Menu CTA */}
            <Link
              to={`/restaurants/${activeRestaurant.id}`}
              className="w-full py-3.5 rounded-2xl bg-[#6D5EF5] hover:bg-[#5B4BE8] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-[#6D5EF5]/20"
            >
              <span>Explore Kitchen & Full Menu</span>
              <ArrowRight size={14} />
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
};
