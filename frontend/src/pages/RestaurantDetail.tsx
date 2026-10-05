import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_RESTAURANTS } from '@/data/restaurants';
import type { MenuItem, MenuCategory } from '@/data/restaurants';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { useDiscoveryStore } from '@/store/discoveryStore';

export const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { restaurants: storeRestaurants } = useDiscoveryStore();
  const allRestaurants = storeRestaurants && storeRestaurants.length > 0 ? storeRestaurants : MOCK_RESTAURANTS;

  const restaurant = useMemo(() => {
    if (!id) return undefined;
    const cleanId = id.toLowerCase().trim();
    return allRestaurants.find(
      (r) =>
        r.id.toLowerCase() === cleanId ||
        r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanId ||
        r.name.toLowerCase().replace(/[^a-z0-9]+/g, '') === cleanId.replace(/[^a-z0-9]+/g, '')
    );
  }, [id, allRestaurants]);

  // Dish Customization State (Physical Dish Object)
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [selectedSpice, setSelectedSpice] = useState<'mild' | 'medium' | 'hot' | 'extra-hot'>('medium');
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  // Categories & Vertical Index
  const categories: MenuCategory[] = useMemo(() => {
    if (!restaurant) return [];
    if (restaurant.menuCategories && restaurant.menuCategories.length > 0) {
      return restaurant.menuCategories;
    }
    // Fallback: create a structured catalog from topDishes
    return [
      {
        id: 'signature',
        name: 'Signature Dishes',
        items: restaurant.topDishes || [],
      },
    ];
  }, [restaurant]);

  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0]?.id || '');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  const scrollToCategory = useCallback((catId: string) => {
    setActiveCategoryId(catId);
    const el = sectionRefs.current[catId];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const handleOpenDish = (dish: MenuItem) => {
    setSelectedDish(dish);
    setSelectedSpice(dish.spiceLevel || 'medium');
    setQuantity(1);
    setInstructions('');
  };

  const handleAddToCart = () => {
    if (!selectedDish || !restaurant) return;
    addItem({
      cartItemId: `item_${selectedDish.id}_${Date.now()}`,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      item: selectedDish,
      quantity,
      selectedAddons: [],
      spiceLevel: selectedSpice,
      specialInstructions: instructions,
      unitPrice: selectedDish.price,
      totalPrice: selectedDish.price * quantity,
    });
    addToast({
      message: `${quantity}× ${selectedDish.name} added to your order`,
      type: 'success',
    });
    setSelectedDish(null);
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#F3F0E8] flex flex-col items-center justify-center gap-4 text-[#141518] px-4">
        <span className="font-mono text-xs uppercase tracking-widest text-[#52555F]">
          404 · Unmapped Kitchen
        </span>
        <h2 className="font-display text-4xl font-bold">Kitchen Not Found</h2>
        <Link to="/restaurants" className="btn-graphic-primary mt-2">
          ← Return to All Kitchens
        </Link>
      </div>
    );
  }

  const heroImage =
    (restaurant as any).coverImage ||
    (restaurant.id === 'spice-route'
      ? 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1600&auto=format&fit=crop&q=80'
      : restaurant.id === 'la-cucina'
      ? 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&auto=format&fit=crop&q=80');

  return (
    <div className="w-full bg-[#F3F0E8] text-[#141518] selection:bg-[#D7F04A] selection:text-[#141518]">
      
      {/* ─────────────────────────────────────────────────────────────
          1. FULL-SCREEN RESTAURANT STORY OPENING
          Large photography, overlaid typography, no pastel cards.
      ────────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[70vh] min-h-[520px] overflow-hidden flex flex-col justify-between p-6 sm:p-12 text-[#F3F0E8] select-none">
        
        {/* Background Image with Cinematic Ink Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt={restaurant.name}
            className="w-full h-full object-cover filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141518] via-[#141518]/40 to-black/30" />
        </div>

        {/* Top Hairline & Coordinates */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono tracking-widest uppercase">
          <Link
            to="/restaurants"
            className="flex items-center gap-2 text-[#F3F0E8] hover:text-[#D7F04A] transition-colors"
          >
            ← Kitchen Directory
          </Link>
          <span className="hidden sm:inline text-white/70">
            {restaurant.distance || '2.4 KM'} · {restaurant.isOpen ? 'Active Now' : 'Closed for Prep'}
          </span>
          <span className="text-[#D7F04A] font-bold">FEASTO ARCHIVE</span>
        </div>

        {/* Overlaid Restaurant Story Title */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto pb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#D7F04A] block mb-2 font-bold">
            {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(' · ') : 'Culinary Kitchen'}
          </span>
          
          <h1 className="editorial-display-giant text-[#F3F0E8] mb-4">
            {restaurant.name.toUpperCase()}
          </h1>

          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-[#F3F0E8]">
            <span className="text-base font-bold text-[#D7F04A]">★ {restaurant.rating}</span>
            <span>·</span>
            <span>{restaurant.deliveryTime} MIN DELIVERY</span>
            <span>·</span>
            <span>MIN ORDER ₹{restaurant.minOrder}</span>
            <span>·</span>
            <span className="text-white/70">{restaurant.tagline}</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. EDITORIAL MENU CATALOG WITH VERTICAL INDEX
          Left: Vertical Index. Right: Physical Dish Objects.
      ────────────────────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Vertical Index (Pure Typography, No Pills) */}
        <aside className="lg:col-span-3 lg:sticky lg:top-24 flex flex-col gap-6 select-none font-mono text-xs">
          <div className="pb-3 border-b border-[#E2DED4]">
            <span className="uppercase tracking-widest text-[#8A8D98]">Menu Index</span>
          </div>

          <nav className="flex flex-col gap-3">
            {categories.map((cat, idx) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`text-left flex items-center justify-between py-1 transition-all ${
                    isActive
                      ? 'text-[#141518] font-bold pl-2 border-l-2 border-[#1B3BFF]'
                      : 'text-[#52555F] hover:text-[#141518] hover:translate-x-1'
                  }`}
                >
                  <span className="font-heading text-sm tracking-tight">
                    {cat.name.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-[#8A8D98]">
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-[#E2DED4] flex flex-col gap-2 text-[11px] text-[#52555F]">
            <span className="font-bold text-[#141518]">Kitchen Protocol</span>
            <p>Dishes prepared to order. Real-time temperature checks during courier dispatch.</p>
          </div>
        </aside>

        {/* Right Column: Editorial Catalog */}
        <main className="lg:col-span-9 flex flex-col gap-16">
          {categories.map((category) => (
            <div
              key={category.id}
              ref={(el) => {
                sectionRefs.current[category.id] = el;
              }}
              className="flex flex-col gap-6"
            >
              <div className="pb-2 border-b border-[#141518] flex items-baseline justify-between">
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#141518]">
                  {category.name}
                </h2>
                <span className="font-mono text-xs text-[#8A8D98]">
                  {category.items.length} SELECTIONS
                </span>
              </div>

              {/* Dish List as Editorial Objects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.items.map((dish) => (
                  <div
                    key={dish.id}
                    onClick={() => handleOpenDish(dish)}
                    className="p-4 bg-white border border-[#E2DED4] hover:border-[#141518] transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image & Category Tag */}
                      <div className="relative overflow-hidden mb-3 aspect-video bg-[#FAF8F5]">
                        <img
                          src={
                            (dish as any).image ||
                            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
                          }
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        {dish.tags?.includes('Vegetarian') && (
                          <span className="absolute top-2 left-2 bg-[#15803D] text-white font-mono text-[9px] px-1.5 py-0.5 uppercase font-bold">
                            VEG
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <h3 className="font-heading font-bold text-base text-[#141518] group-hover:text-[#1B3BFF] transition-colors">
                          {dish.name}
                        </h3>
                        <span className="font-mono text-sm font-bold text-[#141518] shrink-0">
                          ₹{dish.price}
                        </span>
                      </div>

                      <p className="font-sans text-xs text-[#52555F] line-clamp-2">
                        {dish.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E2DED4] flex items-center justify-between font-mono text-xs">
                      <span className="text-[#8A8D98]">
                        {dish.spiceLevel ? `Spice: ${dish.spiceLevel}` : 'Standard'}
                      </span>
                      <span className="text-[#1B3BFF] font-bold group-hover:underline">
                        CUSTOMIZE & ADD +
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. PHYSICAL DISH OBJECT DRAWER / MODAL
          Background deeply dims. Large dish image expands.
          Sensory information positioned physically around image.
      ────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-[#141518]/90 backdrop-blur-xl flex items-center justify-center p-4 select-none"
            onClick={() => setSelectedDish(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl bg-[#F3F0E8] text-[#141518] border border-black/10 rounded-2xl p-6 sm:p-8 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 overflow-hidden"
            >
              {/* Left Column: Expanded Dish Image */}
              <div className="md:col-span-6 flex flex-col justify-between">
                <div className="overflow-hidden border border-[#141518] aspect-square bg-[#FAF8F5]">
                  <img
                    src={
                      (selectedDish as any).image ||
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={selectedDish.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-[#52555F]">
                  <span>{restaurant.name} Kitchen</span>
                  <span>Authentic Recipe</span>
                </div>
              </div>

              {/* Right Column: Physical Dish Details & Customization */}
              <div className="md:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2DED4] mb-3">
                    <span className="font-mono text-[10px] uppercase text-[#1B3BFF] tracking-wider font-bold">
                      {selectedDish.tags?.join(' · ') || 'Chef Curated'}
                    </span>
                    <button
                      onClick={() => setSelectedDish(null)}
                      className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center font-mono text-sm hover:bg-black hover:text-[#F3F0E8] transition-colors"
                    >
                      ×
                    </button>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#141518]">
                    {selectedDish.name}
                  </h3>

                  <div className="font-mono text-xl font-bold text-[#141518] my-2">
                    ₹{selectedDish.price}
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-[#52555F] leading-relaxed mb-6">
                    {selectedDish.description}
                  </p>

                  {/* Physical Spice Level Selector */}
                  <div className="mb-6">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#8A8D98] block mb-2">
                      Select Spice Intensity
                    </span>
                    <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
                      {(['mild', 'medium', 'hot', 'extra-hot'] as const).map((spice) => (
                        <button
                          key={spice}
                          onClick={() => setSelectedSpice(spice)}
                          className={`py-2 text-center uppercase border transition-all ${
                            selectedSpice === spice
                              ? 'bg-[#141518] text-[#D7F04A] border-[#141518] font-bold'
                              : 'bg-white text-[#141518] border-[#E2DED4] hover:border-[#141518]'
                          }`}
                        >
                          {spice.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Special Kitchen Notes */}
                  <div className="mb-6">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#8A8D98] block mb-1">
                      Kitchen Instructions
                    </span>
                    <input
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. less oil, extra cut lemons..."
                      className="w-full px-3 py-2 bg-white border border-[#E2DED4] text-xs font-sans rounded-none focus:outline-none focus:border-[#141518]"
                    />
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="pt-4 border-t border-[#E2DED4] flex items-center gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-[#141518] font-mono text-xs">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center hover:bg-black/10 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-black/10 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Confirm Add */}
                  <button
                    onClick={handleAddToCart}
                    className="btn-graphic-acid flex-1 justify-center"
                  >
                    Add to Order · ₹{selectedDish.price * quantity} →
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
