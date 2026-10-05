import { Restaurant, MenuItem } from '@/data/restaurants';

export type RecommendationCategory =
  | 'dietary'
  | 'budget'
  | 'recency'
  | 'time_of_day'
  | 'cuisine_affinity'
  | 'popularity'
  | 'favorites';

export interface RecommendationReason {
  category: RecommendationCategory;
  text: string;
}

export interface TasteProfile {
  spiceTolerance: 'mild' | 'medium' | 'hot' | 'any';
  preferredTimeOfDay: 'breakfast' | 'lunch' | 'dinner' | 'late_night' | 'any';
  pricePreference: 'budget' | 'mid-range' | 'premium' | 'any';
  strictDietary: boolean;
}

export interface PersonalizationProfile {
  explicitPreferences: TasteProfile;
  inferredCuisineAffinities: Record<string, number>; // cuisine tag -> score (0 to 100)
  dismissedRecommendationIds: string[]; // item or restaurant IDs that should be hidden
  lastOrderedCuisines: string[];
  averageOrderValue: number;
}

export interface PersonalizedRestaurant {
  restaurant: Restaurant;
  score: number; // 0 to 100
  reasons: RecommendationReason[];
  isBestMatch: boolean;
}

export interface PersonalizedMenuItem {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
  score: number; // 0 to 100
  reasons: RecommendationReason[];
}

export default TasteProfile;
