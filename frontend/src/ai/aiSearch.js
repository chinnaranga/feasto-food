export function parseAISearch(query) {
    const text = query.toLowerCase();

    const filters = {
        maxPrice: null,
        spicy: false,
        healthy: false,
        fast: false,
        mealTime: null,
    };

    // 💰 Price intent (e.g. "under 200", "below 500", "< 300")
    const priceMatch = text.match(/(?:under|below|<)\s*₹?\s*(\d+)/);
    if (priceMatch) {
        filters.maxPrice = parseInt(priceMatch[1]);
    }

    // 🌶️ Spicy
    if (text.includes("spicy") || text.includes("hot") || text.includes("chili")) {
        filters.spicy = true;
    }

    // 🥗 Healthy
    if (text.includes("healthy") || text.includes("low calorie") || text.includes("light") || text.includes("diet")) {
        filters.healthy = true;
    }

    // ⚡ Fast
    if (text.includes("fast") || text.includes("quick") || text.includes("express")) {
        filters.fast = true;
    }

    // 🕒 Time-based (Matched to mockData keys: breakfast, lunch, dinner, late_night)
    if (text.includes("breakfast") || text.includes("morning")) filters.mealTime = "breakfast";
    if (text.includes("lunch") || text.includes("afternoon")) filters.mealTime = "lunch";
    if (text.includes("dinner") || text.includes("evening")) filters.mealTime = "dinner";
    if (text.includes("late") || text.includes("night")) filters.mealTime = "late_night";

    return filters;
}
