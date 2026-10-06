import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { useAIStore } from '@/store/aiStore';
import { MOCK_RESTAURANTS } from '@/data/restaurants';

// Food Objects on the Opening Canvas
interface FoodObject {
  id: string;
  name: string;
  category: string;
  descriptor: string;
  price: number;
  image: string;
  restaurantId: string;
  restaurantName: string;
  coordinates: { x: string; y: string };
  spice: string;
}

const CANVAS_FOOD_OBJECTS: FoodObject[] = [
  {
    id: 'biryani-01',
    name: 'Dum Biryani',
    category: 'Heritage',
    descriptor: 'Slow-cooked mutton, saffron ghee, fried shallots',
    price: 340,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
    restaurantId: 'spice-route',
    restaurantName: 'Spice Route',
    coordinates: { x: '12%', y: '48%' },
    spice: 'Warm · Fragrant',
  },
  {
    id: 'pizza-02',
    name: 'Neapolitan Margherita',
    category: 'Wood-fired',
    descriptor: 'San Marzano tomatoes, buffalo mozzarella, fresh basil',
    price: 380,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=800&auto=format&fit=crop',
    restaurantId: 'la-cucina',
    restaurantName: 'La Cucina',
    coordinates: { x: '72%', y: '22%' },
    spice: 'Subtle · Herbal',
  },
  {
    id: 'dosa-03',
    name: 'Ghee Roast Dosa',
    category: 'Tiffin',
    descriptor: 'Crisp fermented crepe, tempered potato, fresh coconut chutney',
    price: 180,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=800&auto=format&fit=crop',
    restaurantId: 'spice-route',
    restaurantName: 'Spice Route',
    coordinates: { x: '24%', y: '78%' },
    spice: 'Tangy · Crisp',
  },
  {
    id: 'ramen-04',
    name: 'Tonkotsu Ramen',
    category: 'Nocturnal',
    descriptor: '18-hour bone broth, hand-pulled noodles, charred chashu',
    price: 420,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop',
    restaurantId: 'sora-sushi',
    restaurantName: 'Sora Japanese',
    coordinates: { x: '76%', y: '68%' },
    spice: 'Rich · Umami',
  },
  {
    id: 'tart-05',
    name: 'Cacao Fleur de Sel',
    category: 'Patisserie',
    descriptor: '70% Valrhona dark chocolate, Breton butter crust, Maldon salt',
    price: 260,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
    restaurantId: 'artisan-table',
    restaurantName: 'Artisan Table',
    coordinates: { x: '48%', y: '88%' },
    spice: 'Bittersweet · Silky',
  },
];

