import { aiApi, AIDiscoveryResponse, AIRecommendedFoodCard } from '../api/aiApi';
import type { MenuItem, DietaryTag, SpiceLevel } from '@/data/restaurants';

export interface CravingIntent {
  rawQuery: string;
  detectedTags: string[];
  spicePreference?: 'mild' | 'medium' | 'hot';
  dietary?: string[];
  maxBudget?: number;
  mood?: string;
  isNearby?: boolean;
}

export interface RecommendedFoodCard {
  id: string;
  name: string;
  restaurantId: string;
  restaurantName: string;
  image: string;
  price: number;
  rating: number;
  deliveryTime: number;
  distance: string;
  dietaryTags: string[];
  description: string;
  matchReason: string;
  menuItem: MenuItem;
}

export interface FoodDiscoveryResponse {
  intent: CravingIntent;
  recommendations: RecommendedFoodCard[];
  reasoning: string;
  confidenceMessage: string;
  executionMode?: 'nemotron_live' | 'deterministic_fallback';
}

class AiFoodDiscoveryService {
  /**
   * Translates natural language cravings into real dishes using NVIDIA Nemotron 3 Ultra backend.
   */
  async parseCraving(prompt: string): Promise<FoodDiscoveryResponse> {
    try {
      const apiRes: AIDiscoveryResponse = await aiApi.discover({ prompt: prompt.trim() });

      const mappedRecommendations: RecommendedFoodCard[] = apiRes.recommendations.map((item: AIRecommendedFoodCard) => {
        const menuItem: MenuItem = {
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          tags: (item.dietaryTags as DietaryTag[]) || [],
          spiceLevel: (item.spiceLevel as SpiceLevel) || 'medium',
          isPopular: true,
          isRecommended: true,
          isAvailable: true,
          cookingTime: item.deliveryTime,
          nutrition: item.nutrition
            ? {
                calories: item.nutrition.calories || 450,
                protein: item.nutrition.protein || 24,
                carbs: item.nutrition.carbs || 50,
                fat: item.nutrition.fat || 15,
              }
            : undefined,
        };

        return {
          id: item.id,
          name: item.name,
          restaurantId: item.restaurantId,
          restaurantName: item.restaurantName,
          image: item.image,
          price: item.price,
          rating: item.rating,
          deliveryTime: item.deliveryTime,
          distance: item.distance || '2.2 km',
          dietaryTags: item.dietaryTags,
          description: item.description,
          matchReason: item.matchReason,
          menuItem,
        };
      });

      return {
        intent: {
          rawQuery: apiRes.intent.rawQuery,
          detectedTags: apiRes.intent.detectedTags,
          spicePreference: apiRes.intent.spicePreference ?? undefined,
          dietary: apiRes.intent.dietaryTags,
          maxBudget: apiRes.intent.maxBudget ?? undefined,
          mood: apiRes.intent.mood ?? undefined,
          isNearby: true,
        },
        recommendations: mappedRecommendations,
        reasoning: apiRes.reasoning,
        confidenceMessage: apiRes.confidenceMessage,
        executionMode: apiRes.executionMode,
      };
    } catch (err) {
      console.warn('[Feasto AI] Backend discovery fallback triggered:', err);
      return this.localGracefulFallback(prompt);
    }
  }

  /**
   * Graceful fallback if backend is momentarily unreachable.
   */
  private localGracefulFallback(prompt: string): FoodDiscoveryResponse {
    const isVeg = prompt.toLowerCase().includes('veg');
    const isSpicy = prompt.toLowerCase().includes('spicy') || prompt.toLowerCase().includes('biryani');

    const fallbackDish: RecommendedFoodCard = {
      id: isVeg ? 'dish-dal-makhani-02' : 'dish-hyd-biryani-01',
      name: isVeg ? 'Dal Makhani Royale' : 'Hyderabadi Dum Biryani',
      restaurantId: 'rest-spice-route',
      restaurantName: 'Spice Route Kitchen',
      image: isVeg
        ? 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      price: isVeg ? 280 : 340,
      rating: 4.9,
      deliveryTime: 25,
      distance: '1.8 km',
      dietaryTags: isVeg ? ['Vegetarian', 'High Protein'] : ['Halal', 'Signature', 'Spicy'],
      description: isVeg
        ? 'Black lentils slow simmered overnight over wood charcoal with fresh churned white butter.'
        : 'Slow-cooked aged Basmati rice with whole fragrant spices and tender marinated cuts.',
      matchReason: isVeg ? '100% Vegetarian comforting richness' : 'Classic wood-smoked preparation with warm cardamom & mace',
      menuItem: {
        id: isVeg ? 'dish-dal-makhani-02' : 'dish-hyd-biryani-01',
        name: isVeg ? 'Dal Makhani Royale' : 'Hyderabadi Dum Biryani',
        description: isVeg ? 'Black lentils slow simmered overnight' : 'Slow-cooked aged Basmati rice',
        price: isVeg ? 280 : 340,
        tags: isVeg ? ['Vegetarian'] : ['Halal'],
        spiceLevel: isSpicy ? 'hot' : 'medium',
        isPopular: true,
      },
    };

    return {
      intent: {
        rawQuery: prompt,
        detectedTags: [isVeg ? 'Vegetarian' : 'Chef Special', isSpicy ? 'Spicy' : 'Balanced'],
        isNearby: true,
      },
      recommendations: [fallbackDish],
      reasoning: 'Curated specialty dish matching your immediate craving.',
      confidenceMessage: 'Locally cached kitchen specialty',
      executionMode: 'deterministic_fallback',
    };
  }
}

export const aiFoodDiscoveryService = new AiFoodDiscoveryService();
