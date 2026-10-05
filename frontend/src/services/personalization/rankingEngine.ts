import { Restaurant, MenuItem } from '@/data/restaurants';
import { TasteProfile, RecommendationReason } from '@/types/personalization';

// Helper to determine the current time category
export function getCurrentTimeCategory(): 'breakfast' | 'lunch' | 'dinner' | 'late_night' {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 16) return 'lunch';
  if (hour >= 16 && hour < 22) return 'dinner';
  return 'late_night';
}

/**
 * Calculates a matching score between 0 and 100 for a given restaurant.
 */
export function scoreRestaurant(
  restaurant: Restaurant,
  explicitPreferences: TasteProfile,
  inferredCuisineAffinities: Record<string, number>,
  favorites: string[],
  averageOrderValue: number
): { score: number; reasons: RecommendationReason[] } {
  let score = 55; // Base score
  const reasons: RecommendationReason[] = [];

  // 1. Favorites Boost
  if (favorites.includes(restaurant.id)) {
    score += 25;
    reasons.push({
      category: 'favorites',
      text: 'Surfaced because it is in your saved kitchens list',
    });
  }

  // 2. Cuisine Affinity Match
  let maxCuisineAffinity = 0;
  let matchedCuisine = '';
  restaurant.cuisine.forEach((c) => {
    const affinity = inferredCuisineAffinities[c] || 0;
    if (affinity > maxCuisineAffinity) {
      maxCuisineAffinity = affinity;
      matchedCuisine = c;
    }
  });

  if (maxCuisineAffinity > 0) {
    const boost = Math.round((maxCuisineAffinity / 100) * 15);
    score += boost;
    reasons.push({
      category: 'cuisine_affinity',
      text: `Matches your interest in ${matchedCuisine} cuisine (${maxCuisineAffinity}% affinity)`,
    });
  }

  // 3. Explicit Dietary Check
  // Check if restaurant is vegetarian/vegan/healthy friendly based on its tags/cuisines
  const isVegFriendly = (restaurant.tags || []).some(t => ['vegetarian', 'vegan', 'pure veg'].includes(t.toLowerCase())) ||
                        (restaurant.cuisine || []).some(c => ['pure veg', 'south indian', 'north indian'].includes(c.toLowerCase()));
  const isHealthyFriendly = (restaurant.tags || []).some(t => ['healthy', 'salad', 'organic'].includes(t.toLowerCase()));

  if (explicitPreferences.strictDietary) {
    // If strict dietary rules are active, verify check
    const matchesAnyExplicit = isVegFriendly || isHealthyFriendly;
    if (!matchesAnyExplicit) {
      score -= 30; // Strong penalty
    }
  }

  // Add reason if they explicitly have dietary settings
  if (isVegFriendly && (explicitPreferences.strictDietary || (restaurant.tags || []).includes('pure veg'))) {
    score += 10;
    reasons.push({
      category: 'dietary',
      text: 'Offers extensive vegetarian options matching your preferences',
    });
  }

  // 4. Budget & Price Preference Matching
  const tier = explicitPreferences.pricePreference;
  if (tier && tier !== 'any') {
    const mappedTier = tier === 'mid-range' ? 'mid' : tier;
    if (restaurant.priceRange === mappedTier) {
      score += 12;
      reasons.push({
        category: 'budget',
        text: `Fits your preferred budget tier (${tier})`,
      });
    } else {
      score -= 8; // slight penalty for mismatch
    }
  } else if (averageOrderValue > 0) {
    // Inferred budget match based on average order values
    if (averageOrderValue < 300 && restaurant.priceRange === 'budget') {
      score += 10;
      reasons.push({
        category: 'budget',
        text: 'Matches your typical low-cost budget comfort range',
      });
    } else if (averageOrderValue > 600 && restaurant.priceRange === 'premium') {
      score += 10;
      reasons.push({
        category: 'budget',
        text: 'Highly aligned with your premium ordering preferences',
      });
    }
  }

  // 5. Time-of-Day relevance
  const timeCat = getCurrentTimeCategory();
  const lowerTags = (restaurant.tags || []).map(t => t.toLowerCase());
  
  if (timeCat === 'late_night' && (lowerTags.includes('late night') || lowerTags.includes('fast food') || lowerTags.includes('pizza'))) {
    score += 15;
    reasons.push({
      category: 'time_of_day',
      text: 'Good choice for late-night food delivery',
    });
  } else if (timeCat === 'breakfast' && (lowerTags.includes('breakfast') || lowerTags.includes('cafe') || lowerTags.includes('bakery'))) {
    score += 15;
    reasons.push({
      category: 'time_of_day',
      text: 'Perfect option for morning breakfast and snacks',
    });
  }

  // 6. Rating relevance
  if (restaurant.rating >= 4.5) {
    score += 10;
    // Add popularity reason only if we don't have too many reasons
    if (reasons.length < 2) {
      reasons.push({
        category: 'popularity',
        text: `Highly rated kitchen with a ${restaurant.rating} ★ star score`,
      });
    }
  }

  // Normalize final score between 0 and 100
  const finalScore = Math.max(0, Math.min(100, score));

  // Add default reason if empty
  if (reasons.length === 0) {
    reasons.push({
      category: 'popularity',
      text: 'Popular match with active delivery services near you',
    });
  }

  return { score: finalScore, reasons };
}

