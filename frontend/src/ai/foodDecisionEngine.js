import { loadAIMemory } from "./aiMemory";

function getTimeContext() {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) return "late_night";
    if (hour >= 12 && hour <= 15) return "lunch";
    if (hour >= 18 && hour <= 21) return "dinner";
    return "general";
}

export function pickBestRestaurant(restaurants, context = {}) {
    const memory = loadAIMemory();
    const timeContext = getTimeContext();

    const scored = restaurants.map(r => {
        let score = 0;

        // ⭐ Quality (dominant factor)
        score += (r.rating || 0) * 3;

        // 🔥 Trending (adaptive)
        if (r.trending) score += 2 + memory.trendingBias;

        // 🏷️ Offers (adaptive)
        if (r.discount) {
            const discountVal = parseInt(r.discount) || 10;
            score += (discountVal / 10) + memory.offerBias;
        }

        // 🚀 Speed
        if (r.time) {
            const timeVal = parseInt(r.time) || 30;
            score -= timeVal / 8;
            if (timeVal <= 25) score += memory.fastBias;
        }

        // 🕒 Time Context Boost
        if (timeContext === "late_night" && r.openLate) score += 2;
        if (timeContext === "lunch" && r.quickMeal) score += 1.5;

        // 👥 Social proof
        if (r.reviews > 500) score += 1.5;

        // 🎯 Confidence damping (avoid overfitting)
        score = Number(score.toFixed(2));

        return { ...r, score };
    });

    return scored.sort((a, b) => b.score - a.score)[0];
}

export function explainPick(r) {
    const reasons = [];

    if (r.rating >= 4.5) reasons.push("exceptional ratings ⭐");
    if (r.trending) reasons.push("popular right now 🔥");
    if (r.discount) reasons.push("a great deal 🏷️");
    if (r.time && parseInt(r.time) <= 25) reasons.push("fast delivery 🚀");
    if (r.openLate) reasons.push("open late 🌙");

    if (reasons.length === 0)
        return "picked based on your taste patterns 👨‍🍳";

    return reasons.slice(0, 3).join(", ");
}
