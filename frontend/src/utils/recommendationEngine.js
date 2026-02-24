// src/ai/recommendationEngine.ts (Converted to JS and expanded)
export function rankFood(items, profile, timeOfDay) {
    if (!items || !Array.isArray(items)) return [];

    return items
        .map(item => {
            let score = 0;
            const reasons = [];

            // 1. Cuisine Preference (+30)
            if (profile.cuisines[item.cuisine] && profile.cuisines[item.cuisine] > 0) {
                score += 30;
                reasons.push(explain(item, profile, "cuisine"));
            }

            // 2. Calories (+20) - Mock check logic
            if (item.calories && item.calories <= (profile.maxCalories || 800)) {
                score += 20;
            }

            // 3. Price (+15)
            if (profile.priceRange[item.priceBucket]) {
                score += 15;
            }

            // 4. Delivery Speed (+10)
            if (item.deliveryTime <= (profile.preferredTime || 30)) {
                score += 10;
                reasons.push(explain(item, profile, "speed"));
            }

            // Contextual Boosts (Legacy)
            if (timeOfDay === "morning" && item.category === "breakfast") score += 5;

            return { ...item, score, reasons: reasons.slice(0, 1) }; // Keep top reason only
        })
        .sort((a, b) => b.score - a.score);
}

// Explanation Generator
export function explain(dish, user, specificReason) {
    if (specificReason === "cuisine") return "you often order this cuisine";
    if (specificReason === "speed") return "it arrives super fast";
    if (dish.deliveryTime < 20) return "it arrives super fast";
    return "it matches your preferences";
}
