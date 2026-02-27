import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";

/**
 * Get user's previous orders for "Reorder Again" section
 */
export const getReorderItems = async (req, res) => {
    try {
        const userId = req.user?.uid;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Fetch user's completed orders using Mongoose
        const orders = await Order.find({
            userId: userId,
            status: { $in: ['delivered', 'picked_up'] } // Case insensitive check handled by logic or enum usually
        })
            .sort({ createdAt: -1 })
            .limit(20);


        // Extract food items and count frequency
        const foodMap = new Map();

        orders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const itemId = item.id || item._id?.toString();
                    if (!itemId) return;

                    const existing = foodMap.get(itemId) || {
                        ...item,
                        id: itemId, // Ensure ID is present
                        orderCount: 0,
                        lastOrdered: null
                    };

                    existing.orderCount++;
                    if (!existing.lastOrdered || new Date(order.createdAt) > new Date(existing.lastOrdered)) {
                        existing.lastOrdered = order.createdAt;
                    }

                    foodMap.set(itemId, existing);
                });
            }
        });

        // Convert to array and sort by order count and recency
        const reorderItems = Array.from(foodMap.values())
            .sort((a, b) => {
                // Prioritize items ordered multiple times
                if (b.orderCount !== a.orderCount) {
                    return b.orderCount - a.orderCount;
                }
                // Then by recency
                return new Date(b.lastOrdered) - new Date(a.lastOrdered);
            })
            .slice(0, 10); // Top 10 items

        res.json({
            success: true,
            items: reorderItems
        });
    } catch (error) {
        console.error('Error fetching reorder items:', error);
        res.status(500).json({ error: 'Failed to fetch reorder items' });
    }
};

/**
 * Get AI-powered recommendations for "Recommended for You" section
 */
export const getRecommendations = async (req, res) => {
    try {
        const userId = req.user?.uid;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Fetch user's order history for context
        const orders = await Order.find({
            userId: userId,
            status: 'delivered'
        }).limit(10);

        // Extract user preferences
        const orderedCategories = new Set();
        const orderedItems = new Set();
        let totalSpent = 0;
        let avgPrice = 0;
        let prefersSpicy = false;

        orders.forEach(order => {
            if (order.items) {
                order.items.forEach(item => {
                    if (item.id) orderedItems.add(item.id);
                    if (item._id) orderedItems.add(item._id.toString());
                    if (item.category) orderedCategories.add(item.category);
                    if (item.isSpicy) prefersSpicy = true;
                });
            }
            if (order.total) totalSpent += order.total;
        });

        if (orders.length > 0) {
            avgPrice = totalSpent / orders.length;
        } else {
            // Default avg price if no history
            avgPrice = 300;
        }

        // Fetch all available restaurants and their menus
        // We only fetch open restaurants
        const restaurants = await Restaurant.find({ isOpen: true });

        // Flatten all menu items
        let allFood = [];
        restaurants.forEach(rest => {
            if (rest.menu && Array.isArray(rest.menu)) {
                rest.menu.forEach(item => {
                    if (item.isAvailable) {
                        allFood.push({
                            ...item.toObject(), // Convert Mongoose subdoc to object
                            restaurantId: rest._id, // Add restaurant reference
                            restaurantName: rest.name,
                            _id: item._id.toString()
                        });
                    }
                });
            }
        });

        // Filter and score recommendations
        const recommendations = allFood
            .filter(food => !orderedItems.has(food._id)) // Exclude already ordered
            .map(food => {
                let score = 0;
                let reason = '';

                // Score based on category match
                if (orderedCategories.has(food.category)) {
                    score += 3;
                    reason = `Popular in ${food.category}`;
                }

                // Score based on price range
                const priceDiff = Math.abs(food.price - avgPrice);
                if (priceDiff < avgPrice * 0.3) {
                    score += 2;
                }

                // Score based on spicy preference
                if (prefersSpicy && food.isSpicy) {
                    score += 2;
                    reason = 'Matches your spicy preference';
                }

                // Score based on rating (if item has rating, or fallback to something)
                // Assuming items might not have individual ratings yet, we could use restaurant rating
                // For now, let's assume food items don't have individual ratings in schema yet,
                // so we skip or use restaurant rating if we linked it.
                // Let's rely on 'isPopular' or similar if existed, or just random boost for now.

                // Boost random items slightly to give variety
                score += Math.random();

                return { ...food, score, reason: reason || 'You might like this' };
            })
            // Return even low score items if user has no history, to show *something*
            .sort((a, b) => b.score - a.score)
            .slice(0, 12); // Top 12 recommendations

        res.json({
            success: true,
            items: recommendations
        });
    } catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
};
