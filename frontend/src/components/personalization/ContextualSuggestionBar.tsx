import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getCurrentTimeCategory } from '@/services/personalization/rankingEngine';
import { Link } from 'react-router-dom';

export const ContextualSuggestionBar: React.FC = () => {
  const timeCat = getCurrentTimeCategory();

  const getBannerDetails = () => {
    switch (timeCat) {
      case 'breakfast':
        return {
          title: 'Start your morning right!',
          desc: 'Explore quick south Indian breakfasts, cafés, and bakeries matching your healthy preferences.',
          link: '/discover?filter=breakfast',
          linkText: 'Morning Picks',
          bg: 'from-amber-50 to-orange-50 border-amber-100 text-amber-900',
        };
      case 'lunch':
        return {
          title: 'Lunchtime cravings?',
          desc: 'Feasto Smart Match is highlighting protein-rich salads and traditional meals near you.',
          link: '/discover?filter=lunch',
          linkText: 'View Options',
          bg: 'from-blue-50 to-indigo-50 border-blue-100 text-blue-900',
        };
      case 'dinner':
        return {
          title: 'Plan a perfect dinner',
          desc: 'Check out premium-rated multicuisine tables or customized budget comfort selections.',
          link: '/discover?filter=dinner',
          linkText: 'Dinner Specials',
          bg: 'from-purple-50/50 to-pink-50/50 border-purple-100 text-purple-900',
        };
      case 'late_night':
        return {
          title: 'Late night cravings?',
          desc: 'Craving snacks, desserts, or warm pizzas? Showing late night delivery kitchens.',
          link: '/discover?filter=latenight',
          linkText: 'Late Night Hub',
          bg: 'from-[#1e293b]/5 to-[#0f172a]/5 border-slate-200 text-slate-800',
        };
    }
  };

  const banner = getBannerDetails();

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r ${banner.bg} border rounded-2xl text-left shadow-xs transition-main`}
    >
      <div className="flex items-start gap-3">
        <div className="p-1.5 bg-white/80 rounded-xl shadow-xs shrink-0 mt-0.5">
          <Sparkles size={13} className="text-brand-orange animate-pulse" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold tracking-tight">
            {banner.title}
          </h4>
          <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">
            {banner.desc}
          </p>
        </div>
      </div>
      
      <Link
        to={banner.link}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-brand-orange/5 text-[10px] font-extrabold text-brand-orange rounded-xl border border-brand-orange/20 transition-main shrink-0 cursor-pointer self-start sm:self-center uppercase tracking-wider"
      >
        <span>{banner.linkText}</span>
        <ArrowRight size={11} />
      </Link>
    </motion.div>
  );
};
