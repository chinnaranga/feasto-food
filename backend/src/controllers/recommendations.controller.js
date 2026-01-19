import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

/**
 * Get user's previous orders for "Reorder Again" section
 */
export const getReorderItems = async (req, res) => {
    try {
        const userId = req.user?.uid;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Fetch user's completed orders
        const ordersSnapshot = await db
            .collection('orders')
            .where('userId', '==', userId)
            .where('status', '==', 'delivered')
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();

        // Extract food items and count frequency
        const foodMap = new Map();

        ordersSnapshot.forEach(doc => {
            const order = doc.data();
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const existing = foodMap.get(item.id) || {
                        ...item,
                        orderCount: 0,
                        lastOrdered: null
                    };

                    existing.orderCount++;
                    if (!existing.lastOrdered || order.createdAt > existing.lastOrdered) {
                        existing.lastOrdered = order.createdAt;
                    }

                    foodMap.set(item.id, existing);
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
                return b.lastOrdered - a.lastOrdered;
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
        const ordersSnapshot = await db
            .collection('orders')
            .where('userId', '==', userId)
            .where('status', '==', 'delivered')
            .limit(10)
            .get();

        // Extract user preferences
        const orderedCategories = new Set();
        const orderedItems = new Set();
        let totalSpent = 0;
        let avgPrice = 0;
        let prefersSpicy = false;

        ordersSnapshot.forEach(doc => {
            const order = doc.data();
            if (order.items) {
                order.items.forEach(item => {
                    orderedItems.add(item.id);
                    if (item.category) orderedCategories.add(item.category);
                    if (item.isSpicy) prefersSpicy = true;
                });
            }
            if (order.total) totalSpent += order.total;
        });

        if (ordersSnapshot.size > 0) {
            avgPrice = totalSpent / ordersSnapshot.size;
        }

        // Fetch all available food items
        const foodSnapshot = await db.collection('food').get();
        const allFood = foodSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filter and score recommendations
        const recommendations = allFood
            .filter(food => !orderedItems.has(food.id)) // Exclude already ordered
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

                // Score based on rating
                if (food.rating >= 4.5) {
                    score += 2;
                    reason = reason || 'Highly rated';
                }

                // Score trending items
                if (food.trending) {
                    score += 1;
                    reason = reason || 'Trending now';
                }

                return { ...food, score, reason: reason || 'You might like this' };
            })
            .filter(food => food.score > 0)
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