export const Home: React.FC = () => {
  const [selectedFood, setSelectedFood] = useState<FoodObject | null>(CANVAS_FOOD_OBJECTS[0]);
  const [activeDialogueStep, setActiveDialogueStep] = useState(0);
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Feasto | A Living World of Food";
  }, []);

  const handleQuickAdd = (food: FoodObject) => {
    addItem({
      cartItemId: `item_${food.id}_${Date.now()}`,
      restaurantId: food.restaurantId,
      restaurantName: food.restaurantName,
      item: {
        id: food.id,
        name: food.name,
        description: food.descriptor,
        price: food.price,
        tags: ['Healthy'],
      },
      quantity: 1,
      selectedAddons: [],
      spiceLevel: 'medium',
      specialInstructions: '',
      unitPrice: food.price,
      totalPrice: food.price,
    });
    addToast({
      message: `${food.name} added to your bag · ₹${food.price}`,
      type: 'success',
    });
  };

  return (
    <div className="w-full bg-[#F3F0E8] text-[#141518] selection:bg-[#D7F04A] selection:text-[#141518] overflow-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          1. OPENING VISUAL COMPOSITION: THE FEASTO CANVAS
          No traditional hero. Pure spatial editorial composition.
      ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] w-full flex flex-col justify-between pt-28 pb-12 px-6 sm:px-12 editorial-grid hairline-b overflow-hidden">
        
        {/* Top Spatial Context */}
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#52555F]">
          <span>01 · Opening Canvas</span>
          <span className="hidden sm:inline">Hyderabad Kitchen Archive · 17°23'N 78°28'E</span>
          <span className="text-[#141518] font-bold">FEASTO 2026</span>
        </div>

        {/* Massive Viewport Headline */}
        <div className="my-auto py-12">
          <div className="max-w-[1440px] mx-auto">
            <h1 className="editorial-display-giant select-none">
              WHAT’S<br />
              WORTH<br />
              EATING?
            </h1>

            <p className="mt-8 font-sans text-lg sm:text-2xl text-[#52555F] max-w-xl leading-relaxed">
              Food is not an algorithm. Explore real kitchens, honest regional cooking, and dishes worth leaving the house for.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link to="/restaurants" className="btn-graphic-primary">
                Explore Kitchens →
              </Link>
              <button
                onClick={() => navigate('/discover?collection=curated')}
                className="btn-graphic-ghost"
              >
                View Seasonal Archive
              </button>
            </div>

            {/* Live Autonomous AI Craving Trigger Bar */}
            <div className="mt-8 max-w-xl p-2 rounded-2xl bg-white border border-[#141518] shadow-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E07A5F]/20 text-[#E07A5F] flex items-center justify-center shrink-0">
                <Sparkles size={16} />
              </div>
              <input
                type="text"
                placeholder="Craving spicy biryani under ₹400, or healthy bowls?"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    useAIStore.getState().setIsOpen(true);
                    useAIStore.getState().sendChatMessage(e.currentTarget.value.trim());
                    e.currentTarget.value = '';
                  }
                }}
                className="w-full bg-transparent text-xs sm:text-sm font-sans focus:outline-none placeholder:text-[#8A8D98]"
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    useAIStore.getState().setIsOpen(true);
                    useAIStore.getState().sendChatMessage(input.value.trim());
                    input.value = '';
                  } else {
                    useAIStore.getState().setIsOpen(true);
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#141518] text-[#F3F0E8] hover:bg-[#D7F04A] hover:text-[#141518] transition-all font-mono text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <span>Ask AI</span>
                <span>→</span>
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <span className="text-[#8A8D98]">Instant Cravings:</span>
              {['Spicy Dum Biryani under ₹400', 'Clean Protein Bowl', 'Wood-fired Pizza'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    useAIStore.getState().setIsOpen(true);
                    useAIStore.getState().sendChatMessage(tag);
                  }}
                  className="px-2.5 py-0.5 rounded-full border border-[#DCD6C8] bg-[#FAF8F5] hover:border-[#141518] text-[#52555F] hover:text-[#141518] transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Spatial Floating Food Interactive Objects */}
        <div className="w-full max-w-[1440px] mx-auto pt-6 border-t border-[#E2DED4] grid grid-cols-2 sm:grid-cols-5 gap-3">
          {CANVAS_FOOD_OBJECTS.map((food) => {
            const isSelected = selectedFood?.id === food.id;
            return (
              <button
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className={`p-3 text-left transition-all rounded-none border ${
                  isSelected
                    ? 'bg-[#141518] text-[#F3F0E8] border-[#141518]'
                    : 'bg-[#FAF8F5] text-[#141518] border-[#E2DED4] hover:border-[#141518]'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase text-[#8A8D98] mb-1">
                  <span>{food.category}</span>
                  <span className={isSelected ? 'text-[#D7F04A]' : 'text-[#141518]'}>₹{food.price}</span>
                </div>
                <h4 className="font-heading font-bold text-xs sm:text-sm tracking-tight truncate">
                  {food.name}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Selected Food Object Live Spotlight */}
        <AnimatePresence mode="wait">
          {selectedFood && (
            <motion.div
              key={selectedFood.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 max-w-[1440px] mx-auto w-full p-4 sm:p-6 bg-white border border-[#E2DED4] flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5">
                <img
                  src={selectedFood.image}
                  alt={selectedFood.name}
                  className="w-20 h-20 object-cover border border-[#141518]"
                />
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#1B3BFF] tracking-wider font-bold">
                    {selectedFood.restaurantName} · {selectedFood.spice}
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#141518]">
                    {selectedFood.name}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#52555F] max-w-lg">
                    {selectedFood.descriptor}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="font-mono text-xl font-bold text-[#141518] mr-2">
                  ₹{selectedFood.price}
                </span>
                <button
                  onClick={() => handleQuickAdd(selectedFood)}
                  className="btn-graphic-acid flex-1 md:flex-initial"
                >
                  Add to Order +
                </button>
                <Link
                  to={`/restaurants/${selectedFood.restaurantId}`}
                  className="btn-graphic-primary flex-1 md:flex-initial"
                >
                  Visit Kitchen →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. VERTICAL EDITORIAL FEED: KITCHEN STORIES
          No cards. Large full-bleed imagery, typography & context.
      ────────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 py-24 flex flex-col gap-32">
        
        {/* Story 01 */}
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-2 font-mono text-xs text-[#52555F] flex flex-col gap-1">
            <span className="text-3xl font-bold text-[#141518]">01</span>
            <span className="uppercase tracking-widest text-[#8A8D98]">Old City Heritage</span>
            <span>Est. 1974 · Mutton Dum</span>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <h2 className="editorial-display-sub text-[#141518]">
              THE BIRYANI YOU DIDN'T KNOW YOU WANTED.
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#52555F] leading-relaxed">
              Marinated over twelve hours in stone-ground cloves, long-grain basmati sealed under dough with red-hot charcoal coals atop the degh. This is slow craft served without haste.
            </p>
            <div className="pt-4 flex items-center gap-6 font-mono text-xs">
              <span className="font-bold text-[#141518]">Spice Route</span>
              <span className="text-[#8A8D98]">4.8 ★ · 28 min</span>
              <Link to="/restaurants/spice-route" className="text-[#1B3BFF] font-bold hover:underline">
                Explore Kitchen →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200&auto=format&fit=crop"
              alt="Authentic Dum Biryani"
              className="w-full h-[460px] object-cover border border-[#141518] group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute top-4 right-4 bg-[#141518] text-[#F3F0E8] font-mono text-[10px] px-2.5 py-1 uppercase">
              Limited Portions Today
            </div>
          </div>
        </article>

        {/* Story 02: Asymmetric Inversion */}
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 order-3 lg:order-1 relative overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop"
              alt="Wood-fired Sourdough Pizza"
              className="w-full h-[460px] object-cover border border-[#141518] group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute bottom-4 left-4 bg-[#D7F04A] text-[#141518] font-mono text-[10px] px-2.5 py-1 uppercase font-bold">
              480°C Neapolitan Hearth
            </div>
          </div>

          <div className="lg:col-span-5 order-2 lg:order-2 flex flex-col gap-4">
            <h2 className="editorial-display-sub text-[#141518]">
              LATE NIGHT COMFORT: BLISTERED DOUGH & ASH.
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#52555F] leading-relaxed">
              Naturally fermented sourdough proofed for 36 hours. Thin centered, pillowy charred crust, and sweet volcanic pomodoro tomatoes from Campania. Open until 02:30 AM.
            </p>
            <div className="pt-4 flex items-center gap-6 font-mono text-xs">
              <span className="font-bold text-[#141518]">La Cucina</span>
              <span className="text-[#8A8D98]">4.9 ★ · 24 min</span>
              <Link to="/restaurants/la-cucina" className="text-[#1B3BFF] font-bold hover:underline">
                Explore Kitchen →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 order-1 lg:order-3 font-mono text-xs text-[#52555F] flex flex-col gap-1">
            <span className="text-3xl font-bold text-[#141518]">02</span>
            <span className="uppercase tracking-widest text-[#8A8D98]">Nocturnal Hearth</span>
            <span>Midnight Delivery Active</span>
          </div>
        </article>

        {/* Story 03 */}
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-2 font-mono text-xs text-[#52555F] flex flex-col gap-1">
            <span className="text-3xl font-bold text-[#141518]">03</span>
            <span className="uppercase tracking-widest text-[#8A8D98]">Coastal & Botanical</span>
            <span>Micro-Greens · Wild Catch</span>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <h2 className="editorial-display-sub text-[#141518]">
              THE INGREDIENTS ARRIVED AT DAWN.
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#52555F] leading-relaxed">
              No seed oils, no refined sugars, no factory dairy. Wild-caught ocean trout, avocado tartare, and heirloom lettuces harvested 4 hours before your bell rings.
            </p>
            <div className="pt-4 flex items-center gap-6 font-mono text-xs">
              <span className="font-bold text-[#141518]">Verde Kitchen</span>
              <span className="text-[#8A8D98]">4.9 ★ · 19 min</span>
              <Link to="/restaurants/verde-kitchen" className="text-[#1B3BFF] font-bold hover:underline">
                Explore Kitchen →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop"
              alt="Fresh Botanical Harvest"
              className="w-full h-[460px] object-cover border border-[#141518] group-hover:scale-102 transition-transform duration-500"
            />
          </div>
        </article>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. QUIET CONVERSATIONAL LAYER: INTELLIGENCE WITHOUT AI CLICHÉS
          No robot icons, no glow cards. Pure natural dialogue.
      ────────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#141518] text-[#F3F0E8] py-24 px-6 sm:px-12 hairline-t hairline-b">
        <div className="max-w-[1440px] mx-auto">
          
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D7F04A] block mb-2">
              Conversational Food Selection
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#F3F0E8]">
              You don’t need to browse 500 menus.
            </h2>
          </div>

          {/* Dialogue Surface */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Conversation Flow */}
            <div className="lg:col-span-6 flex flex-col gap-6 font-sans">
              
              {/* Turn 1 */}
              <div className="flex flex-col gap-1 p-4 bg-white/5 border-l-2 border-[#D7F04A]">
                <span className="font-mono text-[10px] text-[#8A8D98] uppercase">You</span>
                <p className="text-base text-[#F3F0E8] font-medium">
                  "I'm exhausted tonight. I need dinner for two—one vegetarian, nothing too spicy or greasy."
                </p>
              </div>

              {/* Turn 2 */}
              <div className="flex flex-col gap-1 p-4 bg-white/5 border-l-2 border-[#1B3BFF]">
                <span className="font-mono text-[10px] text-[#D7F04A] uppercase">Feasto</span>
                <p className="text-base text-[#F3F0E8] font-medium">
                  "Got it. I'd skip heavy curries tonight. Start with the charcoal roasted paneer skewers and a hand-stretched sourdough margherita from La Cucina. Light, comforting, ready in 26 minutes."
                </p>
              </div>

              {/* Direct Quick Triggers */}
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-feasto-ai', { detail: { prompt: 'Show vegetarian comfort under ₹400' } }))}
                  className="px-3 py-1.5 border border-white/20 hover:border-[#D7F04A] hover:text-[#D7F04A] transition-colors"
                >
                  "Show vegetarian comfort" →
                </button>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-feasto-ai', { detail: { prompt: 'High-protein dinner with clean ingredients' } }))}
                  className="px-3 py-1.5 border border-white/20 hover:border-[#D7F04A] hover:text-[#D7F04A] transition-colors"
                >
                  "High-protein post workout" →
                </button>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-feasto-ai', { detail: { prompt: 'Light dinner under 500 kcal' } }))}
                  className="px-3 py-1.5 border border-white/20 hover:border-[#D7F04A] hover:text-[#D7F04A] transition-colors"
                >
                  "Light dinner under 500 kcal" →
                </button>
              </div>
            </div>

            {/* Visual Recommendation Objects (Direct fulfillment) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 bg-white/5 border border-white/10 flex flex-col justify-between">
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=600&auto=format&fit=crop"
                    alt="Charcoal Paneer Skewers"
                    className="w-full h-40 object-cover mb-3"
                  />
                  <span className="font-mono text-[10px] text-[#D7F04A] uppercase">Spice Route · Vegetarian</span>
                  <h4 className="font-heading font-bold text-base mt-0.5">Charcoal Paneer Skewers</h4>
                  <p className="font-sans text-xs text-[#8A8D98] mt-1">
                    Cottage cheese steeped in yogurt, mustard oil, hung curd, charred over fire.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-[#F3F0E8]">₹280</span>
                  <button
                    onClick={() => handleQuickAdd({
                      id: 'paneer-skewers',
                      name: 'Charcoal Paneer Skewers',
                      category: 'Vegetarian',
                      descriptor: 'Cottage cheese steeped in yogurt and mustard oil',
                      price: 280,
                      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=600&auto=format&fit=crop',
                      restaurantId: 'spice-route',
                      restaurantName: 'Spice Route',
                      coordinates: { x: '0', y: '0' },
                      spice: 'Mild',
                    })}
                    className="font-mono text-xs uppercase text-[#D7F04A] font-bold hover:underline"
                  >
                    Add +
                  </button>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 flex flex-col justify-between">
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=600&auto=format&fit=crop"
                    alt="Sourdough Margherita"
                    className="w-full h-40 object-cover mb-3"
                  />
                  <span className="font-mono text-[10px] text-[#D7F04A] uppercase">La Cucina · Vegetarian</span>
                  <h4 className="font-heading font-bold text-base mt-0.5">Sourdough Margherita</h4>
                  <p className="font-sans text-xs text-[#8A8D98] mt-1">
                    Light, blistered dough with fragrant fresh basil and melted mozzarella.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-[#F3F0E8]">₹380</span>
                  <button
                    onClick={() => handleQuickAdd({
                      id: 'sourdough-margherita',
                      name: 'Sourdough Margherita',
                      category: 'Wood-fired',
                      descriptor: 'Blistered sourdough with San Marzano and fresh basil',
                      price: 380,
                      image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=600&auto=format&fit=crop',
                      restaurantId: 'la-cucina',
                      restaurantName: 'La Cucina',
                      coordinates: { x: '0', y: '0' },
                      spice: 'Mild',
                    })}
                    className="font-mono text-xs uppercase text-[#D7F04A] font-bold hover:underline"
                  >
                    Add +
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. TIME-OF-DAY CULINARY ARCHIVE & FINAL ACTION
      ────────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 py-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#52555F] block mb-2">
            The Living City Dispatch
          </span>
          <h3 className="font-display text-3xl sm:text-5xl font-bold text-[#141518]">
            34 Kitchens Firing Now.
          </h3>
          <p className="font-sans text-sm text-[#52555F] mt-2 max-w-md">
            Order verification, kitchen dispatch, and live rider tracking all updated in sub-second precision.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/restaurants" className="btn-graphic-primary">
            Browse All Restaurants →
          </Link>
          <Link to="/orders" className="btn-graphic-ghost">
            View Live Orders
          </Link>
        </div>
      </section>

    </div>
  );
};
