import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CollectionItem {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  image: string;
  restaurantCount: number;
  collectionFilter: string;
}

const SMART_COLLECTIONS: CollectionItem[] = [
  {
    id: 'comfort',
    title: "Tonight's Comfort",
    subtitle: 'Steaming dum biryanis, slow-cooked lentils & warm broths',
    tagline: 'Warmth on demand',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    restaurantCount: 14,
    collectionFilter: 'comfort',
  },
  {
    id: 'under-300',
    title: 'Under ₹300 Daily Fuel',
    subtitle: 'Hearty bowls, rolls, and thalis without budget stretch',
    tagline: 'Value without compromise',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    restaurantCount: 22,
    collectionFilter: 'budget',
  },
  {
    id: 'high-protein',
    title: 'High Protein Clean',
    subtitle: 'Macro-verified 30g+ protein bowls and grilled poultry',
    tagline: 'Fitness focused',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    restaurantCount: 11,
    collectionFilter: 'protein',
  },
  {
    id: 'late-night',
    title: 'Late Night Hyderabad',
    subtitle: 'Kitchens delivering steaming hot food past 1:00 AM',
    tagline: 'Midnight cravings',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    restaurantCount: 9,
    collectionFilter: 'late_night',
  },
  {
    id: 'wood-fired',
    title: 'Artisanal Neapolitan',
    subtitle: 'Fermented doughs, Italian san marzano, charred crusts',
    tagline: 'Craft ovens',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    restaurantCount: 8,
    collectionFilter: 'pizza',
  },
];

export const SmartCollections: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-[#08090D] border-t border-[#1F2232] select-none text-[#F4F5F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4FD1E8] mb-2 block">
              Contextual Curation
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#F4F5F7] tracking-tight leading-[1.08] mb-3">
              Smart Collections
            </h2>
            <p className="text-base text-[#A7ACB8] font-normal">
              Organized by time, mood, and biological appetite rather than generic grocery aisles.
            </p>
          </div>

          <Link
            to="/discover"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#4FD1E8] hover:text-[#6D5EF5] transition-colors"
          >
            <span>View all collections</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Horizontal Immersive Carousel */}
        <div className="flex gap-6 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory">
          {SMART_COLLECTIONS.map((col) => (
            <Link
              key={col.id}
              to={`/discover?collection=${col.collectionFilter}`}
              className="group snap-start shrink-0 w-[280px] sm:w-[340px] bg-[#101218] border border-[#1F2232] rounded-3xl overflow-hidden hover:border-[#6D5EF5]/60 hover:shadow-2xl hover:shadow-[#6D5EF5]/10 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Frame */}
              <div className="relative h-60 w-full overflow-hidden bg-[#171923]">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101218] via-black/40 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-[#101218]/90 backdrop-blur-md border border-[#25293A] text-[10px] font-extrabold uppercase tracking-wider text-[#4FD1E8] shadow-xs">
                    {col.tagline}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[11px] font-semibold text-[#A7ACB8] uppercase tracking-wider mb-1">
                    {col.restaurantCount} Kitchens Available
                  </p>
                  <h3 className="text-xl font-black text-[#F4F5F7] group-hover:text-[#4FD1E8] tracking-tight leading-tight transition-colors">
                    {col.title}
                  </h3>
                </div>
              </div>

              {/* Description Body */}
              <div className="p-5 flex items-center justify-between border-t border-[#1F2232]">
                <p className="text-xs text-[#A7ACB8] font-medium line-clamp-1 pr-3">
                  {col.subtitle}
                </p>
                <div className="w-8 h-8 rounded-full bg-[#171923] border border-[#25293A] flex items-center justify-center text-[#A7ACB8] group-hover:bg-[#6D5EF5] group-hover:text-white group-hover:border-[#6D5EF5] transition-colors shrink-0 shadow-xs">
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
