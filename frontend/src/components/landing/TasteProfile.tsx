import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, UserCheck, Flame, Compass } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { usePersonalizationStore } from '@/store/personalization/personalizationStore';

export const TasteProfile: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const { explicitPreferences, updateExplicitPreferences } = usePersonalizationStore();

  // Axis values from 10 to 90
  const [spicy, setSpicy] = useState(75);
  const [savory, setSavory] = useState(85);
  const [fresh, setFresh] = useState(60);
  const [sweet, setSweet] = useState(30);

  const [activeTags, setActiveTags] = useState<string[]>([
    'Biryani',
    'South Indian',
    'Street Food',
    'High Protein',
  ]);

  const allTags = [
    'Biryani',
    'South Indian',
    'Street Food',
    'High Protein',
    'Late Night',
    'Wood-Fired',
    'Keto / Low Carb',
    'Desserts',
    'Filter Coffee',
  ];

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <section className="py-20 md:py-32 bg-[#08090D] border-t border-[#1F2232] select-none text-[#F4F5F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4FD1E8] mb-2 block">
            Adaptive Taste Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#F4F5F7] tracking-tight leading-[1.08] mb-4">
            Feasto learns your taste.
          </h2>
          <p className="text-base sm:text-xl text-[#A7ACB8] font-normal leading-relaxed">
            Every bite you enjoy, spice you prefer, and kitchen you bookmark tunes your continuous culinary vector. Never start from scratch again.
          </p>
        </div>

        {/* Visual Taste Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: 4-Axis Interactive Taste Compass */}
          <div className="lg:col-span-6 bg-[#101218] border border-[#1F2232] rounded-3xl p-8 sm:p-10 shadow-xl relative flex flex-col items-center justify-center min-h-[440px]">
            
            <div className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider text-[#6F7480]">
              Interactive Taste Map
            </div>

            {/* Compass Visualization */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center my-6">
              
              {/* Concentric Guide Circles */}
              <div className="absolute w-full h-full rounded-full border border-dashed border-[#25293A]" />
              <div className="absolute w-3/4 h-3/4 rounded-full border border-dashed border-[#25293A]" />
              <div className="absolute w-1/2 h-1/2 rounded-full border border-[#25293A]" />

              {/* Cross Axis Lines */}
              <div className="absolute w-full h-px bg-[#1F2232]" />
              <div className="absolute h-full w-px bg-[#1F2232]" />

              {/* Labels */}
              <span className="absolute -top-3 text-[11px] font-black uppercase tracking-wider text-[#F4F5F7] bg-[#101218] px-2">
                SPICY ({spicy}%)
              </span>
              <span className="absolute -bottom-3 text-[11px] font-black uppercase tracking-wider text-[#F4F5F7] bg-[#101218] px-2">
                SWEET ({sweet}%)
              </span>
              <span className="absolute -left-3 text-[11px] font-black uppercase tracking-wider text-[#F4F5F7] bg-[#101218] px-2 -translate-x-full">
                SAVORY ({savory}%)
              </span>
              <span className="absolute -right-3 text-[11px] font-black uppercase tracking-wider text-[#F4F5F7] bg-[#101218] px-2 translate-x-full">
                FRESH ({fresh}%)
              </span>

              {/* Polygon Shape representing the Taste Coordinates */}
              <svg className="w-full h-full absolute inset-0 overflow-visible pointer-events-none">
                <polygon
                  points={`
                    160,${160 - (spicy / 100) * 110}
                    ${160 + (fresh / 100) * 110},160
                    160,${160 + (sweet / 100) * 110}
                    ${160 - (savory / 100) * 110},160
                  `}
                  fill="rgba(109, 94, 245, 0.2)"
                  stroke="#6D5EF5"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Center Dot */}
              <div className="w-3.5 h-3.5 rounded-full bg-[#4FD1E8] shadow-md shadow-[#4FD1E8]/50 z-10" />
            </div>

            <p className="text-xs text-[#6F7480] text-center max-w-xs mt-2">
              Continuous vector calibrated across 4 primary flavor axes.
            </p>
          </div>

          {/* Right: Taste Preferences & Auth State */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171923] border border-[#25293A] text-[#4FD1E8] text-xs font-bold mb-4">
                <Flame size={14} className="text-[#6D5EF5]" />
                <span>Preferred Flavor Clusters</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#F4F5F7] mb-3 tracking-tight">
                Surrounding Cravings & Habits
              </h3>
              <p className="text-sm text-[#A7ACB8] mb-6 leading-relaxed">
                Tap cuisines and dining styles to calibrate your profile. Feasto weights menus according to your true eating habits.
              </p>

              {/* Preference Tags */}
              <div className="flex flex-wrap gap-2.5 mb-8">
                {allTags.map((tag) => {
                  const isSelected = activeTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-[#6D5EF5] text-white shadow-md shadow-[#6D5EF5]/20'
                          : 'bg-[#101218] text-[#A7ACB8] border border-[#1F2232] hover:border-[#6D5EF5]/50 hover:text-[#F4F5F7]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Auth-Guarded Profile State */}
            <div className="bg-[#101218] border border-[#1F2232] rounded-3xl p-6 sm:p-7 shadow-xl">
              {isAuthenticated ? (
                <div>
                  <div className="flex items-center gap-2 text-[#2DD4BF] text-xs font-bold mb-1">
                    <UserCheck size={16} />
                    <span>Logged In Profile: {user?.name || user?.email}</span>
                  </div>
                  <p className="text-xs text-[#A7ACB8] mb-4">
                    Your taste preferences are actively syncing with your saved orders.
                  </p>
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#6D5EF5] hover:bg-[#5B4BE8] text-white text-xs font-bold transition-colors shadow-md shadow-[#6D5EF5]/20"
                  >
                    <span>Manage Full Taste Profile</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 text-[#F4F5F7] text-sm font-black mb-1">
                    <Sparkles size={16} className="text-[#A78BFA]" />
                    <span>Personal Taste Vector Unlocked for Members</span>
                  </div>
                  <p className="text-xs text-[#A7ACB8] mb-5 leading-relaxed">
                    Build your permanent profile once. We remember your favorite spice thresholds, late-night spots, and dietary exclusions across all devices.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/signup"
                      className="px-6 py-3 rounded-2xl bg-[#6D5EF5] hover:bg-[#5B4BE8] text-white text-xs font-bold transition-colors shadow-md shadow-[#6D5EF5]/20"
                    >
                      Build My Taste Profile
                    </Link>
                    <Link
                      to="/signin"
                      className="px-5 py-3 rounded-2xl bg-[#171923] hover:bg-[#1F2232] text-[#F4F5F7] border border-[#25293A] text-xs font-bold transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
