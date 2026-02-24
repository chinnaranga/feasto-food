export function applyAISearch(foodList, filters) {
    return foodList.filter(food => {
        // 💰 Price Check
        if (filters.maxPrice && food.price > filters.maxPrice) return false;

        // 🌶️ Spicy Check
        // Checks explict flag or inferred from tags/description if flag missing (for robustness)
        if (filters.spicy) {
            const isSpicy = food.spicy === true || food.tags?.includes("spicy") || food.spiceLevel > 0;
            if (!isSpicy) return false;
        }

        // 🥗 Healthy Check
        if (filters.healthy) {
            const isHealthy = food.healthy === true || food.tags?.includes("healthy") || (food.nutrition?.calories && parseInt(food.nutrition.calories) < 500);
            if (!isHealthy) return false;
        }

        // ⚡ Fast Check (<= 25 mins)
        if (filters.fast) {
            const time = food.time || food.prepTime;
            if (!time || time > 25) return false;
        }

        // 🕒 Time Check
        if (filters.mealTime && food.bestFor !== filters.mealTime) return false;

        return true;
    });
}
