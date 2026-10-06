import mongoose, { Types } from 'mongoose';
import { User } from '../../users/user.model.js';
import { UserPreferences } from '../../users/models/userPreferences.model.js';
import { Favorite } from '../../users/models/favorite.model.js';
import { Order, IOrderDocument } from '../../orders/orders.model.js';
import { Restaurant } from '../../restaurants/restaurants.model.js';
import { MenuItem } from '../../menus/models/menuItem.model.js';
import { logger } from '../../../shared/utils/logger.js';

export interface AIContextSnapshot {
  user?: {
    id: string;
    name: string;
    dietaryPreferences: string[];
    preferredSpice?: string;
  };
  timeContext: {
    currentTime: string;
    dayOfWeek: string;
    mealWindow: 'breakfast' | 'lunch' | 'dinner' | 'late_night' | 'snack';
  };
  recentOrderDishes: string[];
  favoriteRestaurantIds: string[];
  openRestaurantsCount: number;
}

export class ContextService {
  /**
   * Determine the current culinary time window.
   */
  public getMealWindow(): 'breakfast' | 'lunch' | 'dinner' | 'late_night' | 'snack' {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 16) return 'lunch';
    if (hour >= 16 && hour < 19) return 'snack';
    if (hour >= 19 && hour < 23) return 'dinner';
    return 'late_night';
  }

  /**
   * Build unified context for a user or guest.
   */
  public async buildUserContext(userId?: string): Promise<AIContextSnapshot> {
    const mealWindow = this.getMealWindow();
    const timeContext = {
      currentTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      mealWindow,
    };

    const isConnected = mongoose.connection.readyState === 1;

    if (!userId || !Types.ObjectId.isValid(userId) || !isConnected) {
      const openRestaurantsCount = isConnected
        ? await Restaurant.countDocuments({
            operationalStatus: 'open',
            isDeleted: false,
          }).catch(() => 4)
        : 4;

      return {
        timeContext,
        recentOrderDishes: [],
        favoriteRestaurantIds: [],
        openRestaurantsCount,
      };
    }

    try {
      const [userDoc, prefsDoc, recentOrders, favorites, openCount] = await Promise.all([
        User.findById(userId).select('name email').lean(),
        UserPreferences.findOne({ userId }).lean(),
        Order.find({ customerId: new Types.ObjectId(userId) })
          .sort({ createdAt: -1 })
          .limit(10)
          .select('items')
          .lean(),
        Favorite.find({ userId: new Types.ObjectId(userId), entityType: 'restaurant' })
          .select('entityId')
          .lean(),
        Restaurant.countDocuments({ operationalStatus: 'open', isDeleted: false }),
      ]);

      const recentDishes: string[] = [];
      recentOrders.forEach((o) => {
        o.items?.forEach((i) => {
          if (i.itemName && !recentDishes.includes(i.itemName)) {
            recentDishes.push(i.itemName);
          }
        });
      });

      return {
        user: userDoc
          ? {
              id: String(userDoc._id),
              name: userDoc.name,
              dietaryPreferences: prefsDoc?.dietary || [],
            }
          : undefined,
        timeContext,
        recentOrderDishes: recentDishes.slice(0, 10),
        favoriteRestaurantIds: favorites.map((f) => String(f.entityId)),
        openRestaurantsCount: openCount,
      };
    } catch (err) {
      logger.warn({ err, userId }, 'ContextService: failed to build full user context, returning fallback');
      return {
        timeContext,
        recentOrderDishes: [],
        favoriteRestaurantIds: [],
        openRestaurantsCount: 0,
      };
    }
  }

  /**
   * Compact text representation of available menu items for prompt context.
   */
  public async getAvailableMenuSlice(restaurantId?: string, limit = 25): Promise<string> {
    if (mongoose.connection.readyState !== 1) {
      return `- Hyderabadi Dum Biryani ([NON-VEG], ₹340) at Spice Route Kitchen: Slow cooked aged Basmati rice\n- Dal Makhani Royale ([VEG], ₹280) at Spice Route Kitchen: Black lentils slow simmered overnight\n- Margherita Verace DOC ([VEG], ₹490) at La Cucina Pizzeria: San Marzano DOP tomatoes and fresh mozzarella`;
    }

    try {
      const query: Record<string, unknown> = {
        isDeleted: false,
        publishState: 'published',
        availabilityStatus: 'available',
      };

      if (restaurantId && Types.ObjectId.isValid(restaurantId)) {
        query.restaurantId = new Types.ObjectId(restaurantId);
      }

      const items = await MenuItem.find(query)
        .populate('restaurantId', 'restaurantName cuisineTypes')
        .limit(limit)
        .select('itemName itemDescription basePrice isVeg dietaryTags restaurantId')
        .lean();

      if (!items || items.length === 0) {
        return `- Hyderabadi Dum Biryani ([NON-VEG], ₹340) at Spice Route Kitchen: Slow cooked aged Basmati rice with tender marinated cuts\n- Dal Makhani Royale ([VEG], ₹280) at Spice Route Kitchen: Black lentils slow simmered overnight\n- Avocado Protein Power Bowl ([VEG], ₹420) at Verde Clean Kitchen: Hass avocado, quinoa, charred edamame\n- Margherita Verace DOC ([VEG], ₹490) at La Cucina Pizzeria: San Marzano DOP tomatoes and fresh buffalo mozzarella`;
      }

      return items
        .map((item: any) => {
          const restName = item.restaurantId?.restaurantName || 'Kitchen';
          const vegTag = item.isVeg ? '[VEG]' : '[NON-VEG]';
          return `- [ID:${item._id}] ${item.itemName} (${vegTag}, ₹${item.basePrice}) at ${restName}: ${item.itemDescription || 'Specialty item'}`;
        })
        .join('\n');
    } catch (err) {
      logger.warn({ err }, 'ContextService: getAvailableMenuSlice failed');
      return '';
    }
  }
}

export const contextService = new ContextService();
