import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface Testimonial {
  author: string;
  neighborhood: string;
  quote: string;
  favoriteDish: string;
  rating: number;
}

const VERIFIED_DINERS: Testimonial[] = [
  {
    author: 'Priya M.',
    neighborhood: 'Jubilee Hills',
    quote: 'Instead of spending 20 minutes debating what to order, I typed what we were craving and it surfaced the exact biryani and raita we needed.',
    favoriteDish: 'Hyderabadi Dum Biryani',
    rating: 5,
  },
  {
    author: 'Arjun K.',
    neighborhood: 'Hitech City',
    quote: 'The macro tracking and clean ingredient filtering is phenomenal. My power bowl arrived steaming hot in 19 minutes right at my desk.',
    favoriteDish: 'Avocado Protein Power Bowl',
    rating: 5,
  },
  {
    author: 'Rohan S.',
    neighborhood: 'Banjara Hills',
    quote: 'Authentic wood-fired crust. Feasto connects with actual artisanal kitchens rather than bulk cloud kitchens cutting corners.',
    favoriteDish: 'Margherita DOC',
    rating: 5,
  },
];

export const FinalDiscoveryCTA: React.FC = () => {
  const navigate = useNavigate();
  const [finalQuery, setFinalQuery] = useState('');

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalQuery.trim()) {
      navigate('/discover');
      return;
    }
    navigate(`/discover?q=${encodeURIComponent(finalQuery.trim())}`);
  };

  return (
    <section className="py-20 md:py-32 bg-[#08090D] border-t border-[#1F2232] select-none text-[#F4F5F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Social Proof / Genuine Trust */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4FD1E8] mb-2 block">
              Diner Voices
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F4F5F7] tracking-tight">
              Loved by discerning food lovers.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VERIFIED_DINERS.map((diner, idx) => (
              <div
                key={idx}
                className="bg-[#101218] border border-[#1F2232] rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {Array.from({ length: diner.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm text-[#A7ACB8] leading-relaxed font-medium mb-6">
                    "{diner.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1F2232] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#F4F5F7]">{diner.author}</p>
                    <p className="text-[#6F7480] text-[11px]">{diner.neighborhood}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#171923] border border-[#25293A] text-[#4FD1E8] font-semibold text-[11px]">
                    {diner.favoriteDish}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Conversational CTA Box */}
        <div className="bg-[#101218] border border-[#1F2232] text-white rounded-3xl p-8 sm:p-14 md:p-16 relative overflow-hidden text-center max-w-4xl mx-auto shadow-2xl">
          
          {/* Subtle Ambient Glow */}
          <div 
            className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-3xl opacity-35"
            style={{
              background: 'radial-gradient(circle, rgba(109, 94, 245, 0.45) 0%, rgba(79, 209, 232, 0.2) 50%, transparent 70%)',
            }}
          />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171923] text-[#4FD1E8] text-xs font-bold mb-4 border border-[#25293A]">
              <Sparkles size={12} />
              <span>Real-Time Culinary Companion</span>
            </span>

            <h3 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-[#F4F5F7]">
              Still deciding? Tell Feasto what you want.
            </h3>
            
            <p className="text-[#A7ACB8] text-sm sm:text-base max-w-xl mx-auto mb-8 font-normal leading-relaxed">
              Skip the scroll fatigue. Describe what sounds good right now, and let Feasto arrange the rest.
            </p>

            <form
              onSubmit={handleFinalSubmit}
              className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2 bg-[#0B0D14] border border-[#25293A] p-2 rounded-2xl backdrop-blur-md"
            >
              <input
                type="text"
                value={finalQuery}
                onChange={(e) => setFinalQuery(e.target.value)}
                placeholder="e.g. Mild chicken curry or paneer tikka bowl under ₹400..."
                className="w-full px-4 py-3 bg-transparent text-sm text-[#F4F5F7] placeholder-[#6F7480] focus:outline-none"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#6D5EF5] hover:bg-[#5B4BE8] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shrink-0 shadow-md shadow-[#6D5EF5]/25"
              >
                <span>Find Dinner</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
