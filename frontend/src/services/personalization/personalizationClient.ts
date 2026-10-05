import { MOCK_RESTAURANTS } from '@/data/restaurants';
import { scoreRestaurant, scoreMenuItem } from './rankingEngine';
import { PersonalizedRestaurant, PersonalizedMenuItem, TasteProfile } from '@/types/personalization';

export interface PersonalizationContext {
  explicitPreferences: TasteProfile;
  inferredCuisineAffinities: Record<string, number>;
  favorites: string[];
  dismissedRecommendationIds: string[];
  averageOrderValue: number;
}

export const personalizationClient = {
  /**
   * Generates a sorted list of recommended restaurants for the user.
   */
  getRecommendedRestaurants(
    context: PersonalizationContext,
    limit = 10
  ): PersonalizedRestaurant[] {
    const list: PersonalizedRestaurant[] = [];

    MOCK_RESTAURANTS.forEach((restaurant) => {
      // Filter out dismissed recommendations
      if (context.dismissedRecommendationIds.includes(restaurant.id)) {
        return;
      }

      const { score, reasons } = scoreRestaurant(
        restaurant,
        context.explicitPreferences,
        context.inferredCuisineAffinities,
        context.favorites,
        context.averageOrderValue
      );

      list.push({
        restaurant,
        score,
        reasons,
        isBestMatch: score >= 85,
      });
    });

    // Sort descending by match score
    return list.sort((a, b) => b.score - a.score).slice(0, limit);
  },

  /**
   * Generates a sorted list of recommended menu items.
   */
  getRecommendedMenuItems(
    context: PersonalizationContext,
    limit = 12
  ): PersonalizedMenuItem[] {
    const list: PersonalizedMenuItem[] = [];

    MOCK_RESTAURANTS.forEach((restaurant) => {
      // Skip items from dismissed restaurants
      if (context.dismissedRecommendationIds.includes(restaurant.id)) {
        return;
      }

      restaurant.cuisine.forEach(() => {}); // placeholder mapping check

      // Traverse category items
      restaurant.menuCategories?.forEach((category) => {
        category.items.forEach((item) => {
          if (context.dismissedRecommendationIds.includes(item.id)) {
            return;
          }

          const { score, reasons } = scoreMenuItem(
            item,
            restaurant,
            context.explicitPreferences,
            context.inferredCuisineAffinities,
            context.averageOrderValue
          );

          if (score > 0) {
            list.push({
              item,
              restaurantId: restaurant.id,
              restaurantName: restaurant.name,
              score,
              reasons,
            });
          }
        });
      });
    });

    // Sort descending by score
    return list.sort((a, b) => b.score - a.score).slice(0, limit);
  },

  /**
   * Generates custom recommendations under specific category tags (e.g. healthy, budget, etc.)
   */
  getThematicCollections(
    theme: 'healthy' | 'budget' | 'spicy' | 'favorites' | 'popular',
    context: PersonalizationContext,
    limit = 6
  ): PersonalizedMenuItem[] {
    const allPicks = this.getRecommendedMenuItems(context, 100);

    const filtered = allPicks.filter((pick) => {
      const tags = (pick.item.tags || []).map((t) => t.toLowerCase());
      if (theme === 'healthy') {
        return tags.includes('healthy') || tags.includes('high protein') || tags.includes('low carb');
      }
      if (theme === 'budget') {
        return pick.item.price < 220;
      }
      if (theme === 'spicy') {
        return pick.item.spiceLevel === 'hot' || pick.item.spiceLevel === 'extra-hot';
      }
      if (theme === 'favorites') {
        return context.favorites.includes(pick.restaurantId);
      }
      return pick.item.isPopular || pick.score > 70;
    });

    return filtered.slice(0, limit);
  },
};
