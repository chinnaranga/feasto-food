import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { restaurantApi } from '@/services/api/restaurantApi';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { LogOut } from 'lucide-react';

interface FeastoCommandCanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeastoCommandCanvas: React.FC<FeastoCommandCanvasProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const { addToast } = useToastStore();

  const handleSignOut = async () => {
    onClose();
    await logout();
    addToast({ message: 'Signed out of Feasto successfully.', type: 'info' });
    navigate('/');
  };

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced real search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const all = await restaurantApi.getRestaurants();
        const q = query.trim().toLowerCase();
        const matches = (all || []).filter((r: any) =>
          r.name?.toLowerCase().includes(q) ||
          (Array.isArray(r.cuisine) && r.cuisine.some((c: string) => c.toLowerCase().includes(q)))
        ).slice(0, 5);
        setResults(matches);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectAction = (actionPath: string) => {
    onClose();
    navigate(actionPath);
  };

  const executeNaturalQuery = (promptText: string) => {
    onClose();
    navigate(`/restaurants?search=${encodeURIComponent(promptText)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] bg-[#141518]/90 backdrop-blur-xl flex flex-col items-center justify-start pt-20 px-4 select-none"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: -20, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#F3F0E8] text-[#141518] rounded-2xl p-6 sm:p-8 shadow-2xl border border-black/10 overflow-hidden"
          >
            {/* Header statement */}
            <div className="flex items-center justify-between pb-4 hairline-b mb-6">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#52555F]">
                  Feasto Command Layer
                </span>
                <h3 className="font-display text-2xl font-bold tracking-tight mt-0.5">
                  What's worth eating right now?
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-mono text-sm hover:bg-black hover:text-[#F3F0E8] transition-colors"
              >
                esc
              </button>
            </div>

            {/* Natural Query Input */}
            <div className="relative mb-6">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim()) {
                    executeNaturalQuery(query.trim());
                  }
                }}
                placeholder="Ask Feasto: 'Spicy biryani under ₹400', 'Crispy dosa', 'Late night dessert'..."
                className="w-full px-4 py-3.5 bg-white border border-[#E2DED4] rounded-xl text-base font-sans text-[#141518] placeholder:text-[#8A8D98] focus:outline-none focus:border-[#1B3BFF] focus:ring-2 focus:ring-[#1B3BFF]/10 transition-all"
              />
              {isSearching && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-[#8A8D98]">
                  searching...
                </span>
              )}
            </div>

            {/* Live Search Results (if user is typing) */}
            {results.length > 0 && (
              <div className="mb-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#52555F] block mb-2">
                  Matching Kitchens
                </span>
                <div className="flex flex-col gap-2">
                  {results.map((r) => (
                    <button
                      key={r.id || r._id}
                      onClick={() => handleSelectAction(`/restaurants/${r.id || r._id}`)}
                      className="flex items-center justify-between p-3 bg-white hover:bg-[#FAF8F5] border border-[#E2DED4] rounded-xl text-left transition-colors group"
                    >
                      <div>
                        <h4 className="font-heading font-bold text-sm text-[#141518] group-hover:text-[#1B3BFF] transition-colors">
                          {r.name}
                        </h4>
                        <p className="text-xs text-[#52555F]">
                          {Array.isArray(r.cuisines) ? r.cuisines.join(' · ') : r.cuisineType || 'Culinary Kitchen'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-[#141518]">
                          ★ {r.rating || '4.8'}
                        </span>
                        <span className="text-[11px] text-[#8A8D98] block">
                          {r.deliveryTime || '30'} mins
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Natural Editorial Inquiries */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#52555F] block mb-2.5">
                Suggested Intentions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => executeNaturalQuery('Spicy Biryani')}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[#E2DED4] bg-white hover:border-[#141518] hover:bg-[#FAF8F5] transition-colors text-left"
                >
                  <span className="font-sans font-medium text-[#141518]">"Dum Biryani & Kebabs"</span>
                  <span className="font-mono text-[11px] text-[#1B3BFF]">Explore →</span>
                </button>

                <button
                  onClick={() => executeNaturalQuery('Comfort Food')}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[#E2DED4] bg-white hover:border-[#141518] hover:bg-[#FAF8F5] transition-colors text-left"
                >
                  <span className="font-sans font-medium text-[#141518]">"Late night comfort food"</span>
                  <span className="font-mono text-[11px] text-[#1B3BFF]">Explore →</span>
                </button>

                <button
                  onClick={() => handleSelectAction('/orders')}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[#E2DED4] bg-white hover:border-[#141518] hover:bg-[#FAF8F5] transition-colors text-left"
                >
                  <span className="font-sans font-medium text-[#141518]">"Track active order status"</span>
                  <span className="font-mono text-[11px] text-[#141518]">Orders →</span>
                </button>

                <button
                  onClick={() => executeNaturalQuery('Artisan Bakery Desserts')}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[#E2DED4] bg-white hover:border-[#141518] hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer"
                >
                  <span className="font-sans font-medium text-[#141518]">"Artisan bakery & pastries"</span>
                  <span className="font-mono text-[11px] text-[#1B3BFF]">Explore →</span>
                </button>
              </div>

              {/* Account & Session Controls */}
              <div className="mt-4 pt-3 hairline-t flex items-center justify-between">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => handleSelectAction('/profile')}
                      className="text-xs font-mono text-[#52555F] hover:text-[#141518] flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Culinary Passport</span>
                      <span>→</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#661527]/30 bg-[#661527]/10 text-[#661527] hover:bg-[#661527] hover:text-white font-mono text-xs font-bold transition-all cursor-pointer"
                    >
                      <LogOut size={12} />
                      <span>SIGN OUT OF FEASTO</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleSelectAction('/auth/signin')}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-[#141518] text-[#D7F04A] font-mono text-xs font-bold hover:bg-black cursor-pointer"
                  >
                    <span>SIGN IN TO ACCESS PASSPORT</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
