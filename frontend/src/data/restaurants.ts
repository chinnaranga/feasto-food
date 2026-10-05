// ─── Core Types ─────────────────────────────────────────────────────────────

export type DietaryTag = 'Vegan' | 'Vegetarian' | 'Gluten Free' | 'Dairy Free' | 'Halal' | 'Keto' | 'High Protein' | 'Low Carb' | 'Healthy' | 'Omega-3' | 'Anti-inflammatory';
export type SpiceLevel = 'mild' | 'medium' | 'hot' | 'extra-hot';
export type PriceRange = 'budget' | 'mid' | 'premium';

export interface Addon {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface AddonGroup {
  id: string;
  name: string;
  required: boolean;
  maxSelections: number;
  options: Addon[];
}

export interface NutritionInfo {
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: DietaryTag[];
  aiMatch?: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  isRecommended?: boolean;
  spiceLevel?: SpiceLevel;
  cookingTime?: number; // minutes
  nutrition?: NutritionInfo;
  addonGroups?: AddonGroup[];
  isAvailable?: boolean;
  emoji?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  items: MenuItem[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: number;
  deliveryFee: number;
  minOrder: number;
  priceRange: PriceRange;
  distance: string;
  isOpen: boolean;
  hasOffers: boolean;
  offerText?: string;
  tags: string[];
  coverGradient: string;
  emoji: string;
  topDishes: MenuItem[];        // legacy: used on discovery cards
  menuCategories?: MenuCategory[]; // Stage 7: full menu
  reviews: Review[];
  aiMatchScore?: number;
}

// ─── Cuisine & Collection Data ────────────────────────────────────────────────

export const CUISINES = [
  'Japanese', 'Italian', 'Indian', 'Mediterranean', 'Mexican',
  'Chinese', 'Thai', 'American', 'Middle Eastern', 'Korean',
];

export const FEATURED_COLLECTIONS = [
  { id: 'weekend-brunch', title: 'Weekend Brunch', emoji: '🥐', description: 'Slow mornings, perfect plates', restaurantIds: ['artisan-table', 'verde-kitchen'] },
  { id: 'late-night', title: 'Late Night Cravings', emoji: '🌙', description: 'Open past midnight', restaurantIds: ['spice-route', 'la-cucina'] },
  { id: 'date-night', title: 'Date Night', emoji: '🕯️', description: 'Impress someone special', restaurantIds: ['la-cucina', 'sora-sushi'] },
  { id: 'healthy-week', title: 'Healthy Week', emoji: '💪', description: 'Fuel your best self', restaurantIds: ['verde-kitchen', 'artisan-table'] },
];

export const MOOD_SUGGESTIONS = [
  { mood: 'Comfort Food', emoji: '🫂', query: 'comforting warm dishes' },
  { mood: 'Feeling Healthy', emoji: '🥦', query: 'healthy balanced meals' },
  { mood: 'Date Night', emoji: '💫', query: 'romantic dinner options' },
  { mood: 'Quick Lunch', emoji: '⚡', query: 'fast delivery under 20 mins' },
  { mood: 'Late Night', emoji: '🌙', query: 'late night food nearby' },
  { mood: 'Post Workout', emoji: '💪', query: 'high protein muscle building' },
];

// ─── Shared Add-on Groups ─────────────────────────────────────────────────────

const SPICE_ADDON: AddonGroup = {
  id: 'spice', name: 'Spice Level', required: true, maxSelections: 1,
  options: [
    { id: 'mild', name: 'Mild', price: 0, isDefault: true },
    { id: 'medium', name: 'Medium', price: 0 },
    { id: 'hot', name: 'Hot', price: 0 },
    { id: 'extra-hot', name: 'Extra Hot 🌶🌶', price: 0 },
  ],
};

const PORTION_ADDON: AddonGroup = {
  id: 'portion', name: 'Portion Size', required: false, maxSelections: 1,
  options: [
    { id: 'regular', name: 'Regular', price: 0, isDefault: true },
    { id: 'large', name: 'Large (+₹80)', price: 80 },
  ],
};

// ─── Restaurant Data ──────────────────────────────────────────────────────────

export let MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'sora-sushi',
    name: 'Sora Sushi',
    tagline: 'Traditional Edomae-style sushi, crafted daily',
    cuisine: ['Japanese', 'Sushi'],
    rating: 4.9,
    reviewCount: 412,
    deliveryTime: 22,
    deliveryFee: 0,
    minOrder: 350,
    priceRange: 'premium',
    distance: '2.4 km',
    isOpen: true,
    hasOffers: true,
    offerText: 'Free delivery on orders ₹500+',
    tags: ['Trending', 'Elite Partner', 'Omega-3'],
    coverGradient: 'from-blue-500/10 to-indigo-600/10',
    emoji: '🍣',
    aiMatchScore: 96,
    topDishes: [
      { id: 'd1', name: 'Omakase Salmon Roll', description: 'Chef-curated 8-piece selection', price: 480, tags: ['Omega-3'], aiMatch: 97, isPopular: true, emoji: '🍣', nutrition: { calories: 320, protein: 28, carbs: 30, fat: 9 } },
      { id: 'd2', name: 'Toro Nigiri (2pc)', description: 'Bluefin fatty tuna, aged wasabi', price: 360, tags: ['Omega-3'], aiMatch: 95, emoji: '🐟', nutrition: { calories: 180, protein: 22, carbs: 12, fat: 6 } },
      { id: 'd3', name: 'Yuzu Edamame', description: 'Yuzu-salted steamed pods', price: 120, tags: ['Vegan', 'Healthy'], aiMatch: 90, emoji: '🫛', nutrition: { calories: 95, protein: 9, carbs: 8, fat: 4 } },
    ],
    menuCategories: [
      {
        id: 'chef-specials', name: "Chef's Specials", emoji: '⭐', description: 'Omakase selections from our head chef',
        items: [
          { id: 'm1', name: 'Omakase Salmon Roll', description: 'Chef-curated 8-piece selection with premium Atlantic salmon and cucumber', price: 480, tags: ['Omega-3'], aiMatch: 97, isPopular: true, isFeatured: true, spiceLevel: 'mild', cookingTime: 12, emoji: '🍣', nutrition: { calories: 320, protein: 28, carbs: 30, fat: 9 }, addonGroups: [SPICE_ADDON, PORTION_ADDON], isAvailable: true },
          { id: 'm2', name: 'Chef\'s 12-Piece Omakase', description: 'Seasonal chef\'s selection — trust the chef', price: 980, tags: ['Omega-3', 'High Protein'], aiMatch: 95, isFeatured: true, spiceLevel: 'mild', cookingTime: 18, emoji: '🍱', nutrition: { calories: 620, protein: 56, carbs: 55, fat: 18 }, isAvailable: true },
        ],
      },
      {
        id: 'nigiri', name: 'Nigiri', emoji: '🐟', description: 'Single pressed rice topped with premium fish',
        items: [
          { id: 'm3', name: 'Toro Nigiri (2pc)', description: 'Bluefin fatty tuna, aged wasabi', price: 360, tags: ['Omega-3'], aiMatch: 95, isRecommended: true, spiceLevel: 'mild', cookingTime: 5, emoji: '🐟', nutrition: { calories: 180, protein: 22, carbs: 12, fat: 6 }, isAvailable: true },
          { id: 'm4', name: 'Salmon Nigiri (2pc)', description: 'Norwegian Atlantic salmon, sushi rice', price: 280, tags: ['Omega-3', 'High Protein'], spiceLevel: 'mild', cookingTime: 5, emoji: '🍣', nutrition: { calories: 160, protein: 20, carbs: 12, fat: 5 }, isAvailable: true },
          { id: 'm5', name: 'Eel Unagi Nigiri (2pc)', description: 'Kabayaki-glazed freshwater eel', price: 420, tags: ['High Protein'], isPopular: true, spiceLevel: 'mild', cookingTime: 8, emoji: '🐡', nutrition: { calories: 230, protein: 24, carbs: 18, fat: 8 }, isAvailable: true },
        ],
      },
      {
        id: 'sides', name: 'Sides & Drinks', emoji: '🫛',
        items: [
          { id: 'm6', name: 'Yuzu Edamame', description: 'Yuzu-salted steamed pods', price: 120, tags: ['Vegan', 'Healthy'], spiceLevel: 'mild', cookingTime: 5, emoji: '🫛', nutrition: { calories: 95, protein: 9, carbs: 8, fat: 4 }, isAvailable: true },
          { id: 'm7', name: 'Miso Soup', description: 'Dashi-based white miso, wakame, tofu', price: 80, tags: ['Vegan', 'Healthy'], spiceLevel: 'mild', cookingTime: 3, emoji: '🍜', nutrition: { calories: 45, protein: 3, carbs: 6, fat: 1 }, isAvailable: true },
          { id: 'm8', name: 'Japanese Green Tea', description: 'Chilled Sencha or hot Matcha', price: 90, tags: ['Vegan', 'Healthy'], cookingTime: 2, emoji: '🍵', nutrition: { calories: 2, protein: 0, carbs: 0, fat: 0 }, isAvailable: true },
        ],
      },
    ],
    reviews: [
      { id: 'r1', author: 'Priya M.', rating: 5, comment: 'The omakase is incredible. Freshest fish in the city.', date: '2 days ago' },
      { id: 'r2', author: 'Arjun K.', rating: 5, comment: 'Premium experience, perfectly matched my dietary needs.', date: '1 week ago' },
      { id: 'r3', author: 'Leena S.', rating: 4, comment: 'Brilliant salmon nigiri. Delivery was fast and cold-pack preserved freshness.', date: '2 weeks ago' },
    ],
  },
  {
    id: 'artisan-table',
    name: 'The Artisan Table',
    tagline: 'Organic Mediterranean, farm to plate',
    cuisine: ['Mediterranean', 'Organic'],
    rating: 4.9,
    reviewCount: 230,
    deliveryTime: 18,
    deliveryFee: 0,
    minOrder: 300,
    priceRange: 'mid',
    distance: '1.2 km',
    isOpen: true,
    hasOffers: false,
    tags: ['Michelin Partner', 'Healthy', 'Organic'],
    coverGradient: 'from-amber-500/10 to-orange-400/10',
    emoji: '🥗',
    aiMatchScore: 98,
    topDishes: [
      { id: 'd4', name: 'Avocado Protein Bowl', description: 'Quinoa, avo, tempeh, tahini', price: 340, tags: ['High Protein', 'Vegan'], aiMatch: 98, emoji: '🥗', nutrition: { calories: 520, protein: 28, carbs: 45, fat: 22 } },
      { id: 'd5', name: 'Grilled Sea Bass', description: 'Lemon-caper butter, seasonal veg', price: 480, tags: ['Low Carb', 'Omega-3'], aiMatch: 94, emoji: '🐟', nutrition: { calories: 390, protein: 42, carbs: 8, fat: 18 } },
      { id: 'd6', name: 'Mezze Platter', description: 'Hummus, falafel, warm pita', price: 260, tags: ['Vegetarian'], emoji: '🫔', nutrition: { calories: 480, protein: 16, carbs: 62, fat: 20 } },
    ],
    menuCategories: [
      {
        id: 'bowls', name: 'Power Bowls', emoji: '🥗', description: 'Nutrient-dense, perfectly balanced',
        items: [
          { id: 'at1', name: 'Avocado Protein Bowl', description: 'Quinoa, avocado, tempeh, roasted chickpeas, tahini drizzle', price: 340, tags: ['High Protein', 'Vegan', 'Gluten Free'], aiMatch: 98, isPopular: true, isFeatured: true, spiceLevel: 'mild', cookingTime: 10, emoji: '🥗', nutrition: { calories: 520, protein: 28, carbs: 45, fat: 22 }, addonGroups: [PORTION_ADDON, { id: 'protein', name: 'Add Protein', required: false, maxSelections: 1, options: [{ id: 'tofu', name: 'Extra Tofu (+₹60)', price: 60 }, { id: 'eggs', name: 'Poached Eggs (+₹40)', price: 40 }] }], isAvailable: true },
          { id: 'at2', name: 'Mediterranean Grain Bowl', description: 'Farro, roasted veg, za\'atar chicken, garlic labneh', price: 380, tags: ['High Protein', 'Healthy'], isRecommended: true, spiceLevel: 'mild', cookingTime: 12, emoji: '🫙', nutrition: { calories: 580, protein: 35, carbs: 52, fat: 18 }, isAvailable: true },
          { id: 'at3', name: 'Golden Beet & Lentil Bowl', description: 'Roasted golden beets, puy lentils, pomegranate, herb oil', price: 300, tags: ['Vegan', 'Gluten Free', 'Healthy'], spiceLevel: 'mild', cookingTime: 10, emoji: '🥣', nutrition: { calories: 420, protein: 18, carbs: 58, fat: 12 }, isAvailable: true },
        ],
      },
      {
        id: 'mains', name: 'Mains', emoji: '🐟',
        items: [
          { id: 'at4', name: 'Grilled Sea Bass', description: 'Sustainably caught sea bass, lemon-caper brown butter, seasonal vegetable medley', price: 480, tags: ['Low Carb', 'Omega-3', 'Gluten Free'], aiMatch: 94, isPopular: true, spiceLevel: 'mild', cookingTime: 18, emoji: '🐟', nutrition: { calories: 390, protein: 42, carbs: 8, fat: 18 }, isAvailable: true },
          { id: 'at5', name: 'Lamb Kofta Platter', description: 'Spiced minced lamb, tzatziki, grilled flatbread, sumac onions', price: 520, tags: ['High Protein', 'Halal'], spiceLevel: 'medium', cookingTime: 20, emoji: '🫕', nutrition: { calories: 680, protein: 48, carbs: 32, fat: 36 }, isAvailable: true },
        ],
      },
      {
        id: 'starters', name: 'Starters & Sharing', emoji: '🫔',
        items: [
          { id: 'at6', name: 'Mezze Platter', description: 'Housemade hummus, crispy falafel, warm pita, tabbouleh, olives', price: 260, tags: ['Vegetarian'], spiceLevel: 'mild', cookingTime: 8, emoji: '🫔', nutrition: { calories: 480, protein: 16, carbs: 62, fat: 20 }, isAvailable: true },
          { id: 'at7', name: 'Burrata & Heirloom Tomato', description: 'Creamy burrata, heirloom tomatoes, fresh basil, aged balsamic', price: 320, tags: ['Vegetarian', 'Gluten Free'], spiceLevel: 'mild', cookingTime: 5, emoji: '🧀', nutrition: { calories: 340, protein: 14, carbs: 12, fat: 26 }, isAvailable: true },
        ],
      },
    ],
    reviews: [
      { id: 'r4', author: 'Sarah J.', rating: 5, comment: 'Feasto matched me here perfectly — exactly my macros.', date: '3 days ago' },
      { id: 'r5', author: 'Ananya T.', rating: 5, comment: 'The avocado bowl is life-changing. Comes hot and fresh every time.', date: '1 week ago' },
    ],
  },
  {
    id: 'la-cucina',
    name: 'La Cucina',
    tagline: 'Authentic Neapolitan pizzas, wood-fired perfection',
    cuisine: ['Italian', 'Pizza'],
    rating: 4.8,
    reviewCount: 185,
    deliveryTime: 28,
    deliveryFee: 49,
    minOrder: 400,
    priceRange: 'mid',
    distance: '3.1 km',
    isOpen: true,
    hasOffers: true,
    offerText: '20% off first order',
    tags: ['Feasto Exclusive', 'Date Night'],
    coverGradient: 'from-emerald-500/10 to-teal-500/10',
    emoji: '🍕',
    aiMatchScore: 91,
    topDishes: [
      { id: 'd7', name: 'Margherita DOC', description: 'San Marzano, fior di latte, basil', price: 380, tags: ['Vegetarian'], emoji: '🍕', nutrition: { calories: 620, protein: 22, carbs: 80, fat: 22 } },
      { id: 'd8', name: 'Tartufo Nero', description: 'Black truffle, cream, prosciutto', price: 520, tags: [], emoji: '🍕', nutrition: { calories: 720, protein: 26, carbs: 84, fat: 30 } },
      { id: 'd9', name: 'Tiramisu', description: 'Mascarpone, espresso, cocoa', price: 180, tags: [], emoji: '🍮', nutrition: { calories: 380, protein: 8, carbs: 42, fat: 20 } },
    ],
    menuCategories: [
      {
        id: 'pizza', name: 'Pizzas', emoji: '🍕', description: 'Wood-fired at 450°C for 90 seconds',
        items: [
          { id: 'lc1', name: 'Margherita DOC', description: 'Certified San Marzano tomato, fior di latte mozzarella, fresh basil', price: 380, tags: ['Vegetarian'], isPopular: true, spiceLevel: 'mild', cookingTime: 15, emoji: '🍕', nutrition: { calories: 620, protein: 22, carbs: 80, fat: 22 }, addonGroups: [{ id: 'extra', name: 'Extra Toppings', required: false, maxSelections: 3, options: [{ id: 'olives', name: 'Olives (+₹40)', price: 40 }, { id: 'mushroom', name: 'Mushroom (+₹50)', price: 50 }, { id: 'chilli', name: 'Chilli Flakes (+₹20)', price: 20 }] }], isAvailable: true },
          { id: 'lc2', name: 'Tartufo Nero', description: 'Black truffle, béchamel, prosciutto crudo, mozzarella', price: 520, tags: [], isFeatured: true, aiMatch: 91, spiceLevel: 'mild', cookingTime: 16, emoji: '🍕', nutrition: { calories: 720, protein: 26, carbs: 84, fat: 30 }, isAvailable: true },
          { id: 'lc3', name: 'Diavola', description: 'Spicy Calabrian salami, San Marzano, mozzarella', price: 420, tags: [], isPopular: true, spiceLevel: 'hot', cookingTime: 15, emoji: '🍕', nutrition: { calories: 680, protein: 28, carbs: 76, fat: 28 }, addonGroups: [SPICE_ADDON], isAvailable: true },
          { id: 'lc4', name: 'Quattro Formaggi', description: 'Mozzarella, gorgonzola, taleggio, parmigiano', price: 460, tags: ['Vegetarian'], spiceLevel: 'mild', cookingTime: 15, emoji: '🧀', nutrition: { calories: 780, protein: 32, carbs: 72, fat: 42 }, isAvailable: true },
        ],
      },
      {
        id: 'pasta', name: 'Pasta', emoji: '🍝',
        items: [
          { id: 'lc5', name: 'Cacio e Pepe', description: 'Tonnarelli, pecorino romano, black pepper — a Roman classic', price: 340, tags: ['Vegetarian'], isRecommended: true, spiceLevel: 'mild', cookingTime: 14, emoji: '🍝', nutrition: { calories: 580, protein: 20, carbs: 74, fat: 22 }, isAvailable: true },
          { id: 'lc6', name: 'Ragu Bolognese', description: 'Slow-cooked beef & pork ragu, fresh tagliatelle, parmigiano', price: 420, tags: [], spiceLevel: 'mild', cookingTime: 16, emoji: '🍝', nutrition: { calories: 680, protein: 36, carbs: 68, fat: 28 }, isAvailable: true },
        ],
      },
      {
        id: 'desserts', name: 'Dolci', emoji: '🍮',
        items: [
          { id: 'lc7', name: 'Tiramisu', description: 'Mascarpone cream, espresso-soaked savoiardi, cocoa dusting', price: 180, tags: ['Vegetarian'], spiceLevel: 'mild', cookingTime: 5, emoji: '🍮', nutrition: { calories: 380, protein: 8, carbs: 42, fat: 20 }, isAvailable: true },
          { id: 'lc8', name: 'Panna Cotta', description: 'Vanilla bean set cream, wild berry coulis', price: 160, tags: ['Vegetarian', 'Gluten Free'], spiceLevel: 'mild', cookingTime: 3, emoji: '🍮', nutrition: { calories: 290, protein: 6, carbs: 32, fat: 16 }, isAvailable: true },
        ],
      },
    ],
    reviews: [
      { id: 'r6', author: 'Elena R.', rating: 5, comment: 'Best pizza outside Naples. Feasto gets me.', date: '5 days ago' },
      { id: 'r7', author: 'Marco V.', rating: 5, comment: 'The cacio e pepe rivals anything in Rome. Remarkable.', date: '2 weeks ago' },
    ],
  },
  {
    id: 'spice-route',
    name: 'Spice Route',
    tagline: 'Regional Indian flavors, slow-cooked mastery',
    cuisine: ['Indian', 'Biryani'],
    rating: 4.7,
    reviewCount: 689,
    deliveryTime: 32,
    deliveryFee: 0,
    minOrder: 250,
    priceRange: 'budget',
    distance: '0.8 km',
    isOpen: true,
    hasOffers: true,
    offerText: 'Buy 2 biryanis, get 1 free raita',
    tags: ['Most Popular', 'Spicy', 'Value'],
    coverGradient: 'from-red-500/10 to-orange-500/10',
    emoji: '🍛',
    aiMatchScore: 88,
    topDishes: [
      { id: 'd10', name: 'Hyderabadi Dum Biryani', description: 'Slow-cooked aged basmati, saffron', price: 280, tags: [], emoji: '🍛', nutrition: { calories: 780, protein: 32, carbs: 98, fat: 28 } },
      { id: 'd11', name: 'Dal Makhani', description: '24-hour slow-cooked black lentils', price: 180, tags: ['Vegetarian'], emoji: '🫕', nutrition: { calories: 420, protein: 18, carbs: 52, fat: 16 } },
      { id: 'd12', name: 'Gulab Jamun (4pc)', description: 'Rose-syrup soaked milk dumplings', price: 120, tags: ['Vegetarian'], emoji: '🍡', nutrition: { calories: 320, protein: 6, carbs: 52, fat: 10 } },
    ],
    menuCategories: [
      {
        id: 'biryani', name: 'Biryanis', emoji: '🍛', description: 'Aged basmati, slow-cooked over 3 hours',
        items: [
          { id: 'sr1', name: 'Hyderabadi Dum Biryani', description: 'Slow-cooked aged basmati with saffron, fried onions, and aromatic spice bouquet', price: 280, tags: [], isPopular: true, isFeatured: true, spiceLevel: 'medium', cookingTime: 25, emoji: '🍛', nutrition: { calories: 780, protein: 32, carbs: 98, fat: 28 }, addonGroups: [SPICE_ADDON, { id: 'raita', name: 'Add Sides', required: false, maxSelections: 2, options: [{ id: 'raita', name: 'Raita (+₹40)', price: 40 }, { id: 'salan', name: 'Mirchi Salan (+₹60)', price: 60 }] }], isAvailable: true },
          { id: 'sr2', name: 'Lucknowi Awadhi Biryani', description: 'Dum-cooked with kewra water, rose, and whole spices', price: 300, tags: [], isRecommended: true, spiceLevel: 'mild', cookingTime: 25, emoji: '🍚', nutrition: { calories: 760, protein: 28, carbs: 96, fat: 26 }, isAvailable: true },
          { id: 'sr3', name: 'Veg Tahiri', description: 'Seasonal vegetables, basmati, whole spices', price: 220, tags: ['Vegetarian', 'Healthy'], spiceLevel: 'mild', cookingTime: 20, emoji: '🥘', nutrition: { calories: 560, protein: 14, carbs: 88, fat: 16 }, isAvailable: true },
        ],
      },
      {
        id: 'curries', name: 'Curries & Gravies', emoji: '🫕',
        items: [
          { id: 'sr4', name: 'Dal Makhani', description: '24-hour slow-cooked black lentils, cream, butter', price: 180, tags: ['Vegetarian'], isPopular: true, spiceLevel: 'mild', cookingTime: 10, emoji: '🫕', nutrition: { calories: 420, protein: 18, carbs: 52, fat: 16 }, isAvailable: true },
          { id: 'sr5', name: 'Butter Chicken', description: 'Tandoori chicken in tomato cream gravy', price: 260, tags: [], isPopular: true, spiceLevel: 'mild', cookingTime: 15, emoji: '🍗', nutrition: { calories: 480, protein: 34, carbs: 18, fat: 28 }, addonGroups: [SPICE_ADDON], isAvailable: true },
        ],
      },
      {
        id: 'desserts-sr', name: 'Mithai & Desserts', emoji: '🍡',
        items: [
          { id: 'sr6', name: 'Gulab Jamun (4pc)', description: 'Rose-syrup soaked milk dumplings', price: 120, tags: ['Vegetarian'], spiceLevel: 'mild', cookingTime: 5, emoji: '🍡', nutrition: { calories: 320, protein: 6, carbs: 52, fat: 10 }, isAvailable: true },
          { id: 'sr7', name: 'Kulfi Falooda', description: 'Rose kulfi, vermicelli, basil seeds', price: 150, tags: ['Vegetarian'], spiceLevel: 'mild', cookingTime: 5, emoji: '🍧', nutrition: { calories: 280, protein: 8, carbs: 42, fat: 10 }, isAvailable: true },
        ],
      },
    ],
    reviews: [
      { id: 'r8', author: 'Rohan S.', rating: 5, comment: 'The biryani is unmatched in this city.', date: '1 day ago' },
      { id: 'r9', author: 'Mehak A.', rating: 5, comment: 'Dal makhani is pure nostalgia. Fast delivery too.', date: '3 days ago' },
    ],
  },
  {
    id: 'verde-kitchen',
    name: 'Verde Kitchen',
    tagline: 'Plant-forward bowls and whole-food cooking',
    cuisine: ['Vegan', 'Healthy'],
    rating: 4.7,
    reviewCount: 178,
    deliveryTime: 20,
    deliveryFee: 0,
    minOrder: 300,
    priceRange: 'mid',
    distance: '1.5 km',
    isOpen: true,
    hasOffers: false,
    tags: ['Vegan', 'Healthy', 'Gluten Free'],
    coverGradient: 'from-green-500/10 to-lime-500/10',
    emoji: '🌱',
    aiMatchScore: 94,
    topDishes: [
      { id: 'd15', name: 'Golden Turmeric Bowl', description: 'Chickpeas, roasted veg, tahini', price: 290, tags: ['Vegan', 'Anti-inflammatory'], emoji: '🥣', nutrition: { calories: 480, protein: 18, carbs: 62, fat: 16 } },
      { id: 'd16', name: 'Acai Power Smoothie', description: 'Acai, banana, oat milk, hemp', price: 180, tags: ['High Protein', 'Vegan'], emoji: '🫐', nutrition: { calories: 280, protein: 12, carbs: 38, fat: 8 } },
    ],
    menuCategories: [
      {
        id: 'bowls-vk', name: 'Signature Bowls', emoji: '🥣', description: 'Plant-powered, nutrient-dense',
        items: [
          { id: 'vk1', name: 'Golden Turmeric Bowl', description: 'Roasted chickpeas, sweet potato, kale, tahini-turmeric dressing, pumpkin seeds', price: 290, tags: ['Vegan', 'Gluten Free', 'Anti-inflammatory'], isPopular: true, isFeatured: true, aiMatch: 96, spiceLevel: 'mild', cookingTime: 10, emoji: '🥣', nutrition: { calories: 480, protein: 18, carbs: 62, fat: 16 }, isAvailable: true },
          { id: 'vk2', name: 'Macro Balance Bowl', description: 'Brown rice, edamame, cucumber, avocado, miso-sesame drizzle', price: 310, tags: ['Vegan', 'Gluten Free', 'High Protein'], isRecommended: true, spiceLevel: 'mild', cookingTime: 10, emoji: '🥗', nutrition: { calories: 520, protein: 22, carbs: 68, fat: 20 }, isAvailable: true },
        ],
      },
      {
        id: 'drinks-vk', name: 'Smoothies & Drinks', emoji: '🫐',
        items: [
          { id: 'vk3', name: 'Acai Power Smoothie', description: 'Organic acai, banana, oat milk, hemp protein, chia', price: 180, tags: ['Vegan', 'High Protein'], spiceLevel: 'mild', cookingTime: 5, emoji: '🫐', nutrition: { calories: 280, protein: 12, carbs: 38, fat: 8 }, isAvailable: true },
          { id: 'vk4', name: 'Green Detox Juice', description: 'Kale, cucumber, celery, ginger, lemon', price: 160, tags: ['Vegan', 'Healthy', 'Gluten Free'], cookingTime: 3, emoji: '🥤', nutrition: { calories: 80, protein: 3, carbs: 18, fat: 1 }, isAvailable: true },
        ],
      },
    ],
    reviews: [
      { id: 'r10', author: 'Anika T.', rating: 5, comment: 'Best vegan spot in the city, hands down.', date: '2 days ago' },
    ],
  },
  {
    id: 'seoul-garden',
    name: 'Seoul Garden',
    tagline: 'Modern Korean BBQ and street food',
    cuisine: ['Korean', 'BBQ'],
    rating: 4.8,
    reviewCount: 324,
    deliveryTime: 25,
    deliveryFee: 29,
    minOrder: 400,
    priceRange: 'mid',
    distance: '2.0 km',
    isOpen: false,
    hasOffers: false,
    tags: ['High Protein', 'BBQ', 'Trending'],
    coverGradient: 'from-pink-500/10 to-rose-500/10',
    emoji: '🥩',
    aiMatchScore: 86,
    topDishes: [
      { id: 'd13', name: 'Galbi Platter', description: 'Marinated short ribs, kimchi', price: 560, tags: ['High Protein'], emoji: '🥩', nutrition: { calories: 820, protein: 58, carbs: 12, fat: 52 } },
      { id: 'd14', name: 'Bibimbap Bowl', description: 'Mixed rice, gochujang, fried egg', price: 320, tags: [], emoji: '🍚', nutrition: { calories: 580, protein: 24, carbs: 78, fat: 18 } },
    ],
    menuCategories: [
      {
        id: 'bbq', name: 'Korean BBQ', emoji: '🥩',
        items: [
          { id: 'sg1', name: 'Galbi Short Rib Platter', description: 'Gochujang-marinated LA-cut short ribs, house kimchi, banchan', price: 560, tags: ['High Protein', 'Halal'], isPopular: true, isFeatured: true, spiceLevel: 'medium', cookingTime: 18, emoji: '🥩', nutrition: { calories: 820, protein: 58, carbs: 12, fat: 52 }, addonGroups: [SPICE_ADDON], isAvailable: false },
          { id: 'sg2', name: 'Samgyeopsal (Pork Belly)', description: 'Thick-cut pork belly, sesame oil dip, ssam', price: 480, tags: ['High Protein'], spiceLevel: 'mild', cookingTime: 15, emoji: '🐖', nutrition: { calories: 740, protein: 46, carbs: 8, fat: 58 }, isAvailable: false },
        ],
      },
      {
        id: 'bowls-sg', name: 'Rice & Bowls', emoji: '🍚',
        items: [
          { id: 'sg3', name: 'Bibimbap Bowl', description: 'Stone-pot mixed rice, sauteed vegetables, gochujang, fried egg', price: 320, tags: [], isRecommended: true, spiceLevel: 'medium', cookingTime: 12, emoji: '🍚', nutrition: { calories: 580, protein: 24, carbs: 78, fat: 18 }, addonGroups: [SPICE_ADDON], isAvailable: false },
        ],
      },
    ],
    reviews: [
      { id: 'r11', author: 'Jin P.', rating: 5, comment: 'Authentic galbi, perfect portion sizes.', date: '4 days ago' },
    ],
  },
];