/**
 * Calculates a matching score between 0 and 100 for an individual menu item.
 */
export function scoreMenuItem(
  item: MenuItem,
  restaurant: Restaurant,
  explicitPreferences: TasteProfile,
  inferredCuisineAffinities: Record<string, number>,
  averageOrderValue: number
): { score: number; reasons: RecommendationReason[] } {
  let score = 50; // Base score
  const reasons: RecommendationReason[] = [];

  // Inherit some score attributes from the parent restaurant's general cuisine affinity
  let hasCuisineMatch = false;
  let matchedCuisineName = '';
  restaurant.cuisine.forEach((c) => {
    const affinity = inferredCuisineAffinities[c] || 0;
    if (affinity > 30) {
      score += Math.round((affinity / 100) * 10);
      hasCuisineMatch = true;
      matchedCuisineName = c;
    }
  });

  if (hasCuisineMatch && matchedCuisineName) {
    reasons.push({
      category: 'cuisine_affinity',
      text: `Aligned with your preferred taste in ${matchedCuisineName}`,
    });
  }

  // 1. Explicit Dietary Filter compliance check
  const itemTags = (item.tags || []).map(t => t.toLowerCase());

  if (explicitPreferences.strictDietary) {
    const vegetarianActive = itemTags.includes('vegetarian') || itemTags.includes('vegan');
    if (!vegetarianActive) {
      score = 0; // Strict drop
      return { score: 0, reasons: [] };
    }
  }

  // Add dietary match boosts
  const healthyBoost = itemTags.includes('healthy') || itemTags.includes('high protein') || itemTags.includes('low carb');
  if (healthyBoost) {
    score += 15;
    reasons.push({
      category: 'dietary',
      text: 'Great low-calorie/high-protein fit for healthy eating habits',
    });
  }

  // 2. Spice tolerance checks
  const spice = item.spiceLevel;
  if (spice) {
    const preference = explicitPreferences.spiceTolerance;
    if (preference === 'mild' && (spice === 'hot' || spice === 'extra-hot')) {
      score -= 25; // severe mismatch
    } else if (preference === 'hot' && (spice === 'hot' || spice === 'extra-hot')) {
      score += 15;
      reasons.push({
        category: 'cuisine_affinity',
        text: 'Matches your preferences for spicy dishes',
      });
    } else if (preference === 'mild' && spice === 'mild') {
      score += 12;
      reasons.push({
        category: 'cuisine_affinity',
        text: 'Mild choice matching your spice preferences',
      });
    }
  }

  // 3. Time of Day relevance
  const timeCat = getCurrentTimeCategory();
  const itemCategoryTags = item.description.toLowerCase() + ' ' + item.name.toLowerCase();
  
  if (timeCat === 'breakfast') {
    if (itemCategoryTags.includes('idli') || itemCategoryTags.includes('dosa') || itemCategoryTags.includes('pancake') || itemCategoryTags.includes('omelette') || itemCategoryTags.includes('chai') || itemCategoryTags.includes('coffee')) {
      score += 20;
      reasons.push({
        category: 'time_of_day',
        text: 'Top rated pick for your morning breakfast cravings',
      });
    }
  } else if (timeCat === 'late_night') {
    if (itemCategoryTags.includes('dessert') || itemCategoryTags.includes('burger') || itemCategoryTags.includes('fries') || itemCategoryTags.includes('pizza') || itemCategoryTags.includes('waffle') || itemCategoryTags.includes('shake')) {
      score += 20;
      reasons.push({
        category: 'time_of_day',
        text: 'Highly ordered snack for late-night cravings',
      });
    }
  }

  // 4. Budget fit relevance
  if (explicitPreferences.pricePreference === 'budget' && item.price < 250) {
    score += 10;
    reasons.push({
      category: 'budget',
      text: 'Matches your budget-friendly price preference',
    });
  } else if (averageOrderValue > 0) {
    // If item price fits perfectly in their average order budget
    const targetSingleItemPrice = averageOrderValue / 2;
    const priceDifferenceRatio = Math.abs(item.price - targetSingleItemPrice) / targetSingleItemPrice;
    if (priceDifferenceRatio < 0.25) {
      score += 8;
    }
  }

  // 5. Popularity boost
  if (item.isPopular) {
    score += 10;
    if (reasons.length < 2) {
      reasons.push({
        category: 'popularity',
        text: 'Highly rated popular choice among Feasto diners',
      });
    }
  }

  const finalScore = Math.max(0, Math.min(100, score));
  
  if (reasons.length === 0) {
    reasons.push({
      category: 'popularity',
      text: 'Highly recommended dish from this kitchen',
    });
  }

  return { score: finalScore, reasons };
}
